import { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import {
  Activity,
  Droplets,
  CheckCircle2,
  ShieldCheck,
  Building,
  TrendingDown,
  TrendingUp,
  MapPin,
  RefreshCw,
  Zap,
  Award
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from 'recharts';

export default function PilotTelemetry() {
  const [pilot, setPilot] = useState(null);
  const [telemetry, setTelemetry] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionSuccess, setActionSuccess] = useState('');
  const [simulating, setSimulating] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      // 1. Fetch or initialize pilot deployment
      let pilotsRes = await api.getPilots();
      let activePilot = pilotsRes.pilots && pilotsRes.pilots.length > 0 ? pilotsRes.pilots[0] : null;

      if (!activePilot) {
        const deployRes = await api.deployPilot({
          projectId: 'proj-gumla-01',
          district: 'Gumla',
          block: 'Kamdara',
          panchayat: 'Kamdara Gram Panchayat',
          beneficiaryCount: 2400
        });
        activePilot = deployRes.pilot;
      }
      setPilot(activePilot);

      // 2. Fetch sensor telemetry
      const telemRes = await api.getTelemetry('GUM-FL-01');
      if (telemRes.success) {
        // Format for Recharts
        const formatted = telemRes.readings.map((r) => ({
          time: new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          fluoridePpm: r.fluoridePpm,
          safeThreshold: 1.0,
          baselinePpm: 4.2,
          flowRateLpm: r.flowRateLpm,
          batteryPct: r.solarBatteryPct
        }));
        setTelemetry(formatted);
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

  const handleSimulateStream = async () => {
    setSimulating(true);
    try {
      await api.simulateStream();
      setActionSuccess('Simulated 24-hour IoT sensor stream refreshed with live solar LoRaWAN packet feeds.');
      loadData();
    } catch (err) {
      alert('Stream error: ' + err.message);
    } finally {
      setSimulating(false);
    }
  };

  const handlePriVerify = async () => {
    if (!pilot) return;
    try {
      const res = await api.priGroundVerify(pilot.id, {
        remarks: 'Physical ground inspection completed in Kamdara Panchayat. Fluoride filtration unit operational. 2,400+ villagers receiving clean continuous water.'
      });
      if (res.success) {
        setActionSuccess('Stage 1: PRI Ground Verification signed off successfully.');
        setPilot(res.pilot);
      }
    } catch (err) {
      alert('Verification Error: ' + err.message);
    }
  };

  const handleNodalVerify = async () => {
    if (!pilot) return;
    try {
      const res = await api.nodalTechnicalVerify(pilot.id, {
        remarks: 'Certified by BAU & IIT ISM hydrology lab: Fluoride reduced to 0.8 PPM (well below WHO 1.0 standard). Sensor telemetry accuracy verified ±2.4%.'
      });
      if (res.success) {
        setActionSuccess('Stage 2: Nodal Technical Verification signed off successfully.');
        setPilot(res.pilot);
      }
    } catch (err) {
      alert('Verification Error: ' + err.message);
    }
  };

  const handleStateAccept = async () => {
    if (!pilot) return;
    try {
      const res = await api.stateProgramAccept(pilot.id, {
        scaleUpGrantSanctionedINR: 2500000,
        remarks: 'Govt of Jharkhand DHTE officially accepts pilot outcomes. Sanctioned ₹25 Lakhs for multi-district rollout across Gumla, Simdega, and Palamu.'
      });
      if (res.success) {
        setActionSuccess('Stage 3: State Program Acceptance granted! Solution archived in State Innovation Repository.');
        setPilot(res.pilot);
      }
    } catch (err) {
      alert('Acceptance Error: ' + err.message);
    }
  };

  return (
    <div className="view-container">
      <div className="view-header">
        <div>
          <span className="eyebrow">FIELD PILOT & TELEMETRY DASHBOARD</span>
          <h1>Field Pilot Deployment & 3-Stage Impact Verification</h1>
          <p className="header-description">
            Live IoT telemetry monitoring in Kamdara Panchayat, Gumla District with directional social impact metrics and multi-tier governmental sign-off.
          </p>
        </div>

        <button onClick={handleSimulateStream} disabled={simulating} className="btn-refresh-stream">
          <RefreshCw size={15} className={simulating ? 'spin' : ''} />
          <span>Refresh Live Sensor Stream</span>
        </button>
      </div>

      {actionSuccess && (
        <div className="alert-banner success">
          <CheckCircle2 size={18} />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Directional Impact Metrics (Fluoride Decrease + Water Increase) */}
      <section className="stats-grid">
        <div className="stat-card impact-card">
          <div className="stat-top">
            <div className="stat-icon decrease"><TrendingDown size={21} /></div>
            <span className="stat-change good">-80.9% (Safe)</span>
          </div>
          <div className="stat-value">0.82 PPM</div>
          <div className="stat-title">Fluoride Concentration</div>
          <p className="stat-description">Baseline: 4.2 PPM &bull; Safe Limit: &lt; 1.0 PPM</p>
        </div>

        <div className="stat-card impact-card">
          <div className="stat-top">
            <div className="stat-icon increase"><TrendingUp size={21} /></div>
            <span className="stat-change good">+183.3%</span>
          </div>
          <div className="stat-value">8.5 Hrs / Day</div>
          <div className="stat-title">Daily Potable Water Access</div>
          <p className="stat-description">Baseline: 3.0 Hrs &bull; Continuous solar supply</p>
        </div>

        <div className="stat-card impact-card">
          <div className="stat-top">
            <div className="stat-icon neutral"><Activity size={21} /></div>
            <span className="stat-change good">100% Target</span>
          </div>
          <div className="stat-value">2,400</div>
          <div className="stat-title">Beneficiary Population</div>
          <p className="stat-description">Kamdara Panchayat, Gumla District</p>
        </div>

        <div className="stat-card impact-card">
          <div className="stat-top">
            <div className="stat-icon gold"><Zap size={21} /></div>
            <span className="stat-change good">Solar Mesh</span>
          </div>
          <div className="stat-value">94% Battery</div>
          <div className="stat-title">LoRaWAN Telemetry Uptime</div>
          <p className="stat-description">Solar battery reserve: 36+ Hours</p>
        </div>
      </section>

      {/* Live Recharts Sensor Telemetry Chart */}
      <section className="dashboard-card chart-card">
        <div className="card-header">
          <div>
            <h2>24-Hour Real-Time IoT Telemetry Stream</h2>
            <p>Device #GUM-FL-01 &bull; Kamdara Panchayat Community Well #2</p>
          </div>
          <div className="legend-tag-row">
            <span className="legend-pill green">Fluoride PPM (Post-Filtration)</span>
            <span className="legend-pill red-dash">WHO Max Permissible (1.0 PPM)</span>
            <span className="legend-pill blue">Flow Rate (LPM)</span>
          </div>
        </div>

        <div style={{ width: '100%', height: 320 }}>
          <ResponsiveContainer>
            <LineChart data={telemetry} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e8e4" />
              <XAxis dataKey="time" stroke="#4a5f54" />
              <YAxis stroke="#4a5f54" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="fluoridePpm"
                stroke="#108e5e"
                strokeWidth={3}
                dot={{ r: 3 }}
                name="Fluoride (PPM)"
              />
              <Line
                type="monotone"
                dataKey="safeThreshold"
                stroke="#d9534f"
                strokeDasharray="5 5"
                strokeWidth={2}
                dot={false}
                name="Safe Threshold (1.0 PPM)"
              />
              <Line
                type="monotone"
                dataKey="flowRateLpm"
                stroke="#0284c7"
                strokeWidth={2}
                dot={false}
                name="Flow Rate (LPM)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* 3-Stage Impact Verification Pipeline */}
      {pilot && (
        <section className="dashboard-card verification-pipeline-card">
          <div className="card-header">
            <div>
              <h2>3-Stage Impact Verification Pipeline</h2>
              <p>Transparent multi-tier governance ensuring public accountability before state scale-up funding.</p>
            </div>
          </div>

          <div className="pipeline-grid">
            {/* Stage 1: PRI Ground Verification */}
            <div className={`pipeline-stage-box ${pilot.verifications?.stage1_priGround?.verified ? 'verified' : 'pending'}`}>
              <div className="stage-header">
                <span className="stage-num">STAGE 1</span>
                <strong>PRI Ground Truth Sign-off</strong>
              </div>
              <p className="stage-desc">Gram Panchayat physically verifies community operational access and functioning well.</p>

              {pilot.verifications?.stage1_priGround?.verified ? (
                <div className="stage-signoff-data">
                  <CheckCircle2 size={16} className="good-icon" />
                  <div>
                    <strong>Verified by {pilot.verifications.stage1_priGround.officerName}</strong>
                    <span>"{pilot.verifications.stage1_priGround.remarks}"</span>
                  </div>
                </div>
              ) : (
                <button onClick={handlePriVerify} className="btn-stage-action">
                  <ShieldCheck size={16} />
                  <span>Sign off as PRI Officer (Sunita Oraon)</span>
                </button>
              )}
            </div>

            {/* Stage 2: Nodal Technical Verification */}
            <div className={`pipeline-stage-box ${pilot.verifications?.stage2_nodalTechnical?.verified ? 'verified' : 'pending'}`}>
              <div className="stage-header">
                <span className="stage-num">STAGE 2</span>
                <strong>Nodal Technical Audit</strong>
              </div>
              <p className="stage-desc">Domain experts verify lab water assay reduction from 4.2 to 0.8 PPM and telemetry calibration.</p>

              {pilot.verifications?.stage2_nodalTechnical?.verified ? (
                <div className="stage-signoff-data">
                  <CheckCircle2 size={16} className="good-icon" />
                  <div>
                    <strong>Verified by {pilot.verifications.stage2_nodalTechnical.directorName}</strong>
                    <span>"{pilot.verifications.stage2_nodalTechnical.remarks}"</span>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleNodalVerify}
                  disabled={!pilot.verifications?.stage1_priGround?.verified}
                  className="btn-stage-action"
                >
                  <ShieldCheck size={16} />
                  <span>Sign off as Nodal Director (Dr. Arvind Swaminathan)</span>
                </button>
              )}
            </div>

            {/* Stage 3: State Program Acceptance */}
            <div className={`pipeline-stage-box ${pilot.verifications?.stage3_stateProgram?.accepted ? 'verified' : 'pending'}`}>
              <div className="stage-header">
                <span className="stage-num">STAGE 3</span>
                <strong>State Program Acceptance</strong>
              </div>
              <p className="stage-desc">DHTE sanctioning ₹25 Lakhs scale-up grant for multi-district rollout across Jharkhand.</p>

              {pilot.verifications?.stage3_stateProgram?.accepted ? (
                <div className="stage-signoff-data">
                  <Award size={16} className="good-icon" />
                  <div>
                    <strong>Accepted by {pilot.verifications.stage3_stateProgram.adminName}</strong>
                    <span>Grant Sanctioned: ₹25 Lakhs &bull; Entered in State Innovation Repository</span>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleStateAccept}
                  disabled={!pilot.verifications?.stage2_nodalTechnical?.verified}
                  className="btn-stage-action grant"
                >
                  <Award size={16} />
                  <span>Accept Program & Sanction ₹25L Scale-up (Dr. Vivek Murmu)</span>
                </button>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
