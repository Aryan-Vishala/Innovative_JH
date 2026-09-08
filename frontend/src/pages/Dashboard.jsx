import { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import {
  AlertTriangle,
  FolderKanban,
  GraduationCap,
  CheckCircle2,
  Droplets,
  Building,
  TrendingUp,
  MapPin,
  ArrowUpRight,
  ShieldCheck,
  Search,
  Award
} from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [districtFilter, setDistrictFilter] = useState('');

  useEffect(() => {
    api.getStateOverview().then((res) => {
      if (res.success) setStats(res);
      setLoading(false);
    }).catch((err) => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const filteredDistricts = (stats?.districts || []).filter((d) =>
    !districtFilter || d.name.toLowerCase().includes(districtFilter.toLowerCase())
  );

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">GOVERNMENT OF JHARKHAND &bull; STATE INNOVATION PORTAL</p>
          <h1>
            State Innovation & Social Impact Overview <span>🏛️</span>
          </h1>
          <p className="header-description">
            Real-time telemetry and innovation pipeline across all 24 districts of Jharkhand under NEP 2020.
          </p>
        </div>

        <div className="header-actions">
          <div className="state-authority-tag">
            <ShieldCheck size={16} />
            <span>Govt. of Jharkhand Verified</span>
          </div>
        </div>
      </header>

      {/* Top Level Macro Statistics */}
      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-top">
            <div className="stat-icon"><AlertTriangle size={21} /></div>
            <span className="stat-change">+14.2%</span>
          </div>
          <div className="stat-value">{stats ? stats.totalProblems.toLocaleString() : '1,249'}</div>
          <div className="stat-title">Grassroots Problems Logged</div>
          <p className="stat-description">Across all 24 Jharkhand districts</p>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <div className="stat-icon"><FolderKanban size={21} /></div>
            <span className="stat-change">+9.5%</span>
          </div>
          <div className="stat-value">{stats ? stats.activeProjects.toLocaleString() : '343'}</div>
          <div className="stat-title">Active R&D Projects</div>
          <p className="stat-description">HEI & Startup co-developments</p>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <div className="stat-icon"><GraduationCap size={21} /></div>
            <span className="stat-change">+6.2%</span>
          </div>
          <div className="stat-value">{stats ? stats.impactSummary.activeUniversityPartners : '48'}</div>
          <div className="stat-title">Universities & Research Labs</div>
          <p className="stat-description">BAU, BIT, IIT ISM, NIT, AIIMS</p>
        </div>

        <div className="stat-card">
          <div className="stat-top">
            <div className="stat-icon"><CheckCircle2 size={21} /></div>
            <span className="stat-change good">+21.8%</span>
          </div>
          <div className="stat-value">{stats ? stats.completedPilots.toLocaleString() : '79'}</div>
          <div className="stat-title">Verified Field Pilots</div>
          <p className="stat-description">With 3-stage governance sign-off</p>
        </div>
      </section>

      {/* Quantified Measurable Social Impact Counters */}
      <section className="dashboard-card impact-summary-card">
        <div className="card-header">
          <div>
            <h2>Verified Measurable Social Impact (Jharkhand Macro)</h2>
            <p>Audited on-ground telemetry outcomes reported by Panchayats and Nodal Universities.</p>
          </div>
        </div>

        <div className="impact-kpi-grid">
          <div className="kpi-box">
            <span className="kpi-label">Total Citizens Benefited</span>
            <strong className="kpi-value text-green">
              {stats ? stats.impactSummary.totalBeneficiaries.toLocaleString() : '247,400'}
            </strong>
            <span className="kpi-sub">Kamdara benchmark pilot: 2,400</span>
          </div>

          <div className="kpi-box">
            <span className="kpi-label">Safe Potable Water Delivered</span>
            <strong className="kpi-value text-blue">
              {stats ? stats.impactSummary.litresSafeWaterDistributedM : '3.84'} M Litres
            </strong>
            <span className="kpi-sub">Continuous solar pumping telemetry</span>
          </div>

          <div className="kpi-box">
            <span className="kpi-label">Fluoride Toxicity Reduction</span>
            <strong className="kpi-value text-gold">
              -{stats ? stats.impactSummary.averageFluorideReductionPct : '80.9'}%
            </strong>
            <span className="kpi-sub">Reduced from 4.2 to 0.8 PPM (&lt; 1.0 WHO limit)</span>
          </div>

          <div className="kpi-box">
            <span className="kpi-label">State Grants Disbursed</span>
            <strong className="kpi-value text-purple">
              ₹{(stats ? stats.impactSummary.stateInnovationGrantsDisbursedINR / 10000000 : 1.85).toFixed(2)} Cr
            </strong>
            <span className="kpi-sub">Including ₹25L Gumla scale-up grant</span>
          </div>
        </div>
      </section>

      {/* 24 Jharkhand Districts Matrix */}
      <section className="dashboard-card recent-card">
        <div className="card-header">
          <div>
            <h2>District Innovation Matrix (All 24 Districts)</h2>
            <p>Active challenge response rates and university pilot status.</p>
          </div>

          <div className="search-box">
            <Search size={15} />
            <input
              type="text"
              placeholder="Filter district..."
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
            />
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>District Name</th>
                <th>Challenges Logged</th>
                <th>Active Projects</th>
                <th>Field Pilots</th>
                <th>Priority Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredDistricts.map((d) => (
                <tr key={d.name} className={d.name === 'Gumla' ? 'highlight-row' : ''}>
                  <td>
                    <div className="district-cell">
                      <MapPin size={15} className="district-pin" />
                      <strong>{d.name}</strong>
                      {d.name === 'Gumla' && <span className="benchmark-mini-badge">Benchmark Pilot Active</span>}
                    </div>
                  </td>
                  <td>{d.problems}</td>
                  <td>{d.activeProjects}</td>
                  <td>
                    <span className="badge-count">{d.pilotsDeployed}</span>
                  </td>
                  <td>
                    <span className={`status-badge ${d.name === 'Gumla' ? 'resolved-badge' : 'progress-badge'}`}>
                      {d.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}