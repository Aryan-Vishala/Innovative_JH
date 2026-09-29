import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Bell,
  ArrowUpRight,
  AlertTriangle,
  FolderKanban,
  GraduationCap,
  CheckCircle2,
} from "lucide-react";

import { getCurrentUser, problemApi } from "../services/api";

function Dashboard() {
  const user = getCurrentUser();
  const displayName = user?.name?.split(" ")[0] || "Admin";
  const [analytics, setAnalytics] = useState(null);
  const [recentProblems, setRecentProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isCurrent = true;

    Promise.all([
      problemApi.getPublicAnalytics(),
      problemApi.getAll({ limit: 5 }),
    ])
      .then(([analyticsResponse, problemsResponse]) => {
        if (!isCurrent) return;
        setAnalytics(analyticsResponse.data);
        setRecentProblems(problemsResponse.data || []);
      })
      .catch((error) => {
        if (isCurrent) setErrorMessage(error.message || "Dashboard data could not be loaded.");
      })
      .finally(() => {
        if (isCurrent) setLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  const kpis = analytics?.kpis || {};
  const statusCounts = analytics?.statusCounts || {};
  const statusTotal = Object.values(statusCounts).reduce((total, count) => total + count, 0);
  const monthlySubmissions = analytics?.monthlySubmissions || [];
  const monthlyMaximum = Math.max(...monthlySubmissions.map((month) => month.count), 1);
  const statusRows = [
    { label: "Resolved", count: statusCounts.resolved || 0, className: "resolved" },
    { label: "In Progress", count: statusCounts.inProgress || 0, className: "progress" },
    { label: "Under Review", count: statusCounts.underReview || 0, className: "review" },
    { label: "Submitted", count: statusCounts.submitted || 0, className: "submitted" },
    { label: "Rejected", count: statusCounts.rejected || 0, className: "review" },
  ];

  return (
    <div className="dashboard">

      {/* Header */}
      <header className="dashboard-header">

        <div>
          <p className="eyebrow">GOVERNMENT OF JHARKHAND</p>

          <h1>
            Good morning, {displayName} <span>👋</span>
          </h1>

          <p className="header-description">
            Here's what's happening across the Innovative Jharkhand platform.
          </p>
        </div>

        <div className="header-actions">

          <div className="search-box">
            <Search size={17} />
            <input
              type="text"
              placeholder="Search..."
            />
          </div>

          <button className="icon-button">
            <Bell size={19} />
            <span className="bell-dot"></span>
          </button>

          <div className="header-avatar">
            {displayName.charAt(0).toUpperCase()}
          </div>

        </div>

      </header>

      {errorMessage && (
        <p className="dashboard-data-error" role="alert">
          Dashboard data could not be loaded: {errorMessage}
        </p>
      )}

      {/* Statistics */}
      <section className="stats-grid">

        <StatCard
          title="Total Challenges"
          value={loading ? "..." : formatCount(kpis.totalReported)}
          icon={<AlertTriangle size={21} />}
          description="Reported challenges"
        />

        <StatCard
          title="Active Projects"
          value={loading ? "..." : formatCount(kpis.activeProjects)}
          icon={<FolderKanban size={21} />}
          description="In delivery or testing"
        />

        <StatCard
          title="Universities"
          value={loading ? "..." : formatCount(kpis.universities)}
          icon={<GraduationCap size={21} />}
          description="Registered HEI organizations"
        />

        <StatCard
          title="Resolved"
          value={loading ? "..." : formatCount(kpis.resolved)}
          icon={<CheckCircle2 size={21} />}
          description="Deployed solutions"
        />

      </section>


      {/* Dashboard content */}
      <section className="dashboard-grid">

        <div className="dashboard-card large-card">

          <div className="card-header">
            <div>
              <h2>Challenges Overview</h2>
              <p>Challenges submitted over the last 6 months</p>
            </div>

            <span>Last 6 months</span>
          </div>

          <div className="chart-placeholder">
            <div className="chart-bars">
              {monthlySubmissions.map((month) => (
                <div
                  key={month.month}
                  title={`${month.count} challenges`}
                  style={{ height: `${month.count ? Math.max((month.count / monthlyMaximum) * 100, 4) : 0}%` }}
                />
              ))}
            </div>

            <div className="chart-labels">
              {monthlySubmissions.map((month) => (
                <span key={month.month}>{month.month}</span>
              ))}
            </div>
            {!loading && monthlySubmissions.every((month) => month.count === 0) && (
              <p>No submissions in this period.</p>
            )}
          </div>

        </div>


        <div className="dashboard-card">

          <div className="card-header">
            <div>
              <h2>Challenge Status</h2>
              <p>Current distribution</p>
            </div>
          </div>

          <div className="status-list">
            {statusRows.map((row) => (
              <StatusRow
                key={row.label}
                label={row.label}
                value={formatCount(row.count)}
                percentage={statusTotal ? Math.round((row.count / statusTotal) * 100) : 0}
                className={row.className}
              />
            ))}
          </div>

        </div>

      </section>

      {/* Recent Problems */}

      <section className="dashboard-card recent-card">

        <div className="card-header">

          <div>
            <h2>Recent Challenges</h2>
            <p>Latest problems submitted by citizens</p>
          </div>

          <Link className="view-all" to="/tracker">
            View all
            <ArrowUpRight size={15} />
          </Link>

        </div>

        <div className="table-container">

          <table>

            <thead>
              <tr>
                <th>Challenge</th>
                <th>District</th>
                <th>Category</th>
                <th>Status</th>
                <th>Priority</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr><td colSpan="5">Loading recent challenges...</td></tr>
              ) : recentProblems.length === 0 ? (
                <tr><td colSpan="5">No challenges have been reported yet.</td></tr>
              ) : recentProblems.map((problem) => {
                const severity = problem.impact?.citizenReportedSeverity || "Medium";
                return (
                  <tr key={problem._id}>
                    <td>
                      <strong>{problem.title}</strong>
                      <span>{problem.problemId}</span>
                    </td>
                    <td>{problem.location?.district || "-"}</td>
                    <td>{problem.category}</td>
                    <td>
                      <span className={`status-badge ${getStatusBadgeClass(problem.status)}`}>
                        {formatStatus(problem.status)}
                      </span>
                    </td>
                    <td>
                      <span className={`priority ${severity.toLowerCase() === "critical" ? "high" : severity.toLowerCase()}`}>
                        {severity}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>

          </table>

        </div>

      </section>

    </div>
  );
}

function formatCount(value) {
  return Number.isFinite(value) ? value.toLocaleString() : "--";
}

function formatStatus(status = "") {
  return status
    .split("_")
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(" ");
}

function getStatusBadgeClass(status) {
  if (status === "DEPLOYED") return "resolved-badge";
  if (["SOLUTION_IN_PROGRESS", "PROTOTYPE_READY", "PILOT_TESTING"].includes(status)) {
    return "progress-badge";
  }
  return "review-badge";
}


/* =========================
   STAT CARD
========================= */

function StatCard({
  title,
  value,
  icon,
  description,
}) {
  return (
    <div className="stat-card">

      <div className="stat-top">

        <div className="stat-icon">
          {icon}
        </div>

      </div>

      <div className="stat-value">
        {value}
      </div>

      <div className="stat-title">
        {title}
      </div>

      <p className="stat-description">
        {description}
      </p>

    </div>
  );
}


/* =========================
   STATUS ROW
========================= */

function StatusRow({
  label,
  value,
  percentage,
  className,
}) {
  return (
    <div className="status-row">

      <div className="status-info">
        <div>
          <span className={`status-dot ${className}`}></span>
          {label}
        </div>

        <strong>{value}</strong>
      </div>

      <div className="status-bar">
        <div
          className={`status-fill ${className}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <span className="percentage">
        {percentage}%
      </span>

    </div>
  );
}

export default Dashboard;