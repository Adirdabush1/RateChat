// src/components/ChatComponent.tsx
import React, { useEffect, useState, useRef } from 'react';
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
  IonFooter,
  IonText,
  IonToast,
} from '@ionic/react';
import { connectSocket, disconnectSocket, getSocket } from '../utils/socket';
import { getToken } from '../utils/token';

type Props = { chatId: string };

const ChatComponent: React.FC<Props> = ({ chatId }) => {
  const [messages, setMessages] = useState<{ sender: string; message: string }[]>([]);
  const [text, setText] = useState('');
  const [toastMsg, setToastMsg] = useState('');
  const contentRef = useRef<HTMLIonContentElement>(null);

  useEffect(() => {
    const token = getToken();
    if (!token || !chatId) return;

    const socket = connectSocket(token, chatId);

    socket.on('connect', () => {
      console.log('🔌 Socket connected');
    });

    socket.on('chat_history', (history) => {
      setMessages(history);
      scrollToBottom();
    });

    socket.on('receive_message', (message) => {
      setMessages(prev => [...prev, message]);
      scrollToBottom();
    });

    socket.on('disconnect', () => {
      console.log('🔌 Socket disconnected');
    });

    return () => {
      disconnectSocket();
    };
  }, [chatId]);

  const scrollToBottom = () => {
    setTimeout(() => {
      contentRef.current?.scrollToBottom(300);
    }, 100);
  };

  const sendMessage = () => {
    if (!text.trim()) return;

    const socket = getSocket();
    if (!socket) {
      setToastMsg('⚠️ No socket connection');
      return;
    }

    if (socket.connected) {
      socket.emit('send_message', { message: text });
      setText('');
    } else {
      setToastMsg('⚠️ Socket not connected yet');
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Chat Room: {chatId}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent ref={contentRef} fullscreen>
        <IonList>
          {messages.map((msg, i) => (
            <IonItem key={i}>
              <IonLabel>
                <strong>{msg.sender}:</strong> {msg.message}
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>

      <IonFooter>
        <IonToolbar>
          <IonInput
            value={text}
            placeholder="Type a message..."
            onIonChange={e => setText(e.detail.value!)}
            onKeyPress={e => { if (e.key === 'Enter') sendMessage(); }}
            clearInput
          />
          <IonButton onClick={sendMessage}>Send</IonButton>
        </IonToolbar>
      </IonFooter>

      <IonToast
        isOpen={!!toastMsg}
        onDidDismiss={() => setToastMsg('')}
        message={toastMsg}
        duration={2000}
        color="danger"
      />
    </IonPage>
  );
};

export default ChatComponent;
