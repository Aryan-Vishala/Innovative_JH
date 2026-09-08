import express from 'express';
import { db } from '../data/store.js';

const router = express.Router();

// Generate or ensure simulated 24h data is present
function getOrCreateTelemetry(deviceId = 'GUM-FL-01') {
  let records = db.telemetryLogs.filter((t) => t.deviceId === deviceId);
  if (records.length === 0) {
    const now = Date.now();
    for (let i = 24; i >= 0; i--) {
      const time = new Date(now - i * 3600000).toISOString();
      const isPostSolution = i <= 16; // Solution activated 16 hours ago

      records.push({
        id: `telem-${now}-${i}`,
        deviceId,
        location: 'Kamdara Panchayat Well #2, Gumla',
        fluoridePpm: isPostSolution
          ? Number((0.78 + Math.random() * 0.12).toFixed(2)) // Safe: 0.78 - 0.90 PPM
          : Number((4.15 + Math.random() * 0.25).toFixed(2)), // Baseline: 4.15 - 4.40 PPM
        flowRateLpm: isPostSolution
          ? Number((38 + Math.random() * 8).toFixed(1))
          : Number((10 + Math.random() * 4).toFixed(1)),
        waterTableDepthM: Number((44.2 - (24 - i) * 0.05).toFixed(1)),
        solarBatteryPct: Number((85 + Math.sin(i) * 10).toFixed(0)),
        timestamp: time
      });
    }
    db.telemetryLogs.push(...records);
    db.saveSnapshot();
  }
  return records.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
}

// Ingest sensor readings
router.post('/ingest', (req, res) => {
  const {
    deviceId = 'GUM-FL-01',
    fluoridePpm = 0.82,
    flowRateLpm = 42.0,
    waterTableDepthM = 43.8,
    solarBatteryPct = 94
  } = req.body;

  const newReading = {
    id: `telem-${Date.now()}`,
    deviceId,
    location: 'Kamdara Panchayat Well #2, Gumla',
    fluoridePpm: Number(fluoridePpm),
    flowRateLpm: Number(flowRateLpm),
    waterTableDepthM: Number(waterTableDepthM),
    solarBatteryPct: Number(solarBatteryPct),
    timestamp: new Date().toISOString()
  };

  db.telemetryLogs.push(newReading);
  db.saveSnapshot();

  res.status(201).json({ success: true, reading: newReading });
});

// Get time-series readings for device
router.get('/device/:deviceId', (req, res) => {
  const records = getOrCreateTelemetry(req.params.deviceId);
  res.json({ success: true, deviceId: req.params.deviceId, count: records.length, readings: records });
});

// Force refresh simulated 24h stream
router.post('/simulate-stream', (req, res) => {
  db.telemetryLogs = db.telemetryLogs.filter((t) => t.deviceId !== 'GUM-FL-01');
  const fresh = getOrCreateTelemetry('GUM-FL-01');
  res.json({ success: true, message: 'Simulated 24-hour telemetry stream refreshed.', count: fresh.length, readings: fresh });
});

export default router;
