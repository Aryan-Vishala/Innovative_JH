import { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  MapPin,
  Clock,
  Droplets,
  AlertTriangle,
  Building,
  FileCheck
} from 'lucide-react';

export default function PriConsole() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [remarks, setRemarks] = useState('Ground inspection completed at Kamdara Toli. 120+ school children with skeletal fluorosis symptoms confirmed. Water supply limited to 3 hours daily. Approved for urgent Nodal University intervention.');
  const [verifying, setVerifying] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');

  const loadProblems = () => {
    setLoading(true);
    api.getProblems().then((res) => {
      if (res.success) setProblems(res.problems);
      setLoading(false);
    }).catch(console.error);
  };

  useEffect(() => {
    loadProblems();
  }, []);

  const handleVerify = async (problemId, decision) => {
    setVerifying(true);
    try {
      const res = await api.priVerify(problemId, {
        decision,
        remarks,
        baselineData: {
          surveyDate: new Date().toISOString(),
          confirmedFluoridePpm: 4.2,
          confirmedWaterAccessHoursDaily: 3.0,
          householdsAffected: 420
        }
      });
      if (res.success) {
        setActionSuccess(`Problem #${res.problem.code} ground-verified and routed to ${res.problem.assignedNodalOrgId === 'org-bau' ? 'BAU Ranchi (Nodal HEI)' : 'Nodal Institution'}.`);
        loadProblems();
      }
    } catch (err) {
      alert('Verification error: ' + err.message);
    } finally {
      setVerifying(false);
    }
  };

  const benchmarkProblem = problems.find((p) => p.code === 'JH-WTR-2026-01') || problems[0];

  return (
    <div className="view-container">
      <div className="view-header">
        <div>
          <span className="eyebrow">LOCAL BODY / PRI VERIFICATION CONSOLE</span>
          <h1>Gram Panchayat Ground Truth Audit</h1>
          <p className="header-description">
            Panchayat Secretaries & Block Development Officers inspect grassroots citizen reports, verify on-ground authenticity, and authorize academic routing.
          </p>
        </div>
      </div>

      {actionSuccess && (
        <div className="alert-banner success">
          <CheckCircle2 size={18} />
          <span>{actionSuccess}</span>
        </div>
      )}

      {benchmarkProblem && (
        <section className="dashboard-card pri-card">
          <div className="card-header">
            <div>
              <div className="badge-row">
                <span className="status-badge review-badge">{benchmarkProblem.status}</span>
                <span className="code-pill">#{benchmarkProblem.code}</span>
                <span className="pri-jurisdiction-badge">Kamdara Panchayat Jurisdiction</span>
              </div>
              <h2>{benchmarkProblem.title}</h2>
              <p className="location-pill">
                <MapPin size={14} /> Reported by: <strong>{benchmarkProblem.citizenName}</strong> &bull; {benchmarkProblem.panchayat}, {benchmarkProblem.district}
              </p>
            </div>
          </div>

          <div className="pri-details-box">
            <p className="problem-desc">{benchmarkProblem.description}</p>

            <div className="baseline-audit-grid">
              <div className="audit-item">
                <span className="audit-label">Reported Water Access:</span>
                <strong className="bad">3.0 Hours / Day</strong>
              </div>
              <div className="audit-item">
                <span className="audit-label">Fluoride Level in Lab Assay:</span>
                <strong className="bad">4.2 PPM (Permissible: 1.0 PPM)</strong>
              </div>
              <div className="audit-item">
                <span className="audit-label">Beneficiary Population:</span>
                <strong>{benchmarkProblem.affectedPopulation} Villagers</strong>
              </div>
              <div className="audit-item">
                <span className="audit-label">AI Extracted Domain:</span>
                <strong className="highlight">{benchmarkProblem.thematicDomain}</strong>
              </div>
            </div>
          </div>

          {/* Verification Actions */}
          <div className="pri-action-section">
            <label className="action-label">Panchayat Secretary Ground Inspection Notes & Baseline Findings *</label>
            <textarea
              rows={3}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Enter physical observations, affected household counts, and inspection date..."
            />

            <div className="btn-action-group">
              <button
                onClick={() => handleVerify(benchmarkProblem.id, 'APPROVE')}
                disabled={verifying || benchmarkProblem.priValidated}
                className="btn-approve"
              >
                <CheckCircle2 size={17} />
                <span>
                  {benchmarkProblem.priValidated
                    ? 'Ground Verified & Assigned to Nodal HEI'
                    : 'Confirm Ground Truth & Route to Nodal University'}
                </span>
              </button>

              {!benchmarkProblem.priValidated && (
                <button
                  onClick={() => handleVerify(benchmarkProblem.id, 'REJECT')}
                  disabled={verifying}
                  className="btn-reject"
                >
                  <XCircle size={17} />
                  <span>Reject as Inaccurate / Duplicate</span>
                </button>
              )}
            </div>

            {benchmarkProblem.priValidated && (
              <div className="audit-seal">
                <FileCheck size={16} />
                <span>
                  Officially Verified on {new Date(benchmarkProblem.priValidatedAt || Date.now()).toLocaleDateString()} by {benchmarkProblem.priVerifiedBy?.officerName || 'Sunita Oraon'}
                </span>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
