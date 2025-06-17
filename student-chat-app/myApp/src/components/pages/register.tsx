import { IonPage, IonContent } from '@ionic/react';
import { Link } from 'react-router-dom';
import RegisterForm from '../Auth/RegisterForm';
import './styles/Login.css';

export default function RegisterPage() {
  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="login-page">
          <div className="login-background">
            <div className="shape"></div>
            <div className="shape"></div>
          </div>

          <div className="login-form-container">
            <h2>Register</h2>
            <RegisterForm />

            <div className="extra-links">
              <p>Already have an account?</p>
              <Link to="/login">
                <button className="register-button">Login</button>
              </Link>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
