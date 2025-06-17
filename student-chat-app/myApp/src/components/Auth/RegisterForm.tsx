import { useState } from 'react';
import { registerUser } from '../services/authService';
import { useHistory } from 'react-router-dom';  // לא useNavigate!

import {
  IonPage,
  IonContent,
  IonInput,
  IonButton,
  IonItem,
  IonLabel,
  IonText,
} from '@ionic/react';

export default function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const history = useHistory();  // זה הסוד

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await registerUser(email, password);
      setMessage('Registered successfully!');
      console.log(result);
      history.push('/lobby');  // במקום navigate
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Registration error');
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
            Register
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
