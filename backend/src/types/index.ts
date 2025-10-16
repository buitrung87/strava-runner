// AuthenticatedRequest is now defined in express.d.ts to extend Express namespace
// This avoids type conflicts with Express's built-in Request type

export interface StravaTokenResponse {
  token_type: string;
  expires_at: number;
  expires_in: number;
  refresh_token: string;
  access_token: string;
  athlete: StravaAthlete;
}

export interface StravaAthlete {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  city: string;
  country: string;
  profile: string;
  profile_medium: string;
}

export interface StravaActivity {
  id: number;
  name: string;
  type: string;
  distance: number;
  moving_time: number;
  elapsed_time: number;
  total_elevation_gain: number;
  start_date: string;
  start_date_local: string;
  timezone: string;
  average_speed: number;
  max_speed: number;
  average_heartrate?: number;
  max_heartrate?: number;
}

export interface LeaderboardEntry {
  userId: number;
  firstName: string;
  lastName: string;
  username: string | null;
  profilePicture: string | null;
  totalDistance: number;
  totalActivities: number;
  totalTime: number;
}

export type TimePeriod = 'day' | 'week' | 'month';
