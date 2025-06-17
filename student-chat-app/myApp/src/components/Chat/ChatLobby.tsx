// src/pages/ChatLobby.tsx
import React, { useEffect, useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonInput,
  IonButton,
  IonList,
  IonItem,
  IonLabel,
} from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../utils/token';

const ChatLobby: React.FC = () => {
  const [groups, setGroups] = useState<string[]>([]);
  const [newGroup, setNewGroup] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      alert('You must log in first');
      navigate('/login');
      return;
    }

    try {
      const savedGroups = JSON.parse(localStorage.getItem('chatGroups') || '[]');
      if (Array.isArray(savedGroups)) setGroups(savedGroups.filter(g => typeof g === 'string'));
      else setGroups([]);
    } catch {
      setGroups([]);
    }
  }, [navigate]);

  const handleCreateGroup = () => {
    if (!newGroup.trim()) return;

    const uniqueGroups = Array.from(new Set([...groups, newGroup.trim()]));
    setGroups(uniqueGroups);
    localStorage.setItem('chatGroups', JSON.stringify(uniqueGroups));
    setNewGroup('');
  };

  const enterGroup = (groupName: string) => {
    navigate(`/chat/${groupName}`);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>👥 Welcome to the Chat</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonInput
          value={newGroup}
          placeholder="New group name"
          onIonChange={e => setNewGroup(e.detail.value!)}
          clearInput
        />
        <IonButton expand="block" onClick={handleCreateGroup}>➕ Create Group</IonButton>

        <IonList>
          {groups.map((group, idx) => (
            <IonItem key={idx} button onClick={() => enterGroup(group)}>
              <IonLabel>🔹 {group}</IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default ChatLobby;
