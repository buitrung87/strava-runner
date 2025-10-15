import { useState, useEffect } from 'react';
import { leaderboardService } from '../services/api';
import { LeaderboardEntry, TimePeriod } from '../types';
import PeriodSelector from '../components/PeriodSelector';
import { TrophyIcon } from '@heroicons/react/24/solid';

const Leaderboard = () => {
  const [period, setPeriod] = useState<TimePeriod>('month');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, [period]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const data = await leaderboardService.getLeaderboard(period);
      setLeaderboard(data.leaderboard);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'text-yellow-500';
      case 2:
        return 'text-gray-400';
      case 3:
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-yellow-50 border-yellow-200';
      case 2:
        return 'bg-gray-50 border-gray-200';
      case 3:
        return 'bg-orange-50 border-orange-200';
      default:
        return 'bg-white border-gray-200';
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
          <TrophyIcon className="h-8 w-8 text-strava mr-2" />
          Running Club Leaderboard
        </h1>
        <p className="text-gray-600">See how you rank against other club members</p>
      </div>

      {/* Period Selector */}
      <div className="mb-8">
        <PeriodSelector period={period} onChange={setPeriod} />
      </div>

      {/* Leaderboard */}
      {leaderboard.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-500">No activities found for this period</p>
        </div>
      ) : (
        <div className="space-y-4">
          {leaderboard.map((entry) => (
            <div
              key={entry.userId}
              className={`rounded-lg border-2 p-6 transition-all hover:shadow-lg ${getRankBg(
                entry.rank
              )}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* Rank */}
                  <div className="flex-shrink-0">
                    {entry.rank <= 3 ? (
                      <TrophyIcon className={`h-12 w-12 ${getRankColor(entry.rank)}`} />
                    ) : (
                      <div className="h-12 w-12 flex items-center justify-center">
                        <span className="text-2xl font-bold text-gray-400">
                          {entry.rank}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* User Info */}
                  <div className="flex items-center space-x-3">
                    {entry.profilePicture && (
                      <img
                        src={entry.profilePicture}
                        alt={entry.firstName}
                        className="h-12 w-12 rounded-full border-2 border-white shadow"
                      />
                    )}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {entry.firstName} {entry.lastName}
                      </h3>
                      {entry.username && (
                        <p className="text-sm text-gray-500">@{entry.username}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center space-x-8">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">
                      {entry.totalDistanceKm} km
                    </p>
                    <p className="text-sm text-gray-500">Total Distance</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">
                      {entry.totalActivities}
                    </p>
                    <p className="text-sm text-gray-500">Runs</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">
                      {entry.averageDistanceKm} km
                    </p>
                    <p className="text-sm text-gray-500">Avg Distance</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
