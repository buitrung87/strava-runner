import { Request, Response } from 'express';
import { TimePeriod, LeaderboardEntry } from '../types';
import prisma from '../config/database';

export class LeaderboardController {
  /**
   * Get global leaderboard
   */
  static async getLeaderboard(req: Request, res: Response) {
    try {
      const period = (req.query.period as TimePeriod) || 'month';
      const startDate = getStartDate(period);

      // Get all users with their activities in the period
      const users = await prisma.user.findMany({
        include: {
          activities: {
            where: {
              startDate: {
                gte: startDate,
              },
            },
          },
        },
      });

      // Calculate leaderboard
      const leaderboard: LeaderboardEntry[] = users
        .map((user) => {
          const stats = user.activities.reduce(
            (acc, activity) => {
              acc.totalDistance += activity.distance;
              acc.totalTime += activity.movingTime;
              acc.totalActivities += 1;
              return acc;
            },
            { totalDistance: 0, totalTime: 0, totalActivities: 0 }
          );

          return {
            userId: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            username: user.username,
            profilePicture: user.profilePicture,
            totalDistance: stats.totalDistance,
            totalActivities: stats.totalActivities,
            totalTime: stats.totalTime,
          };
        })
        .filter((entry) => entry.totalActivities > 0) // Only include users with activities
        .sort((a, b) => b.totalDistance - a.totalDistance); // Sort by distance descending

      // Add rank
      const rankedLeaderboard = leaderboard.map((entry, index) => ({
        rank: index + 1,
        ...entry,
        totalDistanceKm: (entry.totalDistance / 1000).toFixed(2),
        averageDistanceKm: entry.totalActivities > 0 
          ? (entry.totalDistance / entry.totalActivities / 1000).toFixed(2)
          : '0.00',
      }));

      res.json({
        period,
        leaderboard: rankedLeaderboard,
        totalAthletes: rankedLeaderboard.length,
      });
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      res.status(500).json({ error: 'Failed to fetch leaderboard' });
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
