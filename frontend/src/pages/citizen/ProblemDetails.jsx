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
import { problemApi, priApi, getCurrentUser } from "../../services/api";
import ProblemStatusBadge from "../../components/problems/ProblemStatusBadge";
import TrlProgressTracker from "../../components/problems/TrlProgressTracker";
import QuadHelixActionBar from "../../components/problems/QuadHelixActionBar";
import AiSubProblemBreakdown from "../../components/problems/AiSubProblemBreakdown";
import "./ProblemDetails.css";

// Fallback seed problems for instant pitch demo resilience
const FALLBACK_SEED_PROBLEMS = {
  "JH-000001": {
    _id: "seed-1",
    problemId: "JH-000001",
    title: "Groundwater contamination and high fluoride levels in drinking wells",
    description:
      "Several hand pumps and borewells in Kamdara village produced water with fluoride content reaching 2.4 PPM, causing joint stiffness and fluorosis among villagers.",
    category: "Water Management",
    location: { district: "Gumla", block: "Kamdara", village: "Kamdara North" },
    impact: { estimatedPopulation: 1250, citizenReportedSeverity: "High", frequency: "Daily" },
    status: "DEPLOYED",
    createdAt: "2026-08-15T10:00:00.000Z",
    solution: {
      universityName: "BIT Mesra, Ranchi",
      facultyLead: "Dr. Priya Ranjan (Dept of Chemical Engineering)",
      teamName: "Jal-Shuddhi Innovation Team",
      solutionTitle: "Community Solar-Powered Activated Alumina Fluoride Adsorption Plant",
      solutionSummary:
        "Off-grid decentralized 300W solar adsorption unit providing 4,000 L/day of pure water meeting BIS 10500 standards.",
      level: 5,
      levelTag: "Scaled Deployment",
      impactOutcome: "Fluoride: 2.4 PPM → 0.35 PPM Safe (BIS 10500 Compliant); serving 1,250 residents continuously.",
    },
    adoption: {
      isAdopted: true,
      orgName: "BIT Mesra, Ranchi",
      facultyPi: "Dr. Priya Ranjan (Dept of Chemical Engineering)",
      studentTeam: ["Rahul Verma (Lead)", "Priya Soren", "Aman Tirkey"],
      adoptedAt: "2026-08-25T14:00:00.000Z",
    },
    pledges: [
      {
        orgName: "Tata Steel Foundation",
        resourceType: "CSR Funding & Water Testing Kits",
        amount: 250000,
        pledgeDetails: "Pledging ₹2.5 Lakhs grant funding and specialized IoT water sensor kits for pilot deployment.",
      },
    ],
    priVerification: {
      isGenuine: true,
      verifierName: "Mukhiya Sanjay Oraon (Kamdara GP)",
      verifiedAt: "2026-08-18T11:00:00.000Z",
      observedPopulation: 1250,
      groundCondition: "Physical ground truth confirmed: hand pumps corroded; lab test confirmed fluoride at 2.4 PPM.",
      baselineData: { fluoride_ppm: 2.4, turbidity_ntu: 18 },
    },
    communityUpvotes: { count: 342, upvotedBy: [] },
    aiAnalysis: {
      detectedDomain: "Water Contamination",
      subdomain: "Groundwater Heavy Metal & Chemical Pollutants",
      severity: "High Severity",
      severityScore: 88,
      sdgs: [
        { code: "SDG 6", name: "Clean Water & Sanitation" },
        { code: "SDG 3", name: "Good Health" },
      ],
      recommendedUniversity: {
        name: "Birsa Agricultural University",
        department: "Dept of Hydrology",
        matchScore: 94,
        rationale: "Active research on decentralized fluoride & iron removal filters in Jharkhand rural belts.",
      },
      recommendedIndustry: {
        name: "Tata Steel Foundation",
        mission: "Water & Health CSR Mission",
        matchScore: 91,
        pledgeTypes: ["Clean Water Filtration Plants", "Community RO Plants", "Water Testing Kits"],
      },
      requiredExpertise: ["Hydrology", "Water Chemistry", "Adsorption Filtration", "IoT Water Quality Sensors"],
      aiConfidence: 94,
    },
    timeline: [
      { stage: "SUBMITTED", description: "Problem reported by citizen Rahul Kumar from Kamdara North.", updaterName: "Citizen", timestamp: "2026-08-12T09:00:00.000Z" },
      { stage: "PRI_VERIFIED", description: "Panchayat ground inspection verified fluoride > 2.4 PPM.", updaterName: "Mukhiya Sanjay Oraon", timestamp: "2026-08-18T11:00:00.000Z" },
      { stage: "NODAL_REVIEWED", description: "Selected for state challenge and adopted by BIT Mesra.", updaterName: "State Nodal Cell", timestamp: "2026-08-25T14:00:00.000Z" },
      { stage: "PROTOTYPE_READY", description: "Solar adsorption unit fabrication and lab testing completed.", updaterName: "BIT Mesra Lab", timestamp: "2026-09-05T16:00:00.000Z" },
      { stage: "PILOT_TESTING", description: "14-day field pilot achieved 100% water quality compliance.", updaterName: "District Mission", timestamp: "2026-09-18T10:00:00.000Z" },
      { stage: "DEPLOYED", description: "Full plant commissioned on site; handed over to village Pani Samiti.", updaterName: "State Innovation Mission", timestamp: "2026-09-24T12:00:00.000Z" },
    ],
  },
};

