import {
  LayoutDashboard,
  AlertTriangle,
  BarChart3,
  LogOut,
  PlusCircle,
  ShieldCheck,
  Building2,
  GraduationCap,
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getCurrentUser, authApi } from "../services/api";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getCurrentUser();

  const handleLogout = () => {
    authApi.logout();
    navigate("/auth?mode=login");
  };

  const isCitizen = user?.primaryRole === "citizen";
  const isPri =
    user?.primaryRole === "pri" ||
    user?.organizationName?.toLowerCase().includes("panchayat") ||
    user?.name?.toLowerCase().includes("mukhiya");
  const isHei =
    user?.primaryRole === "participating_hei" ||
    user?.primaryRole === "nodal" ||
    user?.email?.includes(".edu.in") ||
    user?.email?.includes(".ac.in");

  const getRoleLabel = () => {
    if (!user?.primaryRole) return "Government Portal";
    switch (user.primaryRole) {
      case "pri":
        return "Gram Panchayat Mukhiya";
      case "nodal":
        return "Nodal HEI Dean";
      case "participating_hei":
        return "University R&D Faculty";
      case "admin":
        return "District Administration / DC";
      case "industry":
        return "Industry CSR Partner";
      default:
        return isPri ? "Gram Panchayat Mukhiya" : isHei ? "University Faculty" : "Government Officer";
    }
  };

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

            <Link
              to="/"
              className={`nav-item ${location.pathname === "/" ? "active" : ""}`}
            >
              <BarChart3 size={19} />
              <span>Public Tracker</span>
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/dashboard"
              className={`nav-item ${location.pathname === "/dashboard" ? "active" : ""}`}
            >
              <LayoutDashboard size={19} />
              <span>
                {isPri
                  ? "Mukhiya Ground Desk"
                  : isHei
                  ? "University Action Hub"
                  : "State Governance Command"}
              </span>
            </Link>

            <Link
              to="/citizen/my-problems"
              className={`nav-item ${location.pathname === "/citizen/my-problems" ? "active" : ""}`}
            >
              <AlertTriangle size={19} />
              <span>Problems Directory</span>
            </Link>

            <Link
              to="/citizen/submit-problem"
              className={`nav-item ${location.pathname === "/citizen/submit-problem" ? "active" : ""}`}
            >
              <PlusCircle size={19} />
              <span>Submit Ground Issue</span>
            </Link>

            <Link
              to="/"
              className={`nav-item ${location.pathname === "/" ? "active" : ""}`}
            >
              <BarChart3 size={19} />
              <span>Public Transparency Board</span>
            </Link>
          </>
        )}
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
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
