import {
  LayoutDashboard,
  AlertTriangle,
  GraduationCap,
  Building2,
  FolderKanban,
  BarChart3,
  Bell,
  Settings,
  Map,
  LogOut,
  PlusCircle,
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getCurrentUser, authApi } from "../services/api";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getCurrentUser();

  const handleLogout = () => {
    authApi.logout();
    navigate("/auth");
  };

  const isCitizen = user?.primaryRole === "citizen";

  return (
    <aside className="sidebar">
      {/* Logo */}
      <Link to="/" className="sidebar-logo" style={{ textDecoration: "none", color: "inherit" }}>
        <div className="logo-mark">IJ</div>
        <div>
          <h2>Innovative</h2>
          <span>Jharkhand</span>
        </div>
      </Link>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <p className="nav-label">MAIN MENU</p>

        {isCitizen ? (
          <>
            <Link
              to="/citizen"
              className={`nav-item ${location.pathname === "/citizen" ? "active" : ""}`}
            >
              <LayoutDashboard size={19} />
              <span>Citizen Dashboard</span>
            </Link>

            <Link
              to="/citizen/submit-problem"
              className={`nav-item ${location.pathname === "/citizen/submit-problem" ? "active" : ""}`}
            >
              <PlusCircle size={19} />
              <span>Report a Problem</span>
            </Link>

            <Link
              to="/citizen/my-problems"
              className={`nav-item ${location.pathname === "/citizen/my-problems" ? "active" : ""}`}
            >
              <AlertTriangle size={19} />
              <span>My Submissions</span>
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/dashboard"
              className={`nav-item ${location.pathname === "/dashboard" ? "active" : ""}`}
            >
              <LayoutDashboard size={19} />
              <span>State Dashboard</span>
            </Link>

            <Link
              to="/citizen/my-problems"
              className={`nav-item ${location.pathname === "/citizen/my-problems" ? "active" : ""}`}
            >
              <AlertTriangle size={19} />
              <span>Problems Directory</span>
            </Link>

            <a href="#" className="nav-item">
              <GraduationCap size={19} />
              <span>Universities</span>
            </a>

            <a href="#" className="nav-item">
              <Building2 size={19} />
              <span>Industry</span>
            </a>

            <a href="#" className="nav-item">
              <FolderKanban size={19} />
              <span>Projects</span>
            </a>

            <a href="#" className="nav-item">
              <BarChart3 size={19} />
              <span>Analytics</span>
            </a>

            <a href="#" className="nav-item">
              <Map size={19} />
              <span>Districts</span>
            </a>
          </>
        )}

        <p className="nav-label">SYSTEM</p>

        <a href="#" className="nav-item">
          <Bell size={19} />
          <span>Notifications</span>
          <span className="notification-count">3</span>
        </a>

        <a href="#" className="nav-item">
          <Settings size={19} />
          <span>Settings</span>
        </a>
      </nav>

      {/* User */}
      <div className="sidebar-bottom">
        <div className="user-card">
          <div className="avatar">
            {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
          </div>

          <div className="user-info">
            <strong>{user?.name || "Administrator"}</strong>
            <span style={{ textTransform: "capitalize" }}>
              {user?.primaryRole ? `${user.primaryRole} Portal` : "Government Portal"}
            </span>
          </div>
        </div>

        <button className="logout-btn" onClick={handleLogout} title="Sign out">
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;