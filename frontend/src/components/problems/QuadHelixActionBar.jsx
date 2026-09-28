import React, { useState } from "react";
import {
  GraduationCap,
  Building2,
  Users,
  ShieldCheck,
  CheckCircle2,
  ThumbsUp,
  DollarSign,
  FileCheck2,
  Sparkles,
  Layers,
  ArrowRight,
  X,
  Plus,
  AlertCircle,
} from "lucide-react";
import "./QuadHelixActionBar.css";

// 4 Quad-Helix Stakeholder Definitions
const STAKEHOLDER_ROLES = [
  {
    id: "university",
    label: "University / Faculty / Student",
    shortLabel: "University R&D",
    icon: GraduationCap,
    accentColor: "#2563eb",
    btnColor: "#1d4ed8",
    bgLight: "#eff6ff",
    roleMatch: ["participating_hei", "nodal", "student", "university", "faculty"],
  },
  {
    id: "industry",
    label: "Industry / Corporate (CSR)",
    shortLabel: "Industry CSR",
    icon: Building2,
    accentColor: "#059669",
    btnColor: "#047857",
    bgLight: "#ecfdf5",
    roleMatch: ["industry", "corporate", "csr"],
  },
  {
    id: "citizen",
    label: "Citizen Community",
    shortLabel: "Citizen",
    icon: Users,
    accentColor: "#d97706",
    btnColor: "#b45309",
    bgLight: "#fffbeb",
    roleMatch: ["citizen"],
  },
  {
    id: "pri",
    label: "PRI / Local Body",
    shortLabel: "PRI / Local Body",
    icon: ShieldCheck,
    accentColor: "#7c3aed",
    btnColor: "#6d28d9",
    bgLight: "#faf5ff",
    roleMatch: ["pri", "government", "admin"],
  },
];

