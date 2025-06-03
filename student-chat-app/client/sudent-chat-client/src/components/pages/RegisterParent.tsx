import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerParent } from '../services/api';
import './styles/Login.css'; 

export default function RegisterParent() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    childEmail: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerParent(formData);
      alert('ההרשמה הצליחה');
      navigate('/parent-dashboard');
    } catch (err) {
      alert('שגיאה בהרשמה');
      console.error(err);
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
        <h2>הרשמת הורה</h2>

        <input
          name="name"
          placeholder="שם מלא"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="אימייל"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="סיסמה"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input
          name="childEmail"
          type="email"
          placeholder="אימייל של הילד"
          value={formData.childEmail}
          onChange={handleChange}
          required
        />

        <button type="submit">הירשם כהורה</button>

        {/* קישור חזרה לכניסה */}
        <div className="extra-links">
          <a href="/login-parent">כבר רשום? לחץ כאן לכניסה</a>
        </div>
      </form>
    </div>
  );
}
