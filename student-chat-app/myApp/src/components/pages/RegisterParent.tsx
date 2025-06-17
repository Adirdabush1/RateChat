import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { registerParent } from '../services/api';
import { IonPage, IonContent } from '@ionic/react';
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

  const history = useHistory();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerParent(formData);
      alert('Registration successful');
      history.push('/parent-dashboard');
    } catch (err) {
      alert('Registration error');
      console.error(err);
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="login-page">
          <div className="login-background">
            <div className="shape"></div>
            <div className="shape"></div>
          </div>

          <form onSubmit={handleSubmit} className="login-form-container">
            <h2>Parent Registration</h2>

            <input
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <input
              name="childEmail"
              type="email"
              placeholder="Child's Email"
              value={formData.childEmail}
              onChange={handleChange}
              required
            />

            <button type="submit">Register as Parent</button>

            <div className="extra-links">
              <a href="/login-parent">Already registered? Click here to login</a>
            </div>
          </form>
        </div>
      </IonContent>
    </IonPage>
  );
}
