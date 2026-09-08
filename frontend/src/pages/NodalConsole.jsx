import { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import {
  Layers,
  Sparkles,
  GitBranch,
  Cpu,
  Building2,
  CheckCircle2,
  Send,
  Flame,
  ArrowRight,
  ShieldAlert,
  Edit3,
  Award
} from 'lucide-react';

export default function NodalConsole() {
  const [problem, setProblem] = useState(null);
  const [subProblems, setSubProblems] = useState([]);
  const [matches, setMatches] = useState([]);
  const [selectedSubProblem, setSelectedSubProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionSuccess, setActionSuccess] = useState('');

  // Human AI Override state
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [overrideDomain, setOverrideDomain] = useState('water_resources');
  const [overrideNodalOrgId, setOverrideNodalOrgId] = useState('org-bau');
  const [overrideReason, setOverrideReason] = useState('BAU Ranchi possesses specialized hydrology labs and soil water testing capabilities in Gumla.');

  // Hybrid Synthesis state
  const [synthesisReason, setSynthesisReason] = useState('Combining BIT Mesra thin-film electrochemical sensor probe (Team A) with Jalshakti IoT solar telemetry unit (Startup B) provides maximum technical feasibility and lowest unit cost.');

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.getProblems();
      if (res.success && res.problems.length > 0) {
        const p = res.problems.find((x) => x.code === 'JH-WTR-2026-01') || res.problems[0];
        setProblem(p);

        // Check if decomposed sub-problems exist
        const spMatches = await api.getSubProblemMatches('sp-gumla-01').catch(() => null);
        if (spMatches && spMatches.success) {
          setMatches(spMatches.matches);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDecompose = async () => {
    if (!problem) return;
    try {
      const res = await api.decomposeProblem({ problemId: problem.id });
      if (res.success) {
        setSubProblems(res.subProblems);
        setSelectedSubProblem(res.subProblems[0]);
        setActionSuccess('Problem decomposed into 3 dependent sub-problems (DAG).');

        // Fetch matches for first sub-problem
        const matchRes = await api.getSubProblemMatches(res.subProblems[0].id);
        if (matchRes.success) setMatches(matchRes.matches);

        loadData();
      }
    } catch (err) {
      alert('Decomposition error: ' + err.message);
    }
  };

  const handleSelectSubProblem = async (sp) => {
    setSelectedSubProblem(sp);
    try {
      const matchRes = await api.getSubProblemMatches(sp.id);
      if (matchRes.success) setMatches(matchRes.matches);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePublishCfp = async () => {
    if (!problem) return;
    try {
      const res = await api.publishCfp({ problemId: problem.id });
      if (res.success) {
        setActionSuccess('Call for Proposals (CFP) officially published to matched institutions and startups.');
        loadData();
      }
    } catch (err) {
      alert('CFP Error: ' + err.message);
    }
  };

  const handleSynthesize = async () => {
    if (!problem) return;
    try {
      const res = await api.synthesizeSolution({
        problemId: problem.id,
        projectTitle: 'Smart Groundwater & Fluoride Mitigation System (Gumla)',
        synthesisReason,
        selectedProposals: [
          {
            id: 'prop-bit-01',
            organizationId: 'org-bit',
            organizationName: 'BIT Mesra Ranchi',
            leadUserId: 'usr-faculty-preeti',
            leadName: 'Dr. Preeti Sinha',
            assignedComponent: 'Electrochemical Fluoride Sensor Probe & Auto-Relay',
            budgetINR: 350000
          },
          {
            id: 'prop-jal-01',
            organizationId: 'org-jalshakti',
            organizationName: 'Jalshakti IoT Technologies (Startup)',
            leadUserId: 'usr-industry-rajesh',
            leadName: 'Rajesh Varma',
            assignedComponent: 'Solar LoRaWAN Telemetry Unit & Cloud Feed',
            budgetINR: 280000
          }
        ]
      });
      if (res.success) {
        setActionSuccess('Hybrid Multidisciplinary Project successfully synthesized and constituted!');
        loadData();
      }
    } catch (err) {
      alert('Synthesis error: ' + err.message);
    }
  };

  const handleAiOverride = async () => {
    try {
      const res = await api.aiOverride(problem.id, {
        newDomain: overrideDomain,
        newNodalOrgId: overrideNodalOrgId,
        overrideReason
      });
      if (res.success) {
        setActionSuccess('Human AI override recorded with mandatory justification in audit log.');
        setShowOverrideModal(false);
        loadData();
      }
    } catch (err) {
      alert('Override error: ' + err.message);
    }
  };

  return (
    <div className="view-container">
      <div className="view-header">
        <div>
          <span className="eyebrow">DOMAIN NODAL INSTITUTION CONSOLE</span>
          <h1>Domain Orchestration & Problem Decomposition</h1>
          <p className="header-description">
            Lead Domain HEIs validate AI classification, decompose Master Problems into dependent sub-components, match eligible research institutions, and synthesize hybrid solutions.
          </p>
        </div>
      </div>

      {actionSuccess && (
        <div className="alert-banner success">
          <CheckCircle2 size={18} />
          <span>{actionSuccess}</span>
        </div>
      )}

      {problem && (
        <>
          {/* AI Intake & Human Override Section */}
          <section className="dashboard-card nodal-intake-card">
            <div className="card-header">
              <div>
                <span className="status-badge progress-badge">{problem.status}</span>
                <h2>Master Problem: #{problem.code} &bull; {problem.title}</h2>
                <p className="location-pill">Assigned Domain: <strong>{problem.thematicDomain}</strong></p>
              </div>
              <button onClick={() => setShowOverrideModal(true)} className="btn-override">
                <Edit3 size={15} />
                <span>Human AI Override</span>
              </button>
            </div>

            {problem.humanOverride && (
              <div className="override-notice">
                <ShieldAlert size={16} />
                <span>
                  <strong>Manual Override by {problem.humanOverride.overriddenByName}:</strong> "{problem.humanOverride.reason}"
                </span>
              </div>
            )}

            <div className="action-strip">
              <button
                onClick={handleDecompose}
                disabled={problem.status !== 'NODAL_ASSIGNED' && problem.status !== 'PRI_VERIFIED'}
                className="btn-primary"
              >
                <GitBranch size={16} />
                <span>Decompose into 3 Sub-Problems (DAG)</span>
              </button>

              <button
                onClick={handlePublishCfp}
                className="btn-secondary"
              >
                <Send size={16} />
                <span>Publish Call for Proposals (CFP)</span>
              </button>

              <button
                onClick={handleSynthesize}
                className="btn-accent"
              >
                <Flame size={16} />
                <span>Synthesize Hybrid Solution (Team A + Team B)</span>
              </button>
            </div>
          </section>

          {/* Sub-Problem DAG & Decomposition Visualization */}
          <section className="dashboard-card dag-card">
            <div className="card-header">
              <div>
                <h2>Sub-Problem Directed Acyclic Graph (DAG)</h2>
                <p>Discrete technical components with required skill profiles and sequential dependencies.</p>
              </div>
            </div>

            <div className="dag-grid">
              <div
                className={`dag-node ${selectedSubProblem?.id === 'sp-gumla-01' ? 'selected' : ''}`}
                onClick={() => handleSelectSubProblem({ id: 'sp-gumla-01', title: 'Sub-Problem A: Low-Cost Fluoride Electrochemical Sensor', requiredDomain: 'urban_iot' })}
              >
                <div className="node-header">
                  <span className="node-tag">Sub-Problem A (Hardware)</span>
                  <span className="budget-tag">₹3.5 L</span>
                </div>
                <h3>Fluoride Electrochemical Sensor & Shutoff</h3>
                <p className="desc">Ion-selective electrochemical sensor (0.5 to 10.0 PPM) with automated relay.</p>
                <div className="node-footer">
                  <span className="depends-tag">Root Component (No Dependencies)</span>
                </div>
              </div>

              <div className="dag-arrow"><ArrowRight size={20} /></div>

              <div
                className={`dag-node ${selectedSubProblem?.id === 'sp-gumla-02' ? 'selected' : ''}`}
                onClick={() => handleSelectSubProblem({ id: 'sp-gumla-02', title: 'Sub-Problem B: Solar LoRaWAN Telemetry Unit', requiredDomain: 'urban_iot' })}
              >
                <div className="node-header">
                  <span className="node-tag">Sub-Problem B (IoT)</span>
                  <span className="budget-tag">₹2.8 L</span>
                </div>
                <h3>Solar LoRaWAN Telemetry Unit & Gateway</h3>
                <p className="desc">IP67 solar telemetry rig transmitting water level and fluoride readings over 15km.</p>
                <div className="node-footer">
                  <span className="depends-tag">Depends on: Sub-Problem A Specs</span>
                </div>
              </div>

              <div className="dag-arrow"><ArrowRight size={20} /></div>

              <div
                className={`dag-node ${selectedSubProblem?.id === 'sp-gumla-03' ? 'selected' : ''}`}
                onClick={() => handleSelectSubProblem({ id: 'sp-gumla-03', title: 'Sub-Problem C: Hydrological Recharge Model & PWA', requiredDomain: 'water_resources' })}
              >
                <div className="node-header">
                  <span className="node-tag">Sub-Problem C (Software)</span>
                  <span className="budget-tag">₹2.2 L</span>
                </div>
                <h3>Groundwater Depletion Model & Farmer PWA</h3>
                <p className="desc">Borewell recharge forecasting exposed via Hindi / Nagpuri community PWA.</p>
                <div className="node-footer">
                  <span className="depends-tag">Depends on: Sub-Problem B Telemetry</span>
                </div>
              </div>
            </div>
          </section>

          {/* 80-10-10 Recommendation Engine Results */}
          <section className="dashboard-card matching-card">
            <div className="card-header">
              <div>
                <h2>Normalized Recommendation Engine (80-10-10 Formula)</h2>
                <p>
                  Ranked institutional capability match: <strong>80% Skill Match + 10% Track Record + 10% Field Feasibility</strong>.
                </p>
              </div>
            </div>

            <div className="matches-list">
              {matches.map((item, idx) => (
                <div key={item.organizationId} className="match-card">
                  <div className="match-rank">#{idx + 1}</div>
                  <div className="match-body">
                    <div className="match-title-row">
                      <h3>{item.organizationName}</h3>
                      <span className="org-type-tag">{item.type.replace('_', ' ')}</span>
                      <span className="location-tag">{item.district}</span>
                    </div>

                    <div className="pci-breakdown-row">
                      <div className="score-badge">
                        <strong>{item.totalScore}%</strong>
                        <span>Compatibility</span>
                      </div>
                      <div className="factor-breakdown">
                        <span>Skill Match: {item.components.skillMatchScore}/100</span>
                        <span>Track Record: {item.components.trackRecordScore}/100</span>
                        <span>Field Feasibility: {item.components.fieldFeasibilityScore}/100</span>
                      </div>
                    </div>

                    <div className="reasons-list">
                      {item.reasons.map((r, i) => (
                        <span key={i} className="reason-pill">&bull; {r}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Hybrid Solution Synthesizer Studio */}
          <section className="dashboard-card synthesis-card">
            <div className="card-header">
              <div>
                <h2>Hybrid Solution Synthesizer</h2>
                <p>Nodal Director authority to combine complementary research and industrial capabilities into a single unified deployment.</p>
              </div>
            </div>

            <div className="synthesis-combination-box">
              <div className="combo-item">
                <Award size={18} />
                <div>
                  <strong>Team A: BIT Mesra (Dr. Preeti Sinha + Aryan Kumar)</strong>
                  <span>Thin-Film Electrochemical Fluoride Sensor Probe & Auto Shutoff</span>
                </div>
              </div>
              <span className="plus-sign">+</span>
              <div className="combo-item">
                <Building2 size={18} />
                <div>
                  <strong>Startup B: Jalshakti IoT Technologies (Rajesh Varma)</strong>
                  <span>Ruggedized Solar LoRaWAN Telemetry Enclosure & Cloud API</span>
                </div>
              </div>
            </div>

            <div className="synthesis-form">
              <label>State Audit Compliance Justification Reason *</label>
              <textarea
                rows={3}
                value={synthesisReason}
                onChange={(e) => setSynthesisReason(e.target.value)}
                placeholder="Explain why combining these institutions is optimal for technical and social outcomes..."
              />

              <button onClick={handleSynthesize} className="btn-execute-synthesis">
                <Flame size={17} />
                <span>Approve & Constitute Integrated Innovation Project</span>
              </button>
            </div>
          </section>
        </>
      )}

      {/* Human AI Override Modal */}
      {showOverrideModal && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <h3>Human AI Recommendation Override</h3>
            <p>Modify AI classification and assign alternate Nodal Lead with mandatory audit justification.</p>

            <div className="form-field">
              <label>Assigned Domain</label>
              <select value={overrideDomain} onChange={(e) => setOverrideDomain(e.target.value)}>
                <option value="water_resources">Water Resources & Quality Management</option>
                <option value="agriculture">Smart Agriculture & Soil Health</option>
                <option value="urban_iot">Urban Infrastructure, IoT & Energy</option>
                <option value="environment_mining">Environment & Mining Reclamation</option>
                <option value="healthcare">Rural Public Health & Sanitation</option>
              </select>
            </div>

            <div className="form-field">
              <label>Assigned Nodal Lead HEI</label>
              <select value={overrideNodalOrgId} onChange={(e) => setOverrideNodalOrgId(e.target.value)}>
                <option value="org-bau">Birsa Agricultural University (BAU Ranchi)</option>
                <option value="org-bit">BIT Mesra Ranchi</option>
                <option value="org-iit-ism">IIT (ISM) Dhanbad</option>
                <option value="org-aiims">AIIMS Deoghar</option>
              </select>
            </div>

            <div className="form-field">
              <label>Mandatory Justification Reason (Minimum 10 chars) *</label>
              <textarea
                rows={3}
                value={overrideReason}
                onChange={(e) => setOverrideReason(e.target.value)}
                required
              />
            </div>

            <div className="modal-actions">
              <button onClick={() => setShowOverrideModal(false)} className="btn-cancel">Cancel</button>
              <button onClick={handleAiOverride} className="btn-save">Confirm Override & Log to Audit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
