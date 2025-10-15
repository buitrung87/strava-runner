import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cron from 'node-cron';
import passport from './config/passport';
import authRoutes from './routes/authRoutes';
import activityRoutes from './routes/activityRoutes';
import leaderboardRoutes from './routes/leaderboardRoutes';
import { StravaService } from './services/stravaService';
import prisma from './config/database';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/auth', authRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

// Background job: Sync activities for all users every 6 hours
cron.schedule('0 */6 * * *', async () => {
  console.log('Running scheduled activity sync...');
  
  try {
    const users = await prisma.user.findMany();
    
    for (const user of users) {
      try {
        await StravaService.fetchActivities(user.id);
        console.log(`Synced activities for user ${user.id}`);
      } catch (error) {
        console.error(`Failed to sync activities for user ${user.id}:`, error);
      }
    }
    
    console.log('Scheduled activity sync completed');
  } catch (error) {
    console.error('Scheduled sync error:', error);
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing server...');
  await prisma.$disconnect();
  process.exit(0);
});

export default app;
