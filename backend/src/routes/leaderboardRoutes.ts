import { Router } from 'express';
import { LeaderboardController } from '../controllers/leaderboardController';

const router = Router();

// Get global leaderboard (public, no auth required)
router.get('/', LeaderboardController.getLeaderboard);

export default router;
