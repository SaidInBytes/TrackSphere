import express from 'express';
import cors from 'cors';
import reportRoutes from './routes/reportRoutes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/reports', reportRoutes);

// 404 handler for unknown routes
app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

export default app;
