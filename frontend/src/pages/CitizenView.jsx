import { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import {
  MapPin,
  AlertTriangle,
  Upload,
  CheckCircle2,
  Clock,
  Droplets,
  Send,
  Eye,
  FileText
} from 'lucide-react';

export default function CitizenView() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    district: 'Gumla',
    block: 'Kamdara',
    panchayat: 'Kamdara Gram Panchayat',
    affectedPopulation: 2400,
    evidenceUrl: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const loadProblems = () => {
    setLoading(true);
    api.getProblems().then((res) => {
      if (res.success) setProblems(res.problems);
      setLoading(false);
    }).catch((err) => {
      console.error(err);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadProblems();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.submitProblem({
        ...formData,
        evidence: formData.evidenceUrl ? [{ type: 'image', url: formData.evidenceUrl, caption: 'Field photo' }] : []
      });
      if (res.success) {
        setSuccessMessage(`Problem submitted successfully! AI classified domain: ${res.problem.thematicDomain}. Routed to ${res.problem.panchayat} for ground verification.`);
        setFormData({
          title: '',
          description: '',
          district: 'Gumla',
          block: 'Kamdara',
          panchayat: 'Kamdara Gram Panchayat',
          affectedPopulation: 2400,
          evidenceUrl: ''
        });
        loadProblems();
      }
    } catch (err) {
      alert('Error submitting problem: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const benchmarkProblem = problems.find((p) => p.code === 'JH-WTR-2026-01') || problems[0];

  return (
    <div className="view-container">
      <div className="view-header">
        <div>
          <span className="eyebrow">CITIZEN & COMMUNITY PORTAL</span>
          <h1>Crowdsource Societal Challenges</h1>
          <p className="header-description">
            Submit grassroots community challenges with location geotags and lab evidence for AI classification and university-industry resolution.
          </p>
        </div>
      </div>

      {successMessage && (
        <div className="alert-banner success">
          <CheckCircle2 size={18} />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Benchmark Problem Showcase & Live Progress Tracker */}
      {benchmarkProblem && (
        <section className="dashboard-card benchmark-card">
          <div className="card-header">
            <div>
              <div className="badge-row">
                <span className="status-badge progress-badge">{benchmarkProblem.status}</span>
                <span className="code-pill">Code: #{benchmarkProblem.code}</span>
                <span className="priority high">High Priority</span>
              </div>
              <h2 className="benchmark-title">{benchmarkProblem.title}</h2>
              <p className="location-pill">
                <MapPin size={14} /> {benchmarkProblem.panchayat}, {benchmarkProblem.block} Block, {benchmarkProblem.district} District
              </p>
            </div>
          </div>

          <div className="dual-theme-grid">
            <div className="theme-card quantity">
              <div className="theme-header">
                <Droplets size={17} />
                <strong>Theme 1: Water Quantity Depletion</strong>
              </div>
              <p>Water table dropped to 48m depth. Handpumps running dry during summer.</p>
              <div className="metric-compare">
                <div>
                  <span className="label">Baseline Supply</span>
                  <span className="val bad">3.0 Hours / Day</span>
                </div>
                <div>
                  <span className="label">Target Resolution</span>
                  <span className="val good">8.0+ Hours / Day</span>
                </div>
              </div>
            </div>

            <div className="theme-card quality">
              <div className="theme-header">
                <AlertTriangle size={17} />
                <strong>Theme 2: Toxic Fluoride Contamination</strong>
              </div>
              <p>120+ school children affected with skeletal fluorosis and severe joint pain.</p>
              <div className="metric-compare">
                <div>
                  <span className="label">Lab Fluoride Reading</span>
                  <span className="val bad">4.2 PPM (Dangerous)</span>
                </div>
                <div>
                  <span className="label">Safe WHO Standard</span>
                  <span className="val good">&lt; 1.0 PPM (Safe)</span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Analysis Summary */}
          {benchmarkProblem.aiAnalysis && (
            <div className="ai-intel-box">
              <div className="ai-intel-header">
                <span className="ai-badge">AI Analysis v2.1</span>
                <span>Confidence: {benchmarkProblem.aiAnalysis.confidenceScore}%</span>
                <span>Severity Index: {benchmarkProblem.aiAnalysis.severityScore}/100</span>
              </div>
              <p className="ai-domain-text">
                Domain: <strong>{benchmarkProblem.thematicDomain}</strong> &bull; Subdomain: {benchmarkProblem.subdomain}
              </p>
              <div className="skill-tags">
                <span className="tag-label">Required Expertise:</span>
                {Object.entries(benchmarkProblem.aiAnalysis.requiredExpertise || {}).map(([skill, pct]) => (
                  <span key={skill} className="skill-pill">{skill.replace('_', ' ')}: {pct}%</span>
                ))}
              </div>
            </div>
          )}

          {/* Verification Status Banner */}
          <div className="ground-verification-status">
            {benchmarkProblem.priValidated ? (
              <div className="status-item verified">
                <CheckCircle2 size={16} />
                <span>
                  Ground Verified by <strong>{benchmarkProblem.priVerifiedBy?.officerName}</strong> ({benchmarkProblem.priVerifiedBy?.designation}): "{benchmarkProblem.priValidationRemarks}"
                </span>
              </div>
            ) : (
              <div className="status-item pending">
                <Clock size={16} />
                <span>Awaiting Ground Truth Verification by Kamdara Gram Panchayat Secretary.</span>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Submission Form */}
      <section className="dashboard-card form-card">
        <div className="card-header">
          <div>
            <h2>Report a Community Challenge</h2>
            <p>Fill in problem details to initiate the innovation lifecycle.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="problem-submit-form">
          <div className="form-row">
            <div className="form-field">
              <label>Challenge Title *</label>
              <input
                type="text"
                placeholder="e.g. Iron & Arsenic contamination in drinking well"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div className="form-field">
              <label>Target District *</label>
              <select
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
              >
                <option value="Gumla">Gumla</option>
                <option value="Ranchi">Ranchi</option>
                <option value="Dhanbad">Dhanbad</option>
                <option value="Simdega">Simdega</option>
                <option value="Palamu">Palamu</option>
                <option value="Deoghar">Deoghar</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label>Block & Panchayat *</label>
              <input
                type="text"
                value={`${formData.block} Block, ${formData.panchayat}`}
                readOnly
              />
            </div>
            <div className="form-field">
              <label>Estimated Affected Population</label>
              <input
                type="number"
                value={formData.affectedPopulation}
                onChange={(e) => setFormData({ ...formData, affectedPopulation: e.target.value })}
              />
            </div>
          </div>

          <div className="form-field">
            <label>Detailed Description & Symptoms Observed *</label>
            <textarea
              rows={4}
              placeholder="Describe the physical impact, frequency, water supply hours, health symptoms, or agricultural losses..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div className="form-field">
            <label>Evidence Document / Photo URL (Optional)</label>
            <input
              type="url"
              placeholder="https://example.com/water_test_report.pdf or photo URL"
              value={formData.evidenceUrl}
              onChange={(e) => setFormData({ ...formData, evidenceUrl: e.target.value })}
            />
          </div>

          <button type="submit" disabled={submitting} className="submit-action-btn">
            <Send size={16} />
            <span>{submitting ? 'Analyzing & Submitting...' : 'Submit Challenge to Innovation Portal'}</span>
          </button>
        </form>
      </section>
    </div>
  );
}
