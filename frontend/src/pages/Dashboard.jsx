import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Bell,
  LogOut,
  RefreshCw,
  Loader2,
  Building2,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Layers,
} from "lucide-react";
import { problemApi, getCurrentUser, authApi } from "../services/api";
import CollectorOversightView from "../components/dashboard/CollectorOversightView";
import MukhiyaGroundCheckView from "../components/dashboard/MukhiyaGroundCheckView";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const [loading, setLoading] = useState(true);
  const [problems, setProblems] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [logoutNotification, setLogoutNotification] = useState("");

  // Determine initial hierarchy mode based on logged-in role
  const isPriUser =
    currentUser?.primaryRole === "pri" ||
    currentUser?.organizationName?.toLowerCase().includes("panchayat") ||
    currentUser?.name?.toLowerCase().includes("mukhiya");

  const [hierarchyMode, setHierarchyMode] = useState(isPriUser ? "MUKHIYA" : "COLLECTOR");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [problemsRes, analyticsRes] = await Promise.all([
        problemApi.getAll().catch(() => ({ data: [] })),
        problemApi.getPublicAnalytics().catch(() => ({ data: null })),
      ]);

      if (problemsRes?.data) {
        setProblems(problemsRes.data);
      }
      if (analyticsRes?.data) {
        setAnalytics(analyticsRes.data);
      }
    } catch (err) {
      console.warn("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  // Logout Handler
  const handleLogout = () => {
    authApi.logout();
    setLogoutNotification("Signing out of Jharkhand Administrative Portal...");
    setTimeout(() => {
      navigate("/auth?mode=login");
    }, 400);
  };

  return (
    <div className="dashboard-container">
      {/* Top Header Bar */}
      <header className="gov-dashboard-header">
        <div className="gov-header-left">
          <p className="eyebrow">GOVERNMENT OF JHARKHAND &bull; ADMINISTRATIVE HIERARCHY COMMAND</p>
          <div className="title-role-row">
            <h1>
              Welcome, {currentUser?.name || "Administrative Officer"} <span>👋</span>
            </h1>
            <span className="role-tag-pill">
              {hierarchyMode === "COLLECTOR"
                ? "District Collector / Magistrate View"
                : "Gram Panchayat Mukhiya (PRI) View"}
            </span>
          </div>
          <p className="header-description">
            Multi-tier governance: local Mukhiyas conduct physical ground checks while District Collectors supervise multi-panchayat execution and municipal corporations.
          </p>
        </div>

        <div className="gov-header-actions">
          {/* Refresh Action */}
          <button
            className="gov-icon-button"
            onClick={handleRefresh}
            title="Refresh Live State Records"
            disabled={refreshing}
          >
            <RefreshCw size={17} className={refreshing ? "animate-spin" : ""} />
          </button>

          {/* Notifications */}
          <button className="gov-icon-button" title="Administrative Alerts">
            <Bell size={18} />
            <span className="bell-dot-alert"></span>
          </button>

          {/* Avatar Profile */}
          <div className="gov-avatar" title={currentUser?.organizationName || "Admin"}>
            {(currentUser?.name || "A").charAt(0).toUpperCase()}
          </div>

          {/* PROMINENT LOGOUT BUTTON */}
          <button
            type="button"
            className="gov-logout-button"
            onClick={handleLogout}
            title="Log out of the administrative system"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Logout Toast Notification */}
      {logoutNotification && (
        <div className="logout-toast-banner">
          <Loader2 size={16} className="animate-spin" />
          <span>{logoutNotification}</span>
        </div>
      )}

      {/* =========================================================================
          🌟 ADMINISTRATIVE HIERARCHY SWITCHER BAR
      ========================================================================= */}
      <section className="hierarchy-switcher-bar">
        <div className="switcher-info">
          <span className="switcher-label">ADMINISTRATIVE HIERARCHY TIER:</span>
          <p className="switcher-desc">
            Switch between grassroots Gram Panchayat verification and macro District Collector multi-panchayat governance.
          </p>
        </div>

        <div className="switcher-tabs">
          <button
            type="button"
            className={`hierarchy-tab-btn ${hierarchyMode === "COLLECTOR" ? "active collector" : ""}`}
            onClick={() => setHierarchyMode("COLLECTOR")}
          >
            <Building2 size={17} />
            <div className="tab-text">
              <strong>District Collector & Municipal Oversight</strong>
              <span>Macro-Oversight across All Mukhiyas & Corporations</span>
            </div>
          </button>

          <button
            type="button"
            className={`hierarchy-tab-btn ${hierarchyMode === "MUKHIYA" ? "active mukhiya" : ""}`}
            onClick={() => setHierarchyMode("MUKHIYA")}
          >
            <ShieldCheck size={17} />
            <div className="tab-text">
              <strong>Gram Panchayat Mukhiya Ground Checks</strong>
              <span>Grassroots Verification & Site Truth Certification</span>
            </div>
          </button>
        </div>
      </section>

      {/* Loading state indicator */}
      {loading && (
        <div className="syncing-indicator">
          <Loader2 size={16} className="animate-spin" />
          <span>Syncing real-time records from Jharkhand State Database...</span>
        </div>
      )}

      {/* Render Selected Hierarchical View */}
      {hierarchyMode === "COLLECTOR" ? (
        <CollectorOversightView
          problems={problems}
          analytics={analytics}
          currentUser={currentUser}
        />
      ) : (
        <MukhiyaGroundCheckView onProblemInspected={fetchData} />
      )}
    </div>
  );
}

export default Dashboard;