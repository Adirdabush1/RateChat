import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';

type ChatMessage = {
  message: string;
  sender: string;
  score?: number;
  alertParent?: boolean;
};

export default function ChatWindow() {
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('');
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const navigate = useNavigate();
  const { groupName } = useParams();
  const previousGroupRef = useRef<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      alert('עליך להתחבר קודם');
      navigate('/login');
      return;
    }

    let parsedUser;
    try {
      parsedUser = JSON.parse(userData);
    } catch {
      alert('אירעה שגיאה בטעינת פרטי המשתמש');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
      return;
    }

    setUsername(parsedUser.name);

    socketRef.current = io('http://localhost:3000', {
      auth: { token, CHAT_ID: groupName },
    });

    socketRef.current.on('connect', () => {
      console.log('Connected to socket');
      if (groupName) {
        socketRef.current?.emit('join_room', groupName);
        previousGroupRef.current = groupName;
      } else {
        alert('שם הקבוצה לא תקין');
        navigate('/');
      }
    });

    socketRef.current.on('receive_message', (data: ChatMessage) => {
     

      setChat(prev => {
        const updatedChat = [...prev, data];
        if (groupName) {
          localStorage.setItem(`chatMessages_${groupName}`, JSON.stringify(updatedChat));
        }
        return updatedChat;
      });
    });

    socketRef.current.on('chat_history', (messages: ChatMessage[]) => {
      setChat(messages);
      if (groupName) {
        localStorage.setItem(`chatMessages_${groupName}`, JSON.stringify(messages));
      }
    });

    socketRef.current.on('clear_chat', () => {
      setChat([]);
      if (groupName) {
        localStorage.removeItem(`chatMessages_${groupName}`);
      }
    });

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [navigate, groupName]);

  useEffect(() => {
    if (!groupName) return;

    const storageKey = `chatMessages_${groupName}`;
    const savedMessages = JSON.parse(localStorage.getItem(storageKey) || '[]');
    setChat(savedMessages);

    if (socketRef.current) {
      if (previousGroupRef.current && previousGroupRef.current !== groupName) {
        socketRef.current.emit('leave_room', previousGroupRef.current);
      }
      socketRef.current.emit('join_room', groupName);
    }

    previousGroupRef.current = groupName;
  }, [groupName]);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chat]);

  const clearChat = () => {
    if (!groupName) return;
    localStorage.removeItem(`chatMessages_${groupName}`);
    setChat([]);
    socketRef.current?.emit('clear_room', groupName);
  };

  const sendMessage = () => {
    if (message.trim() === '') return;
    socketRef.current?.emit('send_message', {
      message,
      sender: username,
      room: groupName,
    });
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
        <h2>🟢 קבוצת צ'אט - {groupName}</h2>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={clearChat} style={{ padding: '5px 10px', background: '#fdd', border: '1px solid #faa', color: '#a00' }}>נקה צ'אט</button>
          <button onClick={handleLogout} style={{ padding: '5px 10px', background: '#eee', border: '1px solid #ccc' }}>התנתקות</button>
        </div>
      </div>

      <div ref={chatBoxRef} style={{
        border: '1px solid #ccc',
        padding: 10,
        height: 300,
        overflowY: 'auto',
        marginBottom: 10,
        background: '#f9f9f9',
        borderRadius: 4,
      }}>
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
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage} style={{ padding: '5px 15px' }}>
          שלח
        </button>
      </div>
    </div>
  );
}
