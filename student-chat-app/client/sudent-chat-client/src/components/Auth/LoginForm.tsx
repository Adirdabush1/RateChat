import { useState } from 'react';
import { loginUser } from '../services/authService';
import { useNavigate } from 'react-router-dom';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await loginUser(email, password);
      localStorage.setItem('token', result.access_token);
      localStorage.setItem('user', JSON.stringify({ name: result.name, email }));
      setMessage('התחברת בהצלחה!');
      navigate('/chat');
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'שגיאה בעת התחברות');
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
        התחבר
      </button>
      <p style={{ color: message.includes('שגיאה') ? 'red' : 'green', marginTop: 10 }}>{message}</p>
    </form>
  );
}
