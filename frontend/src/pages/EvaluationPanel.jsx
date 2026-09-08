import { useState } from 'react';
import { api } from '../services/api.js';
import {
  SlidersHorizontal,
  Award,
  CheckCircle2,
  FileText,
  UserCheck,
  Send
} from 'lucide-react';

export default function EvaluationPanel() {
  const [scores, setScores] = useState({
    technicalFeasibility: 19, // max 20
    socialImpact: 19,         // max 20
    costEfficiency: 14,       // max 15
    scalability: 14,          // max 15
    implementationViability: 9, // max 10
    sustainability: 9,        // max 10
    innovationNovelty: 9      // max 10
  });

  const [remarks, setRemarks] = useState('Outstanding thin-film sensor design with high sensitivity to fluoride ion range (0.5 to 10 PPM). Excellent alignment with rural Gumla water conditions.');
  const [scoringSuccess, setScoringSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const totalScore = Object.values(scores).reduce((a, b) => Number(a) + Number(b), 0);

  const handleScoreChange = (key, val) => {
    setScores({ ...scores, [key]: Number(val) });
  };

  const handleSubmitScore = async () => {
    setSubmitting(true);
    try {
      const res = await api.scoreProposal('prop-bit-01', {
        ...scores,
        evaluationRemarks: remarks
      });
      if (res.success) {
        setScoringSuccess(`Evaluation recorded successfully! Proposal scored ${totalScore}/100 and marked as HIGHLY RECOMMENDED for Nodal Director synthesis.`);
      }
    } catch (err) {
      alert('Scoring error: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="view-container">
      <div className="view-header">
        <div>
          <span className="eyebrow">EXPERT EVALUATION COMMITTEE</span>
          <h1>Proposal Evaluation & 7-Parameter Scoring</h1>
          <p className="header-description">
            Multidisciplinary expert panels evaluate candidate proposals on objective criteria. Scores generate transparent recommendations for Nodal Director review.
          </p>
        </div>
      </div>

      {scoringSuccess && (
        <div className="alert-banner success">
          <CheckCircle2 size={18} />
          <span>{scoringSuccess}</span>
        </div>
      )}

      <div className="eval-layout-grid">
        {/* Proposal Info Card */}
        <section className="dashboard-card prop-summary-card">
          <div className="card-header">
            <div>
              <span className="status-badge progress-badge">Under Evaluation</span>
              <h2>Candidate Proposal #PROP-BIT-01</h2>
              <p className="location-pill">Institution: <strong>BIT Mesra (IoT Lab)</strong></p>
            </div>
          </div>

          <div className="prop-body">
            <h3>Low-Cost Electrochemical Fluoride Sensor Probe</h3>
            <p>
              Ion-selective electrochemical sensor probe with automated relay shutoff. Designed for rural borewells with high solar efficiency and IP67 dust/water protection.
            </p>

            <div className="prop-meta-grid">
              <div>
                <span>Lead Investigator</span>
                <strong>Dr. Preeti Sinha</strong>
              </div>
              <div>
                <span>Budget</span>
                <strong>₹3.5 Lakhs</strong>
              </div>
              <div>
                <span>Timeline</span>
                <strong>10 Weeks</strong>
              </div>
              <div>
                <span>Student Credits</span>
                <strong>4 Experiential Credits</strong>
              </div>
            </div>
          </div>
        </section>

        {/* 7-Parameter Rubric Scoring Panel */}
        <section className="dashboard-card scoring-card">
          <div className="card-header">
            <div>
              <h2>Evaluation Rubric Scoring</h2>
              <p>Adjust the criteria sliders according to technical review.</p>
            </div>
            <div className="total-score-pill">
              <span className="score-num">{totalScore}</span>
              <span className="score-denom">/ 100</span>
            </div>
          </div>

          <div className="sliders-list">
            <div className="slider-item">
              <div className="slider-label-row">
                <span>1. Technical Feasibility & Rigor</span>
                <strong>{scores.technicalFeasibility} / 20</strong>
              </div>
              <input
                type="range"
                min="0"
                max="20"
                value={scores.technicalFeasibility}
                onChange={(e) => handleScoreChange('technicalFeasibility', e.target.value)}
              />
            </div>

            <div className="slider-item">
              <div className="slider-label-row">
                <span>2. Measurable Social Impact</span>
                <strong>{scores.socialImpact} / 20</strong>
              </div>
              <input
                type="range"
                min="0"
                max="20"
                value={scores.socialImpact}
                onChange={(e) => handleScoreChange('socialImpact', e.target.value)}
              />
            </div>

            <div className="slider-item">
              <div className="slider-label-row">
                <span>3. Cost Efficiency & Low Unit Cost</span>
                <strong>{scores.costEfficiency} / 15</strong>
              </div>
              <input
                type="range"
                min="0"
                max="15"
                value={scores.costEfficiency}
                onChange={(e) => handleScoreChange('costEfficiency', e.target.value)}
              />
            </div>

            <div className="slider-item">
              <div className="slider-label-row">
                <span>4. Scalability Across Districts</span>
                <strong>{scores.scalability} / 15</strong>
              </div>
              <input
                type="range"
                min="0"
                max="15"
                value={scores.scalability}
                onChange={(e) => handleScoreChange('scalability', e.target.value)}
              />
            </div>

            <div className="slider-item">
              <div className="slider-label-row">
                <span>5. Ground Implementation Viability</span>
                <strong>{scores.implementationViability} / 10</strong>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={scores.implementationViability}
                onChange={(e) => handleScoreChange('implementationViability', e.target.value)}
              />
            </div>

            <div className="slider-item">
              <div className="slider-label-row">
                <span>6. Long-Term Sustainability</span>
                <strong>{scores.sustainability} / 10</strong>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={scores.sustainability}
                onChange={(e) => handleScoreChange('sustainability', e.target.value)}
              />
            </div>

            <div className="slider-item">
              <div className="slider-label-row">
                <span>7. Novelty & IP Generation</span>
                <strong>{scores.innovationNovelty} / 10</strong>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={scores.innovationNovelty}
                onChange={(e) => handleScoreChange('innovationNovelty', e.target.value)}
              />
            </div>
          </div>

          <div className="eval-remarks-box">
            <label>Expert Reviewer Written Remarks & Recommendation *</label>
            <textarea
              rows={2}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />

            <button
              onClick={handleSubmitScore}
              disabled={submitting}
              className="btn-submit-score"
            >
              <Send size={16} />
              <span>{submitting ? 'Submitting Score...' : 'Submit Official Committee Evaluation'}</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