export default function QuadHelixActionBar({
  problem,
  currentUser,
  upvoteCount = 0,
  hasUpvoted = false,
  isUpvoting = false,
  onUpvote,
  onAdoptSubmit,
  onPledgeSubmit,
  onPriValidateSubmit,
}) {
  // Determine initial active stakeholder based on currentUser or default to university/citizen
  const detectInitialRole = () => {
    if (!currentUser?.primaryRole) return "university";
    const found = STAKEHOLDER_ROLES.find((r) =>
      r.roleMatch.includes(currentUser.primaryRole.toLowerCase())
    );
    return found ? found.id : "university";
  };

  const [activeStakeholder, setActiveStakeholder] = useState(detectInitialRole());

  // Modal States
  const [showAdoptModal, setShowAdoptModal] = useState(false);
  const [showPledgeModal, setShowPledgeModal] = useState(false);
  const [showPriModal, setShowPriModal] = useState(false);

  // Adopt Form State
  const [adoptData, setAdoptData] = useState({
    projectTitle: problem ? `R&D: ${problem.title}` : "",
    facultyPi: currentUser?.name || "Dr. Priya Ranjan (Dept of Chemical Engineering)",
    studentTeam: "Rahul Verma (B.Tech Lead), Priya Soren (M.Tech), Aman Tirkey (IoT)",
  });
  const [adoptLoading, setAdoptLoading] = useState(false);

  // Pledge Form State
  const [pledgeData, setPledgeData] = useState({
    orgName: currentUser?.organizationName || "Tata Steel Foundation",
    resourceType: "Funding",
    amount: "250000", // ₹2.5 Lakhs as requested in user prompt
    pledgeDetails: "Pledging ₹2.5 Lakhs grant funding and specialized IoT water sensor kits for pilot deployment.",
  });
  const [pledgeLoading, setPledgeLoading] = useState(false);

  // PRI Validate Form State
  const [priData, setPriData] = useState({
    isGenuine: true,
    verifierName: currentUser?.name || "Mukhiya Sanjay Oraon",
    observedPopulation: problem?.impact?.estimatedPopulation || 1250,
    baselineMetric: "Fluoride: 2.4 PPM, Turbidity: 18 NTU, Bacterial Pathogen: Present",
    groundCondition: "Physical ground truth verified on site. Hand pumps corroded and producing brackish rust water.",
    remarks: "Priority 1 Civic Emergency. Panchayat allocating land for decentralized filtration unit.",
  });
  const [priLoading, setPriLoading] = useState(false);

  // Success Flash
  const [flashMsg, setFlashMsg] = useState("");

  const triggerFlash = (msg) => {
    setFlashMsg(msg);
    setTimeout(() => setFlashMsg(""), 4500);
  };

  const handleAdoptForm = async (e) => {
    e.preventDefault();
    setAdoptLoading(true);
    try {
      const team = adoptData.studentTeam
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      if (onAdoptSubmit) {
        await onAdoptSubmit({
          projectTitle: adoptData.projectTitle,
          facultyPi: adoptData.facultyPi,
          studentTeam: team,
        });
      }
      setShowAdoptModal(false);
      triggerFlash("Challenge successfully adopted as University R&D Project!");
    } catch (err) {
      alert(err.message || "Failed to submit adoption");
    } finally {
      setAdoptLoading(false);
    }
  };

  const handlePledgeForm = async (e) => {
    e.preventDefault();
    setPledgeLoading(true);
    try {
      if (onPledgeSubmit) {
        await onPledgeSubmit({
          orgName: pledgeData.orgName,
          resourceType: pledgeData.resourceType,
          amount: pledgeData.amount,
          pledgeDetails: pledgeData.pledgeDetails,
        });
      }
      setShowPledgeModal(false);
      triggerFlash("CSR Support & Resources successfully pledged!");
    } catch (err) {
      alert(err.message || "Failed to submit pledge");
    } finally {
      setPledgeLoading(false);
    }
  };

  const handlePriForm = async (e) => {
    e.preventDefault();
    setPriLoading(true);
    try {
      if (onPriValidateSubmit) {
        await onPriValidateSubmit({
          isGenuine: priData.isGenuine,
          verifierName: priData.verifierName,
          observedPopulation: priData.observedPopulation,
          groundCondition: priData.groundCondition,
          baselineData: { metricSummary: priData.baselineMetric },
          remarks: priData.remarks,
        });
      }
      setShowPriModal(false);
      triggerFlash("Ground truth verified & baseline metrics officially registered!");
    } catch (err) {
      alert(err.message || "Failed to submit PRI verification");
    } finally {
      setPriLoading(false);
    }
  };

  return (
    <section className="quad-action-bar-container">
      {/* Top Header: Title & Pitch Stakeholder Simulator Switcher */}
      <div className="quad-bar-top">
        <div className="quad-title-group">
          <div className="quad-helix-icon-badge">
            <Layers size={18} />
          </div>
          <div>
            <div className="quad-tag-line">
              <span>QUAD-HELIX COLLABORATION HUB</span>
              <span className="live-pitch-pill">Interactive Live Pitch Differentiator</span>
            </div>
            <h3 className="quad-main-title">Interactive Stakeholder Action Bar</h3>
            <p className="quad-subtext">
              Demonstrates real-time Quad-Helix actions for <strong>University</strong>, <strong>Industry CSR</strong>, <strong>Citizens</strong>, and <strong>PRI Local Bodies</strong>.
            </p>
          </div>
        </div>

        {/* Stakeholder Perspective Switcher */}
        <div className="stakeholder-switch-group">
          <span className="switch-label">View Perspective:</span>
          <div className="stakeholder-pills-row">
            {STAKEHOLDER_ROLES.map((st) => {
              const IconComp = st.icon;
              const isActive = activeStakeholder === st.id;
              return (
                <button
                  key={st.id}
                  type="button"
                  className={`stakeholder-pill ${isActive ? "active" : ""}`}
                  style={{
                    "--st-color": st.accentColor,
                    "--st-bg": st.bgLight,
                  }}
                  onClick={() => setActiveStakeholder(st.id)}
                >
                  <IconComp size={15} />
                  <span>{st.shortLabel}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {flashMsg && (
        <div className="quad-flash-banner">
          <CheckCircle2 size={18} />
          <span>{flashMsg}</span>
        </div>
      )}

      {/* Dynamic Action Surface Based on Active Stakeholder */}
      <div className={`quad-active-surface theme-${activeStakeholder}`}>
        {/* ============================================================
            1. UNIVERSITY / FACULTY / STUDENT
        ============================================================ */}
        {activeStakeholder === "university" && (
          <div className="stakeholder-view university-view">
            <div className="view-content-left">
              <div className="stakeholder-badge university">
                <GraduationCap size={16} />
                <span>Academic R&D / Student Capstone Portal</span>
              </div>
              <h4 className="action-headline">
                Deploy Student Engineering Teams & Faculty Mentors
              </h4>
              <p className="action-description">
                Institutions (BIT Mesra, BAU, IIT ISM, NIT) can adopt this civic challenge as a funded final-year capstone, prototyping a working solution in campus laboratories.
              </p>

              {problem?.adoption?.isAdopted ? (
                <div className="adopted-summary-box">
                  <div className="adopted-check">
                    <CheckCircle2 size={16} color="#059669" />
                    <strong>Currently Adopted by {problem.adoption.orgName || "University Team"}</strong>
                  </div>
                  <div className="adopted-details">
                    <span><strong>Faculty Mentor:</strong> {problem.adoption.facultyPi || "Prof. Rajiv Ranjan"}</span>
                    {problem.adoption.studentTeam?.length > 0 && (
                      <span><strong>Student Team:</strong> {problem.adoption.studentTeam.join(", ")}</span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="adoption-open-chip">
                  ✨ Open for Academic R&D Adoption & Capstone Allocation
                </div>
              )}
            </div>

            <div className="view-action-right">
              <button
                type="button"
                className="stakeholder-cta-btn university"
                onClick={() => setShowAdoptModal(true)}
              >
                <span>🚀 Adopt as Student R&D / Capstone Project</span>
                <ArrowRight size={17} />
              </button>
              <span className="cta-helper-text">
                Assigns Faculty Mentor + Student Team to build a working prototype
              </span>
            </div>
          </div>
        )}

        {/* ============================================================
            2. INDUSTRY / CORPORATE (e.g. Tata Steel CSR)
        ============================================================ */}
        {activeStakeholder === "industry" && (
          <div className="stakeholder-view industry-view">
            <div className="view-content-left">
              <div className="stakeholder-badge industry">
                <Building2 size={16} />
                <span>Corporate CSR & Technology Sponsorship</span>
              </div>
              <h4 className="action-headline">
                Pledge CSR Grants, Hardware Kits & Technical Mentorship
              </h4>
              <p className="action-description">
                Enterprises and CSR foundations (e.g. Tata Steel CSR, Jharkhand CleanTech) can sponsor ₹2.5 Lakhs funding, IoT telemetry sensors, 3D printing equipment, and industrial mentors.
              </p>

              {problem?.pledges && problem.pledges.length > 0 ? (
                <div className="pledges-summary-list">
                  <span className="pledge-count-badge">
                    ✓ {problem.pledges.length} Active Industry Pledge(s)
                  </span>
                  {problem.pledges.map((pl, i) => (
                    <div key={i} className="pledge-chip-item">
                      <strong>{pl.orgName}:</strong> {pl.resourceType}
                      {pl.amount ? ` (₹${Number(pl.amount).toLocaleString("en-IN")})` : ""}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="industry-open-chip">
                  💼 Seeking CSR Hardware & Funding Sponsorship (e.g. ₹2.5 Lakhs)
                </div>
              )}
            </div>

            <div className="view-action-right">
              <button
                type="button"
                className="stakeholder-cta-btn industry"
                onClick={() => setShowPledgeModal(true)}
              >
                <span>💼 Pledge CSR Support / Mentorship</span>
                <ArrowRight size={17} />
              </button>
              <span className="cta-helper-text">
                Pledge funding (e.g. ₹2.5 Lakhs), IoT sensors, or engineering mentorship
              </span>
            </div>
          </div>
        )}

        {/* ============================================================
            3. CITIZEN COMMUNITY
        ============================================================ */}
        {activeStakeholder === "citizen" && (
          <div className="stakeholder-view citizen-view">
            <div className="view-content-left">
              <div className="stakeholder-badge citizen">
                <Users size={16} />
                <span>Citizen Endorsement & Crowdsourced Validation</span>
              </div>
              <h4 className="action-headline">
                Crowdsourced Grievance Validation: &quot;I Am Also Affected&quot;
              </h4>
              <p className="action-description">
                When local community members endorse this issue, its priority score elevates on the state dashboard, expediting university adoption and PRI physical inspection.
              </p>

              <div className="citizen-counter-display">
                <div className="counter-number">{upvoteCount}</div>
                <div className="counter-text">
                  <strong>Citizens Affected</strong>
                  <span>Crowdsourced community weight verified on ground</span>
                </div>
              </div>
            </div>

            <div className="view-action-right">
              <button
                type="button"
                className={`stakeholder-cta-btn citizen ${hasUpvoted ? "has-upvoted" : ""}`}
                onClick={onUpvote}
                disabled={isUpvoting}
              >
                <ThumbsUp size={18} fill={hasUpvoted ? "currentColor" : "none"} />
                <span>
                  {hasUpvoted ? "✓ Endorsed by You" : '👍 Community Upvote ("I Am Also Affected")'}
                </span>
              </button>
              <span className="cta-helper-text">
                Adds community weight and crowdsourced validation to the issue
              </span>
            </div>
          </div>
        )}

        {/* ============================================================
            4. PRI / LOCAL BODY
        ============================================================ */}
        {activeStakeholder === "pri" && (
          <div className="stakeholder-view pri-view">
            <div className="view-content-left">
              <div className="stakeholder-badge pri">
                <ShieldCheck size={16} />
                <span>Panchayati Raj Institution (PRI) / ULB Ground Inspection</span>
              </div>
              <h4 className="action-headline">
                Verify Ground Truth & Add Baseline Metrics
              </h4>
              <p className="action-description">
                Gram Panchayat Mukhiyas and Urban Municipal Officers conduct physical inspections to confirm genuineness and record baseline data (e.g. Fluoride: 2.4 PPM, Turbidity, Silt Depth).
              </p>

              {problem?.priVerification?.isGenuine ? (
                <div className="pri-verified-badge-box">
                  <div className="pri-verified-top">
                    <CheckCircle2 size={16} color="#7c3aed" />
                    <strong>Ground Truth Verified by {problem.priVerification.verifierName || "Local PRI Officer"}</strong>
                  </div>
                  {problem.priVerification.groundCondition && (
                    <p className="pri-verified-desc">
                      &quot;{problem.priVerification.groundCondition}&quot;
                    </p>
                  )}
                </div>
              ) : (
                <div className="pri-pending-chip">
                  📋 Pending Official Ground Truth Inspection & Baseline Metric Logging
                </div>
              )}
            </div>

            <div className="view-action-right">
              <button
                type="button"
                className="stakeholder-cta-btn pri"
                onClick={() => setShowPriModal(true)}
              >
                <FileCheck2 size={18} />
                <span>📋 Verify Ground Truth & Add Baseline Metrics</span>
              </button>
              <span className="cta-helper-text">
                Certifies ground inspection and records baseline chemical/physical parameters
              </span>
            </div>
          </div>
        )}
      </div>

      {/* ============================================================
          MODAL 1: ADOPT AS STUDENT R&D / CAPSTONE PROJECT
      ============================================================ */}
      {showAdoptModal && (
        <div className="quad-modal-backdrop" onClick={() => setShowAdoptModal(false)}>
          <div className="quad-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="quad-modal-header university">
              <div className="modal-title-with-icon">
                <div className="modal-badge-icon university">
                  <GraduationCap size={22} />
                </div>
                <div>
                  <h3>Adopt as Student R&D / Capstone Project</h3>
                  <p>Assign Faculty Mentor + Student Engineering Team</p>
                </div>
              </div>
              <button
                type="button"
                className="quad-modal-close"
                onClick={() => setShowAdoptModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAdoptForm} className="quad-modal-form">
              <div className="quad-form-field">
                <label>R&D Project Title *</label>
                <input
                  type="text"
                  value={adoptData.projectTitle}
                  onChange={(e) => setAdoptData({ ...adoptData, projectTitle: e.target.value })}
                  placeholder="e.g. Jal-Shuddhi: Solar Fluoride Adsorption Plant"
                  required
                />
              </div>

              <div className="quad-form-field">
                <label>Faculty Mentor / Principal Investigator (PI) *</label>
                <input
                  type="text"
                  value={adoptData.facultyPi}
                  onChange={(e) => setAdoptData({ ...adoptData, facultyPi: e.target.value })}
                  placeholder="e.g. Dr. Priya Ranjan (Dept of Chemical Engineering, BIT Mesra)"
                  required
                />
              </div>

              <div className="quad-form-field">
                <label>Student Research Team Members (Comma-separated) *</label>
                <input
                  type="text"
                  value={adoptData.studentTeam}
                  onChange={(e) => setAdoptData({ ...adoptData, studentTeam: e.target.value })}
                  placeholder="e.g. Rahul Verma (Lead), Priya Soren, Aman Tirkey"
                  required
                />
              </div>

              <div className="quad-info-callout">
                <Sparkles size={16} color="#2563eb" />
                <span>
                  Adopting moves this challenge to <strong>TRL Level 2 (University Adopted)</strong> and opens student access to state incubation grants.
                </span>
              </div>

              <div className="quad-modal-actions">
                <button
                  type="button"
                  className="quad-btn-cancel"
                  onClick={() => setShowAdoptModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={adoptLoading}
                  className="quad-btn-confirm university"
                >
                  <GraduationCap size={16} />
                  {adoptLoading ? "Assigning Team..." : "Confirm R&D Project Adoption"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================
          MODAL 2: PLEDGE CSR SUPPORT / MENTORSHIP
      ============================================================ */}
      {showPledgeModal && (
        <div className="quad-modal-backdrop" onClick={() => setShowPledgeModal(false)}>
          <div className="quad-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="quad-modal-header industry">
              <div className="modal-title-with-icon">
                <div className="modal-badge-icon industry">
                  <Building2 size={22} />
                </div>
                <div>
                  <h3>Pledge Industry CSR Support & Mentorship</h3>
                  <p>Commit funding, IoT hardware, or corporate engineering mentors</p>
                </div>
              </div>
              <button
                type="button"
                className="quad-modal-close"
                onClick={() => setShowPledgeModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handlePledgeForm} className="quad-modal-form">
              <div className="quad-form-field">
                <label>Company / CSR Foundation Name *</label>
                <input
                  type="text"
                  value={pledgeData.orgName}
                  onChange={(e) => setPledgeData({ ...pledgeData, orgName: e.target.value })}
                  placeholder="e.g. Tata Steel Foundation / Jharkhand CleanTech"
                  required
                />
              </div>

              <div className="quad-form-row">
                <div className="quad-form-field">
                  <label>Pledge Type *</label>
                  <select
                    value={pledgeData.resourceType}
                    onChange={(e) => setPledgeData({ ...pledgeData, resourceType: e.target.value })}
                  >
                    <option value="Funding">CSR Grant Funding (₹)</option>
                    <option value="Hardware">Hardware (IoT Sensors, 3D Printing)</option>
                    <option value="Technical Mentorship">Corporate Engineering Mentorship</option>
                    <option value="Pilot Testing Site">Industrial Pilot Testing Facility</option>
                  </select>
                </div>

                <div className="quad-form-field">
                  <label>Pledge Value / Amount (₹)</label>
                  <input
                    type="number"
                    value={pledgeData.amount}
                    onChange={(e) => setPledgeData({ ...pledgeData, amount: e.target.value })}
                    placeholder="250000"
                  />
                </div>
              </div>

              {/* Quick Select Buttons */}
              <div className="quick-pledge-row">
                <span className="quick-label">Quick Pledges:</span>
                {[
                  { label: "₹1 Lakh (Seed)", val: "100000" },
                  { label: "₹2.5 Lakhs (Hardware & Pilot)", val: "250000" },
                  { label: "₹5 Lakhs (Full Plant)", val: "500000" },
                ].map((qp, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="quick-pledge-btn"
                    onClick={() => setPledgeData({ ...pledgeData, amount: qp.val })}
                  >
                    {qp.label}
                  </button>
                ))}
              </div>

              <div className="quad-form-field">
                <label>Pledge Commitment Scope & Specifications *</label>
                <textarea
                  rows="3"
                  value={pledgeData.pledgeDetails}
                  onChange={(e) => setPledgeData({ ...pledgeData, pledgeDetails: e.target.value })}
                  placeholder="e.g. Pledging ₹2.5 Lakhs grant funding and specialized IoT water sensor kits for pilot deployment."
                  required
                />
              </div>

              <div className="quad-modal-actions">
                <button
                  type="button"
                  className="quad-btn-cancel"
                  onClick={() => setShowPledgeModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={pledgeLoading}
                  className="quad-btn-confirm industry"
                >
                  <DollarSign size={16} />
                  {pledgeLoading ? "Registering..." : "Confirm CSR Resource Pledge"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================
          MODAL 3: VERIFY GROUND TRUTH & ADD BASELINE METRICS (PRI)
      ============================================================ */}
      {showPriModal && (
        <div className="quad-modal-backdrop" onClick={() => setShowPriModal(false)}>
          <div className="quad-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="quad-modal-header pri">
              <div className="modal-title-with-icon">
                <div className="modal-badge-icon pri">
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <h3>Verify Ground Truth & Add Baseline Metrics</h3>
                  <p>Local Panchayati Raj / Urban Body Inspection</p>
                </div>
              </div>
              <button
                type="button"
                className="quad-modal-close"
                onClick={() => setShowPriModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handlePriForm} className="quad-modal-form">
              <div className="quad-form-row">
                <div className="quad-form-field">
                  <label>Inspected By / Officer Name *</label>
                  <input
                    type="text"
                    value={priData.verifierName}
                    onChange={(e) => setPriData({ ...priData, verifierName: e.target.value })}
                    placeholder="e.g. Mukhiya Sanjay Oraon"
                    required
                  />
                </div>

                <div className="quad-form-field">
                  <label>Observed Affected Citizens</label>
                  <input
                    type="number"
                    value={priData.observedPopulation}
                    onChange={(e) => setPriData({ ...priData, observedPopulation: e.target.value })}
                    placeholder="1250"
                  />
                </div>
              </div>

              <div className="quad-form-field">
                <label>Baseline Technical Metrics *</label>
                <input
                  type="text"
                  value={priData.baselineMetric}
                  onChange={(e) => setPriData({ ...priData, baselineMetric: e.target.value })}
                  placeholder="e.g. Fluoride: 2.4 PPM, Turbidity: 18 NTU, Bacterial Pathogen: Positive"
                  required
                />
                <span className="field-hint">
                  Critical for measuring before/after impact outcome at TRL Level 5
                </span>
              </div>

              <div className="quad-form-field">
                <label>Ground Inspection Findings & Condition *</label>
                <textarea
                  rows="3"
                  value={priData.groundCondition}
                  onChange={(e) => setPriData({ ...priData, groundCondition: e.target.value })}
                  placeholder="Describe on-site verification, physical evidence inspected, and urgency..."
                  required
                />
              </div>

              <div className="quad-info-callout" style={{ background: "#faf5ff", borderColor: "#e9d5ff" }}>
                <CheckCircle2 size={16} color="#7c3aed" />
                <span style={{ color: "#581c87" }}>
                  Verifying ground truth advances this challenge to <strong>TRL Level 1 (Ground Verified)</strong> and queues it for University innovation matchmaking.
                </span>
              </div>

              <div className="quad-modal-actions">
                <button
                  type="button"
                  className="quad-btn-cancel"
                  onClick={() => setShowPriModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={priLoading}
                  className="quad-btn-confirm pri"
                >
                  <CheckCircle2 size={16} />
                  {priLoading ? "Recording Inspection..." : "Certify Ground Truth & Metrics"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
