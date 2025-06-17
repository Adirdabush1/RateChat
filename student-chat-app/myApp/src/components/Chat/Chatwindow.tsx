// src/pages/ChatWindow.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonText,
  IonToast,
  IonButtons,
  IonBackButton,
} from '@ionic/react';
import { IonFooter } from '@ionic/react';
import { useParams, useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { getToken, getUser } from '../utils/token';

type ChatMessage = {
  message: string;
  sender: string;
  score?: number;
  flagged?: boolean;
};

const ChatWindow: React.FC = () => {
  const { groupName } = useParams<{ groupName: string }>();
  const navigate = useNavigate();
  const token = getToken();

  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  const socketRef = useRef<Socket | null>(null);
  const contentRef = useRef<HTMLIonContentElement>(null);
  const previousGroupRef = useRef<string | null>(null);

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

  useEffect(() => {
    const user = getUser();
    if (!token || !user || !groupName) return;

    setUsername(user.name);

    socketRef.current = io('https://ratechat-f72a4557d4ab.herokuapp.com', {
      auth: { token, chatId: groupName },
    });

    socketRef.current.on('connect', () => {
      socketRef.current?.emit('join_room', groupName);
      previousGroupRef.current = groupName;
    });

    socketRef.current.on('receive_message', (data: ChatMessage) => {
      setChat(prev => {
        const updated = [...prev, data];
        localStorage.setItem(`chatMessages_${groupName}`, JSON.stringify(updated));
        return updated;
      });

      if (data.flagged) alert('⚠️ A message was sent to a parent due to harmful content!');
    });

    socketRef.current.on('chat_history', (messages: ChatMessage[]) => {
      setChat(messages);
      localStorage.setItem(`chatMessages_${groupName}`, JSON.stringify(messages));
    });

    socketRef.current.on('clear_chat', () => {
      setChat([]);
      localStorage.removeItem(`chatMessages_${groupName}`);
    });

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [token, groupName]);

  useEffect(() => {
    if (!groupName) return;

    const saved = JSON.parse(localStorage.getItem(`chatMessages_${groupName}`) || '[]');
    setChat(saved);

    if (socketRef.current) {
      if (previousGroupRef.current && previousGroupRef.current !== groupName) {
        socketRef.current.emit('leave_room', previousGroupRef.current);
      }
      socketRef.current.emit('join_room', groupName);
    }

    previousGroupRef.current = groupName;
  }, [groupName]);

  useEffect(() => {
    setTimeout(() => {
      contentRef.current?.scrollToBottom(300);
    }, 100);
  }, [chat]);

  const sendMessage = () => {
    if (message.trim() === '') return;
    socketRef.current?.emit('send_message', { message });
    setMessage('');
  };

  const clearChat = () => {
    if (!groupName) return;
    localStorage.removeItem(`chatMessages_${groupName}`);
    setChat([]);
    socketRef.current?.emit('clear_room', groupName);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  if (!groupName || !token) {
    return <IonPage><IonContent>Loading...</IonContent></IonPage>;
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start"><IonBackButton defaultHref="/chatlobby" /></IonButtons>
          <IonTitle>Chat Group: {groupName}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent ref={contentRef} fullscreen>
        <IonList>
          {chat.map((msg, i) => (
            <IonItem key={i} className={msg.sender === username ? 'own-message' : ''}>
              <IonLabel><strong>{msg.sender}:</strong> {msg.message}</IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>

      <IonFooter>
        <IonToolbar>
          <IonInput
            value={message}
            placeholder="Type a message..."
            onIonChange={e => setMessage(e.detail.value!)}
            onKeyPress={e => { if (e.key === 'Enter') sendMessage(); }}
            clearInput
          />
          <IonButton onClick={sendMessage}>Send</IonButton>
          <IonButton color="danger" onClick={clearChat}>Clear</IonButton>
          <IonButton color="medium" onClick={handleLogout}>Logout</IonButton>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default ChatWindow;
