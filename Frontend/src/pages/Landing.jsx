import { Link } from "react-router-dom";

// ==========================================================================
// INLINE SVG ICONS — Consistent across all platforms
// ==========================================================================
const icons = {
  shield: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  mapPin: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  arrowRight: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  chart: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
  lock: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="3" ry="3" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  messages: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  search: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  heart: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  ),
  calendar: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="3" ry="3" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  users: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  star: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  checkCircle: (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  phoneCall: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  mail: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  clock: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
};

// ==========================================================================
// DATA: Features
// ==========================================================================
const features = [
  {
    icon: icons.chart,
    title: "Track Progress",
    desc: "Monitor your health metrics and see improvements over time with beautiful visual dashboards and real-time insights.",
    color: "blue",
  },
  {
    icon: icons.lock,
    title: "Secure & Private",
    desc: "Your data is end-to-end encrypted and HIPAA compliant. Only you and your care team have access.",
    color: "green",
  },
  {
    icon: icons.messages,
    title: "AI-Powered Chat",
    desc: "Connect with board-certified specialists through intelligent, secure messaging with instant doctor matching.",
    color: "purple",
  },
  {
    icon: icons.search,
    title: "Smart Matching",
    desc: "Take our diagnostic health quiz and get matched to the perfect specialist based on your unique symptoms.",
    color: "amber",
  },
  {
    icon: icons.heart,
    title: "Mental Wellness",
    desc: "Compassionate psychiatry and mental health support from licensed professionals, when you need it most.",
    color: "rose",
  },
  {
    icon: icons.calendar,
    title: "Easy Booking",
    desc: "Schedule, reschedule, or cancel consultations with your preferred doctor in just a few clicks, 24/7.",
    color: "cyan",
  },
];

// ==========================================================================
// DATA: Stats
// ==========================================================================
const stats = [
  { value: "10,000+", label: "Active Patients", icon: icons.users },
  { value: "12", label: "Medical Specialists", icon: icons.star },
  { value: "24/7", label: "Support Available", icon: icons.clock },
  { value: "100%", label: "HIPAA Compliant", icon: icons.shield },
];

// Color classes per feature
const colorMap = {
  blue:   { bg: "rgba(74,144,226,0.08)",  text: "#4A90E2", border: "rgba(74,144,226,0.15)" },
  green:  { bg: "rgba(80,200,120,0.08)",  text: "#50C878", border: "rgba(80,200,120,0.15)" },
  purple: { bg: "rgba(139,92,246,0.08)",  text: "#8B5CF6", border: "rgba(139,92,246,0.15)" },
  amber:  { bg: "rgba(245,158,11,0.08)",  text: "#F59E0B", border: "rgba(245,158,11,0.15)" },
  rose:   { bg: "rgba(244,63,94,0.08)",   text: "#F43F5E", border: "rgba(244,63,94,0.15)" },
  cyan:   { bg: "rgba(6,182,212,0.08)",   text: "#06B6D4", border: "rgba(6,182,212,0.15)" },
};

