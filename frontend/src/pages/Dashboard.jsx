import {
  Search,
  Bell,
  ArrowUpRight,
  AlertTriangle,
  FolderKanban,
  GraduationCap,
  CheckCircle2,
} from "lucide-react";

import ProblemCard from "../components/problems/ProblemCard";

function Dashboard() {
  return (
    <div className="dashboard">

      {/* Header */}
      <header className="dashboard-header">

        <div>
          <p className="eyebrow">GOVERNMENT OF JHARKHAND</p>

          <h1>
            Good morning, Admin <span>👋</span>
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
            A
          </div>

        </div>

      </header>


      {/* Statistics */}
      <section className="stats-grid">

        <StatCard
          title="Total Challenges"
          value="1,248"
          change="+12.4%"
          icon={<AlertTriangle size={21} />}
          description="vs. last month"
        />

        <StatCard
          title="Active Projects"
          value="342"
          change="+8.2%"
          icon={<FolderKanban size={21} />}
          description="currently in progress"
        />

        <StatCard
          title="Universities"
          value="87"
          change="+5.6%"
          icon={<GraduationCap size={21} />}
          description="participating institutions"
        />

        <StatCard
          title="Resolved"
          value="624"
          change="+18.7%"
          icon={<CheckCircle2 size={21} />}
          description="challenges addressed"
        />

      </section>


      {/* Dashboard content */}
      <section className="dashboard-grid">

        <div className="dashboard-card large-card">

          <div className="card-header">
            <div>
              <h2>Challenges Overview</h2>
              <p>Problems submitted over the last 6 months</p>
            </div>

            <select>
              <option>Last 6 months</option>
              <option>Last 30 days</option>
              <option>This year</option>
            </select>
          </div>

          <div className="chart-placeholder">
            <div className="chart-bars">
              <div style={{ height: "45%" }}></div>
              <div style={{ height: "60%" }}></div>
              <div style={{ height: "52%" }}></div>
              <div style={{ height: "72%" }}></div>
              <div style={{ height: "68%" }}></div>
              <div style={{ height: "90%" }}></div>
            </div>

            <div className="chart-labels">
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
              <span>Jul</span>
              <span>Aug</span>
              <span>Sep</span>
            </div>
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

            <StatusRow
              label="Resolved"
              value="624"
              percentage="50%"
              className="resolved"
            />

            <StatusRow
              label="In Progress"
              value="342"
              percentage="27%"
              className="progress"
            />

            <StatusRow
              label="Under Review"
              value="187"
              percentage="15%"
              className="review"
            />

            <StatusRow
              label="Submitted"
              value="95"
              percentage="8%"
              className="submitted"
            />

          </div>

        </div>

      </section>

      <ProblemCard
        title="Non-functional street lights"
        description="Several street lights are not working in the residential area, creating safety concerns for citizens."
        category="Urban Infrastructure"
        district="Ranchi"
        status="In Progress"
        priority="High"
        submittedBy="Citizen"
        date="08 Sep 2026"
        onViewDetails={() => alert("Opening problem details")}
      />

      {/* Recent Problems */}

      <section className="dashboard-card recent-card">

        <div className="card-header">

          <div>
            <h2>Recent Challenges</h2>
            <p>Latest problems submitted by citizens</p>
          </div>

          <button className="view-all">
            View all
            <ArrowUpRight size={15} />
          </button>

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

              <tr>
                <td>
                  <strong>Non-functional street lights</strong>
                  <span>#IJ-10248</span>
                </td>

                <td>Ranchi</td>

                <td>Urban Infrastructure</td>

                <td>
                  <span className="status-badge progress-badge">
                    In Progress
                  </span>
                </td>

                <td>
                  <span className="priority high">
                    High
                  </span>
                </td>
              </tr>

              <tr>
                <td>
                  <strong>Water supply disruption</strong>
                  <span>#IJ-10247</span>
                </td>

                <td>Dhanbad</td>

                <td>Water Management</td>

                <td>
                  <span className="status-badge review-badge">
                    Under Review
                  </span>
                </td>

                <td>
                  <span className="priority medium">
                    Medium
                  </span>
                </td>
              </tr>

              <tr>
                <td>
                  <strong>Waste management issue</strong>
                  <span>#IJ-10246</span>
                </td>

                <td>Jamshedpur</td>

                <td>Environment</td>

                <td>
                  <span className="status-badge resolved-badge">
                    Resolved
                  </span>
                </td>

                <td>
                  <span className="priority low">
                    Low
                  </span>
                </td>
              </tr>

            </tbody>

          </table>

        </div>

      </section>

    </div>
  );
}


/* =========================
   STAT CARD
========================= */

function StatCard({
  title,
  value,
  change,
  icon,
  description,
}) {
  return (
    <div className="stat-card">

      <div className="stat-top">

        <div className="stat-icon">
          {icon}
        </div>

        <span className="stat-change">
          {change}
        </span>

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
          style={{ width: percentage }}
        />
      </div>

      <span className="percentage">
        {percentage}
      </span>

    </div>
  );
}

export default Dashboard;