import { useEffect, useState } from "react";
import {
  ArrowLeft,
  MapPin,
  CalendarDays,
  User,
  Clock3,
  CheckCircle2,
  FileText,
  ShieldCheck,
  GraduationCap,
  Paperclip,
  Loader2,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { problemApi } from "../../services/api";
import ProblemStatusBadge from "../../components/problems/ProblemStatusBadge";
import "./ProblemDetails.css";

function ProblemDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const res = await problemApi.getById(id);
        if (res.success && res.data) {
          setProblem(res.data);
        } else {
          setError("Problem not found in the registry.");
        }
      } catch (err) {
        console.error("Error fetching problem details:", err);
        setError(err.message || "Failed to load problem details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "100px", color: "#6b7280" }}>
        <Loader2 className="animate-spin" size={40} />
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="problem-not-found" style={{ textAlign: "center", padding: "60px 20px" }}>
        <h2 style={{ fontSize: "22px", color: "#111827", marginBottom: "12px" }}>
          {error || "Problem Not Found"}
        </h2>
        <p style={{ color: "#6b7280", marginBottom: "24px" }}>
          The requested problem record may have been archived or does not exist.
        </p>
        <button
          onClick={() => navigate("/citizen/my-problems")}
          className="report-problem-btn"
          style={{ margin: "0 auto" }}
        >
          Back to Problem Directory
        </button>
      </div>
    );
  }

  const locationText = [
    problem.location?.village,
    problem.location?.panchayat,
    problem.location?.block ? `Block: ${problem.location.block}` : null,
    problem.location?.district,
  ]
    .filter(Boolean)
    .join(", ");

  const submittedDate = problem.createdAt
    ? new Date(problem.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Recent";

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
          <span className="details-category">{problem.category}</span>
          <h1>{problem.title}</h1>
          <p>
            Problem ID: <strong>{problem.problemId || problem._id}</strong>
          </p>
        </div>

        <ProblemStatusBadge status={problem.status} />
      </div>

      <div className="details-layout">
        <div className="details-main">
          {/* Description */}
          <section className="details-card">
            <h2>Problem Description</h2>
            <p className="details-description">{problem.description}</p>

            {problem.impact && (
              <div style={{ marginTop: "20px", display: "flex", gap: "16px", flexWrap: "wrap" }}>
                <div style={{ background: "#f9fafb", padding: "10px 14px", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
                  <span style={{ fontSize: "12px", color: "#6b7280", display: "block" }}>Beneficiaries</span>
                  <strong style={{ fontSize: "15px", color: "#111827" }}>
                    {problem.impact.estimatedPopulation ? `${problem.impact.estimatedPopulation} citizens` : "Local community"}
                  </strong>
                </div>

                <div style={{ background: "#f9fafb", padding: "10px 14px", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
                  <span style={{ fontSize: "12px", color: "#6b7280", display: "block" }}>Severity Claim</span>
                  <strong style={{ fontSize: "15px", color: "#111827" }}>
                    {problem.impact.citizenReportedSeverity || "Medium"}
                  </strong>
                </div>

                <div style={{ background: "#f9fafb", padding: "10px 14px", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
                  <span style={{ fontSize: "12px", color: "#6b7280", display: "block" }}>Frequency</span>
                  <strong style={{ fontSize: "15px", color: "#111827" }}>
                    {problem.impact.frequency || "Daily"}
                  </strong>
                </div>
              </div>
            )}
          </section>

          {/* Evidence Files */}
          {problem.evidence && problem.evidence.length > 0 && (
            <section className="details-card">
              <h2>Supporting Evidence ({problem.evidence.length})</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {problem.evidence.map((ev, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "10px 14px",
                      background: "#f9fafb",
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb",
                    }}
                  >
                    <Paperclip size={18} color="#059669" />
                    <div style={{ flex: 1 }}>
                      <span style={{ fontWeight: "600", fontSize: "14px", color: "#111827" }}>
                        {ev.caption || ev.originalName || "Uploaded Document"}
                      </span>
                      {ev.fileType && (
                        <span style={{ fontSize: "12px", color: "#6b7280", marginLeft: "8px" }}>
                          ({ev.fileType})
                        </span>
                      )}
                    </div>
                    {ev.fileUrl && (
                      <a
                        href={`http://localhost:5000${ev.fileUrl}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{ fontSize: "13px", color: "#059669", fontWeight: "600", textDecoration: "none" }}
                      >
                        View File
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* PRI Ground Verification Card (if verified) */}
          {problem.priVerification?.isGenuine !== null && problem.priVerification?.verifiedAt && (
            <section
              className="details-card"
              style={{
                borderLeft: problem.priVerification.isGenuine ? "4px solid #10b981" : "4px solid #ef4444",
                background: problem.priVerification.isGenuine ? "#f0fdf4" : "#fef2f2",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                <ShieldCheck size={22} color={problem.priVerification.isGenuine ? "#059669" : "#dc2626"} />
                <h2 style={{ margin: 0, fontSize: "17px", color: "#111827" }}>
                  PRI / Local Body Ground Verification
                </h2>
              </div>
              <p style={{ fontSize: "14px", color: "#374151", marginBottom: "8px" }}>
                <strong>Inspected By:</strong> {problem.priVerification.verifierName || "Local PRI Officer"}
              </p>
              {problem.priVerification.groundCondition && (
                <p style={{ fontSize: "14px", color: "#374151", marginBottom: "8px" }}>
                  <strong>Ground Condition:</strong> {problem.priVerification.groundCondition}
                </p>
              )}
              {problem.priVerification.baselineData && Object.keys(problem.priVerification.baselineData).length > 0 && (
                <div style={{ background: "#ffffff", padding: "10px 14px", borderRadius: "8px", border: "1px solid #e5e7eb", marginTop: "10px" }}>
                  <strong style={{ fontSize: "13px", color: "#4b5563", display: "block", marginBottom: "6px" }}>
                    Baseline Inspection Data:
                  </strong>
                  <pre style={{ margin: 0, fontSize: "12px", color: "#1f2937", fontFamily: "inherit" }}>
                    {JSON.stringify(problem.priVerification.baselineData, null, 2)}
                  </pre>
                </div>
              )}
            </section>
          )}

          {/* Nodal HEI Review Card */}
          {problem.nodalReview?.reviewedAt && (
            <section
              className="details-card"
              style={{ borderLeft: "4px solid #3b82f6", background: "#eff6ff" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                <GraduationCap size={22} color="#2563eb" />
                <h2 style={{ margin: 0, fontSize: "17px", color: "#111827" }}>
                  Nodal HEI Orchestration
                </h2>
              </div>
              <p style={{ fontSize: "14px", color: "#374151", marginBottom: "6px" }}>
                <strong>Reviewed By:</strong> {problem.nodalReview.reviewerName || "Nodal University Dean"}
              </p>
              {problem.nodalReview.masterProblemId && (
                <p style={{ fontSize: "14px", color: "#1e40af", fontWeight: "600", marginBottom: "6px" }}>
                  Converted to Master Problem: {problem.nodalReview.masterProblemId}
                </p>
              )}
              {problem.nodalReview.remarks && (
                <p style={{ fontSize: "14px", color: "#4b5563" }}>
                  {problem.nodalReview.remarks}
                </p>
              )}
            </section>
          )}

          {/* Timeline */}
          <section className="details-card">
            <h2>Problem Lifecycle Timeline</h2>
            <div className="timeline">
              {problem.timeline && problem.timeline.length > 0 ? (
                problem.timeline.map((item, index) => (
                  <div key={index} className="timeline-item completed">
                    <CheckCircle2 size={20} color="#059669" />
                    <div>
                      <strong>{item.stage}</strong>
                      <p style={{ margin: "4px 0 2px", fontSize: "13px", color: "#4b5563" }}>
                        {item.description}
                      </p>
                      <span style={{ fontSize: "12px", color: "#9ca3af" }}>
                        {item.timestamp
                          ? new Date(item.timestamp).toLocaleString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : ""}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="timeline-item completed">
                  <CheckCircle2 size={20} color="#059669" />
                  <div>
                    <strong>Problem Submitted</strong>
                    <span>{submittedDate}</span>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="details-sidebar">
          <section className="details-card">
            <h2>Problem Information</h2>

            <div className="info-row">
              <MapPin size={17} />
              <div>
                <span>Location</span>
                <strong>{locationText || "Jharkhand"}</strong>
              </div>
            </div>

            <div className="info-row">
              <MapPin size={17} />
              <div>
                <span>District</span>
                <strong>{problem.location?.district || problem.district}</strong>
              </div>
            </div>

            <div className="info-row">
              <User size={17} />
              <div>
                <span>Submitted By</span>
                <strong>{problem.submitterName || "Citizen"}</strong>
              </div>
            </div>

            <div className="info-row">
              <CalendarDays size={17} />
              <div>
                <span>Date Reported</span>
                <strong>{submittedDate}</strong>
              </div>
            </div>

            {problem.location?.coordinates?.latitude && (
              <div className="info-row">
                <MapPin size={17} />
                <div>
                  <span>GPS Coordinates</span>
                  <strong>
                    {problem.location.coordinates.latitude.toFixed(4)},{" "}
                    {problem.location.coordinates.longitude.toFixed(4)}
                  </strong>
                </div>
              </div>
            )}
          </section>

          <section className="details-card">
            <h2>Current Assignment</h2>
            <p className="assignment-label">Orchestrating Body / Team</p>
            <strong style={{ color: "#059669", fontSize: "15px" }}>
              {problem.assignedTo || "Local PRI / ULB Inspection"}
            </strong>
          </section>
        </aside>
      </div>
    </div>
  );
}

export default ProblemDetails;