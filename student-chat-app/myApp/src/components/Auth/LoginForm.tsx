import { useState } from 'react';
import { loginUser } from '../services/authService';
import { useNavigate } from 'react-router-dom';

import {
  IonPage,
  IonContent,
  IonInput,
  IonButton,
  IonItem,
  IonLabel,
  IonText,
} from '@ionic/react';

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
      setMessage('Logged in successfully!');
      navigate('/lobby');
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Login error');
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen className="ion-padding">
        <form onSubmit={handleSubmit}>
          <IonItem>
            <IonLabel position="floating">Email</IonLabel>
            <IonInput
              type="email"
              value={email}
              onIonChange={(e) => setEmail(e.detail.value!)}
              required
            />
          </IonItem>

          <IonItem>
            <IonLabel position="floating">Password</IonLabel>
            <IonInput
              type="password"
              value={password}
              onIonChange={(e) => setPassword(e.detail.value!)}
              required
            />
          </IonItem>

          <IonButton expand="block" type="submit" style={{ marginTop: 20 }}>
            Log In
          </IonButton>

          {message && (
            <IonText color={message.toLowerCase().includes('error') ? 'danger' : 'success'}>
              <p style={{ marginTop: 10 }}>{message}</p>
            </IonText>
          )}
        </form>
      </IonContent>
    </IonPage>
  );
}
