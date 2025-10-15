import { Router } from 'express';
import { ActivityController } from '../controllers/activityController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Get user activities
router.get('/', ActivityController.getActivities);

// Sync activities from Strava
router.post('/sync', ActivityController.syncActivities);

export default router;
