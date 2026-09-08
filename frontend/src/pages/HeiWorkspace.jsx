import { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import {
  Cpu,
  GraduationCap,
  Users,
  CheckCircle2,
  UploadCloud,
  FileCheck2,
  Calendar,
  Layers,
  Send,
  FileText
} from 'lucide-react';

export default function HeiWorkspace() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionSuccess, setActionSuccess] = useState('');
  const [milestoneProof, setMilestoneProof] = useState('https://example.com/gumla_lab_fluoride_calibration_report.pdf');

  // Proposal Submission state
  const [proposalData, setProposalData] = useState({
    title: 'Low-Cost Electrochemical Fluoride Sensor Probe with LoRaWAN Auto-Shutoff',
    abstract: 'Field-tested ion-selective electrode detecting fluoride from 0.5 to 10.0 PPM with integrated solar battery management for rural Jharkhand borewells.',
    budgetINR: 350000,
    timelineWeeks: 10,
    studentCredits: 4
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.getProjects();
      if (res.success) setProjects(res.projects);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmitProposal = async (e) => {
    e.preventDefault();
    try {
      const res = await api.submitProposal({
        subProblemId: 'sp-gumla-01',
        title: proposalData.title,
        abstract: proposalData.abstract,
        technicalApproach: 'Electrochemical potential measurement utilizing doped lanthanum fluoride crystal.',
        budgetINR: proposalData.budgetINR,
        timelineWeeks: proposalData.timelineWeeks,
        teamMembers: [
          { name: 'Dr. Preeti Sinha', role: 'Faculty PI (IoT Lab)', credits: 0 },
          { name: 'Aryan Kumar', role: 'Lead Student Researcher (Final Year)', credits: proposalData.studentCredits },
          { name: 'Kavita Kumari', role: 'Student Firmware Researcher', credits: proposalData.studentCredits }
        ]
      });
      if (res.success) {
        setActionSuccess('Proposal submitted for Evaluation Committee review with student experiential learning credits.');
      }
    } catch (err) {
      alert('Proposal Error: ' + err.message);
    }
  };

  const handleVerifyMilestone = async (projectId, milestoneId) => {
    try {
      const res = await api.verifyMilestone(projectId, milestoneId, {
        remarks: 'Calibrated across 10 lab test assays from 0.5 PPM to 6.0 PPM. Accuracy ± 2.8%. Ready for Kamdara field deployment.'
      });
      if (res.success) {
        setActionSuccess('Milestone verified and approved! Solution advanced to v1.0 Pilot Ready.');
        loadData();
      }
    } catch (err) {
      alert('Milestone Error: ' + err.message);
    }
  };

  const activeProject = projects[0];

  return (
    <div className="view-container">
      <div className="view-header">
        <div>
          <span className="eyebrow">PARTICIPATING HEI, FACULTY & STUDENT WORKSPACE</span>
          <h1>Multidisciplinary Innovation Workspace</h1>
          <p className="header-description">
            Faculty mentors and student researchers bid on open sub-problems, earn NEP 2020 experiential academic credits, and advance prototypes through milestone deliverables.
          </p>
        </div>
      </div>

      {actionSuccess && (
        <div className="alert-banner success">
          <CheckCircle2 size={18} />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Active Project Workspace */}
      {activeProject ? (
        <section className="dashboard-card project-workspace-card">
          <div className="card-header">
            <div>
              <div className="badge-row">
                <span className="status-badge progress-badge">{activeProject.status}</span>
                <span className="version-pill">Version: {activeProject.solutionVersion}</span>
                {activeProject.isHybridSynthesis && <span className="hybrid-pill">Hybrid Synthesis</span>}
              </div>
              <h2>{activeProject.title}</h2>
              <p className="location-pill">Problem Ref: #{activeProject.problemCode} &bull; Lead Nodal: {activeProject.nodalDirectorName}</p>
            </div>
          </div>

          <div className="tripartite-mou-box">
            <GraduationCap size={18} />
            <div>
              <strong>IP Governance & Tripartite Agreement:</strong>
              <span> {activeProject.ipDetails?.agreementType} (Status: {activeProject.ipStatus})</span>
            </div>
          </div>

          {/* Constituted Teams */}
          <div className="teams-grid">
            {activeProject.teams?.map((team) => (
              <div key={team.teamId} className="team-box">
                <div className="team-header">
                  <strong>{team.organizationName}</strong>
                  <span className="budget-pill">₹{(team.allocatedBudgetINR / 100000).toFixed(1)} Lakhs</span>
                </div>
                <p className="component-text">Assigned: {team.assignedComponent}</p>
                <div className="lead-tag">Team Lead: {team.leadName}</div>
              </div>
            ))}
          </div>

          {/* Milestone Deliverables Tracker */}
          <div className="milestones-section">
            <h3>Project Milestones & Verification Tracker</h3>
            <div className="milestone-list">
              {activeProject.milestones?.map((m) => (
                <div key={m.id} className={`milestone-row ${m.status.toLowerCase()}`}>
                  <div className="m-info">
                    <strong>{m.title}</strong>
                    <div className="m-meta">
                      <span>Timeline: {m.targetWeeks} Weeks</span>
                      <span className={`m-status-pill ${m.status}`}>
                        {m.status.replace('_', ' ')}
                      </span>
                    </div>
                    {m.verifiedBy && (
                      <p className="m-verified">
                        Verified by {m.verifiedBy} &bull; Proof: <a href={m.proofDocument} target="_blank" rel="noreferrer">View Report</a>
                      </p>
                    )}
                  </div>

                  {m.status === 'PENDING' && (
                    <button
                      onClick={() => handleVerifyMilestone(activeProject.id, m.id)}
                      className="btn-milestone-verify"
                    >
                      <CheckCircle2 size={15} />
                      <span>Submit Proof & Verify</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : (
        /* Proposal Submission Form if no active project */
        <section className="dashboard-card form-card">
          <div className="card-header">
            <div>
              <h2>Submit Multidisciplinary Solution Proposal</h2>
              <p>Bid on open sub-problem: <strong>Sub-Problem A: Low-Cost Fluoride Electrochemical Sensor Probe</strong></p>
            </div>
          </div>

          <form onSubmit={handleSubmitProposal} className="problem-submit-form">
            <div className="form-field">
              <label>Proposal Title *</label>
              <input
                type="text"
                value={proposalData.title}
                onChange={(e) => setProposalData({ ...proposalData, title: e.target.value })}
                required
              />
            </div>

            <div className="form-field">
              <label>Technical Approach & Methodology *</label>
              <textarea
                rows={3}
                value={proposalData.abstract}
                onChange={(e) => setProposalData({ ...proposalData, abstract: e.target.value })}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-field">
                <label>Budget Requested (INR) *</label>
                <input
                  type="number"
                  value={proposalData.budgetINR}
                  onChange={(e) => setProposalData({ ...proposalData, budgetINR: e.target.value })}
                  required
                />
              </div>
              <div className="form-field">
                <label>Timeline (Weeks) *</label>
                <input
                  type="number"
                  value={proposalData.timelineWeeks}
                  onChange={(e) => setProposalData({ ...proposalData, timelineWeeks: e.target.value })}
                  required
                />
              </div>
              <div className="form-field">
                <label>NEP 2020 Student Experiential Credits</label>
                <input
                  type="number"
                  value={proposalData.studentCredits}
                  onChange={(e) => setProposalData({ ...proposalData, studentCredits: e.target.value })}
                  required
                />
              </div>
            </div>

            <button type="submit" className="submit-action-btn">
              <Send size={16} />
              <span>Submit Proposal to Evaluation Committee</span>
            </button>
          </form>
        </section>
      )}
    </div>
  );
}
