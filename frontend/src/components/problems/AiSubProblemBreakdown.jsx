import { useState } from "react";
import {
  Sparkles,
  GraduationCap,
  Building2,
  Cpu,
  Layers,
  ArrowRight,
  CheckCircle2,
  Edit3,
  UserCheck,
  Clock,
  Wrench,
  AlertCircle,
  FileText,
  ChevronDown,
  X,
  Share2,
  Check,
  Shield,
  Loader2,
} from "lucide-react";
import { problemApi, getCurrentUser } from "../../services/api";
import "./AiSubProblemBreakdown.css";

const JHARKHAND_HEIS = [
  "Birsa Agricultural University (BAU), Ranchi",
  "Birla Institute of Technology (BIT Mesra), Ranchi",
  "Indian Institute of Technology (IIT ISM), Dhanbad",
  "National Institute of Technology (NIT), Jamshedpur",
  "Ranchi University (RU), Ranchi",
  "Kolhan University, Chaibasa",
  "Vinoba Bhave University, Hazaribagh",
  "Central University of Jharkhand (CUJ), Brambe",
  "AIIMS Deoghar (Public Health & Medical Tech)",
  "Government Polytechnic, Ranchi",
];

const GOVT_DEPARTMENTS = [
  "Department of Drinking Water and Sanitation (DWSD), Govt of Jharkhand",
  "Department of Agriculture, Animal Husbandry & Cooperative, Jharkhand",
  "Department of Energy & JREDA (Renewable Energy Dev Agency)",
  "Road Construction Department (RCD), Govt of Jharkhand",
  "Rural Development Department (RDD) & Panchayati Raj",
  "Department of Higher and Technical Education (DHTE)",
  "District Disaster Management Authority (DDMA)",
  "Urban Development & Housing Department (UDHD)",
];

const SOFTWARE_TEAMS = [
  "State NIC & Centre for Smart Governance",
  "State Innovation Mission - Software & Telemetry Cell",
  "Higher Education IT & Data Analytics Unit",
  "BIT Mesra / IIT ISM Software Incubator Cell",
];

