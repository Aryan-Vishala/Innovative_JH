import {
  ArrowLeft,
  MapPin,
  CalendarDays,
  User,
  Clock3,
  CheckCircle2,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { mockProblems } from "../../data/mockProblems";
import ProblemStatusBadge from "../../components/problems/ProblemStatusBadge";
import "./ProblemDetails.css";

function ProblemDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const problem = mockProblems.find(
    (item) => item.id === Number(id)
  );

  if (!problem) {
    return (
      <div className="problem-not-found">
        <h2>Problem not found</h2>

        <button onClick={() => navigate("/citizen/my-problems")}>
          Back to My Problems
        </button>
      </div>
    );
  }

  return (
    <div className="problem-details-page">

      <button
        className="back-button"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={17} />
        Back
      </button>

      <div className="details-header">

        <div>
          <span className="details-category">
            {problem.category}
          </span>

          <h1>{problem.title}</h1>

          <p>
            Problem #{problem.id}
          </p>
        </div>

        <ProblemStatusBadge status={problem.status} />

      </div>

      <div className="details-layout">

        <div className="details-main">

          <section className="details-card">

            <h2>Problem Description</h2>

            <p className="details-description">
              {problem.description}
            </p>

          </section>

          <section className="details-card">

            <h2>Problem Timeline</h2>

            <div className="timeline">

              <div className="timeline-item completed">
                <CheckCircle2 size={20} />

                <div>
                  <strong>Problem Submitted</strong>
                  <span>{problem.submittedDate}</span>
                </div>
              </div>

              <div className="timeline-item">
                <Clock3 size={20} />

                <div>
                  <strong>Current Status</strong>
                  <span>{problem.status}</span>
                </div>
              </div>

            </div>

          </section>

        </div>

        <aside className="details-sidebar">

          <section className="details-card">

            <h2>Problem Information</h2>

            <div className="info-row">
              <MapPin size={17} />
              <div>
                <span>Location</span>
                <strong>{problem.location}</strong>
              </div>
            </div>

            <div className="info-row">
              <MapPin size={17} />
              <div>
                <span>District</span>
                <strong>{problem.district}</strong>
              </div>
            </div>

            <div className="info-row">
              <User size={17} />
              <div>
                <span>Submitted By</span>
                <strong>{problem.submittedBy}</strong>
              </div>
            </div>

            <div className="info-row">
              <CalendarDays size={17} />
              <div>
                <span>Submitted</span>
                <strong>{problem.submittedDate}</strong>
              </div>
            </div>

          </section>

          <section className="details-card">

            <h2>Assignment</h2>

            <p className="assignment-label">
              Currently assigned to
            </p>

            <strong>
              {problem.assignedTo}
            </strong>

          </section>

        </aside>

      </div>

    </div>
  );
}

export default ProblemDetails;