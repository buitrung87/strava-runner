import axios from 'axios';
import { User, Activity, ActivityStats, LeaderboardEntry, TimePeriod } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth services
export const authService = {
  async getProfile(token: string): Promise<User> {
    const response = await api.get('/auth/profile', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};

// Activity services
export const activityService = {
  async getActivities(
    token: string,
    period: TimePeriod = 'month'
  ): Promise<{ activities: Activity[]; stats: ActivityStats }> {
    const response = await api.get('/api/activities', {
      headers: { Authorization: `Bearer ${token}` },
      params: { period },
    });
    return response.data;
  },

  async syncActivities(token: string): Promise<{ message: string }> {
    const response = await api.post(
      '/api/activities/sync',
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },
};

// Leaderboard services
export const leaderboardService = {
  async getLeaderboard(
    period: TimePeriod = 'month'
  ): Promise<{
    period: TimePeriod;
    leaderboard: LeaderboardEntry[];
    totalAthletes: number;
  }> {
    const response = await api.get('/api/leaderboard', {
      params: { period },
    });
    return response.data;
  },
};
