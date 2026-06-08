import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function RegisterName() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleNext = (e) => {
    e.preventDefault();
    setError("");

    if (!fullName.trim() || fullName.trim().length < 2) {
      setError("Please enter your full name (at least 2 characters).");
      return;
    }
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    navigate("/register/dob", {
      state: { fullName: fullName.trim(), email: email.trim() },
    });
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-icon">👤</span>
          <h1>Create Account</h1>
          <p>Step 1 of 3 — Enter your name and email</p>
        </div>

        <div className="step-indicator">
          <span className="step active">1</span>
          <span className="step-divider"></span>
          <span className="step">2</span>
          <span className="step-divider"></span>
          <span className="step">3</span>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleNext} className="auth-form">
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              type="text"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary btn-full">
            Next
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="auth-link">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}