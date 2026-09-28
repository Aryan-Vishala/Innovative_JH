import React from "react";
import {
  CheckCircle2,
  Clock,
  GraduationCap,
  Building2,
  Cpu,
  Truck,
  Award,
  Sparkles,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import "./TrlProgressTracker.css";

export const TRL_LEVELS = [
  {
    level: 1,
    tag: "Ground Verified",
    title: "Level 1 — Ground Verified",
    shortLabel: "Ground Verified",
    subtitle: "Inspected by Local PRI",
    description: "Inspected by Local PRI. Physical on-site verification of citizen grievance, baseline data collection, and genuineness certification.",
    color: "#0284c7",
    icon: CheckCircle2,
  },
  {
    level: 2,
    tag: "University Adopted",
    title: "Level 2 — University Adopted",
    shortLabel: "University Adopted",
    subtitle: "Student team & faculty lead assigned",
    description: "Student team & faculty lead assigned. State Nodal Cell evaluation, academic lab allocation, and engineering R&D kickoff.",
    color: "#7c3aed",
    icon: GraduationCap,
  },
  {
    level: 3,
    tag: "Prototype Ready",
    title: "Level 3 — Prototype Ready",
    shortLabel: "Prototype Ready",
    subtitle: "Working solution tested in campus lab",
    description: "Working solution tested in campus lab. Functional hardware/software prototype built and validated against bench standards.",
    color: "#d97706",
    icon: Cpu,
  },
  {
    level: 4,
    tag: "Field Pilot Testing",
    title: "Level 4 — Field Pilot Testing",
    shortLabel: "Field Pilot Testing",
    subtitle: "Deployed in target village for 30-day trial",
    description: "Deployed in target village for 30-day trial. Real-world village stress testing, community feedback, and safety certification.",
    color: "#0f766e",
    icon: Truck,
  },
  {
    level: 5,
    tag: "Scaled Deployment",
    title: "Level 5 — Scaled Deployment",
    shortLabel: "Scaled Deployment",
    subtitle: "Verified impact with before/after metrics",
    description: "Verified impact with before/after metrics (e.g. Fluoride: 2.4 PPM → 0.6 PPM Safe). Fully commissioned community asset.",
    color: "#059669",
    icon: Award,
  },
];

export default function TrlProgressTracker({
  currentLevel = 1,
  compact = false,
  interactive = false,
  onLevelSelect,
  metricsText,
  solutionInfo,
}) {
  const levelNum = Math.min(5, Math.max(1, Number(currentLevel) || 1));
  const activeLevelData = TRL_LEVELS[levelNum - 1];

  // Default fallback before/after metrics for Level 5 if none provided
  const displayMetrics =
    metricsText ||
    solutionInfo?.impactOutcome ||
    (levelNum === 5
      ? "Fluoride: 2.4 PPM → 0.35 PPM Safe (BIS 10500 Compliant)"
      : null);

  if (compact) {
    return (
      <div className="trl-compact-wrapper">
        <div className="trl-compact-header">
          <span className="trl-compact-title">
            <TrendingUp size={12} className="trl-icon-pulse" />
            Solution Maturity:
          </span>
          <span className={`trl-badge-pill trl-badge-level-${levelNum}`}>
            {activeLevelData.title}
          </span>
        </div>
        <div className="trl-compact-track">
          {TRL_LEVELS.map((st) => {
            const isDone = st.level < levelNum;
            const isCurrent = st.level === levelNum;
            return (
              <div
                key={st.level}
                className={`trl-compact-segment ${isDone ? "done" : ""} ${
                  isCurrent ? "current" : ""
                }`}
                title={`${st.title}: ${st.subtitle}`}
              />
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="trl-stepper-container">
      {/* Header */}
      <div className="trl-stepper-header">
        <div className="trl-header-left">
          <div className="trl-header-icon-box">
            <TrendingUp size={20} />
          </div>
          <div>
            <div className="trl-eyebrow-row">
              <span className="trl-eyebrow">ENGINEERING SOLUTION MATURITY</span>
              <span className="trl-stage-badge">
                Technology Readiness Level (TRL {levelNum} of 5)
              </span>
            </div>
            <h3 className="trl-main-heading">{activeLevelData.title}</h3>
            <p className="trl-sub-heading">{activeLevelData.subtitle}</p>
          </div>
        </div>

        {/* Level 5 Before / After Metric Highlight */}
        {levelNum === 5 && displayMetrics && (
          <div className="trl-metrics-highlight-pill">
            <Sparkles size={16} color="#059669" />
            <div className="trl-metrics-content">
              <span className="trl-metrics-label">Verified Ground Impact:</span>
              <strong className="trl-metrics-val">{displayMetrics}</strong>
            </div>
          </div>
        )}
      </div>

      {/* Progress Track & Steps Grid */}
      <div className="trl-steps-grid">
        {TRL_LEVELS.map((st) => {
          const isDone = st.level < levelNum;
          const isCurrent = st.level === levelNum;
          const isPending = st.level > levelNum;
          const IconComp = st.icon;

          return (
            <div
              key={st.level}
              className={`trl-step-card ${isDone ? "is-done" : ""} ${
                isCurrent ? "is-current" : ""
              } ${isPending ? "is-pending" : ""}`}
              onClick={() => interactive && onLevelSelect && onLevelSelect(st.level)}
              style={{ cursor: interactive ? "pointer" : "default" }}
            >
              <div className="trl-step-top">
                <div className="trl-step-num-box">
                  {isDone ? (
                    <CheckCircle2 size={18} className="trl-check-icon" />
                  ) : (
                    <span>L{st.level}</span>
                  )}
                </div>
                <span className="trl-step-status-chip">
                  {isDone ? "Completed" : isCurrent ? "Active Stage" : "Upcoming"}
                </span>
              </div>

              <div className="trl-step-body">
                <h4 className="trl-step-title">{st.title}</h4>
                <p className="trl-step-sub">{st.subtitle}</p>
                <p className="trl-step-desc">{st.description}</p>
              </div>

              {/* Connecting arrow indicator */}
              {st.level < 5 && (
                <div className="trl-step-arrow">
                  <ArrowRight size={14} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Details Banner */}
      <div className="trl-stepper-footer">
        <div className="trl-footer-info">
          <strong>Next Action:</strong>{" "}
          {levelNum === 1 && "Pending University adoption and student capstone team allocation."}
          {levelNum === 2 && "Faculty Mentor & student engineering team finalizing lab prototype design."}
          {levelNum === 3 && "Prototype fabricated; preparing for 30-day village field trial."}
          {levelNum === 4 && "Active field trial in progress; collecting real-time water quality/sensor telemetry."}
          {levelNum === 5 && "Operational & Scaled across Jharkhand. Monitored by Panchayat & District Mission."}
        </div>
      </div>
    </div>
  );
}
