// src/pages/ChatLobby.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../utils/token';
import './styles/chatLobby.css';

export default function ChatLobby() {
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
      const validGroups = Array.isArray(savedGroups)
        ? savedGroups.filter(group => typeof group === 'string')
        : [];
      setGroups(validGroups);
    } catch (err) {
      console.error('Error reading chatGroups from localStorage', err);
      setGroups([]);
    }
  }, [navigate]);

  const handleCreateGroup = () => {
    if (!newGroup.trim()) return;

    const cleanedName = newGroup.trim();
    const updatedGroups = [...groups, cleanedName];
    const uniqueGroups = Array.from(new Set(updatedGroups));

    setGroups(uniqueGroups);
    localStorage.setItem('chatGroups', JSON.stringify(uniqueGroups));
    setNewGroup('');
  };

  const enterGroup = (groupName: string) => {
    navigate(`/chat/${groupName}`);
  };

  return (
    <div className="chat-lobby-page">
      <div className="chat-lobby-container">
        <h2>👥 Welcome to the Chat</h2>
        <p>Select an existing group or create a new one:</p>

        <div className="input-group">
          <input
            value={newGroup}
            onChange={(e) => setNewGroup(e.target.value)}
            placeholder="New group name"
          />
          <button onClick={handleCreateGroup}>➕ Create Group</button>
        </div>

        <ul className="groups-list">
          {groups.map((group, idx) =>
            typeof group === 'string' ? (
              <li key={idx}>
                <button onClick={() => enterGroup(group)}>🔹 {group}</button>
              </li>
            ) : null
          )}
        </ul>
      </div>
    </div>
  );
}
