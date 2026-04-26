import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Home, Clock, User, Coins, Shuffle, RefreshCw } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useWallet } from '../../contexts/WalletContext';
import { ListenerCard } from './shared/ListenerCard';
import { SafetyBanner } from './shared/SafetyBanner';
import { PromoCarousel } from './shared/PromoCarousel';
import { LocationFilter } from './shared/LocationFilter';
import { EmptyState } from './shared/EmptyState';
import { LoadingSpinner } from './shared/LoadingSpinner';
import { MOCK_LISTENERS } from '../../services/mockData';
import { Listener } from '../../types';
import { shuffleArray } from '../../lib/utils';
import { APP_CONFIG } from '../../constants';

function FrshTalkLogo() {
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <svg className="w-6 h-6 sm:w-7 sm:h-7" viewBox="0 0 32 32" fill="none" aria-hidden="true">
          <path
            d="M16 28l-1.8-1.6C7.4 20.4 3 16.5 3 11.5 3 7.4 6.2 4 10.2 4c2.2 0 4.3 1 5.8 2.6C17.5 5 19.6 4 21.8 4 25.8 4 29 7.4 29 11.5c0 5-4.4 8.9-11.2 14.9L16 28z"
            fill="white"
          />
        </svg>
        <span className="absolute -bottom-1 -right-0.5 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#fbbf24] rounded-full" />
      </div>
      <span className="text-white text-lg sm:text-xl font-medium tracking-tight">
        {APP_CONFIG.name}
      </span>
    </div>
  );
}

type TabType = 'home' | 'recents' | 'profile';

interface HomeScreenProps {
  onBack?: () => void;
}

export function HomeScreen({ onBack }: HomeScreenProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { balance } = useWallet();

  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [listeners, setListeners] = useState<Listener[]>(MOCK_LISTENERS);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [connectingListener, setConnectingListener] = useState<Listener | null>(null);
  const [isVideoCall, setIsVideoCall] = useState(false);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    if (tab === 'recents') {
      navigate('/recents');
    } else if (tab === 'profile') {
      navigate('/profile');
    }
  };

  const handleVoiceCall = (listener: Listener) => {
    setConnectingListener(listener);
    setIsVideoCall(false);
    // Navigate to connecting screen
    // TODO: Implement proper call flow
  };

  const handleVideoCall = (listener: Listener) => {
    setConnectingListener(listener);
    setIsVideoCall(true);
    // Navigate to connecting screen
    // TODO: Implement proper call flow
  };

  const handleShuffleListeners = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setListeners(shuffleArray([...MOCK_LISTENERS]));
      setIsRefreshing(false);
    }, 1000);
  };

  const handlePurchasePromo = (offerId: string) => {
    navigate('/wallet');
  };

  // Filter listeners by location
  const filteredListeners =
    selectedLocation === 'All'
      ? listeners
      : listeners.filter((l) => l.location === selectedLocation);

  return (
    <div className="h-full w-full bg-[#0d0d0d] flex flex-col">
      {/* Header */}
      <header
        className="flex items-center justify-between px-3 py-2.5 flex-shrink-0 border-b border-[#2a2a2a]"
        role="banner"
      >
        <FrshTalkLogo />

        <button
          onClick={() => navigate('/wallet')}
          className="flex items-center gap-1.5 bg-[#2a2a2a] hover:bg-[#3a3a3a] transition-colors rounded-full px-2.5 py-1.5 active:scale-95"
          aria-label={`Wallet balance: ${balance} coins`}
        >
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
            <span className="text-[10px] font-bold text-white" aria-hidden="true">
              $
            </span>
          </div>
          <span className="text-white text-sm font-medium">{balance}</span>
        </button>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-3 pb-20" role="main">
        {/* Safety Banner */}
        <div className="py-3">
          <SafetyBanner />
        </div>

        {/* Promo Carousel */}
        <div className="pb-4">
          <PromoCarousel onPurchase={handlePurchasePromo} />
        </div>

        {/* Location Filter */}
        <LocationFilter
          selectedLocation={selectedLocation}
          onLocationChange={setSelectedLocation}
        />

        {/* New Listeners Section */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-white text-lg font-semibold">Available Listeners</h2>
            <button
              onClick={handleShuffleListeners}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 text-[#6366f1] hover:text-[#5558e3] active:scale-95 transition-all disabled:opacity-50"
              aria-label="Shuffle listeners"
            >
              {isRefreshing ? (
                <RefreshCw className="w-4 h-4 animate-spin" aria-hidden="true" />
              ) : (
                <Shuffle className="w-4 h-4" aria-hidden="true" />
              )}
              <span className="text-sm font-medium">Shuffle</span>
            </button>
          </div>

          {isRefreshing ? (
            <div className="py-12">
              <LoadingSpinner message="Refreshing listeners..." />
            </div>
          ) : filteredListeners.length === 0 ? (
            <EmptyState
              icon={User}
              title="No listeners found"
              description={`No listeners available in ${selectedLocation}. Try selecting a different location.`}
              action={{
                label: 'Show All',
                onClick: () => setSelectedLocation('All'),
              }}
            />
          ) : (
            <div className="space-y-3">
              {filteredListeners.map((listener) => (
                <ListenerCard
                  key={listener.id}
                  listener={listener}
                  onVoiceCall={handleVoiceCall}
                  onVideoCall={handleVideoCall}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav
        className="flex-shrink-0 bg-[#0d0d0d] border-t border-[#2a2a2a] fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="flex justify-around items-center py-1.5">
          <button
            onClick={() => handleTabChange('home')}
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 transition-colors ${
              activeTab === 'home' ? 'text-white' : 'text-gray-500'
            }`}
            aria-current={activeTab === 'home' ? 'page' : undefined}
            aria-label="Home"
          >
            <Home className="w-5 h-5" aria-hidden="true" />
            <span className="text-[10px] font-medium">Home</span>
          </button>

          <button
            onClick={() => handleTabChange('recents')}
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 transition-colors ${
              activeTab === 'recents' ? 'text-white' : 'text-gray-500'
            }`}
            aria-current={activeTab === 'recents' ? 'page' : undefined}
            aria-label="Recent calls"
          >
            <Clock className="w-5 h-5" aria-hidden="true" />
            <span className="text-[10px] font-medium">Recents</span>
          </button>

          <button
            onClick={() => handleTabChange('profile')}
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 transition-colors ${
              activeTab === 'profile' ? 'text-white' : 'text-gray-500'
            }`}
            aria-current={activeTab === 'profile' ? 'page' : undefined}
            aria-label="Profile"
          >
            <User className="w-5 h-5" aria-hidden="true" />
            <span className="text-[10px] font-medium">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
