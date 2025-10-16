import { Request, Response } from 'express';
import { TimePeriod } from '../types';
import prisma from '../config/database';
import { StravaService } from '../services/stravaService';

export class ActivityController {
  /**
   * Get user's activities with optional time period filter
   */
  static async getActivities(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const period = (req.query.period as TimePeriod) || 'month';

      const startDate = getStartDate(period);

      const activities = await prisma.activity.findMany({
        where: {
          userId,
          startDate: {
            gte: startDate,
          },
        },
        orderBy: {
          startDate: 'desc',
        },
      });

      // Calculate statistics
      const stats = activities.reduce(
        (acc, activity) => {
          acc.totalDistance += activity.distance;
          acc.totalTime += activity.movingTime;
          acc.totalActivities += 1;
          return acc;
        },
        { totalDistance: 0, totalTime: 0, totalActivities: 0 }
      );

      res.json({
        activities: activities.map((a) => ({
          id: a.id,
          name: a.name,
          type: a.type,
          distance: a.distance,
          distanceKm: (a.distance / 1000).toFixed(2),
          movingTime: a.movingTime,
          elapsedTime: a.elapsedTime,
          totalElevationGain: a.totalElevationGain,
          startDate: a.startDate,
          startDateLocal: a.startDateLocal,
          averageSpeed: a.averageSpeed,
          maxSpeed: a.maxSpeed,
          averageHeartrate: a.averageHeartrate,
          maxHeartrate: a.maxHeartrate,
          pace: a.averageSpeed ? formatPace(a.averageSpeed) : null,
        })),
        stats: {
          totalDistance: stats.totalDistance,
          totalDistanceKm: (stats.totalDistance / 1000).toFixed(2),
          totalTime: stats.totalTime,
          totalActivities: stats.totalActivities,
          averageDistance: stats.totalActivities > 0 
            ? (stats.totalDistance / stats.totalActivities / 1000).toFixed(2)
            : 0,
        },
      });
    } catch (error) {
      console.error('Error fetching activities:', error);
      res.status(500).json({ error: 'Failed to fetch activities' });
    }
  }

  /**
   * Sync activities from Strava
   */
  static async syncActivities(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      
      // Trigger background sync
      StravaService.fetchActivities(userId).catch((error) => {
        console.error('Background sync error:', error);
      });

      res.json({ message: 'Sync started in background' });
    } catch (error) {
      console.error('Error syncing activities:', error);
      res.status(500).json({ error: 'Failed to start sync' });
    }
  }
}

/**
 * Helper function to get start date based on period
 */
function getStartDate(period: TimePeriod): Date {
  const now = new Date();
  
  switch (period) {
    case 'day':
      return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    case 'week':
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay());
      weekStart.setHours(0, 0, 0, 0);
      return weekStart;
    case 'month':
      return new Date(now.getFullYear(), now.getMonth(), 1);
    default:
      return new Date(now.getFullYear(), now.getMonth(), 1);
  }
}

/**
 * Helper function to format pace (min/km)
 */
function formatPace(speedMps: number): string {
  if (speedMps === 0) return '0:00';
  
  const paceMinPerKm = 1000 / 60 / speedMps;
  const minutes = Math.floor(paceMinPerKm);
  const seconds = Math.floor((paceMinPerKm - minutes) * 60);
  
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
