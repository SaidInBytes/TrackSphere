import express from 'express';
import cors from 'cors';
import reportRoutes from './routes/reportRoutes';
import authRoutes from './routes/authRoutes';
import { authMiddleware } from './middleware/auth';

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Public auth routes
app.use('/api/auth', authRoutes);

// Protected report routes
app.use('/api/reports', authMiddleware, reportRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

export default app;
