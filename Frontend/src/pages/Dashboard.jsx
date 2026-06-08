import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="dashboard-page">
      <div className="dashboard-welcome">
        <h1>Welcome back, {user?.full_name?.split(" ")[0]}! 👋</h1>
        <p>Here's your health dashboard overview.</p>
      </div>

      <div className="dashboard-cards">
        <Link to="/home" className="dashboard-card">
          <div className="dashboard-card-icon">🏠</div>
          <h3>Home</h3>
          <p>View your health overview and tips.</p>
        </Link>

        <Link to="/profile" className="dashboard-card">
          <div className="dashboard-card-icon">👤</div>
          <h3>Profile</h3>
          <p>View and manage your profile details.</p>
        </Link>

        <Link to="/form" className="dashboard-card">
          <div className="dashboard-card-icon">📝</div>
          <h3>Contact Form</h3>
          <p>Send us a message or inquiry.</p>
        </Link>
      </div>
    </div>
  );
}