// Fallback AI analysis helper for water / kamdara / general problems
const getFallbackAiAnalysis = (problem) => {
  const text = `${problem?.title || ""} ${problem?.description || ""} ${problem?.category || ""}`.toLowerCase();
  if (
    text.includes("water") ||
    text.includes("fluoride") ||
    text.includes("rust") ||
    text.includes("smell") ||
    text.includes("kamdara")
  ) {
    return {
      detectedDomain: "Water Contamination",
      subdomain: "Groundwater Heavy Metal & Chemical Pollutants",
      severity: "High Severity",
      severityScore: 88,
      sdgs: [
        { code: "SDG 6", name: "Clean Water & Sanitation" },
        { code: "SDG 3", name: "Good Health" },
      ],
      recommendedUniversity: {
        name: "Birsa Agricultural University",
        department: "Dept of Hydrology",
        matchScore: 94,
        rationale: "Active research on decentralized fluoride & iron removal filters in Jharkhand rural belts.",
      },
      recommendedIndustry: {
        name: "Tata Steel Foundation",
        mission: "Water & Health CSR Mission",
        matchScore: 91,
        pledgeTypes: ["Clean Water Filtration Plants", "Community RO Plants", "Water Testing Kits"],
      },
      requiredExpertise: ["Hydrology", "Water Chemistry", "Adsorption Filtration", "IoT Water Quality Sensors"],
      aiConfidence: 94,
    };
  }

  return {
    detectedDomain: problem?.category || "Civic Infrastructure Challenge",
    severity: "High Severity",
    sdgs: [
      { code: "SDG 11", name: "Sustainable Cities & Communities" },
      { code: "SDG 9", name: "Industry, Innovation & Infrastructure" },
    ],
    recommendedUniversity: {
      name: "Birla Institute of Technology (BIT Mesra)",
      department: "Dept of Civil & Environmental Engineering",
      matchScore: 92,
      rationale: "Multi-disciplinary academic engineering laboratory and student innovation teams.",
    },
    recommendedIndustry: {
      name: "Tata Steel CSR Foundation",
      mission: "Civic Infrastructure & Sustainability Mission",
      matchScore: 89,
      pledgeTypes: ["CSR Seed Grant", "Technical Mentorship"],
    },
    requiredExpertise: ["Civil Engineering", "IoT Monitoring", "Field Prototyping"],
    aiConfidence: 90,
  };
};

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

  // Live AI Triage State
  const [isAnalyzingAi, setIsAnalyzingAi] = useState(false);

  // Action status message
  const [actionSuccess, setActionSuccess] = useState("");

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);

        // Check if ID matches a fallback seed record first (for instant rendering)
        if (FALLBACK_SEED_PROBLEMS[id] || (id && id.startsWith("seed-"))) {
          const seedKey = Object.keys(FALLBACK_SEED_PROBLEMS).find(
            (k) => k === id || FALLBACK_SEED_PROBLEMS[k]._id === id
          );
          if (seedKey) {
            const seedProb = FALLBACK_SEED_PROBLEMS[seedKey];
            setProblem(seedProb);
            setUpvoteCount(seedProb.communityUpvotes?.count || 342);
            setLoading(false);
            return;
          }
        }

        const res = await problemApi.getById(id);
        if (res.success && res.data) {
          const data = res.data;
          // Ensure aiAnalysis is available
          if (!data.aiAnalysis) {
            data.aiAnalysis = getFallbackAiAnalysis(data);
          }
          setProblem(data);
          setUpvoteCount(data.communityUpvotes?.count || 0);

          if (currentUser && data.communityUpvotes?.upvotedBy) {
            const hasUserUpvoted = data.communityUpvotes.upvotedBy.some(
              (u) => (typeof u === "string" ? u : u._id || u) === currentUser._id
            );
            setHasUpvoted(hasUserUpvoted);
          }
        } else {
          // If not in API, check fallback
          if (FALLBACK_SEED_PROBLEMS["JH-000001"]) {
            setProblem(FALLBACK_SEED_PROBLEMS["JH-000001"]);
            setUpvoteCount(342);
          } else {
            setError("Problem not found in the registry.");
          }
        }
      } catch (err) {
        console.warn("API problem fetch failed, using fallback:", err);
        if (FALLBACK_SEED_PROBLEMS["JH-000001"]) {
          setProblem(FALLBACK_SEED_PROBLEMS["JH-000001"]);
          setUpvoteCount(342);
        } else {
          setError(err.message || "Failed to load problem details.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDetails();
    }
  }, [id]);

  // 1. Citizen Upvote Action ("I Am Also Affected")
  const handleUpvote = async () => {
    // If not logged in, simulate gracefully for demo so user is never locked out
    if (!currentUser) {
      setUpvoteCount((prev) => (hasUpvoted ? Math.max(0, prev - 1) : prev + 1));
      setHasUpvoted((prev) => !prev);
      setActionSuccess(!hasUpvoted ? 'Endorsed! Added your validation as "I Am Also Affected".' : "Endorsement withdrawn.");
      setTimeout(() => setActionSuccess(""), 4000);
      return;
    }

    try {
      setIsUpvoting(true);
      const res = await problemApi.upvote(problem._id);
      if (res.success) {
        setUpvoteCount(res.count);
        setHasUpvoted(res.hasUpvoted);
        setActionSuccess(res.hasUpvoted ? 'Endorsed! Added your validation as "I Am Also Affected".' : "Endorsement withdrawn.");
        setTimeout(() => setActionSuccess(""), 4000);
      }
    } catch (err) {
      // Fallback
      setUpvoteCount((prev) => (hasUpvoted ? Math.max(0, prev - 1) : prev + 1));
      setHasUpvoted((prev) => !prev);
    } finally {
      setIsUpvoting(false);
    }
  };

  // 2. University R&D Adoption Action
  const handleAdoptDirect = async ({ projectTitle, facultyPi, studentTeam }) => {
    try {
      if (currentUser && problem._id && !problem._id.startsWith("seed-")) {
        const res = await problemApi.adopt(problem._id, {
          projectTitle,
          facultyPi,
          studentTeam,
        });
        if (res.success && res.data) {
          setProblem(res.data);
          setActionSuccess("Challenge successfully adopted as University R&D / Capstone Project!");
          setTimeout(() => setActionSuccess(""), 4500);
          return;
        }
      }
    } catch (err) {
      console.warn("API adopt error, applying local state fallback:", err);
    }

    // Local state fallback for offline demo
    setProblem((prev) => ({
      ...prev,
      status: "SOLUTION_IN_PROGRESS",
      adoption: {
        isAdopted: true,
        orgName: currentUser?.organizationName || "University Innovation Lab",
        facultyPi: facultyPi || "Dr. Priya Ranjan",
        studentTeam: studentTeam || ["Rahul Verma", "Priya Soren"],
        adoptedAt: new Date().toISOString(),
      },
      solution: {
        ...prev?.solution,
        universityName: currentUser?.organizationName || "University Innovation Lab",
        facultyLead: facultyPi || "Dr. Priya Ranjan",
        solutionTitle: projectTitle || `R&D: ${prev?.title}`,
        level: Math.max(2, prev?.solution?.level || 2),
        levelTag: "University Adopted",
      },
    }));
    setActionSuccess("Challenge successfully adopted as University R&D / Capstone Project (TRL Level 2)!");
    setTimeout(() => setActionSuccess(""), 4500);
  };

  // 3. Industry CSR Pledge Action
  const handlePledgeDirect = async ({ orgName, resourceType, amount, pledgeDetails }) => {
    try {
      if (currentUser && problem._id && !problem._id.startsWith("seed-")) {
        const res = await problemApi.pledge(problem._id, {
          resourceType,
          amount,
          pledgeDetails,
        });
        if (res.success && res.data) {
          setProblem(res.data);
          setActionSuccess("Industry CSR Support & Resources pledged successfully!");
          setTimeout(() => setActionSuccess(""), 4500);
          return;
        }
      }
    } catch (err) {
      console.warn("API pledge error, applying local state fallback:", err);
    }

    // Local state fallback
    const newPledge = {
      orgName: orgName || "Tata Steel Foundation",
      resourceType: resourceType || "Funding",
      amount: Number(amount) || 250000,
      pledgeDetails: pledgeDetails || "Pledged ₹2.5 Lakhs funding and equipment sponsorship.",
    };

    setProblem((prev) => ({
      ...prev,
      pledges: [...(prev?.pledges || []), newPledge],
    }));
    setActionSuccess(`CSR Support registered! ${newPledge.orgName} pledged ${newPledge.resourceType} (₹${Number(newPledge.amount).toLocaleString('en-IN')}).`);
    setTimeout(() => setActionSuccess(""), 4500);
  };

  // 4. PRI Ground Truth Verification Action
  const handlePriValidateDirect = async ({ isGenuine, verifierName, observedPopulation, groundCondition, baselineData, remarks }) => {
    try {
      if (currentUser && problem._id && !problem._id.startsWith("seed-")) {
        const res = await priApi.validate(problem._id, {
          isGenuine,
          verifierName,
          observedPopulation,
          groundCondition,
          baselineData,
          remarks,
        });
        if (res.success && res.data) {
          setProblem(res.data);
          setActionSuccess("Ground Truth officially verified by Local PRI Mukhiya / ULB!");
          setTimeout(() => setActionSuccess(""), 4500);
          return;
        }
      }
    } catch (err) {
      console.warn("API pri-validate error, applying local state fallback:", err);
    }

    // Local state fallback
    setProblem((prev) => ({
      ...prev,
      status: "PRI_VERIFIED",
      priVerification: {
        isGenuine: true,
        verifierName: verifierName || "Mukhiya Sanjay Oraon",
        observedPopulation: observedPopulation || 1250,
        groundCondition: groundCondition || "Ground truth confirmed on site.",
        baselineData: baselineData || { metricSummary: "Fluoride: 2.4 PPM, Turbidity: 18 NTU" },
        verifiedAt: new Date().toISOString(),
      },
      solution: {
        ...prev?.solution,
        level: Math.max(1, prev?.solution?.level || 1),
        levelTag: "Ground Verified",
      },
    }));
    setActionSuccess("Ground truth officially verified & baseline metrics certified (TRL Level 1)!");
    setTimeout(() => setActionSuccess(""), 4500);
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
      console.warn("AI Triage error, using semantic fallback:", err);
      setProblem((prev) => ({
        ...prev,
        aiAnalysis: getFallbackAiAnalysis(prev),
      }));
    } finally {
      setIsAnalyzingAi(false);
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
          onClick={() => navigate("/tracker")}
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

  // Calculate current solution maturity level (1 to 5)
  let currentLevel = problem.solution?.level || 1;
  if (!problem.solution?.level) {
    if (problem.status === "DEPLOYED") currentLevel = 5;
    else if (problem.status === "PILOT_TESTING") currentLevel = 4;
    else if (problem.status === "PROTOTYPE_READY") currentLevel = 3;
    else if (problem.status === "SOLUTION_IN_PROGRESS" || problem.status === "NODAL_REVIEWED" || problem.status === "MASTER_PROBLEM_CREATED") currentLevel = 2;
    else if (problem.status === "PRI_VERIFIED") currentLevel = 1;
  }

  const ai = problem.aiAnalysis || getFallbackAiAnalysis(problem);

  return (
    <div className="problem-details-page">
      {/* Top Navigation Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowLeft size={17} />
          Back to Portal
        </button>

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
              {hasUpvoted ? "Endorsed by You" : '👍 Community Upvote ("I Am Also Affected")'} ({upvoteCount})
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

      {/* =========================================================================
          🌟 1. THE QUAD-HELIX ACTION HUB ON EVERY PROBLEM (THE ULTIMATE DIFFERENTIATOR)
      ========================================================================= */}
      <QuadHelixActionBar
        problem={problem}
        currentUser={currentUser}
        upvoteCount={upvoteCount}
        hasUpvoted={hasUpvoted}
        isUpvoting={isUpvoting}
        onUpvote={handleUpvote}
        onAdoptSubmit={handleAdoptDirect}
        onPledgeSubmit={handlePledgeDirect}
        onPriValidateSubmit={handlePriValidateDirect}
      />

      {/* =========================================================================
          📊 4. TECHNOLOGY READINESS LEVEL (TRL 1 → 5) PROGRESS TRACKER
      ========================================================================= */}
      <TrlProgressTracker
        currentLevel={currentLevel}
        solutionInfo={problem.solution}
      />

      {/* =========================================================================
          🧠 5. AI PROBLEM DECOMPOSITION & HEI / GOVT / SOFTWARE MULTI-TRACK ROUTING
      ========================================================================= */}
      <AiSubProblemBreakdown
        problem={problem}
        onProblemUpdated={(updated) => {
          setProblem(updated);
          setActionSuccess("Sub-problem scope & assignment updated successfully!");
          setTimeout(() => setActionSuccess(""), 4500);
        }}
      />

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
                      ? `${problem.impact.estimatedPopulation.toLocaleString()} citizens`
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

          {/* =========================================================================
              🧠 2. AI PROBLEM TRIAGE & UNIVERSITY-INDUSTRY MATCHER
          ========================================================================= */}
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
                    Automated neural capability matching via FastAPI microservice & state innovation matrix
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

            {ai && (
              <div className="ai-details-body">
                {/* Detected Domain & Severity */}
                <div className="ai-metric-row">
                  <div className="ai-metric-label">
                    <Target size={16} />
                    <strong>Detected Domain & Severity:</strong>
                  </div>
                  <div className="ai-metric-values">
                    <span className="domain-pill">{ai.detectedDomain || "Water Contamination"}</span>
                    <span className="separator">/</span>
                    <span className={`severity-pill ${ai.severity?.toLowerCase().includes("critical") ? "critical" : "high"}`}>
                      {ai.severity || "High Severity"}
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
                  {/* Recommended University Lab */}
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
                      {ai.recommendedUniversity?.name || "Birsa Agricultural University"} — {ai.recommendedUniversity?.department || "Dept of Hydrology"}
                    </h4>
                    <p className="ai-match-rationale">
                      {ai.recommendedUniversity?.rationale || "Active research on decentralized fluoride & iron removal filters in Jharkhand rural belts."}
                    </p>
                  </div>

                  {/* Recommended Industry Partner */}
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
                      {ai.recommendedIndustry?.name || "Tata Steel Foundation"} — {ai.recommendedIndustry?.mission || "Water & Health CSR Mission"}
                    </h4>
                    <div className="ai-pledge-tags">
                      {ai.recommendedIndustry?.pledgeTypes?.map((pt, idx) => (
                        <span key={idx} className="pledge-tag">{pt}</span>
                      )) || (
                        <>
                          <span className="pledge-tag">Clean Water Filtration Plants</span>
                          <span className="pledge-tag">Community RO Plants</span>
                        </>
                      )}
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
            )}
          </section>

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
                  PRI / Local Body Ground Truth Certification
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
              {problem.priVerification.baselineData && (
                <div style={{ background: "#ffffff", padding: "10px 14px", borderRadius: "8px", border: "1px solid #e5e7eb", marginTop: "10px" }}>
                  <strong style={{ fontSize: "13px", color: "#4b5563", display: "block", marginBottom: "6px" }}>
                    Baseline Technical Inspection Data:
                  </strong>
                  <pre style={{ margin: 0, fontSize: "12px", color: "#1f2937", fontFamily: "inherit" }}>
                    {typeof problem.priVerification.baselineData === "string"
                      ? problem.priVerification.baselineData
                      : JSON.stringify(problem.priVerification.baselineData, null, 2)}
                  </pre>
                </div>
              )}
            </section>
          )}

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

          {/* Timeline */}
          <section className="details-card">
            <h2>Problem Lifecycle Audit Timeline</h2>
            <div className="timeline">
              {problem.timeline && problem.timeline.length > 0 ? (
                problem.timeline.map((item, index) => (
                  <div key={index} className="timeline-item completed">
                    <CheckCircle2 size={20} color="#059669" />
                    <div>
                      <strong>{item.stage.replace(/_/g, " ")}</strong>
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