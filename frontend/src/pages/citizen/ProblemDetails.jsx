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
  ThumbsUp,
  Sparkles,
  Cpu,
  Layers,
  Target,
  Building2,
  DollarSign,
  Award,
  ChevronRight,
  X,
  Heart,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { problemApi, getCurrentUser } from "../../services/api";
import ProblemStatusBadge from "../../components/problems/ProblemStatusBadge";
import "./ProblemDetails.css";

const TRL_STAGES = [
  { level: 1, label: "Level 1: Ground Verified", desc: "PRI / ULB inspected" },
  { level: 2, label: "Level 2: R&D Adopted", desc: "HEI Faculty & Student Lab" },
  { level: 3, label: "Level 3: Lab Prototype", desc: "TRL 4 Functional Unit" },
  { level: 4, label: "Level 4: Field Pilot", desc: "TRL 6 Village Ground Test" },
  { level: 5, label: "Level 5: State Deployed", desc: "Scaled Across Districts" },
];

function ProblemDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const currentUser = getCurrentUser();

  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Upvote State
  const [upvoteCount, setUpvoteCount] = useState(0);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [isUpvoting, setIsUpvoting] = useState(false);

  // Live AI Triage State (if problem didn't have it saved)
  const [isAnalyzingAi, setIsAnalyzingAi] = useState(false);

  // Adoption Modal State
  const [showAdoptModal, setShowAdoptModal] = useState(false);
  const [adoptData, setAdoptData] = useState({
    projectTitle: "",
    facultyPi: currentUser?.name || "",
    studentTeam: "",
  });
  const [adoptLoading, setAdoptLoading] = useState(false);

  // Pledge Modal State
  const [showPledgeModal, setShowPledgeModal] = useState(false);
  const [pledgeData, setPledgeData] = useState({
    resourceType: "Funding",
    amount: "500000",
    pledgeDetails: "",
  });
  const [pledgeLoading, setPledgeLoading] = useState(false);

  // Action status message
  const [actionSuccess, setActionSuccess] = useState("");

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const res = await problemApi.getById(id);
        if (res.success && res.data) {
          setProblem(res.data);
          setUpvoteCount(res.data.communityUpvotes?.count || 0);

          if (currentUser && res.data.communityUpvotes?.upvotedBy) {
            const hasUserUpvoted = res.data.communityUpvotes.upvotedBy.some(
              (u) => (typeof u === "string" ? u : u._id || u) === currentUser._id
            );
            setHasUpvoted(hasUserUpvoted);
          }
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

  const handleUpvote = async () => {
    if (!currentUser) {
      navigate("/auth");
      return;
    }
    try {
      setIsUpvoting(true);
      const res = await problemApi.upvote(problem._id);
      if (res.success) {
        setUpvoteCount(res.count);
        setHasUpvoted(res.hasUpvoted);
      }
    } catch (err) {
      console.error("Upvote error:", err);
    } finally {
      setIsUpvoting(false);
    }
  };

  const handleRunAiTriage = async () => {
    try {
      setIsAnalyzingAi(true);
      const res = await problemApi.getAiTriage({
        title: problem.title,
        description: problem.description,
        category: problem.category,
        district: problem.location?.district,
      });
      if (res.success && res.data) {
        setProblem((prev) => ({
          ...prev,
          aiAnalysis: res.data,
        }));
      }
    } catch (err) {
      console.error("AI Triage error:", err);
    } finally {
      setIsAnalyzingAi(false);
    }
  };

  const handleAdoptSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      navigate("/auth");
      return;
    }
    try {
      setAdoptLoading(true);
      const teamMembers = adoptData.studentTeam
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await problemApi.adopt(problem._id, {
        projectTitle: adoptData.projectTitle || `R&D: ${problem.title}`,
        facultyPi: adoptData.facultyPi || currentUser.name,
        studentTeam: teamMembers,
      });

      if (res.success && res.data) {
        setProblem(res.data);
        setShowAdoptModal(false);
        setActionSuccess("Challenge successfully adopted for University R&D!");
        setTimeout(() => setActionSuccess(""), 4500);
      }
    } catch (err) {
      alert(err.message || "Failed to adopt problem");
    } finally {
      setAdoptLoading(false);
    }
  };

  const handlePledgeSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      navigate("/auth");
      return;
    }
    try {
      setPledgeLoading(true);
      const res = await problemApi.pledge(problem._id, {
        resourceType: pledgeData.resourceType,
        amount: pledgeData.amount,
        pledgeDetails: pledgeData.pledgeDetails,
      });

      if (res.success && res.data) {
        setProblem(res.data);
        setShowPledgeModal(false);
        setActionSuccess("Industry CSR resource pledge submitted successfully!");
        setTimeout(() => setActionSuccess(""), 4500);
      }
    } catch (err) {
      alert(err.message || "Failed to submit pledge");
    } finally {
      setPledgeLoading(false);
    }
  };

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

  const currentLevel = problem.solution?.level || (problem.status === "SUBMITTED" ? 1 : 2);
  const ai = problem.aiAnalysis;

  return (
    <div className="problem-details-page">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "22px" }}>
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowLeft size={17} />
          Back
        </button>

        {/* Upvote CTA in Top Bar */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            type="button"
            className={`upvote-action-btn ${hasUpvoted ? "upvoted" : ""}`}
            onClick={handleUpvote}
            disabled={isUpvoting}
            title={hasUpvoted ? "You have endorsed this issue" : "Click if you face this issue too"}
          >
            <ThumbsUp size={16} fill={hasUpvoted ? "currentColor" : "none"} />
            <span>
              {hasUpvoted ? "Endorsed by You" : "I am Also Affected"} ({upvoteCount})
            </span>
          </button>
        </div>
      </div>

      {actionSuccess && (
        <div className="action-success-banner">
          <CheckCircle2 size={20} />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Header */}
      <div className="details-header">
        <div>
          <span className="details-category">{problem.category}</span>
          <h1>{problem.title}</h1>
          <p>
            Problem ID: <strong>{problem.problemId || problem._id}</strong>
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>
          <ProblemStatusBadge status={problem.status} />
          {problem.adoption?.isAdopted && (
            <span className="adopted-tag">
              <GraduationCap size={13} />
              Adopted by {problem.adoption.orgName}
            </span>
          )}
        </div>
      </div>

      {/* TRL Stepper: Technology Readiness & Societal Maturity Level */}
      <div className="trl-stepper-card">
        <div className="trl-header">
          <div className="trl-title-wrap">
            <TrendingUp size={18} color="#2563eb" />
            <h3>Solution Maturity & Quad-Helix Lifecycle</h3>
          </div>
          <span className="trl-current-badge">
            Current Stage: Level {currentLevel} of 5
          </span>
        </div>

        <div className="trl-steps-grid">
          {TRL_STAGES.map((st) => {
            const isDone = st.level < currentLevel;
            const isCurrent = st.level === currentLevel;
            return (
              <div
                key={st.level}
                className={`trl-step-item ${isDone ? "done" : ""} ${isCurrent ? "current" : ""}`}
              >
                <div className="trl-step-circle">
                  {isDone ? <CheckCircle2 size={16} /> : st.level}
                </div>
                <div className="trl-step-info">
                  <strong>{st.label}</strong>
                  <span>{st.desc}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="details-layout">
        <div className="details-main">
          {/* Problem Description */}
          <section className="details-card">
            <h2>Problem Description</h2>
            <p className="details-description">{problem.description}</p>

            {problem.impact && (
              <div style={{ marginTop: "20px", display: "flex", gap: "16px", flexWrap: "wrap" }}>
                <div className="impact-badge-box">
                  <span>Beneficiaries</span>
                  <strong>
                    {problem.impact.estimatedPopulation
                      ? `${problem.impact.estimatedPopulation} citizens`
                      : "Local community"}
                  </strong>
                </div>

                <div className="impact-badge-box">
                  <span>Severity Claim</span>
                  <strong>{problem.impact.citizenReportedSeverity || "Medium"}</strong>
                </div>

                <div className="impact-badge-box">
                  <span>Frequency</span>
                  <strong>{problem.impact.frequency || "Daily"}</strong>
                </div>
              </div>
            )}
          </section>

          {/* AI Insights Card */}
          <section className="details-card ai-insights-details-card">
            <div className="ai-card-glow-bar" />
            <div className="ai-details-header">
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div className="ai-icon-badge">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: "17px", color: "#1e1b4b" }}>
                    AI Problem Triage & University-Industry Matcher
                  </h2>
                  <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>
                    Neural evaluation & automatic capability allocation
                  </p>
                </div>
              </div>

              {ai ? (
                <span className="ai-confidence-pill">
                  <Cpu size={14} />
                  {ai.aiConfidence || 94}% AI Match Confidence
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleRunAiTriage}
                  disabled={isAnalyzingAi}
                  className="run-ai-btn"
                >
                  <Sparkles size={14} />
                  {isAnalyzingAi ? "Analyzing..." : "Run AI Triage"}
                </button>
              )}
            </div>

            {ai ? (
              <div className="ai-details-body">
                {/* Detected Domain & Severity */}
                <div className="ai-metric-row">
                  <div className="ai-metric-label">
                    <Target size={16} />
                    <strong>Detected Domain & Severity:</strong>
                  </div>
                  <div className="ai-metric-values">
                    <span className="domain-pill">{ai.detectedDomain}</span>
                    <span className="separator">/</span>
                    <span className={`severity-pill ${ai.severity?.toLowerCase().includes("critical") ? "critical" : "high"}`}>
                      {ai.severity}
                    </span>
                  </div>
                </div>

                {/* SDG Alignment */}
                <div className="ai-metric-row">
                  <div className="ai-metric-label">
                    <Layers size={16} />
                    <strong>SDG Alignment:</strong>
                  </div>
                  <div className="sdg-tags-container">
                    {ai.sdgs &&
                      ai.sdgs.map((sdg) => (
                        <span key={sdg.code} className={`sdg-badge ${sdg.code.toLowerCase().replace(/\s+/g, "-")}`}>
                          <strong>{sdg.code}</strong> ({sdg.name})
                        </span>
                      ))}
                  </div>
                </div>

                {/* University & Industry Recommendations */}
                <div className="ai-matches-grid" style={{ marginTop: "16px" }}>
                  {/* University */}
                  <div className="ai-match-box university">
                    <div className="ai-match-top">
                      <div className="ai-match-icon university">
                        <GraduationCap size={18} />
                      </div>
                      <span className="match-score-badge university">
                        {ai.recommendedUniversity?.matchScore || 94}% Match
                      </span>
                    </div>
                    <span className="ai-match-category">Recommended University Lab</span>
                    <h4 className="ai-match-name">
                      {ai.recommendedUniversity?.name} — {ai.recommendedUniversity?.department}
                    </h4>
                    <p className="ai-match-rationale">
                      {ai.recommendedUniversity?.rationale || "Specialized academic R&D testing lab and student project capability in this domain."}
                    </p>
                  </div>

                  {/* Industry */}
                  <div className="ai-match-box industry">
                    <div className="ai-match-top">
                      <div className="ai-match-icon industry">
                        <Building2 size={18} />
                      </div>
                      <span className="match-score-badge industry">
                        {ai.recommendedIndustry?.matchScore || 91}% Match
                      </span>
                    </div>
                    <span className="ai-match-category">Recommended Industry Partner</span>
                    <h4 className="ai-match-name">
                      {ai.recommendedIndustry?.name} — {ai.recommendedIndustry?.mission}
                    </h4>
                    <div className="ai-pledge-tags">
                      {ai.recommendedIndustry?.pledgeTypes?.map((pt, idx) => (
                        <span key={idx} className="pledge-tag">{pt}</span>
                      )) || <span className="pledge-tag">CSR Grant & Water Testing</span>}
                    </div>
                  </div>
                </div>

                {/* Technical Expertise */}
                {ai.requiredExpertise && ai.requiredExpertise.length > 0 && (
                  <div className="ai-expertise-row" style={{ marginTop: "16px" }}>
                    <span className="expertise-label">Required Technical Expertise:</span>
                    <div className="expertise-chips">
                      {ai.requiredExpertise.map((exp, idx) => (
                        <span key={idx} className="expertise-chip">{exp}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p style={{ color: "#64748b", fontSize: "14px", margin: "16px 0 0" }}>
                Click &quot;Run AI Triage&quot; above to query the FastAPI intelligence engine for automated classification and institutional capability matching.
              </p>
            )}
          </section>

          {/* Quad-Helix Action Hub */}
          <section className="details-card quad-helix-hub-card">
            <div className="hub-header">
              <div>
                <h2>Quad-Helix Action Hub</h2>
                <p>Public-Private-Academic partnership actions for this problem</p>
              </div>
            </div>

            <div className="hub-grid">
              {/* 1. Academic R&D Adoption Box */}
              <div className="hub-action-box university">
                <div className="hub-box-title">
                  <GraduationCap size={20} color="#2563eb" />
                  <h4>Academic R&D Portal</h4>
                </div>

                {problem.adoption?.isAdopted ? (
                  <div className="hub-status-active adopted">
                    <div className="hub-badge-done">✓ Adopted for R&D</div>
                    <strong className="hub-org-name">{problem.adoption.orgName}</strong>
                    <p className="hub-desc">
                      <strong>Lead PI:</strong> {problem.adoption.facultyPi}
                    </p>
                    {problem.adoption.studentTeam?.length > 0 && (
                      <p className="hub-desc">
                        <strong>Student Team:</strong> {problem.adoption.studentTeam.join(", ")}
                      </p>
                    )}
                    <span className="hub-date">
                      Adopted on {new Date(problem.adoption.adoptedAt).toLocaleDateString()}
                    </span>
                  </div>
                ) : (
                  <div className="hub-status-open">
                    <p className="hub-prompt">
                      Colleges and engineering institutions can adopt this problem for faculty research and final-year student capstone projects.
                    </p>
                    <button
                      type="button"
                      className="hub-btn university"
                      onClick={() => setShowAdoptModal(true)}
                    >
                      <GraduationCap size={16} />
                      Adopt Challenge for University R&D
                    </button>
                  </div>
                )}
              </div>

              {/* 2. Industry CSR & Resources Box */}
              <div className="hub-action-box industry">
                <div className="hub-box-title">
                  <Building2 size={20} color="#059669" />
                  <h4>Industry CSR & Tech Portal</h4>
                </div>

                {problem.pledges && problem.pledges.length > 0 ? (
                  <div className="hub-status-active pledged">
                    <div className="hub-badge-done" style={{ background: "#d1fae5", color: "#047857" }}>
                      ✓ {problem.pledges.length} CSR Pledge(s) Registered
                    </div>
                    {problem.pledges.map((pl, idx) => (
                      <div key={idx} className="pledge-item">
                        <strong>{pl.orgName}</strong>
                        <span>{pl.resourceType} {pl.amount ? `(₹${Number(pl.amount).toLocaleString('en-IN')})` : ''}</span>
                        <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#475569" }}>
                          &quot;{pl.pledgeDetails}&quot;
                        </p>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="hub-btn industry"
                      style={{ marginTop: "12px" }}
                      onClick={() => setShowPledgeModal(true)}
                    >
                      + Pledge Additional Support
                    </button>
                  </div>
                ) : (
                  <div className="hub-status-open">
                    <p className="hub-prompt">
                      Companies and foundations can pledge CSR funding, specialized testing equipment, or corporate technical mentorship.
                    </p>
                    <button
                      type="button"
                      className="hub-btn industry"
                      onClick={() => setShowPledgeModal(true)}
                    >
                      <DollarSign size={16} />
                      Pledge CSR Support / Resources
                    </button>
                  </div>
                )}
              </div>
            </div>
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

      {/* 1. Modal: Adopt Challenge for University R&D */}
      {showAdoptModal && (
        <div className="modal-backdrop" onClick={() => setShowAdoptModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div className="ai-icon-badge" style={{ background: "#2563eb" }}>
                  <GraduationCap size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: "18px", color: "#1e293b" }}>
                    Adopt Problem for Academic R&D
                  </h3>
                  <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#64748b" }}>
                    Register as an active Student/Faculty Innovation Lab Project
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="close-modal-btn"
                onClick={() => setShowAdoptModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAdoptSubmit} className="modal-form">
              <div className="form-group">
                <label>R&D Project Title *</label>
                <input
                  type="text"
                  value={adoptData.projectTitle}
                  onChange={(e) => setAdoptData({ ...adoptData, projectTitle: e.target.value })}
                  placeholder={`R&D: ${problem.title}`}
                  required
                />
              </div>

              <div className="form-group">
                <label>Faculty Lead / Principal Investigator (PI) *</label>
                <input
                  type="text"
                  value={adoptData.facultyPi}
                  onChange={(e) => setAdoptData({ ...adoptData, facultyPi: e.target.value })}
                  placeholder="e.g. Dr. A.K. Sinha (Dept of Hydrology)"
                  required
                />
              </div>

              <div className="form-group">
                <label>Student Research Team Members (Comma-separated)</label>
                <input
                  type="text"
                  value={adoptData.studentTeam}
                  onChange={(e) => setAdoptData({ ...adoptData, studentTeam: e.target.value })}
                  placeholder="e.g. Rahul Verma (B.Tech Mech), Priya Soren (M.Tech Env)"
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowAdoptModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={adoptLoading}
                  className="confirm-btn university"
                >
                  <GraduationCap size={16} />
                  {adoptLoading ? "Confirming Adoption..." : "Confirm R&D Adoption"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Modal: Industry CSR Support / Pledge */}
      {showPledgeModal && (
        <div className="modal-backdrop" onClick={() => setShowPledgeModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div className="ai-icon-badge" style={{ background: "#059669" }}>
                  <Building2 size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: "18px", color: "#1e293b" }}>
                    Pledge Industry CSR & Tech Resources
                  </h3>
                  <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#64748b" }}>
                    Commit grant funding, testing hardware, or technical mentorship
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="close-modal-btn"
                onClick={() => setShowPledgeModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handlePledgeSubmit} className="modal-form">
              <div className="form-group">
                <label>Resource / Pledge Type *</label>
                <select
                  value={pledgeData.resourceType}
                  onChange={(e) => setPledgeData({ ...pledgeData, resourceType: e.target.value })}
                >
                  <option value="Funding">CSR Grant Funding (₹)</option>
                  <option value="Equipment/Hardware">Equipment / Testing Kits</option>
                  <option value="Technical Mentorship">Corporate Engineering Mentorship</option>
                  <option value="Pilot Testing Site">Industrial Pilot Testing Facility</option>
                </select>
              </div>

              <div className="form-group">
                <label>Estimated Value / Amount (₹)</label>
                <input
                  type="number"
                  value={pledgeData.amount}
                  onChange={(e) => setPledgeData({ ...pledgeData, amount: e.target.value })}
                  placeholder="500000"
                />
              </div>

              <div className="form-group">
                <label>Pledge Scope & Specifications *</label>
                <textarea
                  rows="3"
                  value={pledgeData.pledgeDetails}
                  onChange={(e) => setPledgeData({ ...pledgeData, pledgeDetails: e.target.value })}
                  placeholder="e.g. Sponsoring 3 community RO filtration kits and pilot field testing support for 6 months."
                  required
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowPledgeModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={pledgeLoading}
                  className="confirm-btn industry"
                >
                  <DollarSign size={16} />
                  {pledgeLoading ? "Registering Pledge..." : "Confirm CSR Resource Pledge"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProblemDetails;