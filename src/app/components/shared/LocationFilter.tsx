import { LOCATIONS } from '../../../constants';

interface LocationFilterProps {
  selectedLocation: string;
  onLocationChange: (location: string) => void;
}

export function LocationFilter({ selectedLocation, onLocationChange }: LocationFilterProps) {
  return (
    <div className="mb-4" role="region" aria-label="Location filter">
      <h3 className="text-white text-sm mb-2 px-1">Filter by Location</h3>
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
        {LOCATIONS.map((location) => (
          <button
            key={location}
            onClick={() => onLocationChange(location)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
              selectedLocation === location
                ? 'bg-[#6366f1] text-white'
                : 'bg-[#2a2a2a] text-white/70 hover:bg-[#3a3a3a]'
            }`}
            aria-pressed={selectedLocation === location}
            aria-label={`Filter by ${location}`}
          >
            {location}
          </button>
        ))}
      </div>
    </div>
  );
}
