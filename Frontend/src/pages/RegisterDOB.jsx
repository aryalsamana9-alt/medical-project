import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";

export default function RegisterDOB() {
  const location = useLocation();
  const navigate = useNavigate();
  const { fullName, email } = location.state || {};

  const [dateOfBirth, setDateOfBirth] = useState("");
  const [error, setError] = useState("");

  // If user navigates directly to this page without state, redirect back
  if (!fullName || !email) {
    navigate("/register/name", { replace: true });
    return null;
  }

  const handleNext = (e) => {
    e.preventDefault();
    setError("");

    if (!dateOfBirth) {
      setError("Please select your date of birth.");
      return;
    }

    // Check age: user must be at least 13 years old
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 13) {
      setError("You must be at least 13 years old to create an account.");
      return;
    }
    if (age > 120) {
      setError("Please enter a valid date of birth.");
      return;
    }

    navigate("/register/password", {
      state: { fullName, email, dateOfBirth },
    });
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-icon">🎂</span>
          <h1>Create Account</h1>
          <p>Step 2 of 3 — Enter your date of birth</p>
        </div>

        <div className="step-indicator">
          <span className="step completed">✓</span>
          <span className="step-divider active"></span>
          <span className="step active">2</span>
          <span className="step-divider"></span>
          <span className="step">3</span>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleNext} className="auth-form">
          <div className="form-group">
            <label htmlFor="dob">Date of Birth</label>
            <input
              id="dob"
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              required
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate("/register/name")}
            >
              Back
            </button>
            <button type="submit" className="btn-primary">
              Next
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}