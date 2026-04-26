import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { useInterval } from '../../../hooks/useInterval';
import { PROMO_OFFERS, ANIMATION_DURATIONS } from '../../../constants';
import { formatPrice, formatCoins } from '../../../lib/validation';

interface PromoCarouselProps {
  onPurchase?: (offerId: string) => void;
}

export function PromoCarousel({ onPurchase }: PromoCarouselProps) {
  const [currentPromo, setCurrentPromo] = useState(0);

  useInterval(() => {
    setCurrentPromo((prev) => (prev + 1) % PROMO_OFFERS.length);
  }, ANIMATION_DURATIONS.promoRotation);

  const promo = PROMO_OFFERS[currentPromo];

  return (
    <div
      className="bg-gradient-to-r from-[#ff6b6b] via-[#ff8787] to-[#ffa5a5] rounded-2xl p-4 relative overflow-hidden transition-all duration-500"
      role="region"
      aria-label="Promotional offer"
    >
      {/* Sparkle Icons */}
      <Sparkles className="absolute top-2 right-2 w-5 h-5 text-white/30" aria-hidden="true" />
      <Sparkles
        className="absolute bottom-2 left-2 w-4 h-4 text-white/20"
        aria-hidden="true"
      />

      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-white text-xs mb-1 opacity-90">Special Offer</p>
          <p className="text-white text-2xl font-bold">
            Save {formatPrice(promo.discountAmount || 0)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-white/90 text-sm">Get</p>
          <p className="text-white text-xl font-bold">{formatCoins(promo.coins)}</p>
          <p className="text-white/90 text-xs">coins</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-white/90 text-sm">
          For only <span className="font-semibold">{formatPrice(promo.price)}</span>
        </p>
        {onPurchase && (
          <button
            onClick={() => onPurchase(promo.id)}
            className="bg-white text-[#ff6b6b] px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-white/90 active:scale-95 transition-all"
            aria-label={`Purchase ${promo.coins} coins for ${formatPrice(promo.price)}`}
          >
            Buy Now
          </button>
        )}
      </div>

      {/* Dots Indicator */}
      <div className="flex gap-1.5 mt-3" role="tablist" aria-label="Promo navigation">
        {PROMO_OFFERS.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPromo(index)}
            className={`h-1.5 rounded-full transition-all ${
              index === currentPromo ? 'w-6 bg-white' : 'w-1.5 bg-white/50'
            }`}
            role="tab"
            aria-selected={index === currentPromo}
            aria-label={`Go to offer ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
