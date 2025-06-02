// pages/RegisterParent.tsx
import { useState } from 'react';
import { registerParent } from '../services/api';

export default function RegisterParent() {
  const [formData, setFormData] = useState({ email: '', password: '', name: '', childEmail: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await registerParent(formData);
    alert('ההרשמה הצליחה');
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-gray-800 rounded-xl text-white space-y-4">
      <h2 className="text-xl font-bold">הרשמת הורה</h2>
      <input name="name" placeholder="שם מלא" onChange={handleChange} className="w-full p-2 rounded" />
      <input name="email" placeholder="אימייל" onChange={handleChange} className="w-full p-2 rounded" />
      <input name="password" placeholder="סיסמה" type="password" onChange={handleChange} className="w-full p-2 rounded" />
      <input name="childEmail" placeholder="אימייל של הילד" onChange={handleChange} className="w-full p-2 rounded" />
      <button type="submit" className="bg-blue-600 p-2 rounded w-full">הירשם</button>
    </form>
  );
}
