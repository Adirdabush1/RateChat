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
      setMessage('Registered successfully!');
      console.log(result); 
      navigate('/chat'); // after student registration
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Registration error');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        style={{ padding: 8, width: '100%', marginBottom: 10 }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        style={{ padding: 8, width: '100%', marginBottom: 10 }}
      />
      <button type="submit" style={{ padding: 10, width: '100%' }}>
        Register
      </button>
      {message && <p style={{ marginTop: 10 }}>{message}</p>}
    </form>
  );
}
