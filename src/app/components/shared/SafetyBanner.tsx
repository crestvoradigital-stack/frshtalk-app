import { useState } from 'react';
import { useInterval } from '../../../hooks/useInterval';
import { BANNER_SLIDES, ANIMATION_DURATIONS } from '../../../constants';

export function SafetyBanner() {
  const [currentBanner, setCurrentBanner] = useState(0);

  useInterval(() => {
    setCurrentBanner((prev) => (prev + 1) % BANNER_SLIDES.length);
  }, ANIMATION_DURATIONS.bannerRotation);

  const banner = BANNER_SLIDES[currentBanner];

  return (
    <div
      className={`bg-gradient-to-r ${banner.color} rounded-2xl p-4 transition-all duration-500`}
      role="region"
      aria-label="Safety banner"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-white font-semibold text-base mb-1">{banner.title}</h3>
          <p className="text-white/90 text-sm">{banner.subtitle}</p>
        </div>
      </div>

      {/* Dots Indicator */}
      <div className="flex gap-1.5 mt-3" role="tablist" aria-label="Banner navigation">
        {BANNER_SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentBanner(index)}
            className={`h-1.5 rounded-full transition-all ${
              index === currentBanner ? 'w-6 bg-white' : 'w-1.5 bg-white/50'
            }`}
            role="tab"
            aria-selected={index === currentBanner}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
