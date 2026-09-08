import { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import {
  Shield,
  FileCheck2,
  Clock,
  User,
  Filter,
  RefreshCw,
  Search
} from 'lucide-react';

export default function AuditTrail() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const loadLogs = async () => {
    setLoading(true);
    try {
      const res = await api.getAuditLogs();
      if (res.success) setLogs(res.logs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    const matchesRole = filterRole === 'ALL' || log.actorRole === filterRole;
    const matchesSearch =
      !searchQuery ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.actorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.justificationReason?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <div className="view-container">
      <div className="view-header">
        <div>
          <span className="eyebrow">GOVERNMENT TRANSPARENCY ENGINE</span>
          <h1>Immutable Governance Audit Trail</h1>
          <p className="header-description">
            Complete, tamper-evident log of all problem state changes, AI overrides, evaluation committee scoring, and public fund sanctions across Jharkhand.
          </p>
        </div>

        <button onClick={loadLogs} className="btn-refresh-stream">
          <RefreshCw size={15} />
          <span>Refresh Audit Logs</span>
        </button>
      </div>

      <div className="audit-controls-bar">
        <div className="search-box">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search by action, actor name, or justification reason..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <Filter size={15} />
          <span>Role Filter:</span>
          <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
            <option value="ALL">All Roles</option>
            <option value="citizen">Citizen</option>
            <option value="pri_officer">PRI Officer</option>
            <option value="nodal_director">Nodal Director</option>
            <option value="faculty">Faculty</option>
            <option value="industry_expert">Industry Expert</option>
            <option value="state_admin">State Admin</option>
          </select>
        </div>
      </div>

      <section className="dashboard-card audit-table-card">
        <div className="card-header">
          <div>
            <h2>Recorded Audit Events ({filteredLogs.length})</h2>
            <p>Append-only audit ledger ordered chronologically.</p>
          </div>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Actor & Role</th>
                <th>Action Taken</th>
                <th>Entity Target</th>
                <th>Justification / Reason</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id}>
                  <td>
                    <div className="time-col">
                      <Clock size={13} />
                      <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                      <small>{new Date(log.timestamp).toLocaleDateString()}</small>
                    </div>
                  </td>
                  <td>
                    <strong>{log.actorName}</strong>
                    <span className="role-micro-badge">{log.actorRole}</span>
                  </td>
                  <td>
                    <span className="action-tag">{log.action}</span>
                  </td>
                  <td>
                    <span className="entity-pill">{log.entityType}</span>
                  </td>
                  <td>
                    <p className="justification-text">{log.justificationReason || 'Standard state transition execution.'}</p>
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
