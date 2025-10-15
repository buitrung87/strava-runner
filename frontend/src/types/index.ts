export interface User {
  id: number;
  stravaId: string;
  firstName: string;
  lastName: string;
  username: string | null;
  city: string | null;
  country: string | null;
  profilePicture: string | null;
  lastSyncAt: string | null;
}

export interface Activity {
  id: number;
  name: string;
  type: string;
  distance: number;
  distanceKm: string;
  movingTime: number;
  elapsedTime: number;
  totalElevationGain: number | null;
  startDate: string;
  startDateLocal: string;
  averageSpeed: number | null;
  maxSpeed: number | null;
  averageHeartrate: number | null;
  maxHeartrate: number | null;
  pace: string | null;
}

export interface ActivityStats {
  totalDistance: number;
  totalDistanceKm: string;
  totalTime: number;
  totalActivities: number;
  averageDistance: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: number;
  firstName: string;
  lastName: string;
  username: string | null;
  profilePicture: string | null;
  totalDistance: number;
  totalDistanceKm: string;
  totalActivities: number;
  totalTime: number;
  averageDistanceKm: string;
}

export type TimePeriod = 'day' | 'week' | 'month';
