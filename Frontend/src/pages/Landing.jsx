import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="landing-page">
      <section className="hero">
        <div className="hero-content">
          <div className="hero-icon">🏥</div>
          <h1>Welcome to HealthApp</h1>
          <p className="hero-subtitle">
            Your personal health companion — track, manage, and improve your wellness journey.
          </p>
          <div className="hero-actions">
            <Link to="/login" className="btn-primary">
              Get Started
            </Link>
            <Link to="/login" className="btn-secondary">
              I already have an account
            </Link>
          </div>
        </div>
      </section>

      <section className="features">
        <h2>Why HealthApp?</h2>
        <div className="feature-cards">
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Track Progress</h3>
            <p>Monitor your health metrics and see improvements over time.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Secure & Private</h3>
            <p>Your data is encrypted and only accessible to you.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <h3>Stay Connected</h3>
            <p>Submit forms and stay in touch with your healthcare providers.</p>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <p>© 2026 HealthApp. All rights reserved.</p>
      </footer>
    </div>
  );
}