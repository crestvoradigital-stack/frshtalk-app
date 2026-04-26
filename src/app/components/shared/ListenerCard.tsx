import { Phone, Video, Star, BadgeCheck, MapPin, Heart } from 'lucide-react';
import { Listener } from '../../../types';
import { useFavorites } from '../../../hooks/useFavorites';
import { CALL_RATES } from '../../../constants';

interface ListenerCardProps {
  listener: Listener;
  onVoiceCall: (listener: Listener) => void;
  onVideoCall: (listener: Listener) => void;
}

export function ListenerCard({ listener, onVoiceCall, onVideoCall }: ListenerCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const isListenerFavorite = isFavorite(listener.id);

  return (
    <div className="bg-[#2a2a2a] rounded-2xl p-4 relative">
      {/* Favorite Button */}
      <button
        onClick={() => toggleFavorite(listener.id)}
        className="absolute top-3 right-3 z-10"
        aria-label={isListenerFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        <Heart
          className={`w-5 h-5 transition-colors ${
            isListenerFavorite
              ? 'fill-pink-500 text-pink-500'
              : 'text-white/50 hover:text-pink-500'
          }`}
        />
      </button>

      {/* Avatar and Online Status */}
      <div className="flex items-start gap-3 mb-3">
        <div className="relative flex-shrink-0">
          <img
            src={listener.avatar}
            alt={listener.username}
            className="w-16 h-16 rounded-full object-cover"
            loading="lazy"
          />
          {listener.isOnline && (
            <span
              className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-[#2a2a2a] rounded-full"
              aria-label="Online"
            />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <h3 className="text-white font-medium truncate">{listener.username}</h3>
            {listener.isVerified && (
              <BadgeCheck
                className="w-4 h-4 text-blue-500 flex-shrink-0"
                aria-label="Verified listener"
              />
            )}
          </div>

          {/* Rating and Location */}
          <div className="flex items-center gap-3 text-xs text-white/70">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
              <span>
                {listener.rating.toFixed(1)} ({listener.reviewCount})
              </span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{listener.location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tags */}
      {listener.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {listener.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="text-xs bg-[#3a3a3a] text-white/80 px-2.5 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
          {listener.tags.length > 3 && (
            <span className="text-xs text-white/50 px-2.5 py-1">
              +{listener.tags.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Call Status or Call Buttons */}
      {listener.isOnCall && listener.waitTime !== undefined ? (
        <div className="bg-[#3a3a3a] rounded-lg p-3 text-center">
          <p className="text-white/70 text-sm">On call</p>
          <p className="text-white text-sm">
            Wait time: <span className="font-medium">{listener.waitTime} min</span>
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onVoiceCall(listener)}
            className="flex items-center justify-center gap-2 bg-[#6366f1] hover:bg-[#5558e3] active:scale-95 text-white py-2.5 rounded-lg transition-all"
            aria-label={`Start voice call with ${listener.username}`}
          >
            <Phone className="w-4 h-4" />
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium">{CALL_RATES.voice}</span>
              <span className="text-xs opacity-90">coin/min</span>
            </div>
          </button>

          <button
            onClick={() => onVideoCall(listener)}
            className="flex items-center justify-center gap-2 bg-[#8b5cf6] hover:bg-[#7c3aed] active:scale-95 text-white py-2.5 rounded-lg transition-all"
            aria-label={`Start video call with ${listener.username}`}
          >
            <Video className="w-4 h-4" />
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium">{CALL_RATES.video}</span>
              <span className="text-xs opacity-90">coin/min</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
