import { db } from '../data/store.js';

export function recordAuditLog({
  entityType,
  entityId,
  actorId,
  actorName,
  actorRole,
  action,
  oldState = null,
  newState = null,
  justificationReason = ''
}) {
  const logEntry = {
    id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    entityType,
    entityId,
    actorId,
    actorName,
    actorRole,
    action,
    oldState,
    newState,
    justificationReason,
    timestamp: new Date().toISOString()
  };

  db.auditLogs.unshift(logEntry);
  db.saveSnapshot();

  console.log(`[AUDIT] ${action} on ${entityType}:${entityId} by ${actorName} (${actorRole})`);
  return logEntry;
}

export function getAuditLogsForEntity(entityType, entityId) {
  return db.auditLogs.filter(
    (log) => log.entityType === entityType && log.entityId === entityId
  );
}

export function getAllAuditLogs(limit = 100) {
  return db.auditLogs.slice(0, limit);
}
