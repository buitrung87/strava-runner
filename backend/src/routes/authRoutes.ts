import { Router } from 'express';
import passport from '../config/passport';
import { AuthController } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Initiate Strava OAuth
router.get('/strava', passport.authenticate('strava', { 
  scope: ['read', 'activity:read_all', 'profile:read_all'] 
}));

// OAuth callback
router.get(
  '/strava/callback',
  passport.authenticate('strava', { 
    session: false,
    failureRedirect: process.env.FRONTEND_URL || 'http://localhost:5173'
  }),
  AuthController.callback
);

// Get current user profile
router.get('/profile', authenticateToken, AuthController.getProfile);

// Logout
router.post('/logout', AuthController.logout);

export default router;
