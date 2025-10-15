import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { TrophyIcon, HomeIcon, ChartBarIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

const Layout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex items-center">
                <TrophyIcon className="h-8 w-8 text-strava mr-2" />
                <span className="text-xl font-bold text-gray-900">Strava Runner</span>
              </Link>
              <div className="ml-10 flex items-center space-x-4">
                <Link
                  to="/"
                  className="text-gray-700 hover:text-strava px-3 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <HomeIcon className="h-5 w-5 mr-1" />
                  Home
                </Link>
                {user && (
                  <Link
                    to="/dashboard"
                    className="text-gray-700 hover:text-strava px-3 py-2 rounded-md text-sm font-medium flex items-center"
                  >
                    <ChartBarIcon className="h-5 w-5 mr-1" />
                    Dashboard
                  </Link>
                )}
                <Link
                  to="/leaderboard"
                  className="text-gray-700 hover:text-strava px-3 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <TrophyIcon className="h-5 w-5 mr-1" />
                  Leaderboard
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              {user ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    {user.profilePicture && (
                      <img
                        src={user.profilePicture}
                        alt={user.firstName}
                        className="h-8 w-8 rounded-full mr-2"
                      />
                    )}
                    <span className="text-sm font-medium text-gray-700">
                      {user.firstName} {user.lastName}
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    className="text-gray-700 hover:text-strava px-3 py-2 rounded-md text-sm font-medium flex items-center"
                  >
                    <ArrowRightOnRectangleIcon className="h-5 w-5 mr-1" />
                    Logout
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
