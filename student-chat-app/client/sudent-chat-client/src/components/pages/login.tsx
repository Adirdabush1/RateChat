import { Link } from 'react-router-dom';
import LoginForm from '../Auth/LoginForm';

export default function LoginPage() {
  return (
    <div style={{ maxWidth: 400, margin: 'auto', marginTop: 50, textAlign: 'center' }}>
      <h2>התחברות</h2>
      <LoginForm />

      <div style={{ marginTop: 20 }}>
        <Link to="/login-parent" style={{ color: 'green', textDecoration: 'underline' }}>
          כניסת הורה
        </Link>
      </div>
    </div>
  );
}
