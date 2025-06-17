import {
  IonPage,
  IonContent,
  IonText,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
} from '@ionic/react';
import { Link } from 'react-router-dom';
import LoginForm from '../Auth/LoginForm';
import '../pages/styles/Login.css';

const LoginPage: React.FC = () => {
  return (
    <IonPage>
      <IonContent fullscreen className="login-page">
        <div className="login-background">
          <div className="shape"></div>
          <div className="shape"></div>
        </div>

        <div className="login-form-container">
          <IonText>
            <h2>Login</h2>
          </IonText>

          <LoginForm />

          <div className="extra-links">
            <div>
              <Link to="/login-parent">Parent Login</Link>
            </div>

            <div>
              <Link to="/register">
                <IonButton className="register-button" fill="solid" expand="block">
                  Register
                </IonButton>
              </Link>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;
