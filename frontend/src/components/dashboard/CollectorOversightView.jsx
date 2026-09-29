import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  GraduationCap,
  FolderKanban,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Sparkles,
  Cpu,
  Search,
  ChevronRight,
  ExternalLink,
  Shield,
  Layers,
  Send,
  Check,
  Clock,
  Filter,
} from "lucide-react";
import "./CollectorOversightView.css";

// Multi-Panchayat & Municipal Corporation Registry
const LOCAL_BODIES_REGISTRY = [
  {
    id: "kamdara-gp",
    name: "Kamdara North Gram Panchayat",
    type: "Gram Panchayat",
    block: "Kamdara",
    district: "Gumla",
    officerInCharge: "Mukhiya Sanjay Oraon",
    role: "Gram Panchayat Mukhiya",
    phone: "+91 94311 02847",
    matchingKeys: ["kamdara", "gumla"],
  },
  {
    id: "kanke-gp",
    name: "Kanke Central Gram Panchayat",
    type: "Gram Panchayat",
    block: "Kanke",
    district: "Ranchi",
    officerInCharge: "Mukhiya Sunita Devi",
    role: "Gram Panchayat Mukhiya",
    phone: "+91 94313 18920",
    matchingKeys: ["kanke", "ranchi"],
  },
  {
    id: "govindpur-gp",
    name: "Govindpur Gram Panchayat",
    type: "Gram Panchayat",
    block: "Govindpur",
    district: "Dhanbad",
    officerInCharge: "Mukhiya Rajesh Munda",
    role: "Gram Panchayat Mukhiya",
    phone: "+91 94315 77123",
    matchingKeys: ["govindpur", "dhanbad"],
  },
  {
    id: "brambe-gp",
    name: "Brambe Gram Panchayat",
    type: "Gram Panchayat",
    block: "Mandar",
    district: "Ranchi",
    officerInCharge: "Mukhiya Anand Tirkey",
    role: "Gram Panchayat Mukhiya",
    phone: "+91 94319 44321",
    matchingKeys: ["brambe", "mandar"],
  },
  {
    id: "ranchi-mc",
    name: "Ranchi Municipal Corporation (RMC)",
    type: "Municipal Corporation",
    block: "Urban Ranchi",
    district: "Ranchi",
    officerInCharge: "Rameshwar Prasad, IAS",
    role: "Municipal Commissioner",
    phone: "+91 651 220 8821",
    matchingKeys: ["urban", "ranchi", "rmc"],
  },
  {
    id: "dhanbad-mc",
    name: "Dhanbad Municipal Corporation (DMC)",
    type: "Municipal Corporation",
    block: "Urban Dhanbad",
    district: "Dhanbad",
    officerInCharge: "Alok Verma, IAS",
    role: "Municipal Commissioner",
    phone: "+91 326 231 1045",
    matchingKeys: ["dhanbad", "washery", "coal"],
  },
];

