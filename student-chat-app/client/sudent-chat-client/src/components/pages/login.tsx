import { Link } from 'react-router-dom';
import LoginForm from '../Auth/LoginForm';
import '../pages/styles/Login.css';

export default function LoginPage() {
  return (
    <div className="login-page">
      <div className="login-background">
        <div className="shape"></div>
        <div className="shape"></div>
      </div>

      <div className="login-form-container">
        <h2>Login</h2>
        <LoginForm />

        <div className="extra-links">
          <div>
            <Link to="/login-parent">Parent Login</Link>
          </div>

          <div>
            <Link to="/register">
              <button className="register-button">Register</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
