import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showEmergencyDialog, setShowEmergencyDialog] = useState(false);

  const firstName = user?.full_name?.split(" ")[0] || "Patient";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleEmergencyCall = () => {
    window.open("tel:911", "_self");
  };

  // Mock notifications
  const notifications = [
    { id: 1, text: "Dr. Smith confirmed your appointment for tomorrow at 10:00 AM.", time: "5 min ago", unread: true },
    { id: 2, text: "Your prescription has been renewed.", time: "1 hour ago", unread: true },
    { id: 3, text: "Lab results are now available.", time: "3 hours ago", unread: false },
  ];

  return (
    <div className="dashboard-layout">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="dashboard-main">
        {/* HEADER */}
        <header className="dashboard-header">
          <div className="dashboard-header-left">
            {/* Mobile menu trigger — shown on small screens */}
            <button className="mobile-menu-btn" aria-label="Open menu" onClick={() => {
              // Toggle sidebar on mobile if needed — future enhancement
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <div className="dashboard-greeting">
              <h1>
                {greeting}, <span className="greeting-name">{firstName}</span> 👋
              </h1>
              <p>Here's your health overview for today</p>
            </div>
          </div>

          <div className="dashboard-header-right">
            {/* Notification Bell */}
            <div className="notification-wrapper">
              <button
                className="icon-btn"
                aria-label="Notifications"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                <span className="notification-badge">3</span>
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="notification-dropdown">
                  <div className="notification-dropdown-header">
                    <h3>Notifications</h3>
                    <button className="text-btn" onClick={() => setShowNotifications(false)}>Mark all read</button>
                  </div>
                  <ul className="notification-list">
                    {notifications.map((n) => (
                      <li key={n.id} className={`notification-item ${n.unread ? "unread" : ""}`}>
                        <div className="notification-dot" />
                        <div className="notification-content">
                          <p>{n.text}</p>
                          <span>{n.time}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="notification-dropdown-footer">
                    <Link to="/messages" onClick={() => setShowNotifications(false)}>View all notifications</Link>
                  </div>
                </div>
              )}
            </div>

            {/* User Avatar & Menu */}
            <div className="user-menu-wrapper">
              <button
                className="user-avatar-btn"
                aria-label="User menu"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <div className="user-avatar">
                  {user?.full_name ? user.full_name.charAt(0).toUpperCase() : "P"}
                </div>
              </button>

              {showUserMenu && (
                <div className="user-dropdown">
                  <div className="user-dropdown-header">
                    <div className="user-dropdown-avatar">
                      {user?.full_name ? user.full_name.charAt(0).toUpperCase() : "P"}
                    </div>
                    <div>
                      <p className="user-dropdown-name">{user?.full_name || "Patient"}</p>
                      <p className="user-dropdown-email">{user?.email || "patient@healthapp.com"}</p>
                    </div>
                  </div>
                  <ul className="user-dropdown-menu">
                    <li><Link to="/profile" onClick={() => setShowUserMenu(false)}>View Profile</Link></li>
                    <li><Link to="/settings" onClick={() => setShowUserMenu(false)}>Settings</Link></li>
                    <li><Link to="/medical-history" onClick={() => setShowUserMenu(false)}>Medical History</Link></li>
                  </ul>
                  <div className="user-dropdown-footer">
                    <button className="logout-btn" onClick={handleLogout}>Sign Out</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <div className="dashboard-content">
          {children}
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />

      {/* Emergency Floating Action Button */}
      <button
        className="emergency-fab"
        aria-label="Emergency contact"
        title="Emergency - Call 911"
        onClick={() => setShowEmergencyDialog(true)}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
        <span className="emergency-fab-label">Emergency</span>
      </button>

      {/* Emergency Confirmation Dialog */}
      {showEmergencyDialog && (
        <div className="emergency-overlay" onClick={() => setShowEmergencyDialog(false)}>
          <div className="emergency-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="emergency-dialog-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <h2>Emergency Assistance</h2>
            <p>This will immediately call 911. Are you sure you need emergency services?</p>
            <div className="emergency-dialog-actions">
              <button className="btn-secondary" onClick={() => setShowEmergencyDialog(false)}>Cancel</button>
              <button className="btn-emergency" onClick={handleEmergencyCall}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                Call 911 Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}