export default function Landing() {
  return (
    <div className="landing-new">
      {/* ================================================================== */}
      {/* HERO SECTION                                                       */}
      {/* ================================================================== */}
      <section className="landing-hero">
        <div className="landing-hero-bg">
          <div className="landing-hero-blob landing-hero-blob--top" />
          <div className="landing-hero-blob landing-hero-blob--bottom" />
        </div>

        <div className="landing-hero-inner">
          <div className="landing-hero-grid">
            {/* Left: Text */}
            <div className="landing-hero-text">
              {/* Status badge */}
              <div className="landing-status-badge">
                <span className="landing-status-dot" />
                HIPAA Compliant • 24/7 Support
              </div>

              <h1 className="landing-hero-heading">
                Your health,{" "}
                <span className="landing-hero-gradient">
                  unified.
                </span>
              </h1>

              <p className="landing-hero-subtitle">
                Connect with board-certified specialists, take intelligent health
                assessments, and manage your wellness journey — all from one
                secure, beautifully designed platform.
              </p>

              {/* CTA Buttons */}
              <div className="landing-hero-actions">
                <Link to="/login" className="btn-primary btn-primary--lg">
                  Get Started
                  {icons.arrowRight}
                </Link>
                <Link to="/login" className="btn-secondary btn-secondary--lg">
                  I already have an account
                </Link>
              </div>

              {/* Trust badges */}
              <div className="landing-trust-row">
                <div className="landing-trust-item">
                  <span className="landing-trust-icon landing-trust-icon--green">{icons.shield}</span>
                  <span>End-to-end encrypted</span>
                </div>
                <div className="landing-trust-item">
                  <span className="landing-trust-icon landing-trust-icon--green">{icons.mapPin}</span>
                  <span>Trusted by 10k+ patients</span>
                </div>
              </div>
            </div>

            {/* Right: Illustration */}
            <div className="landing-hero-visual">
              <div className="landing-hero-card landing-hero-card--main">
                <div className="landing-hero-card-top">
                  <div className="landing-hero-card-logo">H</div>
                  <div className="landing-hero-card-lines">
                    <div className="landing-hero-card-line" />
                    <div className="landing-hero-card-line landing-hero-card-line--short" />
                  </div>
                </div>
                <div className="landing-hero-card-body">
                  <div className="landing-hero-card-bar" />
                  <div className="landing-hero-card-bar landing-hero-card-bar--w75" />
                  <div className="landing-hero-card-bar landing-hero-card-bar--w83" />
                </div>
                <div className="landing-hero-card-actions">
                  <div className="landing-hero-card-action">💬</div>
                  <div className="landing-hero-card-action landing-hero-card-action--green">📅</div>
                </div>
              </div>
              <div className="landing-hero-card landing-hero-card--float">
                <div className="landing-hero-card-float-top">
                  <div className="landing-hero-card-float-avatar" />
                  <span className="landing-hero-card-float-name">Dr. Chen</span>
                </div>
                <div className="landing-hero-card-float-line" />
                <div className="landing-hero-card-float-line landing-hero-card-float-line--short" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* STATS BANNER                                                      */}
      {/* ================================================================== */}
      <section className="landing-stats">
        <div className="landing-stats-grid">
          {stats.map((stat, i) => (
            <div key={i} className="landing-stat-card">
              <div className="landing-stat-icon">{stat.icon}</div>
              <div className="landing-stat-body">
                <span className="landing-stat-value">{stat.value}</span>
                <span className="landing-stat-label">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================================================================== */}
      {/* FEATURES SECTION                                                  */}
      {/* ================================================================== */}
      <section className="landing-features">
        <div className="landing-features-header">
          <h2 className="landing-features-title">Why HealthApp?</h2>
          <p className="landing-features-subtitle">
            Everything you need to manage your health — securely, intelligently, beautifully.
          </p>
        </div>

        <div className="landing-features-grid">
          {features.map((feat, i) => {
            const c = colorMap[feat.color];
            return (
              <div key={i} className="landing-feature-card">
                <div
                  className="landing-feature-card-badge"
                  style={{ background: c.bg, color: c.text }}
                >
                  <div className="landing-feature-card-icon-wrap">
                    {feat.icon}
                  </div>
                </div>
                <h3 className="landing-feature-card-title">{feat.title}</h3>
                <p className="landing-feature-card-desc">{feat.desc}</p>
                <div className="landing-feature-card-accent" style={{ background: `linear-gradient(135deg, ${c.text}, transparent)` }} />
              </div>
            );
          })}
        </div>
      </section>

      {/* ================================================================== */}
      {/* CTA SECTION                                                       */}
      {/* ================================================================== */}
      <section className="landing-cta">
        <div className="landing-cta-card">
          <div className="landing-cta-icon">{icons.checkCircle}</div>
          <h2 className="landing-cta-title">Ready to take control of your health?</h2>
          <p className="landing-cta-subtitle">
            Join thousands of patients who trust HealthApp for their medical
            consultations, health tracking, and wellness management.
          </p>
          <div className="landing-cta-actions">
            <Link to="/login" className="btn-primary btn-primary--lg">
              Get Started Free
              {icons.arrowRight}
            </Link>
            <Link to="/login" className="btn-secondary btn-secondary--lg">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* FOOTER                                                            */}
      {/* ================================================================== */}
      <footer className="landing-footer-new">
        <div className="landing-footer-grid">
          {/* Brand */}
          <div className="landing-footer-brand">
            <div className="landing-footer-logo">
              <svg width="36" height="36" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="40" height="40" rx="10" fill="url(#ft-logo-grad)" />
                <path d="M12 20h4l3-6 4 12 3-6h4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <defs>
                  <linearGradient id="ft-logo-grad" x1="0" y1="0" x2="40" y2="40">
                    <stop offset="0%" stopColor="#4A90E2" />
                    <stop offset="100%" stopColor="#50C878" />
                  </linearGradient>
                </defs>
              </svg>
              <span>HealthApp</span>
            </div>
            <p className="landing-footer-brand-desc">
              Your trusted healthcare companion — connecting patients with
              world-class specialists through intelligent, secure technology.
            </p>
          </div>

          {/* Quick Links */}
          <div className="landing-footer-links">
            <h4 className="landing-footer-heading">Quick Links</h4>
            <ul className="landing-footer-list">
              <li><Link to="/login">Get Started</Link></li>
              <li><Link to="/login">Doctors</Link></li>
              <li><Link to="/login">Messages</Link></li>
              <li><Link to="/login">Health Quiz</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="landing-footer-links">
            <h4 className="landing-footer-heading">Support</h4>
            <ul className="landing-footer-list">
              <li>
                <span className="landing-footer-contact">
                  {icons.phoneCall}
                  <span>1-800-HEALTH</span>
                </span>
              </li>
              <li>
                <span className="landing-footer-contact">
                  {icons.mail}
                  <span>support@healthapp.com</span>
                </span>
              </li>
              <li>
                <span className="landing-footer-contact">
                  {icons.clock}
                  <span>24/7 Availability</span>
                </span>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="landing-footer-links">
            <h4 className="landing-footer-heading">Legal</h4>
            <ul className="landing-footer-list">
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">HIPAA Compliance</a></li>
              <li><a href="#">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="landing-footer-bottom">
          <p>© 2026 HealthApp. All rights reserved.</p>
          <p className="landing-footer-bottom-tagline">
            Built with ❤️ for better healthcare.
          </p>
        </div>
      </footer>
    </div>
  );
}