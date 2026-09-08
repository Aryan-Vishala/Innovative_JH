import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initialOrganizations, initialUsers, initialDomainMappings, initialProblems } from './seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SNAPSHOT_PATH = path.join(__dirname, 'db_snapshot.json');

class DataStore {
  constructor() {
    this.organizations = [...initialOrganizations];
    this.users = [...initialUsers];
    this.domainMappings = [...initialDomainMappings];
    this.problems = [...initialProblems];
    this.masterProblems = [];
    this.subProblems = [];
    this.subProblemDependencies = [];
    this.proposals = [];
    this.evaluationCommittees = [];
    this.evaluationScores = [];
    this.projects = [];
    this.projectTeams = [];
    this.teamMembers = [];
    this.milestones = [];
    this.pilotDeployments = [];
    this.impactMetrics = [];
    this.auditLogs = [];
    this.notifications = [];
    this.telemetryLogs = [];

    this.loadSnapshot();
  }

  loadSnapshot() {
    try {
      if (fs.existsSync(SNAPSHOT_PATH)) {
        const raw = fs.readFileSync(SNAPSHOT_PATH, 'utf-8');
        const data = JSON.parse(raw);
        Object.assign(this, data);
        console.log('[DataStore] Loaded snapshot from disk.');
      }
    } catch (err) {
      console.warn('[DataStore] Could not load snapshot, using initial seed:', err.message);
    }
  }

  saveSnapshot() {
    try {
      const data = {
        organizations: this.organizations,
        users: this.users,
        domainMappings: this.domainMappings,
        problems: this.problems,
        masterProblems: this.masterProblems,
        subProblems: this.subProblems,
        subProblemDependencies: this.subProblemDependencies,
        proposals: this.proposals,
        evaluationCommittees: this.evaluationCommittees,
        evaluationScores: this.evaluationScores,
        projects: this.projects,
        projectTeams: this.projectTeams,
        teamMembers: this.teamMembers,
        milestones: this.milestones,
        pilotDeployments: this.pilotDeployments,
        impactMetrics: this.impactMetrics,
        auditLogs: this.auditLogs,
        notifications: this.notifications,
        telemetryLogs: this.telemetryLogs
      };
      fs.writeFileSync(SNAPSHOT_PATH, JSON.stringify(data, null, 2));
    } catch (err) {
      console.error('[DataStore] Failed to save snapshot:', err.message);
    }
  }

  resetToSeed() {
    this.organizations = [...initialOrganizations];
    this.users = [...initialUsers];
    this.domainMappings = [...initialDomainMappings];
    this.problems = JSON.parse(JSON.stringify(initialProblems));
    this.masterProblems = [];
    this.subProblems = [];
    this.subProblemDependencies = [];
    this.proposals = [];
    this.evaluationCommittees = [];
    this.evaluationScores = [];
    this.projects = [];
    this.projectTeams = [];
    this.teamMembers = [];
    this.milestones = [];
    this.pilotDeployments = [];
    this.impactMetrics = [];
    this.auditLogs = [];
    this.notifications = [];
    this.telemetryLogs = [];
    this.saveSnapshot();
  }
}

export const db = new DataStore();
