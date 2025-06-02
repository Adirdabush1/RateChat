import React, { useState } from 'react';
import axios from 'axios';

interface ParentLoginResponse {
  token: string;
  parent: {
    name: string;
    id: string;
  };
}

const LoginParent: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post<ParentLoginResponse>(
        'http://localhost:3000/auth/login-parent',
        formData
      );

      const token = response.data.token;
      localStorage.setItem('parentToken', token);

      alert('התחברת בהצלחה!');
      window.location.href = '/parent-dashboard';
    } catch (error) {
      console.error('שגיאה בכניסה:', error);
      alert('פרטי התחברות שגויים או שגיאה בשרת');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md space-y-4">
        <h2 className="text-2xl font-bold text-center">כניסת הורה</h2>

        <input
          type="email"
          name="email"
          placeholder="אימייל"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="סיסמה"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <button type="submit" className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">
          התחבר כהורה
        </button>
      </form>
    </div>
  );
};

export default LoginParent;