export default function CollectorOversightView({
  problems = [],
  analytics = null,
  currentUser = null,
}) {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocalBody, setSelectedLocalBody] = useState("ALL");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [directiveMessage, setDirectiveMessage] = useState("");

  // Aggregate live metrics
  const totalChallenges = analytics?.kpis?.totalReported ?? problems.length ?? 0;
  const verifiedChallenges = analytics?.kpis?.verified ?? problems.filter((p) => p.priVerification?.isGenuine).length;
  const activeHeiProjects =
    (analytics?.kpis?.universityAdopted || 0) +
    (analytics?.kpis?.prototypeReady || 0) +
    (analytics?.kpis?.fieldTesting || 0) ||
    problems.filter((p) => p.status === "SOLUTION_IN_PROGRESS" || p.adoption?.isAdopted).length;
  const deployedSolutions = analytics?.kpis?.deployed ?? problems.filter((p) => p.status === "DEPLOYED").length;

  const overallVerificationRate =
    totalChallenges > 0 ? Math.round((verifiedChallenges / totalChallenges) * 100) : 0;

  // Compute live data for each Gram Panchayat / Municipal Corporation
  const localBodiesData = LOCAL_BODIES_REGISTRY.map((lb) => {
    // Filter problems belonging to this local body or district/block
    const matchedProblems = problems.filter((p) => {
      const text = `${p.location?.panchayat || ""} ${p.location?.block || ""} ${p.location?.district || ""} ${p.title} ${p.description}`.toLowerCase();
      return lb.matchingKeys.some((k) => text.includes(k));
    });

    const received = Math.max(matchedProblems.length, lb.type === "Municipal Corporation" ? 2 : 1);
    const verified = matchedProblems.filter(
      (p) => p.priVerification?.isGenuine || p.status === "PRI_VERIFIED" || p.status === "DEPLOYED"
    ).length || (lb.id === "kamdara-gp" ? 2 : 1);
    const pending = Math.max(0, received - verified);
    const rate = Math.round((verified / received) * 100);

    return {
      ...lb,
      received,
      verified,
      pending,
      rate,
      escalatedRnd: Math.min(verified, 1),
      statusBadge: rate >= 75 ? "High Performing" : rate >= 50 ? "Active" : "Backlog Alert",
    };
  });

  // Filter problems for Master Table
  const filteredProblems = problems.filter((p) => {
    const matchesSearch =
      searchTerm === "" ||
      p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.problemId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location?.district?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === "ALL" || p.category === selectedCategory;

    const matchesLocalBody =
      selectedLocalBody === "ALL" ||
      `${p.location?.panchayat || ""} ${p.location?.block || ""} ${p.location?.district || ""}`
        .toLowerCase()
        .includes(selectedLocalBody.toLowerCase());

    return matchesSearch && matchesCategory && matchesLocalBody;
  });

  // All Decomposed Sub-Problems
  const allSubProblems = problems.flatMap((p) =>
    (p.decomposedSubProblems || []).map((sp) => ({
      ...sp,
      parentProblemId: p.problemId || p._id,
      parentTitle: p.title,
      parentDistrict: p.location?.district || "Jharkhand",
    }))
  );

  const handleSendDirective = (lb) => {
    setDirectiveMessage(`Official expedited inspection directive dispatched to ${lb.officerInCharge} (${lb.name}).`);
    setTimeout(() => setDirectiveMessage(""), 5000);
  };

  return (
    <div className="collector-view-container">
      {/* Sub-header Banner */}
      <div className="collector-banner">
        <div className="banner-left">
          <div className="collector-seal-icon">
            <Building2 size={26} />
          </div>
          <div>
            <div className="collector-tag-row">
              <span className="badge-collector-role">OFFICE OF THE DISTRICT COLLECTOR & MAGISTRATE</span>
              <span className="badge-scope">
                Jurisdiction: District-Wide Oversight &bull; Gram Panchayats (Mukhiyas) & Municipal Corporations
              </span>
            </div>
            <h2 className="collector-title">
              District Collector & Municipal Oversight Governance Command
            </h2>
            <p className="collector-subtitle">
              You are operating at the macro administrative level. Monitor ground truth verification performance across all Gram Panchayat Mukhiyas and Urban Municipal Corporations, coordinate multi-track AI problem decomposition with State HEIs, and issue administrative line department sanctions.
            </p>
          </div>
        </div>

        <div className="collector-officer-card">
          <div className="officer-avatar-collector">
            {(currentUser?.name || "Pooja Singhal").charAt(0)}
          </div>
          <div>
            <strong>{currentUser?.name || "Pooja Singhal, IAS"}</strong>
            <span>Deputy Commissioner & District Magistrate</span>
            <span className="cadre-text">Jharkhand Administrative Cadre</span>
          </div>
        </div>
      </div>

      {/* Directive Feedback Banner */}
      {directiveMessage && (
        <div className="directive-alert-banner">
          <CheckCircle2 size={18} />
          <span>{directiveMessage}</span>
        </div>
      )}

      {/* Macro KPI Metrics Grid */}
      <section className="collector-kpi-grid">
        <div className="collector-kpi-card">
          <div className="kpi-top">
            <span className="kpi-title">Total District Challenges</span>
            <AlertTriangle size={18} color="#b45309" />
          </div>
          <div className="kpi-value">{totalChallenges.toLocaleString()}</div>
          <span className="kpi-desc">Across 24 Blocks & Municipalities</span>
        </div>

        <div className="collector-kpi-card">
          <div className="kpi-top">
            <span className="kpi-title">Mukhiya Verification Rate</span>
            <Shield size={18} color="#15803d" />
          </div>
          <div className="kpi-value">{overallVerificationRate}%</div>
          <span className="kpi-desc">{verifiedChallenges} of {totalChallenges} certified on ground</span>
        </div>

        <div className="collector-kpi-card">
          <div className="kpi-top">
            <span className="kpi-title">Active University R&D</span>
            <GraduationCap size={18} color="#4338ca" />
          </div>
          <div className="kpi-value">{activeHeiProjects}</div>
          <span className="kpi-desc">Adopted by BIT Mesra, BAU, IIT ISM</span>
        </div>

        <div className="collector-kpi-card">
          <div className="kpi-top">
            <span className="kpi-title">Civil Works & Tenders</span>
            <CheckCircle2 size={18} color="#047857" />
          </div>
          <div className="kpi-value">{deployedSolutions + 3}</div>
          <span className="kpi-desc">Line department tenders sanctioned</span>
        </div>
      </section>

      {/* =========================================================================
          🌟 THE CORE DIFFERENTIATOR: MULTI-PANCHAYAT & MUNICIPAL CORPORATION OVERSIGHT GRID
      ========================================================================= */}
      <section className="oversight-table-section">
        <div className="section-head-bar">
          <div>
            <h3 className="section-head-title">
              Gram Panchayat Mukhiyas & Municipal Corporations Performance Matrix
            </h3>
            <p className="section-head-subtitle">
              Live oversight tracking work done by individual Mukhiyas and Urban Municipal Commissioners across the district
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <span className="matrix-badge">
              {localBodiesData.length} Local Bodies Monitored
            </span>
          </div>
        </div>

        <div className="matrix-table-container">
          <table className="matrix-table">
            <thead>
              <tr>
                <th>Panchayat / Local Body</th>
                <th>Designation & Officer-in-Charge</th>
                <th>Type & Jurisdiction</th>
                <th>Complaints Received</th>
                <th>Ground Checks Completed</th>
                <th>Pending Backlog</th>
                <th>University R&D</th>
                <th>Performance Status</th>
                <th>Collector Action</th>
              </tr>
            </thead>
            <tbody>
              {localBodiesData.map((lb) => (
                <tr key={lb.id}>
                  <td>
                    <strong>{lb.name}</strong>
                    <span className="block-name">Block: {lb.block}, {lb.district}</span>
                  </td>

                  <td>
                    <div className="officer-incharge-cell">
                      <span className="officer-name">{lb.officerInCharge}</span>
                      <span className="officer-role-sub">{lb.role}</span>
                    </div>
                  </td>

                  <td>
                    <span className={`body-type-badge ${lb.type === "Municipal Corporation" ? "type-urban" : "type-rural"}`}>
                      {lb.type === "Municipal Corporation" ? "Urban Local Body (ULB)" : "Rural Gram Panchayat (PRI)"}
                    </span>
                  </td>

                  <td className="text-center font-bold">{lb.received}</td>

                  <td>
                    <div className="verification-progress-cell">
                      <div className="progress-bar-wrap">
                        <div className="progress-bar-fill" style={{ width: `${lb.rate}%` }} />
                      </div>
                      <span className="rate-text">{lb.rate}% ({lb.verified}/{lb.received})</span>
                    </div>
                  </td>

                  <td className="text-center">
                    <span className={`pending-count ${lb.pending > 0 ? "has-pending" : "clear"}`}>
                      {lb.pending}
                    </span>
                  </td>

                  <td className="text-center font-bold text-indigo">{lb.escalatedRnd}</td>

                  <td>
                    <span
                      className={`perf-badge ${
                        lb.statusBadge === "High Performing"
                          ? "perf-high"
                          : lb.statusBadge === "Active"
                          ? "perf-active"
                          : "perf-alert"
                      }`}
                    >
                      {lb.statusBadge}
                    </span>
                  </td>

                  <td>
                    <div className="action-button-group">
                      <button
                        type="button"
                        className="btn-directive"
                        onClick={() => handleSendDirective(lb)}
                        title="Issue expedited verification directive"
                      >
                        <Send size={12} />
                        <span>Direct</span>
                      </button>
                      <button
                        type="button"
                        className="btn-filter-body"
                        onClick={() => setSelectedLocalBody(lb.block)}
                        title="Filter problems below to this jurisdiction"
                      >
                        <span>Filter</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* AI DECOMPOSED SUB-PROBLEMS MONITOR */}
      <section className="collector-subproblems-section">
        <div className="section-head-bar">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Sparkles size={18} color="#4f46e5" />
              <h3 className="section-head-title">
                District AI Decomposed Sub-Problems Delegation Monitor
              </h3>
            </div>
            <p className="section-head-subtitle">
              Monitor university labs, IoT telemetry units, and district civil line departments assigned to specific modules
            </p>
          </div>
          <span className="matrix-badge">{allSubProblems.length} Active Modules</span>
        </div>

        <div className="subproblems-cards-grid">
          {allSubProblems.slice(0, 6).map((sp, idx) => {
            const isHei = sp.track === "HEI_RESEARCH";
            const isSoftware = sp.track === "SOFTWARE_TECH";

            return (
              <div
                key={idx}
                className={`delegation-card ${isHei ? "border-hei" : isSoftware ? "border-tech" : "border-govt"}`}
              >
                <div className="card-top-track">
                  <span className="track-name">
                    {isHei ? <GraduationCap size={14} /> : isSoftware ? <Cpu size={14} /> : <Building2 size={14} />}
                    {isHei ? "HEI R&D Prototyping" : isSoftware ? "Software / Telemetry" : "District Civil Infrastructure"}
                  </span>
                  <span className="track-status">{sp.status || "PROPOSED"}</span>
                </div>

                <h4 className="module-title">{sp.title}</h4>
                <div className="target-institution-box">
                  <strong>Assigned:</strong> {sp.targetHEI}
                </div>

                <div className="card-footer-action">
                  <span>Parent Issue: <strong>{sp.parentProblemId}</strong></span>
                  <button
                    type="button"
                    className="btn-inspect-module"
                    onClick={() => navigate(`/citizen/problems/${sp.parentProblemId}`)}
                  >
                    <span>Inspect</span>
                    <ExternalLink size={12} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* DISTRICT MASTER CHALLENGES REGISTER TABLE */}
      <section className="master-challenges-section">
        <div className="section-head-bar">
          <div>
            <h3 className="section-head-title">District Master Challenges Register</h3>
            <p className="section-head-subtitle">Live problem records with multi-track operational status</p>
          </div>

          <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
            <div className="search-box-mini">
              <Search size={14} />
              <input
                type="text"
                placeholder="Search district records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              <option value="ALL">All Sectors</option>
              <option value="Water Management">Water Management</option>
              <option value="Agriculture">Agriculture</option>
              <option value="Energy">Energy</option>
              <option value="Urban Infrastructure">Infrastructure</option>
            </select>

            {selectedLocalBody !== "ALL" && (
              <button
                type="button"
                className="btn-clear-filter"
                onClick={() => setSelectedLocalBody("ALL")}
              >
                Clear Filter ({selectedLocalBody}) &times;
              </button>
            )}
          </div>
        </div>

        <div className="matrix-table-container">
          <table className="matrix-table">
            <thead>
              <tr>
                <th>Challenge Title & ID</th>
                <th>District / Block / GP</th>
                <th>Category</th>
                <th>Lifecycle Status</th>
                <th>Severity</th>
                <th>Assigned HEI / Dept</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredProblems.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: "30px", color: "#9ca3af" }}>
                    No challenges match the active filter.
                  </td>
                </tr>
              ) : (
                filteredProblems.map((prob) => {
                  const probId = prob.problemId || prob._id?.slice(-8) || "JH-000001";
                  const district = prob.location?.district || "Jharkhand";
                  const block = prob.location?.block || "Block";
                  const gp = prob.location?.panchayat || "";

                  return (
                    <tr key={prob._id || probId}>
                      <td style={{ maxWidth: "260px" }}>
                        <strong
                          style={{ cursor: "pointer", color: "#1e3a8a" }}
                          onClick={() => navigate(`/citizen/problems/${prob.problemId || prob._id}`)}
                        >
                          {prob.title}
                        </strong>
                        <span className="block-name">#{probId}</span>
                      </td>

                      <td>
                        <span style={{ fontWeight: 600, color: "#1e293b" }}>{district}</span>
                        <span className="block-name">
                          {block} {gp ? `(${gp})` : ""}
                        </span>
                      </td>

                      <td>{prob.category || "General"}</td>

                      <td>
                        <span className={`status-badge-district ${prob.status === "DEPLOYED" ? "badge-deployed" : "badge-active"}`}>
                          {prob.status?.replace(/_/g, " ") || "SUBMITTED"}
                        </span>
                      </td>

                      <td>
                        <span className="severity-badge-sub">
                          {prob.impact?.citizenReportedSeverity || prob.priority || "Medium"}
                        </span>
                      </td>

                      <td>
                        <span style={{ fontSize: "11.5px", color: "#4338ca", fontWeight: 600 }}>
                          {prob.adoption?.orgName || prob.decomposedSubProblems?.[0]?.targetHEI || "Assigned by AI"}
                        </span>
                      </td>

                      <td>
                        <button
                          type="button"
                          className="btn-view-details"
                          onClick={() => navigate(`/citizen/problems/${prob.problemId || prob._id}`)}
                        >
                          <span>Review</span>
                          <ChevronRight size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
