// src/components/ChatComponent.tsx
import React, { useEffect, useState } from 'react';
import { connectSocket, disconnectSocket, getSocket } from '../utils/socket';
import { getToken } from '../utils/token';

type Props = {
  chatId: string;
};

const ChatComponent: React.FC<Props> = ({ chatId }) => {
  const [messages, setMessages] = useState<{ sender: string; message: string }[]>([]);

  useEffect(() => {
    const token = getToken();
    if (!token || !chatId) return;

    const socket = connectSocket(token, chatId);

    socket.on('connect', () => {
      console.log('🔌 Socket connected');
    });

    socket.on('chat_history', (history) => {
      console.log('🕘 Chat history received:', history);
      setMessages(history);
    });

    socket.on('receive_message', (message) => {
      console.log('📩 New message received:', message);
      setMessages((prev) => [...prev, message]);
    });

    socket.on('disconnect', () => {
      console.log('🔌 Socket disconnected');
    });

    return () => {
      disconnectSocket();
    };
  }, [chatId]);

  const sendMessage = (text: string) => {
    const socket = getSocket();
    if (!socket) {
      console.warn('⚠️ No socket connection');
      return;
    }

    if (socket.connected) {
      socket.emit('send_message', { message: text });
    } else {
      console.warn('⚠️ Socket not connected yet');
    }
  };

  return (
    <div>
      <h2>Chat Room: {chatId}</h2>
      <div style={{ border: '1px solid gray', height: '300px', overflowY: 'scroll', padding: '10px' }}>
        {messages.map((msg, i) => (
          <div key={i}>
            <b>{msg.sender}:</b> {msg.message}
          </div>
        ))}
      </div>

      <SendMessageForm onSend={sendMessage} />
    </div>
  );
};

const SendMessageForm: React.FC<{ onSend: (text: string) => void }> = ({ onSend }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() === '') return;
    onSend(text);
    setText('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
};

export default ChatComponent;
