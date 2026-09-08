import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.js';
import problemRoutes from './routes/problemRoutes.js';
import nodalRoutes from './routes/nodalRoutes.js';
import proposalRoutes from './routes/proposalRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import pilotRoutes from './routes/pilotRoutes.js';
import telemetryRoutes from './routes/telemetryRoutes.js';
import auditRoutes from './routes/auditRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id']
}));
app.use(express.json());

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    system: 'Innovative Jharkhand API Gateway',
    version: '2.1.0',
    timestamp: new Date().toISOString()
  });
});

// Mount API v1 Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/problems', problemRoutes);
app.use('/api/v1/nodal', nodalRoutes);
app.use('/api/v1/proposals', proposalRoutes);
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/pilots', pilotRoutes);
app.use('/api/v1/telemetry', telemetryRoutes);
app.use('/api/v1/audit', auditRoutes);
app.use('/api/v1/analytics', analyticsRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[API Error]:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : undefined
  });
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 Innovative Jharkhand API Gateway v2.1 running on port ${PORT}`);
  console.log(`🔗 Health Check: http://localhost:${PORT}/health`);
  console.log(`🏛️ State-wide Innovation & Orchestration Engine active`);
  console.log(`=======================================================`);
});

export default app;
