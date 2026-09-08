import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  Plus,
  ArrowRight,
  FileText,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockProblems } from "../../data/mockProblems";
import ProblemCard from "../../components/problems/ProblemCard";
import "./CitizenDashboard.css";

function CitizenDashboard() {
  const navigate = useNavigate();

  const submitted = mockProblems.filter(
    (problem) => problem.status === "Submitted"
  ).length;

  const inProgress = mockProblems.filter(
    (problem) => problem.status === "In Progress"
  ).length;

  const resolved = mockProblems.filter(
    (problem) => problem.status === "Resolved"
  ).length;

  return (
    <div className="citizen-dashboard">

      <div className="citizen-header">
        <div>
          <p className="welcome-text">Welcome back 👋</p>
          <h1>Citizen Dashboard</h1>
          <p>
            Report local problems and track their progress.
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
            <span>Total Problems</span>
            <strong>{mockProblems.length}</strong>
          </div>
        </div>

        <div className="citizen-stat-card">
          <div className="stat-icon">
            <Clock3 size={21} />
          </div>

          <div>
            <span>Under Review</span>
            <strong>{submitted}</strong>
          </div>
        </div>

        <div className="citizen-stat-card">
          <div className="stat-icon">
            <AlertCircle size={21} />
          </div>

          <div>
            <span>In Progress</span>
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
          <h2>My Recent Problems</h2>
          <p>Track the latest problems you have reported.</p>
        </div>

        <button
          onClick={() => navigate("/citizen/my-problems")}
          className="view-all-btn"
        >
          View All
          <ArrowRight size={16} />
        </button>
      </div>

      <div className="citizen-problems-grid">

        {mockProblems.slice(0, 3).map((problem) => (
          <ProblemCard
            key={problem.id}
            {...problem}
            onViewDetails={() =>
              navigate(`/citizen/problems/${problem.id}`)
            }
          />
        ))}

      </div>

    </div>
  );
}

export default CitizenDashboard;