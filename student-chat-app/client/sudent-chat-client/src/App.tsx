import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

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
        <Route path="/" element={<Home />} />
        <Route path="/lobby" element={<ChatLobby />} />
        <Route path="/chat/:groupName" element={<ChatWindow />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register-parent" element={<RegisterParent />} />
        <Route path="/login-parent" element={<LoginParent />} />
        <Route path="/parent-dashboard" element={<ParentDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
