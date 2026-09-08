import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../services/api.js';
import {
  Sparkles,
  ChevronRight,
  RotateCcw,
  UserCheck,
  Building,
  CheckCircle2,
  Cpu,
  Layers,
  FileCheck2,
  SlidersHorizontal,
  Flame,
  Activity
} from 'lucide-react';

const STEPS = [
  { id: 'citizen', label: '1. Citizen Report', role: 'citizen', path: '/citizen', icon: UserCheck },
  { id: 'pri', label: '2. PRI Ground Verify', role: 'pri_officer', path: '/pri-verify', icon: CheckCircle2 },
  { id: 'nodal', label: '3. Nodal Decompose & Match', role: 'nodal_director', path: '/nodal-orchestration', icon: Layers },
  { id: 'proposals', label: '4. HEI & Startup Bid', role: 'faculty', path: '/proposals-workspace', icon: Cpu },
  { id: 'evaluation', label: '5. Expert Panel Scoring', role: 'nodal_director', path: '/evaluation-panel', icon: SlidersHorizontal },
  { id: 'synthesis', label: '6. Hybrid Synthesis', role: 'nodal_director', path: '/nodal-orchestration', icon: Flame },
  { id: 'milestones', label: '7. Milestone Lab Test', role: 'faculty', path: '/proposals-workspace', icon: FileCheck2 },
  { id: 'pilot', label: '8. Field Pilot & 3-Tier Signoff', role: 'pri_officer', path: '/pilot-telemetry', icon: Activity },
  { id: 'analytics', label: '9. State Macro Impact', role: 'state_admin', path: '/dashboard', icon: Building }
];

export default function WalkthroughBar({ activeUser, onUserSwitched }) {
  const [users, setUsers] = useState([]);
  const [isResetting, setIsResetting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    api.getUsers().then((res) => {
      if (res.success) setUsers(res.users);
    }).catch(console.error);
  }, []);

  const handleRoleChange = async (userId) => {
    try {
      const res = await api.switchUser(userId);
      if (res.success) {
        localStorage.setItem('token', res.token);
        localStorage.setItem('activeUserId', res.user.id);
        if (onUserSwitched) onUserSwitched(res.user);
      }
    } catch (err) {
      console.error('Failed to switch user:', err);
    }
  };

  const handleResetDemo = async () => {
    if (window.confirm('Reset the benchmark problem and database to clean initial state?')) {
      setIsResetting(true);
      try {
        await api.resetDemo();
        alert('Benchmark scenario reset to Step 1 (Submitted by Citizen).');
        window.location.reload();
      } catch (err) {
        alert('Reset error: ' + err.message);
      } finally {
        setIsResetting(false);
      }
    }
  };

  return (
    <aside className="walkthrough-bar" aria-label="Benchmark Walkthrough Navigator">
      <div className="walkthrough-header">
        <div className="badge-scenario">
          <Sparkles size={14} />
          <span>GUMLA BENCHMARK WALKTHROUGH</span>
        </div>
        <p className="scenario-title">Dual-Theme: Groundwater Depletion & Fluoride in Kamdara</p>
      </div>

      <div className="walkthrough-steps">
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isActive = location.pathname === step.path;
          return (
            <button
              key={step.id}
              className={`step-chip ${isActive ? 'active' : ''}`}
              onClick={() => {
                const matchingUser = users.find((u) => u.role === step.role);
                if (matchingUser && activeUser?.id !== matchingUser.id) {
                  handleRoleChange(matchingUser.id);
                }
                navigate(step.path);
              }}
              title={`Switch to ${step.label}`}
            >
              <Icon size={13} />
              <span>{step.label}</span>
              {idx < STEPS.length - 1 && <ChevronRight size={11} className="step-sep" />}
            </button>
          );
        })}
      </div>

      <div className="walkthrough-controls">
        <div className="role-switch-container">
          <span className="role-label">Active Actor:</span>
          <select
            value={activeUser?.id || ''}
            onChange={(e) => handleRoleChange(e.target.value)}
            className="role-select"
          >
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.avatar} {u.fullName} — {u.designation || u.role} ({u.organizationName})
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleResetDemo}
          disabled={isResetting}
          className="reset-demo-btn"
          title="Reset database to initial benchmark state"
        >
          <RotateCcw size={13} className={isResetting ? 'spin' : ''} />
          <span>Reset Demo</span>
        </button>
      </div>
    </aside>
  );
}
