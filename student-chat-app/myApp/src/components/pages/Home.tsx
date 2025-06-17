import {
  IonPage,
  IonContent,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
} from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import './styles/Home.css';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <IonPage>
      <IonContent fullscreen className="home-page">
        <div className="background-shape shape1"></div>
        <div className="background-shape shape2"></div>

        <div className="home-container">
          <IonText className="home-title">
            <h1>Welcome to RateChat</h1>
          </IonText>

          <video className="intro-video" controls>
            <source src="/video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          <IonGrid className="button-group">
            <IonRow>
              <IonCol size="12" className="ion-padding-vertical">
                <IonButton expand="block" onClick={() => navigate('/login')}>
                  Student Login
                </IonButton>
              </IonCol>
              <IonCol size="12" className="ion-padding-vertical">
                <IonButton expand="block" onClick={() => navigate('/register')}>
                  Student Register
                </IonButton>
              </IonCol>
              <IonCol size="12" className="ion-padding-vertical">
                <IonButton
                  expand="block"
                  onClick={() => navigate('/login-parent')}
                >
                  Parent Login
                </IonButton>
              </IonCol>
              <IonCol size="12" className="ion-padding-vertical">
                <IonButton
                  expand="block"
                  onClick={() => navigate('/register-parent')}
                >
                  Parent Register
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
