import "./ProblemStatusBadge.css";

function ProblemStatusBadge({ status }) {
  const statusClass = status
    ?.toLowerCase()
    .replace(/\s+/g, "-");

  return (
    <span className={`status-badge status-${statusClass}`}>
      {status}
    </span>
  );
}

export default ProblemStatusBadge;