import { Activity } from '../types';
import { formatTime, formatDateTime } from '../utils/formatters';
import { ClockIcon, MapPinIcon, FireIcon } from '@heroicons/react/24/outline';

interface ActivityCardProps {
  activity: Activity;
}

const ActivityCard = ({ activity }: ActivityCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{activity.name}</h3>
          <p className="text-sm text-gray-500">{formatDateTime(activity.startDateLocal)}</p>
        </div>
        <span className="bg-strava text-white text-xs font-medium px-2.5 py-0.5 rounded">
          {activity.type}
        </span>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col">
          <div className="flex items-center text-gray-500 mb-1">
            <MapPinIcon className="h-4 w-4 mr-1" />
            <span className="text-xs">Distance</span>
          </div>
          <span className="text-lg font-bold text-gray-900">{activity.distanceKm} km</span>
        </div>
        
        <div className="flex flex-col">
          <div className="flex items-center text-gray-500 mb-1">
            <ClockIcon className="h-4 w-4 mr-1" />
            <span className="text-xs">Duration</span>
          </div>
          <span className="text-lg font-bold text-gray-900">
            {formatTime(activity.movingTime)}
          </span>
        </div>
        
        <div className="flex flex-col">
          <div className="flex items-center text-gray-500 mb-1">
            <FireIcon className="h-4 w-4 mr-1" />
            <span className="text-xs">Pace</span>
          </div>
          <span className="text-lg font-bold text-gray-900">
            {activity.pace || 'N/A'} /km
          </span>
        </div>
      </div>
      
      {activity.totalElevationGain && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Elevation: <span className="font-semibold">{activity.totalElevationGain.toFixed(0)}m</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default ActivityCard;
