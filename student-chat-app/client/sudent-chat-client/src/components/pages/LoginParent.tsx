import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './styles/Login.css'; // CSS כמו של login-page

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
    <div className="login-page">
      {/* רקעים דקורטיביים */}
      <div className="login-background">
        <div className="shape"></div>
        <div className="shape"></div>
      </div>

      {/* טופס שקוף */}
      <form onSubmit={handleSubmit} className="login-form-container">
        <h2>כניסת הורה</h2>

        <input
          type="email"
          name="email"
          placeholder="אימייל"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="סיסמה"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit">התחבר כהורה</button>

        {/* קישור להרשמה */}
        <div className="extra-links">
          <Link to="/register-parent">אין לך חשבון? לחץ כאן להרשמה</Link>
        </div>
      </form>
    </div>
  );
};

export default LoginParent;
