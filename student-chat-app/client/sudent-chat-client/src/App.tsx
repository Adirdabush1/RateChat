// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Home from './components/pages/Home'; 

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
        {/* Home page with intro video */}
        <Route path="/" element={<Home />} />

        {/* Group selection (chat lobby) */}
        <Route path="/lobby" element={<ChatLobby />} />

        {/* Chat page for a specific group by URL group name */}
        <Route path="/chat/:groupName" element={<ChatWindow />} />

        {/* Student registration and login pages */}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Parent registration and login pages */}
        <Route path="/register-parent" element={<RegisterParent />} />
        <Route path="/login-parent" element={<LoginParent />} />

        {/* Parent dashboard page */}
        <Route path="/parent-dashboard" element={<ParentDashboard />} />

        {/* Default: redirect all other URLs to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
