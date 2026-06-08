import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to={isAuthenticated ? "/dashboard" : "/"}>
          <span className="navbar-logo">❤️</span>
          <span className="navbar-title">HealthApp</span>
        </Link>
      </div>

      <div className="navbar-links">
        {isAuthenticated ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/home">Home</Link>
            <Link to="/profile">Profile</Link>
            <Link to="/form">Form</Link>
            <div className="navbar-user">
              <span className="navbar-username">👤 {user?.full_name}</span>
              <button className="btn-logout" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
          </>
        )}
      </div>
    </nav>
  );
}