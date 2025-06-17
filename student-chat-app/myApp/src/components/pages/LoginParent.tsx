import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import './styles/Login.css';
import { setToken } from '../utils/token';

interface LoginResponse {
  token: string;
}

const LoginParent: React.FC = () => {
  const [formData, setFormData] = useState({ email: '', studentName: '' });
  const history = useHistory();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post<LoginResponse>(
        'https://ratechat-f72a4557d4ab.herokuapp.com/parent/login',
        formData
      );

      setToken(res.data.token, 'parent');
      localStorage.setItem('parentEmail', formData.email);

      alert('התחברת בהצלחה כהורה!');
      history.push('/parent-dashboard');
    } catch (error) {
      console.error('Login error:', error);
      alert('שגיאה בהתחברות. ודא פרטים נכונים או נסה שוב מאוחר יותר.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-background">
        <div className="shape"></div>
        <div className="shape"></div>
      </div>

      <form onSubmit={handleSubmit} className="login-form-container">
        <h2>התחברות הורה</h2>

        <input
          type="email"
          name="email"
          placeholder="אימייל"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="studentName"
          placeholder="שם התלמיד"
          value={formData.studentName}
          onChange={handleChange}
          required
        />

        <button type="submit">התחבר כהורה</button>

        <div className="extra-links">
          <Link to="/register-parent">אין לך חשבון? לחץ כאן להרשמה</Link>
        </div>
      </form>
    </div>
  );
};

export default LoginParent;
