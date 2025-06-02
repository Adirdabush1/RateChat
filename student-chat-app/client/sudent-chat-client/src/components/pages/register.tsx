import { Link } from 'react-router-dom';
import RegisterForm from '../Auth/RegisterForm';

export default function RegisterPage() {
  return (
    <div style={{ padding: 20, maxWidth: 400, margin: '0 auto', textAlign: 'center' }}>
      <h2>הרשמה</h2>
      <RegisterForm />

      <div style={{ marginTop: 20 }}>
        <Link to="/register-parent" style={{ color: 'green', textDecoration: 'underline' }}>
          הרשמת הורה
        </Link>
      </div>
    </div>
  );
}
