// src/components/Auth/RegisterForm.tsx
import { useState } from 'react';
import { registerUser } from '../services/authService';
import { useNavigate } from 'react-router-dom';



export default function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await registerUser(email, password);
      setMessage('נרשמת בהצלחה!');
      console.log(result); 
      navigate('/chat'); // לאחר הרשמה של תלמיד
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'שגיאה בעת הרשמה');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="אימייל"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        style={{ padding: 8, width: '100%', marginBottom: 10 }}
      />
      <input
        type="password"
        placeholder="סיסמה"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        style={{ padding: 8, width: '100%', marginBottom: 10 }}
      />
      <button type="submit" style={{ padding: 10, width: '100%' }}>
        הרשמה
      </button>
      {message && <p style={{ marginTop: 10 }}>{message}</p>}
    </form>
  );
}
