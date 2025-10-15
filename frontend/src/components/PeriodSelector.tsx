import { TimePeriod } from '../types';

interface PeriodSelectorProps {
  period: TimePeriod;
  onChange: (period: TimePeriod) => void;
}

const PeriodSelector = ({ period, onChange }: PeriodSelectorProps) => {
  const periods: { value: TimePeriod; label: string }[] = [
    { value: 'day', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
  ];

  return (
    <div className="flex space-x-2">
      {periods.map((p) => (
        <button
          key={p.value}
          onClick={() => onChange(p.value)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            period === p.value
              ? 'bg-strava text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
          }`}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
};

export default PeriodSelector;
