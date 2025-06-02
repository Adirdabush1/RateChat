import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

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
    <div style={{ padding: 20, fontFamily: 'sans-serif', direction: 'rtl' }}>
      <h2>👥 ברוך הבא לצ'אט</h2>
      <p>בחר קבוצה קיימת או צור אחת חדשה:</p>

      <div style={{ marginBottom: 20 }}>
        <input
          value={newGroup}
          onChange={(e) => setNewGroup(e.target.value)}
          placeholder="שם הקבוצה החדשה"
          style={{ padding: 8, marginInlineEnd: 10 }}
        />
        <button onClick={handleCreateGroup}>➕ צור קבוצה</button>
      </div>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {groups.map((group, idx) => (
          <li key={idx} style={{ marginBottom: 10 }}>
            <button
              onClick={() => enterGroup(group)}
              style={{ padding: 10, width: '100%', textAlign: 'right' }}
            >
              🔹 {group}
            </button>
          </li>
        ))}
      </ul>

      {/* 🔽 כפתור לדשבורד הורים */}
      <div style={{ marginTop: 40, textAlign: 'center' }}>
        <Link to="/parent-dashboard" style={{ color: '#1e88e5', textDecoration: 'underline' }}>
          עבור לדשבורד הורה
        </Link>
      </div>
    </div>
  );
}
