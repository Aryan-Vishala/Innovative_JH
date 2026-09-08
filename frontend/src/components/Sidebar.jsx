import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  UserCheck,
  CheckCircle2,
  Layers,
  Cpu,
  SlidersHorizontal,
  Activity,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export default function Sidebar({ activeUser }) {
  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-mark">IJ</div>
        <div>
          <h2>Innovative</h2>
          <span>Jharkhand</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <p className="nav-label">BENCHMARK WORKFLOW</p>

        <NavLink to="/citizen" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <UserCheck size={18} />
          <span>1. Citizen Portal</span>
        </NavLink>

        <NavLink to="/pri-verify" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <CheckCircle2 size={18} />
          <span>2. PRI Ground Truth</span>
        </NavLink>

        <NavLink to="/nodal-orchestration" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Layers size={18} />
          <span>3. Nodal Orchestrator</span>
        </NavLink>

        <NavLink to="/proposals-workspace" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Cpu size={18} />
          <span>4. HEI & Startup Lab</span>
        </NavLink>

        <NavLink to="/evaluation-panel" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <SlidersHorizontal size={18} />
          <span>5. Expert Panel Scoring</span>
        </NavLink>

        <NavLink to="/pilot-telemetry" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Activity size={18} />
          <span>6. Pilot & Telemetry</span>
        </NavLink>

        <p className="nav-label">STATE GOVERNANCE</p>

        <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={18} />
          <span>Macro State Analytics</span>
        </NavLink>

        <NavLink to="/audit-trail" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <ShieldCheck size={18} />
          <span>Governance Audit Trail</span>
        </NavLink>
      </nav>

      {/* Active User Pill */}
      <div className="sidebar-bottom">
        <div className="user-card">
          <div className="avatar-emoji">
            {activeUser?.avatar || '🏛️'}
          </div>

          <div className="user-info">
            <strong>{activeUser?.fullName || 'Dr. Vivek Murmu'}</strong>
            <span>{activeUser?.designation || activeUser?.role || 'State Admin'}</span>
            <small className="org-text">{activeUser?.organizationName || 'Govt of Jharkhand'}</small>
          </div>
        </div>
      </div>
    </aside>
  );
}