import { MapPin, CalendarDays, User, ArrowRight } from "lucide-react";
import "./ProblemCard.css";
import ProblemStatusBadge from "./ProblemStatusBadge";

function ProblemCard({
  title,
  description,
  category,
  district,
  status,
  priority,
  submittedBy,
  date,
  onViewDetails,
}) {
  return (
    <div className="problem-card">
      <div className="problem-card-top">
        <span className="problem-category">{category}</span>

        <span className={`problem-priority ${priority?.toLowerCase()}`}>
          {priority}
        </span>
      </div>

      <h3 className="problem-title">{title}</h3>

      <p className="problem-description">{description}</p>

      <div className="problem-meta">
        <span>
          <MapPin size={15} />
          {district}
        </span>

        <span>
          <User size={15} />
          {submittedBy}
        </span>

        <span>
          <CalendarDays size={15} />
          {date}
        </span>
      </div>

      <div className="problem-card-bottom">
        <ProblemStatusBadge status={status} />

        <button
          className="problem-view-btn"
          onClick={onViewDetails}
        >
          View Details
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

export default ProblemCard;