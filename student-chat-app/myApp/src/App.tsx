import {
  IonApp,
  IonRouterOutlet,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Routes, Route, Navigate } from 'react-router-dom';

import Home from './components/pages/Home';
import ChatLobby from './components/Chat/ChatLobby';
import ChatWindow from './components/Chat/Chatwindow';
import RegisterPage from './components/pages/register';
import LoginPage from './components/pages/login';
import RegisterParent from './components/pages/RegisterParent';
import LoginParent from './components/pages/LoginParent';
import ParentDashboard from './components/pages/ParentDashboard';

import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import '@ionic/react/css/palettes/dark.system.css';
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
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
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
