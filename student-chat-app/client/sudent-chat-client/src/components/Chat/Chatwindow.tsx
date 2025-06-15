import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import '../pages/styles/chatwindow.css';
import { getToken, getUser } from '../../components/utils/token';

type ChatMessage = {
  message: string;
  sender: string;
  score?: number;
  alertParent?: boolean;
};

type ChatComponentProps = {
  token: string;
  CHAT_ID: string;
};

const ChatComponent: React.FC<ChatComponentProps> = ({ token, CHAT_ID }) => {
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('');
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const navigate = useNavigate();
  const previousGroupRef = useRef<string | null>(null);

  useEffect(() => {
    const user = getUser();

    if (!token || !user) {
      alert('You must log in first');
      navigate('/login');
      return;
    }

    setUsername(user.name);

    socketRef.current = io('https://ratechat-1.onrender.com', {
      auth: { token, CHAT_ID },
    });

    socketRef.current.on('connect', () => {
      console.log('Connected to socket');
      if (CHAT_ID) {
        socketRef.current?.emit('join_room', CHAT_ID);
        previousGroupRef.current = CHAT_ID;
      } else {
        alert('Invalid group name');
        navigate('/');
      }
    });

    socketRef.current.on('receive_message', (data: ChatMessage) => {
      setChat(prev => {
        const updatedChat = [...prev, data];
        if (CHAT_ID) {
          localStorage.setItem(`chatMessages_${CHAT_ID}`, JSON.stringify(updatedChat));
        }
        return updatedChat;
      });

      if (data.alertParent) {
        alert("⚠️ A message was sent to a parent due to harmful content!");
      }
    });

    socketRef.current.on('chat_history', (messages: ChatMessage[]) => {
      setChat(messages);
      if (CHAT_ID) {
        localStorage.setItem(`chatMessages_${CHAT_ID}`, JSON.stringify(messages));
      }
    });

    socketRef.current.on('clear_chat', () => {
      setChat([]);
      if (CHAT_ID) {
        localStorage.removeItem(`chatMessages_${CHAT_ID}`);
      }
    });

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [navigate, token, CHAT_ID]);

  useEffect(() => {
    if (!CHAT_ID) return;

    const storageKey = `chatMessages_${CHAT_ID}`;
    const savedMessages = JSON.parse(localStorage.getItem(storageKey) || '[]');
    setChat(savedMessages);

    if (socketRef.current) {
      if (previousGroupRef.current && previousGroupRef.current !== CHAT_ID) {
        socketRef.current.emit('leave_room', previousGroupRef.current);
      }
      socketRef.current.emit('join_room', CHAT_ID);
    }

    previousGroupRef.current = CHAT_ID;
  }, [CHAT_ID]);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chat]);

  const clearChat = () => {
    if (!CHAT_ID) return;
    localStorage.removeItem(`chatMessages_${CHAT_ID}`);
    setChat([]);
    socketRef.current?.emit('clear_room', CHAT_ID);
  };

  const sendMessage = () => {
    if (message.trim() === '') return;
    socketRef.current?.emit('send_message', {
      message,
      sender: username,
      room: CHAT_ID,
    });
    setMessage('');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('parentToken');
    localStorage.removeItem('user');
    localStorage.removeItem('parent');
    navigate('/login');
  };

  return (
    <div className="chat-window">
      <aside className="sidebar">
        <h2 className="sidebar-title">🟢 Chat Group</h2>

        <p className="group-name">Current: {CHAT_ID}</p>

        <div className="groups-list">
          {JSON.parse(localStorage.getItem('chatGroups') || '[]').map((group: string, idx: number) => (
            <button
              key={idx}
              className={`group-link ${group === CHAT_ID ? 'active' : ''}`}
              onClick={() => navigate(`/chat/${group}`)}
            >
              {group}
            </button>
          ))}
        </div>

        <div className="sidebar-actions">
          <button className="btn btn-clear" onClick={clearChat}>Clear Chat</button>
          <button className="btn btn-logout" onClick={handleLogout}>Logout</button>
        </div>
      </aside>

      <main className="chat-main">
        <div ref={chatBoxRef} className="chat-box">
          {chat.map((chatMessage, index) => (
            <div
              key={index}
              className={`chat-message ${chatMessage.sender === username ? 'own-message' : ''}`}
            >
              <b>{chatMessage.sender}:</b> {chatMessage.message}
            </div>
          ))}
        </div>

        <div className="chat-input-area">
          <input
            type="text"
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="Type a message..."
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            className="chat-input"
          />
          <button onClick={sendMessage} className="btn btn-send">Send</button>
        </div>
      </main>
    </div>
  );
};

const ChatWindow: React.FC = () => {
  const { groupName } = useParams<{ groupName: string }>();
  const navigate = useNavigate();

  const token = getToken();

  useEffect(() => {
    if (!token) {
      alert('You must log in');
      navigate('/login');
      return;
    }
    if (!groupName) {
      navigate('/');
    }
  }, [token, groupName, navigate]);

  if (!groupName || !token) {
    return <div>Loading...</div>;
  }

  return <ChatComponent token={token} CHAT_ID={groupName} />;
};

export default ChatWindow;
