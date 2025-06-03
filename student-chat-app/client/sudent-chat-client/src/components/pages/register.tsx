import { Link } from 'react-router-dom';
import RegisterForm from '../Auth/RegisterForm';
import './styles/Login.css'; 

export default function RegisterPage() {
  return (
    <div className="login-page">
      {/* רקע דקורטיבי */}
      <div className="login-background">
        <div className="shape"></div>
        <div className="shape"></div>
      </div>

      {/* טופס הרשמה */}
      <div className="login-form-container">
        <h2>הרשמה</h2>
        <RegisterForm />

        <div className="extra-links">
          <p>כבר יש לך חשבון?</p>
          <Link to="/login">
            <button className="register-button">כניסה</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
