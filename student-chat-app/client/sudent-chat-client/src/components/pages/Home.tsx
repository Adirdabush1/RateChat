import { useNavigate } from "react-router-dom";
import "./styles/Home.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <div className="background-shape shape1"></div>
      <div className="background-shape shape2"></div>

      <div className="home-container">
        <h1 className="home-title">Welcome to RateChat</h1>

        <video className="intro-video" controls>
  <source src="/video.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>


        <div className="button-group">
          <button onClick={() => navigate("/login")}>Student Login</button>
          <button onClick={() => navigate("/register")}>Student Register</button>
          <button onClick={() => navigate("/login-parent")}>Parent Login</button>
          <button onClick={() => navigate("/register-parent")}>Parent Register</button>
        </div>
      </div>
    </div>
  );
};

export default Home;
