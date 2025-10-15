import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from '../types';

export class AuthController {
  /**
   * Initiate Strava OAuth
   */
  static login(req: Request, res: Response) {
    // Passport will handle the redirect
  }

  /**
   * Handle OAuth callback
   */
  static callback(req: Request, res: Response) {
    try {
      const user = req.user as any;
      
      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
      );

      // Redirect to frontend with token
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
    } catch (error) {
      res.status(500).json({ error: 'Authentication failed' });
    }
  }

  /**
   * Get current user profile
   */
  static async getProfile(req: AuthenticatedRequest, res: Response) {
    try {
      const user = req.user!;
      
      res.json({
        id: user.id,
        stravaId: user.stravaId,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        city: user.city,
        country: user.country,
        profilePicture: user.profilePicture,
        lastSyncAt: user.lastSyncAt,
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch profile' });
    }
  }

  /**
   * Logout user
   */
  static logout(req: Request, res: Response) {
    req.logout(() => {
      res.json({ message: 'Logged out successfully' });
    });
  }
}
