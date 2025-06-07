import { useNavigate } from "react-router-dom";
import "../styles/Home.css"; // תוודא שקובץ ה-CSS נמצא שם

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="login-page">
      <div className="login-background">
        <div className="shape"></div>
        <div className="shape"></div>
      </div>

      <div className="login-form-container">
        <h2>Welcome to RateChat</h2>

        <video
          className="w-full rounded-xl mb-4"
          controls
          src="/video.mp4"
        >
          Your browser does not support the video tag.
        </video>

        <button onClick={() => navigate("/login")}>User Login</button>
        <button onClick={() => navigate("/register")}>User Register</button>
        <button onClick={() => navigate("/parent-login")}>Parent Login</button>
        <button onClick={() => navigate("/parent-register")}>Parent Register</button>

        <div className="extra-links">
          <p>Need help? <a href="#">Contact Support</a></p>
        </div>
      </div>
    </div>
  );
};

export default Home;
