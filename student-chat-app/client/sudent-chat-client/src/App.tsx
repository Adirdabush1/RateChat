// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import ChatLobby from './components/Chat/ChatLobby';
import ChatWindow from './components/Chat/Chatwindow';
import RegisterPage from './components/pages/register';
import LoginPage from '../src/components/pages/login';
import RegisterParent from './components/pages/RegisterParent';
import LoginParent from './components/pages/LoginParent';
import ParentDashboard from './components/pages/ParentDashboard';
import Home from './components/pages/Home';

function App() {
  return (
    <Router>
      <Routes>
        {/* Home page (main landing page) */}
        <Route path="/" element={<Home />} />

        {/* Chat lobby (group selection) */}
        <Route path="/lobby" element={<ChatLobby />} />

        {/* Chat page for a specific group by name */}
        <Route path="/chat/:groupName" element={<ChatWindow />} />

        {/* Student registration and login */}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Parent registration and login */}
        <Route path="/register-parent" element={<RegisterParent />} />
        <Route path="/login-parent" element={<LoginParent />} />

        {/* Parent dashboard */}
        <Route path="/parent-dashboard" element={<ParentDashboard />} />

        {/* Redirect unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
