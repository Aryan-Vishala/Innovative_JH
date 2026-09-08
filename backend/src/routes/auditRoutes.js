import express from 'express';
import { db } from '../data/store.js';

const router = express.Router();

// Get full audit trail with filters
router.get('/logs', (req, res) => {
  const { entityType, entityId, limit = 100 } = req.query;
  let logs = [...db.auditLogs];

  if (entityType) {
    logs = logs.filter((l) => l.entityType === entityType);
  }
  if (entityId) {
    logs = logs.filter((l) => l.entityId === entityId);
  }

  res.json({
    success: true,
    count: logs.length,
    logs: logs.slice(0, Number(limit))
  });
});

export default router;
