import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import '../pages/styles/chatLobby.css'; 

export default function ChatLobby() {
  const [groups, setGroups] = useState<string[]>([]);
  const [newGroup, setNewGroup] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('עליך להתחבר קודם');
      navigate('/login');
      return;
    }

    const savedGroups = JSON.parse(localStorage.getItem('chatGroups') || '[]');
    setGroups(savedGroups);
  }, [navigate]);

  const handleCreateGroup = () => {
    if (!newGroup.trim()) return;

    const updatedGroups = [...groups, newGroup.trim()];
    setGroups(updatedGroups);
    localStorage.setItem('chatGroups', JSON.stringify(updatedGroups));
    setNewGroup('');
  };

  const enterGroup = (groupName: string) => {
    navigate(`/chat/${groupName}`);
  };

  return (
    <div className="chat-lobby-page">
      <div className="chat-lobby-container">
        <h2>👥 ברוך הבא לצ'אט</h2>
        <p>בחר קבוצה קיימת או צור אחת חדשה:</p>

        <div className="input-group">
          <input
            value={newGroup}
            onChange={(e) => setNewGroup(e.target.value)}
            placeholder="שם הקבוצה החדשה"
          />
          <button onClick={handleCreateGroup}>➕ צור קבוצה</button>
        </div>

        <ul className="groups-list">
          {groups.map((group, idx) => (
            <li key={idx}>
              <button onClick={() => enterGroup(group)}>🔹 {group}</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
