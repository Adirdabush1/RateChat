import {
  IonApp,
  IonRouterOutlet,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Switch, Route, Redirect } from 'react-router-dom';

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
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/lobby" component={ChatLobby} />
          <Route path="/chat/:groupName" component={ChatWindow} />
          <Route path="/register" component={RegisterPage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/register-parent" component={RegisterParent} />
          <Route path="/login-parent" component={LoginParent} />
          <Route path="/parent-dashboard" component={ParentDashboard} />
          <Redirect to="/" />
        </Switch>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