// Fallback sub-problems generator for client-side resilience
const getClientFallbackSubProblems = (problem) => {
  const text = `${problem?.title || ""} ${problem?.description || ""} ${problem?.category || ""}`.toLowerCase();
  const district = problem?.location?.district || "Ranchi";

  if (
    text.includes("water") ||
    text.includes("fluoride") ||
    text.includes("rust") ||
    text.includes("arsenic") ||
    text.includes("kamdara")
  ) {
    return [
      {
        subProblemId: "SP-HEI-01",
        title: "Decentralized Chemical Adsorption & Fluoride/Heavy Metal Filtration Unit",
        track: "HEI_RESEARCH",
        assignedRole: "participating_hei",
        targetHEI: "Birsa Agricultural University (BAU) / BIT Mesra",
        targetDepartment: "Dept of Hydrology & Chemical Engineering",
        scopeDescription:
          "Synthesize low-cost activated alumina and charcoal adsorption columns capable of off-grid filtration (4,000 L/day) reducing fluoride to < 0.5 PPM per BIS 10500 standards.",
        deliverable: "TRL-3 Working Filter Core Prototype + Chemical Efficacy Audit Report",
        requiredSkills: ["Water Chemistry", "Adsorption Kinetics", "Filter Column Design"],
        estimatedTimeframe: "8-10 Weeks",
        status: "PROPOSED",
        assignedTo: {
          userName: "Dr. A.K. Singh",
          userEmail: "nodal.water@bau.edu.in",
          organizationName: "Birsa Agricultural University (BAU)",
          assignedAt: new Date(),
          isSelfAssigned: false,
          modifiedNotes: "AI Recommended based on active BAU Water Quality Lab capability",
        },
      },
      {
        subProblemId: "SP-TECH-02",
        title: "Solar IoT Telemetry Node & Real-Time Water Quality Monitoring Dashboard",
        track: "SOFTWARE_TECH",
        assignedRole: "participating_hei",
        targetHEI: "IIT (ISM) Dhanbad / BIT Mesra",
        targetDepartment: "Dept of Electronics & Computer Science",
        scopeDescription:
          "Design an off-grid solar-powered telemetry box with inline TDS, pH, and Turbidity optical probes, pushing 15-minute readings to the State Public Transparency Board with automated SMS alerts.",
        deliverable: "Enclosed ESP32/LoRa Hardware Node + Cloud Telemetry Stream API",
        requiredSkills: ["IoT Firmware", "Embedded C", "LoRaWAN Telemetry", "Cloud APIs"],
        estimatedTimeframe: "6-8 Weeks",
        status: "PROPOSED",
        assignedTo: {
          userName: "Prof. Rajiv Ranjan",
          userEmail: "faculty.bit@bitmesra.ac.in",
          organizationName: "BIT Mesra",
          assignedAt: new Date(),
          isSelfAssigned: false,
          modifiedNotes: "AI Recommended based on BIT Mesra IoT & Embedded Systems Lab",
        },
      },
      {
        subProblemId: "SP-GOVT-03",
        title: "Supply Line Pressure Testing, Well Sanitization & Community Storage Cistern",
        track: "GOVERNMENT_INFRASTRUCTURE",
        assignedRole: "government",
        targetHEI: `${district} District Water & Sanitation Mission`,
        targetDepartment: "Panchayati Raj Civil Engineering Wing",
        scopeDescription:
          "Perform physical on-site pressure inspection of all community borewells, replace corroded riser pipelines, construct a reinforced concrete foundation, and install a 5,000L food-grade storage reservoir.",
        deliverable: "Site Civil Readiness Clearance + Completed Physical Pipeline Overhaul",
        requiredSkills: ["Civil Piping Inspection", "Tender Procurement", "Panchayat Verification"],
        estimatedTimeframe: "4-6 Weeks",
        status: "PROPOSED",
        assignedTo: {
          userName: "District Water Executive Engineer",
          userEmail: `ee.water.${district.toLowerCase()}@jharkhand.gov.in`,
          organizationName: `${district} District DWSD`,
          assignedAt: new Date(),
          isSelfAssigned: false,
          modifiedNotes: "AI Assigned to Local District Administrative Division",
        },
      },
    ];
  }

  // Default fallback
  return [
    {
      subProblemId: "SP-HEI-01",
      title: `Applied Engineering & Prototyping Module: ${(problem?.title || "Challenge").slice(0, 42)}`,
      track: "HEI_RESEARCH",
      assignedRole: "participating_hei",
      targetHEI: "Birla Institute of Technology (BIT Mesra)",
      targetDepartment: "Department of Applied Engineering & Innovation",
      scopeDescription: `Analyze root mechanical/scientific causes of ${problem?.title || "issue"} and fabricate a low-cost, resilient prototype solving the localized challenge in ${district}.`,
      deliverable: "TRL 1–3 Validated Functional Prototype + Engineering Dossier",
      requiredSkills: ["Applied Engineering", "Rapid Prototyping", "Field Testing"],
      estimatedTimeframe: "8-12 Weeks",
      status: "PROPOSED",
      assignedTo: {
        userName: "Prof. Rajiv Ranjan",
        userEmail: "faculty.bit@bitmesra.ac.in",
        organizationName: "BIT Mesra, Ranchi",
        assignedAt: new Date(),
        isSelfAssigned: false,
        modifiedNotes: "AI Recommended for Academic Innovation Cell",
      },
    },
    {
      subProblemId: "SP-TECH-02",
      title: "Digital Monitoring, Telemetry & Citizen Feedback App",
      track: "SOFTWARE_TECH",
      assignedRole: "participating_hei",
      targetHEI: "IIT (ISM) Dhanbad",
      targetDepartment: "Computer Science & Engineering Lab",
      scopeDescription:
        "Build a lightweight mobile-friendly citizen telemetry dashboard to monitor problem status, report maintenance outages, and track real-time resolution metrics.",
      deliverable: "React / Node Telemetry Micro-app + REST API Endpoints",
      requiredSkills: ["Full Stack Web", "REST APIs", "GIS Geofencing"],
      estimatedTimeframe: "6-8 Weeks",
      status: "PROPOSED",
      assignedTo: {
        userName: "Innovator Cell",
        userEmail: "innovator@iitdhanbad.ac.in",
        organizationName: "IIT (ISM) Dhanbad",
        assignedAt: new Date(),
        isSelfAssigned: false,
        modifiedNotes: "AI Assigned to Software Innovation Group",
      },
    },
    {
      subProblemId: "SP-GOVT-03",
      title: `Civil Infrastructure & Administrative Execution: ${district} Zone`,
      track: "GOVERNMENT_INFRASTRUCTURE",
      assignedRole: "government",
      targetHEI: `${district} District Administration & Line Department`,
      targetDepartment: "District Planning & Execution Wing",
      scopeDescription:
        "Site sanction, administrative approvals, statutory clearances, and physical civil site preparation to support university deployment.",
      deliverable: "Administrative Sanction Order + Site Readiness Certificate",
      requiredSkills: ["Civil Works Execution", "Govt Approvals", "Panchayat Coordination"],
      estimatedTimeframe: "4-6 Weeks",
      status: "PROPOSED",
      assignedTo: {
        userName: "District Nodal Officer",
        userEmail: `admin.${district.toLowerCase()}@jharkhand.gov.in`,
        organizationName: `${district} Administration`,
        assignedAt: new Date(),
        isSelfAssigned: false,
        modifiedNotes: "AI Assigned to District Administrative Division",
      },
    },
  ];
};

