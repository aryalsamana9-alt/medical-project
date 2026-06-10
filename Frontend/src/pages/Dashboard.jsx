import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// ==========================================================================
// QUICK ACTION CARDS DATA
// ==========================================================================
const quickActions = [
  {
    id: "see-doctor",
    title: "See Doctor",
    description: "Book an appointment with a specialist",
    icon: "stethoscope",
    color: "blue",
    path: "/doctors",
  },
  {
    id: "message-doctor",
    title: "Message Doctor",
    description: "Chat with your healthcare provider",
    icon: "message",
    color: "teal",
    path: "/messages",
  },
  {
    id: "medical-history",
    title: "Medical History",
    description: "View your complete health records",
    icon: "clipboard",
    color: "purple",
    path: "/medical-history",
  },
  {
    id: "profile",
    title: "Profile",
    description: "Manage your personal information",
    icon: "user",
    color: "indigo",
    path: "/profile",
  },
  {
    id: "quick-contact",
    title: "Quick Contact",
    description: "Reach our support team instantly",
    icon: "phone",
    color: "emerald",
    path: "/quick-contact",
  },
];

// ==========================================================================
// SVG ICONS for Quick Actions
// ==========================================================================
function ActionIcon({ name }) {
  const baseProps = {
    width: "28",
    height: "28",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  switch (name) {
    case "stethoscope":
      return (
        <svg {...baseProps}>
          <path d="M4.8 2.902A2.995 2.995 0 0 0 2.1 5.7 10 10 0 0 0 12 22a10 10 0 0 0 9.9-16.3" />
          <path d="M16 15c2.21 0 4-1.79 4-4s-1.79-4-4-4" />
          <path d="M16 15v5a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-5" />
          <path d="M8 2h8" />
        </svg>
      );
    case "message":
      return (
        <svg {...baseProps}>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      );
    case "clipboard":
      return (
        <svg {...baseProps}>
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
          <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
        </svg>
      );
    case "user":
      return (
        <svg {...baseProps}>
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      );
    case "phone":
      return (
        <svg {...baseProps}>
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      );
    default:
      return null;
  }
}

// ==========================================================================
// HEALTH OVERVIEW DATA
// ==========================================================================
const healthOverview = [
  {
    id: "appointments",
    title: "Upcoming Appointments",
    value: "2",
    subtitle: "Next: Tomorrow, 10:00 AM",
    icon: "calendar",
    trend: "up",
  },
  {
    id: "prescriptions",
    title: "Active Prescriptions",
    value: "3",
    subtitle: "1 renewal pending",
    icon: "pill",
    trend: "stable",
  },
  {
    id: "reports",
    title: "Recent Reports",
    value: "5",
    subtitle: "2 new this week",
    icon: "file",
    trend: "up",
  },
  {
    id: "reminders",
    title: "Health Reminders",
    value: "4",
    subtitle: "1 due today",
    icon: "bell",
    trend: "warning",
  },
];

function OverviewIcon({ name }) {
  const baseProps = {
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  switch (name) {
    case "calendar":
      return (
        <svg {...baseProps}>
          <rect x="3" y="4" width="18" height="18" rx="3" ry="3" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      );
    case "pill":
      return (
        <svg {...baseProps}>
          <path d="M10.5 20.5L3.5 13.5a4.95 4.95 0 1 1 7-7l7 7a4.95 4.95 0 1 1-7 7z" />
          <path d="M8.5 8.5l7 7" />
        </svg>
      );
    case "file":
      return (
        <svg {...baseProps}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      );
    case "bell":
      return (
        <svg {...baseProps}>
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      );
    default:
      return null;
  }
}

// ==========================================================================
// RECENT ACTIVITY DATA
// ==========================================================================
const recentActivities = [
  {
    id: 1,
    type: "consultation",
    title: "Dr. Sarah Johnson — General Checkup",
    description: "Completed. Follow-up in 3 months.",
    time: "Today, 9:00 AM",
    icon: "stethoscope",
    status: "completed",
  },
  {
    id: 2,
    type: "message",
    title: "New message from Dr. Michael Chen",
    description: "Your lab results are available for review.",
    time: "Yesterday, 4:30 PM",
    icon: "message",
    status: "unread",
  },
  {
    id: 3,
    type: "prescription",
    title: "Prescription Renewed — Lisinopril 10mg",
    description: "30-day supply. Ready at Walgreens Pharmacy.",
    time: "Yesterday, 2:15 PM",
    icon: "pill",
    status: "info",
  },
  {
    id: 4,
    type: "report",
    title: "Blood Test Results Uploaded",
    description: "CBC and lipid panel results attached.",
    time: "Jun 7, 2026",
    icon: "file",
    status: "completed",
  },
  {
    id: 5,
    type: "appointment",
    title: "Appointment Confirmed — Dr. Emily Rodriguez",
    description: "Cardiology consultation on Jun 15, 2026 at 11:00 AM.",
    time: "Jun 6, 2026",
    icon: "calendar",
    status: "upcoming",
  },
];

function ActivityIcon({ name }) {
  const baseProps = {
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  switch (name) {
    case "stethoscope":
      return (
        <svg {...baseProps}>
          <path d="M4.8 2.902A2.995 2.995 0 0 0 2.1 5.7 10 10 0 0 0 12 22a10 10 0 0 0 9.9-16.3" />
          <path d="M16 15c2.21 0 4-1.79 4-4s-1.79-4-4-4" />
          <path d="M16 15v5a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-5" />
        </svg>
      );
    case "message":
      return (
        <svg {...baseProps}>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      );
    case "pill":
      return (
        <svg {...baseProps}>
          <path d="M10.5 20.5L3.5 13.5a4.95 4.95 0 1 1 7-7l7 7a4.95 4.95 0 1 1-7 7z" />
          <path d="M8.5 8.5l7 7" />
        </svg>
      );
    case "file":
      return (
        <svg {...baseProps}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
      );
    case "calendar":
      return (
        <svg {...baseProps}>
          <rect x="3" y="4" width="18" height="18" rx="3" ry="3" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      );
    default:
      return (
        <svg {...baseProps}>
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      );
  }
}

function getStatusClass(status) {
  switch (status) {
    case "completed":
      return "activity-status-completed";
    case "unread":
      return "activity-status-unread";
    case "info":
      return "activity-status-info";
    case "upcoming":
      return "activity-status-upcoming";
    default:
      return "";
  }
}

// ==========================================================================
// MAIN DASHBOARD COMPONENT
// ==========================================================================
export default function Dashboard() {
  const { user } = useAuth();
  const firstName = user?.full_name?.split(" ")[0] || "Patient";

  return (
    <div className="dashboard-home">
      {/* ============ QUICK ACTION CARDS ============ */}
      <section className="dashboard-section" aria-labelledby="quick-actions-heading">
        <div className="section-header">
          <h2 id="quick-actions-heading">Quick Actions</h2>
        </div>
        <div className="quick-actions-grid">
          {quickActions.map((action) => (
            <Link
              key={action.id}
              to={action.path}
              className={`quick-action-card quick-action-${action.color}`}
            >
              <div className={`quick-action-icon-wrap quick-action-icon-${action.color}`}>
                <ActionIcon name={action.icon} />
              </div>
              <div className="quick-action-text">
                <h3>{action.title}</h3>
                <p>{action.description}</p>
              </div>
              <div className="quick-action-arrow">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ============ HEALTH OVERVIEW ============ */}
      <section className="dashboard-section" aria-labelledby="health-overview-heading">
        <div className="section-header">
          <h2 id="health-overview-heading">Health Overview</h2>
        </div>
        <div className="health-overview-grid">
          {healthOverview.map((item) => (
            <div key={item.id} className="health-overview-card">
              <div className={`health-overview-icon health-overview-trend-${item.trend}`}>
                <OverviewIcon name={item.icon} />
              </div>
              <div className="health-overview-body">
                <span className="health-overview-value">{item.value}</span>
                <h3 className="health-overview-title">{item.title}</h3>
                <p className="health-overview-subtitle">{item.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============ RECENT ACTIVITY ============ */}
      <section className="dashboard-section" aria-labelledby="recent-activity-heading">
        <div className="section-header">
          <h2 id="recent-activity-heading">Recent Activity</h2>
          <Link to="/medical-history" className="section-link">
            View All
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
        <div className="activity-timeline">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="activity-item">
              <div className={`activity-icon ${getStatusClass(activity.status)}`}>
                <ActivityIcon name={activity.icon} />
              </div>
              <div className="activity-body">
                <div className="activity-header">
                  <h4 className="activity-title">{activity.title}</h4>
                  <span className="activity-time">{activity.time}</span>
                </div>
                <p className="activity-description">{activity.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}