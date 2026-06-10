import { Link, useLocation } from "react-router-dom";

const mobileNavItems = [
  { path: "/dashboard", label: "Home", icon: "dashboard" },
  { path: "/doctors", label: "Doctors", icon: "doctors" },
  { path: "/messages", label: "Messages", icon: "messages" },
  { path: "/appointments", label: "Calendar", icon: "appointments" },
  { path: "/profile", label: "Profile", icon: "profile" },
];

function BottomSvgIcon({ name, active }) {
  const stroke = active ? "#4A90E2" : "#94A3B8";
  const fill = active ? "rgba(74,144,226,0.1)" : "none";

  switch (name) {
    case "dashboard":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
      );
    case "doctors":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case "messages":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      );
    case "appointments":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="3" ry="3" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      );
    case "profile":
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      );
    default:
      return null;
  }
}

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="bottom-nav" aria-label="Mobile navigation">
      <ul className="bottom-nav-list">
        {mobileNavItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path === "/dashboard" && location.pathname === "/");
          return (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`bottom-nav-item ${isActive ? "active" : ""}`}
                aria-current={isActive ? "page" : undefined}
              >
                <BottomSvgIcon name={item.icon} active={isActive} />
                <span className="bottom-nav-label">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}