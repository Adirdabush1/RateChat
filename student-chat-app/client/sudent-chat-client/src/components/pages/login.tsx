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

      <div style={{ marginTop: 10 }}>
        <Link to="/register">
          <button style={{
            marginTop: 10,
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: 5,
            cursor: 'pointer'
          }}>
            להרשמה
          </button>
        </Link>
      </div>
    </div>
  );
}
