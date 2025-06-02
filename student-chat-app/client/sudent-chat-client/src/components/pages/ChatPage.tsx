// src/pages/ChatPage.tsx
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io, Socket } from "socket.io-client";

let socket: Socket;

export default function ChatPage() {
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('');
  const [chat, setChat] = useState<{ message: string; sender: string }[]>([]);
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userJson = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!userJson || !token) {
      alert('עליך להתחבר קודם');
      navigate('/login');
      return;
    }

    try {
      const user = JSON.parse(userJson);
      if (!user || !user.name) {
        alert('נתוני משתמש שגויים');
        navigate('/login');
        return;
      }
      setUsername(user.name);
    } catch (error) {
      alert('נתוני משתמש שגויים');
      navigate('/login');
      return;
    }

    const CHAT_ID = 'main_chat_room'; // מזהה צ'אט קבוע

    socket = io('http://localhost:3000', {
      auth: {
        token,
        CHAT_ID: CHAT_ID,
      },
    });

    socket.on('connect', () => {
      console.log('Connected to socket');
    });

    socket.on('receive_message', (data) => {
      setChat(prev => [...prev, data]);
    });

    socket.on('chat_history', (messages) => {
      setChat(messages);
    });

    return () => {
      socket.disconnect();
    };
  }, [navigate]);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chat]);

  const sendMessage = () => {
    if (message.trim() === '' || username.trim() === '') return;
    socket.emit('send_message', { message, sender: username });
    setMessage('');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif', direction: 'rtl' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>🟢 צ'אט חי - {username}</h2>
        <button
          onClick={handleLogout}
          style={{ padding: '5px 10px', background: '#eee', border: '1px solid #ccc' }}
        >
          התנתקות
        </button>
      </div>

      <div
        ref={chatBoxRef}
        style={{
          border: '1px solid #ccc',
          padding: 10,
          height: 300,
          overflowY: 'auto',
          marginBottom: 10,
          background: '#f9f9f9',
          borderRadius: 4,
        }}
      >
        {chat.map((chatMessage, index) => (
          <div key={index} style={{ marginBottom: 6 }}>
            <b>{chatMessage.sender}:</b> {chatMessage.message}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <input
          type="text"
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="כתוב הודעה..."
          style={{ flex: 1, padding: 5 }}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage} style={{ padding: '5px 15px' }}>
          שלח
        </button>
      </div>
    </div>
  );
}
