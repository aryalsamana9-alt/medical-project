import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../api";

export default function RegisterPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const { fullName, email, dateOfBirth } = location.state || {};

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // If user navigates directly to this page without state, redirect back
  if (!fullName || !email || !dateOfBirth) {
    navigate("/register/name", { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!password || !confirmPassword) {
      setError("Please fill in both password fields.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.register({
        full_name: fullName,
        email,
        date_of_birth: dateOfBirth,
        password,
      });
      login(response.data.token, response.data.user);
      navigate("/dashboard");
    } catch (err) {
      const message =
        err.response?.data?.detail || "Registration failed. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-icon">🔒</span>
          <h1>Create Account</h1>
          <p>Step 3 of 3 — Create your password</p>
        </div>

        <div className="step-indicator">
          <span className="step completed">✓</span>
          <span className="step-divider active"></span>
          <span className="step completed">✓</span>
          <span className="step-divider active"></span>
          <span className="step active">3</span>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate("/register/dob", { state: { fullName, email } })}
            >
              Back
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}