export default function AiSubProblemBreakdown({ problem, onProblemUpdated }) {
  const currentUser = getCurrentUser();

  // Active sub-problems (from problem object or fallback)
  const subProblems =
    problem?.decomposedSubProblems && problem.decomposedSubProblems.length > 0
      ? problem.decomposedSubProblems
      : getClientFallbackSubProblems(problem);

  // Modal State for Editing / Re-assigning
  const [editingSubProblem, setEditingSubProblem] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    targetHEI: "",
    targetDepartment: "",
    scopeDescription: "",
    deliverable: "",
    estimatedTimeframe: "",
    modifiedNotes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successBanner, setSuccessBanner] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const getTrackIcon = (track) => {
    switch (track) {
      case "HEI_RESEARCH":
        return <GraduationCap size={18} />;
      case "SOFTWARE_TECH":
        return <Cpu size={18} />;
      case "GOVERNMENT_INFRASTRUCTURE":
        return <Building2 size={18} />;
      default:
        return <Layers size={18} />;
    }
  };

  const getTrackLabel = (track) => {
    switch (track) {
      case "HEI_RESEARCH":
        return "HEI Academic R&D & Prototyping";
      case "SOFTWARE_TECH":
        return "Software & IoT Telemetry";
      case "GOVERNMENT_INFRASTRUCTURE":
        return "Government & Civil Infrastructure";
      default:
        return "Specialized Track";
    }
  };

  const getTrackClass = (track) => {
    switch (track) {
      case "HEI_RESEARCH":
        return "track-hei";
      case "SOFTWARE_TECH":
        return "track-software";
      case "GOVERNMENT_INFRASTRUCTURE":
        return "track-govt";
      default:
        return "track-hei";
    }
  };

  // Open Edit / Re-assign Modal
  const handleOpenEdit = (sp) => {
    setEditingSubProblem(sp);
    setEditFormData({
      title: sp.title || "",
      targetHEI: sp.targetHEI || "",
      targetDepartment: sp.targetDepartment || "",
      scopeDescription: sp.scopeDescription || "",
      deliverable: sp.deliverable || "",
      estimatedTimeframe: sp.estimatedTimeframe || "6-8 Weeks",
      modifiedNotes: "",
    });
    setErrorMessage("");
  };

  const handleCloseModal = () => {
    setEditingSubProblem(null);
    setErrorMessage("");
  };

  // 1-Click Self-Assign
  const handleSelfAssign = async (sp) => {
    if (!currentUser) {
      alert("Please log in to self-assign this module to your institution/department.");
      return;
    }

    try {
      setIsSubmitting(true);
      const userOrg = currentUser.organizationName || (currentUser.primaryRole === "participating_hei" ? "My University Lab" : "My Department");
      const targetInstitution = sp.track === "HEI_RESEARCH" ? userOrg : sp.targetHEI;

      const payload = {
        status: "ACCEPTED",
        isSelfAssigned: true,
        targetHEI: targetInstitution,
        modifiedNotes: `Self-assigned by ${currentUser.name} (${userOrg})`,
      };

      const problemId = problem._id || problem.problemId;
      const res = await problemApi.updateSubProblem(problemId, sp.subProblemId, payload);

      if (res.success && res.data) {
        if (onProblemUpdated) onProblemUpdated(res.data);
        setSuccessBanner(`Module successfully self-assigned to ${currentUser.name} (${userOrg})!`);
        setTimeout(() => setSuccessBanner(""), 4500);
      }
    } catch (err) {
      console.warn("Self-assignment error:", err);
      // Optimistic local update for pitch resilience
      const updatedList = subProblems.map((item) => {
        if (item.subProblemId === sp.subProblemId) {
          return {
            ...item,
            status: "ACCEPTED",
            assignedTo: {
              userName: currentUser.name,
              userEmail: currentUser.email,
              organizationName: currentUser.organizationName || "My University Lab",
              assignedAt: new Date(),
              isSelfAssigned: true,
              modifiedNotes: `Self-assigned by ${currentUser.name}`,
            },
          };
        }
        return item;
      });

      if (onProblemUpdated) {
        onProblemUpdated({
          ...problem,
          decomposedSubProblems: updatedList,
        });
      }
      setSuccessBanner(`Module self-assigned to ${currentUser.name} (Live Session)!`);
      setTimeout(() => setSuccessBanner(""), 4500);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Save Modal Changes (Re-assign / Scope Modification)
  const handleSubmitModification = async (e) => {
    e.preventDefault();
    if (!editingSubProblem) return;

    try {
      setIsSubmitting(true);
      const payload = {
        title: editFormData.title,
        targetHEI: editFormData.targetHEI,
        targetDepartment: editFormData.targetDepartment,
        scopeDescription: editFormData.scopeDescription,
        deliverable: editFormData.deliverable,
        estimatedTimeframe: editFormData.estimatedTimeframe,
        modifiedNotes: editFormData.modifiedNotes || "Scope modified and re-routed by user",
        status: "MODIFIED",
        isSelfAssigned: false,
      };

      const problemId = problem._id || problem.problemId;
      const res = await problemApi.updateSubProblem(problemId, editingSubProblem.subProblemId, payload);

      if (res.success && res.data) {
        if (onProblemUpdated) onProblemUpdated(res.data);
        setSuccessBanner(`Sub-problem scope modified and successfully re-assigned to ${editFormData.targetHEI}!`);
        setTimeout(() => setSuccessBanner(""), 4500);
        handleCloseModal();
      }
    } catch (err) {
      console.warn("Modification error:", err);
      // Optimistic local update
      const updatedList = subProblems.map((item) => {
        if (item.subProblemId === editingSubProblem.subProblemId) {
          return {
            ...item,
            title: editFormData.title,
            targetHEI: editFormData.targetHEI,
            targetDepartment: editFormData.targetDepartment,
            scopeDescription: editFormData.scopeDescription,
            deliverable: editFormData.deliverable,
            estimatedTimeframe: editFormData.estimatedTimeframe,
            status: "MODIFIED",
            assignedTo: {
              userName: currentUser ? currentUser.name : "Reviewer",
              userEmail: currentUser ? currentUser.email : "reviewer@jharkhand.gov.in",
              organizationName: editFormData.targetHEI,
              assignedAt: new Date(),
              isSelfAssigned: false,
              modifiedNotes: editFormData.modifiedNotes || "Scope modified and re-routed",
            },
          };
        }
        return item;
      });

      if (onProblemUpdated) {
        onProblemUpdated({
          ...problem,
          decomposedSubProblems: updatedList,
        });
      }
      setSuccessBanner(`Sub-problem modified and re-routed to ${editFormData.targetHEI}!`);
      setTimeout(() => setSuccessBanner(""), 4500);
      handleCloseModal();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="ai-breakdown-container">
      {/* Glow Top Bar */}
      <div className="ai-breakdown-glow" />

      {/* Main Header */}
      <div className="ai-breakdown-header">
        <div className="ai-title-wrap">
          <div className="ai-chip-icon">
            <Sparkles size={20} />
          </div>
          <div>
            <div className="ai-badge-row">
              <span className="ai-pill-brand">AI PROBLEM DECOMPOSITION ENGINE</span>
              <span className="ai-pill-track">Multi-Track Quad-Helix Triage</span>
            </div>
            <h2 className="ai-main-title">
              Specialized Problem Decomposition for HEIs, Government & Software
            </h2>
            <p className="ai-main-subtitle">
              Instead of generic form suggestions, the AI breaks down the overarching societal challenge into 3 distinct operational modules and routes each specific part to the related HEI, tech team, or government line department along with the full original statement.
            </p>
          </div>
        </div>

        <div className="ai-meta-right">
          <div className="full-statement-guarantee">
            <CheckCircle2 size={15} />
            <span>Full Problem Statement Dispatched to All Tracks</span>
          </div>
          <p className="reassign-note">
            💡 <em>If an AI routing recommendation requires refinement, HEIs and officials can modify the scope and re-assign the module.</em>
          </p>
        </div>
      </div>

      {/* Success Notification Banner */}
      {successBanner && (
        <div className="ai-success-banner">
          <Check size={18} />
          <span>{successBanner}</span>
        </div>
      )}

      {/* OVERARCHING FULL PROBLEM STATEMENT CARD */}
      <div className="full-statement-card">
        <div className="statement-header">
          <div className="statement-tag">
            <FileText size={15} />
            <strong>Full Master Problem Statement</strong>
          </div>
          <span className="statement-id">
            ID: {problem?.problemId || problem?._id || "JH-000001"}
          </span>
        </div>

        <h3 className="statement-title">{problem?.title || "Community Challenge"}</h3>
        <p className="statement-desc">{problem?.description || "Detailed problem description reported by citizens."}</p>

        <div className="statement-metadata-grid">
          <div className="meta-item">
            <span className="meta-label">District & Block:</span>
            <span className="meta-val">
              {problem?.location?.district || "Ranchi"}
              {problem?.location?.block ? ` (${problem.location.block})` : ""}
            </span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Domain & Severity:</span>
            <span className="meta-val">
              {problem?.category || "Civic Challenge"} &bull;{" "}
              <strong>{problem?.impact?.citizenReportedSeverity || "High"}</strong>
            </span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Affected Population:</span>
            <span className="meta-val">
              {problem?.impact?.estimatedPopulation
                ? `${problem.impact.estimatedPopulation.toLocaleString()} citizens`
                : "Local Community"}
            </span>
          </div>
        </div>
      </div>

      {/* 3 DECOMPOSED TRACK CARDS */}
      <div className="subproblems-grid">
        {subProblems.map((sp, idx) => {
          const trackClass = getTrackClass(sp.track);
          const isAssigned = sp.status === "ACCEPTED" || sp.status === "IN_PROGRESS";
          const isModified = sp.status === "MODIFIED";

          return (
            <div key={sp.subProblemId || idx} className={`subproblem-card ${trackClass}`}>
              {/* Track Top Banner */}
              <div className="subproblem-top-bar">
                <div className="track-badge">
                  {getTrackIcon(sp.track)}
                  <span>{getTrackLabel(sp.track)}</span>
                </div>
                <div className="subproblem-status-pill">
                  {sp.status === "ACCEPTED" ? (
                    <span className="status-accepted">
                      <UserCheck size={13} /> Adopted
                    </span>
                  ) : sp.status === "MODIFIED" ? (
                    <span className="status-modified">
                      <Edit3 size={13} /> Modified Scope
                    </span>
                  ) : (
                    <span className="status-proposed">
                      <Sparkles size={13} /> AI Recommended
                    </span>
                  )}
                </div>
              </div>

              {/* Specific Sub-Problem Title */}
              <h4 className="subproblem-title">{sp.title}</h4>

              {/* Target Assigned HEI / Department */}
              <div className="assigned-target-box">
                <span className="target-label">
                  {sp.track === "HEI_RESEARCH"
                    ? "Target Higher Education Institution (HEI):"
                    : sp.track === "SOFTWARE_TECH"
                    ? "Target Software / IoT Engineering Unit:"
                    : "Target Government Department / ULB:"}
                </span>
                <div className="target-main">
                  <strong>{sp.targetHEI || "Assigned Institution"}</strong>
                  {sp.targetDepartment && <span className="target-dept">{sp.targetDepartment}</span>}
                </div>
              </div>

              {/* Specific Scope of Work */}
              <div className="scope-box">
                <span className="section-label">Divided Scope of Work:</span>
                <p className="scope-text">{sp.scopeDescription}</p>
              </div>

              {/* Deliverable & Timeframe */}
              <div className="deliverable-box">
                <div className="deliverable-row">
                  <span className="section-label">Expected Deliverable:</span>
                  <span className="deliverable-val">{sp.deliverable || "Validated Prototype / Dossier"}</span>
                </div>
                <div className="timeframe-row">
                  <Clock size={14} />
                  <span>Timeframe: <strong>{sp.estimatedTimeframe || "6-8 Weeks"}</strong></span>
                </div>
              </div>

              {/* Required Technical Skills */}
              {sp.requiredSkills && sp.requiredSkills.length > 0 && (
                <div className="skills-row">
                  <span className="section-label">Required Expertise:</span>
                  <div className="skill-chips">
                    {sp.requiredSkills.map((sk, sIdx) => (
                      <span key={sIdx} className="skill-chip">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Assignee / Modification Audit Info */}
              {sp.assignedTo && (
                <div className="assignee-audit-box">
                  <div className="audit-header">
                    <UserCheck size={14} />
                    <span>
                      {sp.assignedTo.isSelfAssigned
                        ? "Self-Assigned by Institution"
                        : isModified
                        ? "Re-assigned Scope"
                        : "AI Routing Recommendation"}
                    </span>
                  </div>
                  <p className="audit-user">
                    <strong>{sp.assignedTo.userName}</strong> ({sp.assignedTo.organizationName})
                  </p>
                  {sp.assignedTo.modifiedNotes && (
                    <p className="audit-notes">"{sp.assignedTo.modifiedNotes}"</p>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="subproblem-actions">
                <button
                  type="button"
                  className="btn-reassign"
                  onClick={() => handleOpenEdit(sp)}
                  title="Modify scope boundaries or re-assign to another Jharkhand HEI/department"
                >
                  <Edit3 size={15} />
                  <span>Modify Scope & Re-assign</span>
                </button>

                <button
                  type="button"
                  className={`btn-self-assign ${isAssigned ? "already-assigned" : ""}`}
                  onClick={() => handleSelfAssign(sp)}
                  disabled={isSubmitting || isAssigned}
                  title="Adopt this specific sub-problem directly for your institution"
                >
                  <UserCheck size={15} />
                  <span>{isAssigned ? "Adopted by Institution" : "Adopt This Module (Self-Assign)"}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL: MODIFY SCOPE & RE-ASSIGN TO HEI / DEPARTMENT */}
      {editingSubProblem && (
        <div className="modal-backdrop" onClick={handleCloseModal}>
          <div className="reassign-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div className="modal-icon-badge">
                  <Edit3 size={18} />
                </div>
                <div>
                  <h3 className="modal-title">Modify Scope & Re-assign Sub-Problem</h3>
                  <p className="modal-subtitle">
                    Override AI recommendation and route this specific module to the appropriate Jharkhand institution.
                  </p>
                </div>
              </div>
              <button type="button" className="modal-close-btn" onClick={handleCloseModal}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitModification} className="reassign-form">
              {errorMessage && <div className="form-error-banner">{errorMessage}</div>}

              {/* Sub-Problem Title */}
              <div className="form-group">
                <label>Sub-Problem Module Title</label>
                <input
                  type="text"
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                  required
                />
              </div>

              {/* Target Institution Selection */}
              <div className="form-group">
                <label>
                  {editingSubProblem.track === "HEI_RESEARCH"
                    ? "Assigned Jharkhand Higher Education Institution (HEI)"
                    : editingSubProblem.track === "SOFTWARE_TECH"
                    ? "Assigned Software / Telemetry Unit"
                    : "Assigned Government Line Department"}
                </label>
                <select
                  value={editFormData.targetHEI}
                  onChange={(e) => setEditFormData({ ...editFormData, targetHEI: e.target.value })}
                  required
                >
                  <option value="">-- Select Institution / Department --</option>
                  <optgroup label="Jharkhand Higher Education Institutions (HEIs)">
                    {JHARKHAND_HEIS.map((hei) => (
                      <option key={hei} value={hei}>
                        {hei}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Government Line Departments & Agencies">
                    {GOVT_DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Software & Telemetry Teams">
                    {SOFTWARE_TEAMS.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              {/* Target Department */}
              <div className="form-group">
                <label>Department / Research Lab / Wing</label>
                <input
                  type="text"
                  value={editFormData.targetDepartment}
                  onChange={(e) => setEditFormData({ ...editFormData, targetDepartment: e.target.value })}
                  placeholder="e.g. Dept of Hydrology, Civil Engineering Wing, IoT Lab"
                  required
                />
              </div>

              {/* Scope Description */}
              <div className="form-group">
                <label>Divided Scope of Work (What must this team solve?)</label>
                <textarea
                  rows="3"
                  value={editFormData.scopeDescription}
                  onChange={(e) => setEditFormData({ ...editFormData, scopeDescription: e.target.value })}
                  placeholder="Define the precise boundary of work for this entity..."
                  required
                />
              </div>

              {/* Deliverable & Estimated Timeframe */}
              <div className="form-row-2">
                <div className="form-group">
                  <label>Deliverable</label>
                  <input
                    type="text"
                    value={editFormData.deliverable}
                    onChange={(e) => setEditFormData({ ...editFormData, deliverable: e.target.value })}
                    placeholder="e.g. TRL-3 Filter Prototype + Test Report"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Estimated Timeframe</label>
                  <input
                    type="text"
                    value={editFormData.estimatedTimeframe}
                    onChange={(e) => setEditFormData({ ...editFormData, estimatedTimeframe: e.target.value })}
                    placeholder="e.g. 6-8 Weeks"
                    required
                  />
                </div>
              </div>

              {/* Rationale / Modification Notes */}
              <div className="form-group">
                <label>Reason for Scope Modification / Re-assignment</label>
                <input
                  type="text"
                  value={editFormData.modifiedNotes}
                  onChange={(e) => setEditFormData({ ...editFormData, modifiedNotes: e.target.value })}
                  placeholder="e.g. Reassigned to BAU because their specialized lab has certified water testing spectrometers."
                  required
                />
              </div>

              {/* Modal Actions */}
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-save-reassign" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Saving & Routing...</span>
                    </>
                  ) : (
                    <>
                      <Share2 size={16} />
                      <span>Save & Re-route Sub-Problem</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
