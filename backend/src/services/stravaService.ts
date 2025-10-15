import axios from 'axios';
import { StravaActivity, StravaTokenResponse } from '../types';
import prisma from '../config/database';

const STRAVA_API_BASE = 'https://www.strava.com/api/v3';

export class StravaService {
  /**
   * Refresh access token if expired
   */
  static async refreshAccessToken(userId: number): Promise<string> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    // Check if token is expired
    const now = new Date();
    if (user.tokenExpiresAt > now) {
      return user.accessToken;
    }

    // Refresh token
    try {
      const response = await axios.post<StravaTokenResponse>(
        `${STRAVA_API_BASE}/../oauth/token`,
        {
          client_id: process.env.STRAVA_CLIENT_ID,
          client_secret: process.env.STRAVA_CLIENT_SECRET,
          grant_type: 'refresh_token',
          refresh_token: user.refreshToken,
        }
      );

      const { access_token, refresh_token, expires_at } = response.data;

      // Update user with new tokens
      await prisma.user.update({
        where: { id: userId },
        data: {
          accessToken: access_token,
          refreshToken: refresh_token,
          tokenExpiresAt: new Date(expires_at * 1000),
        },
      });

      return access_token;
    } catch (error) {
      throw new Error('Failed to refresh access token');
    }
  }

  /**
   * Fetch all activities from Strava
   */
  static async fetchActivities(userId: number): Promise<void> {
    const accessToken = await this.refreshAccessToken(userId);
    
    let page = 1;
    const perPage = 100;
    let hasMore = true;

    while (hasMore) {
      try {
        const response = await axios.get<StravaActivity[]>(
          `${STRAVA_API_BASE}/athlete/activities`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
            params: { page, per_page: perPage },
          }
        );

        const activities = response.data;
        
        if (activities.length === 0) {
          hasMore = false;
          break;
        }

        // Filter only running activities
        const runningActivities = activities.filter((a) =>
          ['Run', 'TrailRun', 'VirtualRun'].includes(a.type)
        );

        // Store activities in database
        for (const activity of runningActivities) {
          await prisma.activity.upsert({
            where: { stravaActivityId: activity.id.toString() },
            update: {
              name: activity.name,
              type: activity.type,
              distance: activity.distance,
              movingTime: activity.moving_time,
              elapsedTime: activity.elapsed_time,
              totalElevationGain: activity.total_elevation_gain,
              startDate: new Date(activity.start_date),
              startDateLocal: new Date(activity.start_date_local),
              timezone: activity.timezone,
              averageSpeed: activity.average_speed,
              maxSpeed: activity.max_speed,
              averageHeartrate: activity.average_heartrate,
              maxHeartrate: activity.max_heartrate,
            },
            create: {
              stravaActivityId: activity.id.toString(),
              userId,
              name: activity.name,
              type: activity.type,
              distance: activity.distance,
              movingTime: activity.moving_time,
              elapsedTime: activity.elapsed_time,
              totalElevationGain: activity.total_elevation_gain,
              startDate: new Date(activity.start_date),
              startDateLocal: new Date(activity.start_date_local),
              timezone: activity.timezone,
              averageSpeed: activity.average_speed,
              maxSpeed: activity.max_speed,
              averageHeartrate: activity.average_heartrate,
              maxHeartrate: activity.max_heartrate,
            },
          });
        }

        page++;
        
        // If we got fewer activities than requested, we've reached the end
        if (activities.length < perPage) {
          hasMore = false;
        }
      } catch (error) {
        console.error('Error fetching activities:', error);
        hasMore = false;
      }
    }

    // Update last sync time
    await prisma.user.update({
      where: { id: userId },
      data: { lastSyncAt: new Date() },
    });
  }
}
