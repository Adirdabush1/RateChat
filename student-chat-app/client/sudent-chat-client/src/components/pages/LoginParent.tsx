import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './styles/Login.css';

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

      alert('Logged in successfully!');
      window.location.href = '/parent-dashboard';
    } catch (error) {
      console.error('Login error:', error);
      alert('Incorrect login details or server error');
    }
  };

  return (
    <div className="login-page">
      <div className="login-background">
        <div className="shape"></div>
        <div className="shape"></div>
      </div>

      <form onSubmit={handleSubmit} className="login-form-container">
        <h2>Parent Login</h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit">Login as Parent</button>

        <div className="extra-links">
          <Link to="/register-parent">Don't have an account? Click here to register</Link>
        </div>
      </form>
    </div>
  );
};

export default LoginParent;
