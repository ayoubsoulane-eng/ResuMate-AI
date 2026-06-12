/**
 * ResuMate AI - Backend API Server
 * 
 * Main entry point that wires up all routes and middleware.
 */

import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.js';
import resumeRoutes from './routes/resumes.js';
import subscriptionRoutes from './routes/subscriptions.js';
import aiRoutes from './routes/ai.js';
import pdfRoutes from './routes/pdf.js';
import paymentRoutes from './routes/payments.js';
import tutorialRoutes from './routes/tutorial.js';

const app = express();
const PORT = process.env.PORT || 3001;

// ---- Middleware ----

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '10mb' }));

// Stripe webhook needs raw body
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));

// ---- Health Check ----

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'ResuMate AI API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// ---- Routes ----

app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/pdf', pdfRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/tutorial', tutorialRoutes);

// ---- Error Handler ----

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// ---- Start ----

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n  🚀 ResuMate AI API Server`);
  console.log(`  📡 Listening on http://0.0.0.0:${PORT}`);
  console.log(`  🩺 Health: http://localhost:${PORT}/api/health\n`);
});