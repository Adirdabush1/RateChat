// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import ChatLobby from './components/Chat/ChatLobby';
import ChatWindow from './components/Chat/Chatwindow';
import RegisterPage from './components/pages/register';
import LoginPage from './components/pages/login';
import RegisterParent from './components/pages/RegisterParent';
import LoginParent from './components/pages/LoginParent';
import ParentDashboard from './components/pages/ParentDashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* דף בחירת קבוצה */}
        <Route path="/" element={<ChatLobby />} />

        {/* דף צ'אט בקבוצה ספציפית לפי שם הקבוצה ב-URL */}
        <Route path="/chat/:groupName" element={<ChatWindow />} />

        {/* דפי הרשמה והתחברות לתלמיד */}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* דפי הרשמה והתחברות להורה */}
        <Route path="/register-parent" element={<RegisterParent />} />
        <Route path="/login-parent" element={<LoginParent />} />

        {/* דף הדשבורד של ההורה */}
        <Route path="/parent-dashboard" element={<ParentDashboard />} />

        {/* ברירת מחדל: כל כתובת אחרת תעביר ללובי */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
