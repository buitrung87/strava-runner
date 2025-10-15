import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { activityService } from '../services/api';
import { Activity, ActivityStats, TimePeriod } from '../types';
import PeriodSelector from '../components/PeriodSelector';
import ActivityCard from '../components/ActivityCard';
import { ArrowPathIcon, MapPinIcon, ClockIcon, FireIcon } from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { user, token } = useAuth();
  const [period, setPeriod] = useState<TimePeriod>('month');
  const [activities, setActivities] = useState<Activity[]>([]);
  const [stats, setStats] = useState<ActivityStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    fetchActivities();
  }, [period]);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const data = await activityService.getActivities(token!, period);
      setActivities(data.activities);
      setStats(data.stats);
    } catch (error) {
      console.error('Failed to fetch activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    try {
      setSyncing(true);
      await activityService.syncActivities(token!);
      // Wait a bit for sync to complete then refresh
      setTimeout(() => {
        fetchActivities();
        setSyncing(false);
      }, 3000);
    } catch (error) {
      console.error('Failed to sync activities:', error);
      setSyncing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-strava"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="text-gray-600">Here's your running activity summary</p>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center mb-8">
        <PeriodSelector period={period} onChange={setPeriod} />
        <button
          onClick={handleSync}
          disabled={syncing}
          className="flex items-center px-4 py-2 bg-strava text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
        >
          <ArrowPathIcon className={`h-5 w-5 mr-2 ${syncing ? 'animate-spin' : ''}`} />
          {syncing ? 'Syncing...' : 'Sync from Strava'}
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center text-gray-500 mb-2">
              <MapPinIcon className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">Total Distance</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalDistanceKm}</p>
            <p className="text-sm text-gray-500">kilometers</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center text-gray-500 mb-2">
              <ClockIcon className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">Total Time</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {Math.floor(stats.totalTime / 3600)}h {Math.floor((stats.totalTime % 3600) / 60)}m
            </p>
            <p className="text-sm text-gray-500">hours</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center text-gray-500 mb-2">
              <FireIcon className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">Activities</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalActivities}</p>
            <p className="text-sm text-gray-500">runs</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center text-gray-500 mb-2">
              <MapPinIcon className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">Avg Distance</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.averageDistance}</p>
            <p className="text-sm text-gray-500">km per run</p>
          </div>
        </div>
      )}

      {/* Activities List */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Activities</h2>
        {activities.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 mb-4">No activities found for this period</p>
            <button
              onClick={handleSync}
              className="text-strava hover:text-orange-600 font-medium"
            >
              Sync your activities from Strava
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
