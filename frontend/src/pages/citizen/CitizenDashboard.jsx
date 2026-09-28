import { useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  Plus,
  ArrowRight,
  FileText,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { problemApi, getCurrentUser } from "../../services/api";
import ProblemCard from "../../components/problems/ProblemCard";
import "./CitizenDashboard.css";

function CitizenDashboard() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyProblems = async () => {
      try {
        setLoading(true);
        const res = await problemApi.getMySubmissions();
        if (res.success && res.data) {
          setProblems(res.data);
        }
      } catch (err) {
        console.error("Error fetching citizen problems:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyProblems();
  }, []);

  const total = problems.length;
  const underReview = problems.filter(
    (p) => p.status === "SUBMITTED" || p.status === "PRI_VERIFICATION_PENDING"
  ).length;
  const inProgress = problems.filter(
    (p) =>
      p.status === "PRI_VERIFIED" ||
      p.status === "NODAL_REVIEWED" ||
      p.status === "MASTER_PROBLEM_CREATED" ||
      p.status === "SOLUTION_IN_PROGRESS"
  ).length;
  const resolved = problems.filter(
    (p) => p.status === "DEPLOYED" || p.status === "RESOLVED"
  ).length;

  return (
    <div className="citizen-dashboard">
      <div className="citizen-header">
        <div>
          <p className="welcome-text">Welcome back, {user?.name || "Citizen"} 👋</p>
          <h1>Citizen Dashboard</h1>
          <p>
            Report local community challenges and track their resolution progress.
          </p>
        </div>

        <button
          className="report-problem-btn"
          onClick={() => navigate("/citizen/submit-problem")}
        >
          <Plus size={18} />
          Report a Problem
        </button>
      </div>

      <div className="citizen-stats">
        <div className="citizen-stat-card">
          <div className="stat-icon">
            <FileText size={21} />
          </div>
          <div>
            <span>Total Reported</span>
            <strong>{total}</strong>
          </div>
        </div>

        <div className="citizen-stat-card">
          <div className="stat-icon">
            <Clock3 size={21} />
          </div>
          <div>
            <span>Under Review</span>
            <strong>{underReview}</strong>
          </div>
        </div>

        <div className="citizen-stat-card">
          <div className="stat-icon">
            <AlertCircle size={21} />
          </div>
          <div>
            <span>In Progress / R&D</span>
            <strong>{inProgress}</strong>
          </div>
        </div>

        <div className="citizen-stat-card">
          <div className="stat-icon">
            <CheckCircle2 size={21} />
          </div>
          <div>
            <span>Resolved</span>
            <strong>{resolved}</strong>
          </div>
        </div>
      </div>

      <div className="citizen-section-header">
        <div>
          <h2>My Reported Problems</h2>
          <p>Real-time status of challenges you have submitted</p>
        </div>

        {problems.length > 0 && (
          <button
            onClick={() => navigate("/citizen/my-problems")}
            className="view-all-btn"
          >
            View All ({problems.length})
            <ArrowRight size={16} />
          </button>
        )}
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "40px", color: "#6b7280" }}>
          <Loader2 className="animate-spin" size={28} />
        </div>
      ) : problems.length === 0 ? (
        <div
          style={{
            background: "#ffffff",
            padding: "48px 24px",
            borderRadius: "16px",
            textAlign: "center",
            border: "1px dashed #d1d5db",
          }}
        >
          <FileText size={48} color="#9ca3af" style={{ margin: "0 auto 16px" }} />
          <h3 style={{ fontSize: "18px", color: "#111827", marginBottom: "8px" }}>
            No problems reported yet
          </h3>
          <p style={{ color: "#6b7280", maxWidth: "440px", margin: "0 auto 24px", fontSize: "14px" }}>
            Have an issue with drinking water, roads, electricity, or sanitation in your panchayat?
            Report it now to connect with local PRI officers and university innovation teams.
          </p>
          <button
            className="report-problem-btn"
            style={{ margin: "0 auto" }}
            onClick={() => navigate("/citizen/submit-problem")}
          >
            <Plus size={18} />
            Report Your First Problem
          </button>
        </div>
      ) : (
        <div className="citizen-problems-grid">
          {problems.slice(0, 6).map((problem) => (
            <ProblemCard
              key={problem._id || problem.problemId}
              title={problem.title}
              description={problem.description}
              category={problem.category}
              district={problem.location?.district || problem.district}
              status={problem.status}
              priority={problem.impact?.citizenReportedSeverity || problem.priority || "Medium"}
              submittedBy={problem.submitterName || "You"}
              date={
                problem.createdAt
                  ? new Date(problem.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "Recent"
              }
              onViewDetails={() =>
                navigate(`/citizen/problems/${problem.problemId || problem._id}`)
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default CitizenDashboard;