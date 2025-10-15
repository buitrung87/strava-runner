import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { TrophyIcon, ChartBarIcon, UsersIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline';

const Home = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const features = [
    {
      icon: ChartBarIcon,
      title: 'Track Your Progress',
      description: 'View detailed statistics about your running activities, including distance, pace, and elevation.',
    },
    {
      icon: TrophyIcon,
      title: 'Compete on Leaderboards',
      description: 'See how you rank against other club members with daily, weekly, and monthly leaderboards.',
    },
    {
      icon: UsersIcon,
      title: 'Join the Community',
      description: 'Connect with fellow runners and stay motivated together as a club.',
    },
    {
      icon: CloudArrowUpIcon,
      title: 'Auto Sync',
      description: 'Your activities automatically sync from Strava, keeping your stats up to date.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-strava to-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">
              Welcome to Strava Runner
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Track your running activities, compete with your club members, and achieve your fitness goals together.
            </p>
            {user ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-white text-strava px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
              >
                Go to Dashboard
              </button>
            ) : (
              <button
                onClick={login}
                className="bg-white text-strava px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors flex items-center mx-auto"
              >
                <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
                </svg>
                Connect with Strava
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Everything You Need to Track Your Running
          </h2>
          <p className="text-lg text-gray-600">
            Powerful features to help you stay motivated and reach your goals
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <feature.icon className="h-12 w-12 text-strava mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join our running club and start tracking your progress today
          </p>
          {!user && (
            <button
              onClick={login}
              className="bg-strava text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-orange-600 transition-colors"
            >
              Sign in with Strava
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
