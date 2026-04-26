import { useState, useEffect } from 'react';
import { Phone, Video, Home, Clock, User, Shuffle, ArrowUp, RefreshCw, Star, BadgeCheck, MapPin } from 'lucide-react';
import { ConnectingScreen } from './ConnectingScreen';
import { WalletScreen } from './WalletScreen';
import { ProfileScreen } from './ProfileScreen';
import { TransactionsScreen } from './TransactionsScreen';
import { LanguageSettingsScreen } from './LanguageSettingsScreen';
import { HelpSupportScreen } from './HelpSupportScreen';
import { AccountSettingsScreen } from './AccountSettingsScreen';
import { RecentsScreen } from './RecentsScreen';
import { ReferralProgramScreen } from './ReferralProgramScreen';
import { AchievementsScreen } from './AchievementsScreen';
import { CrisisSupportScreen } from './CrisisSupportScreen';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { ListenerVerificationScreen } from './ListenerVerificationScreen';

const users = [
  {
    id: 1,
    username: 'mouni_1612',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face',
    voiceRate: 1,
    videoRate: 6,
    tags: ['Family and relationships', 'Films and music', 'Career'],
    isOnCall: true,
    waitTime: 10,
    rating: 4.8,
    reviewCount: 234,
    location: 'Hyderabad',
    isVerified: true,
  },
  {
    id: 2,
    username: 'rahul5525',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    voiceRate: 1,
    videoRate: 6,
    tags: ['Family and relationships', 'Childhood memories', 'Emotional'],
    isOnCall: false,
    rating: 4.9,
    reviewCount: 187,
    location: 'Bangalore',
    isVerified: true,
  },
  {
    id: 3,
    username: 'eesha1908',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face',
    voiceRate: 1,
    videoRate: 6,
    tags: [],
    isOnCall: false,
    rating: 4.6,
    reviewCount: 92,
    location: 'Vizag',
    isVerified: false,
  },
  {
    id: 4,
    username: 'paddu2508',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&crop=face',
    voiceRate: 1,
    videoRate: 6,
    tags: ['Emotional or Supportive talk', 'Culture, Roots & Memories'],
    isOnCall: false,
    rating: 4.7,
    reviewCount: 156,
    location: 'Kurnool',
    isVerified: true,
  },
];

const bannerSlides = [
  {
    id: 1,
    title: 'Take action',
    subtitle: 'Always report inappropriate behaviour',
    color: 'from-rose-600 to-pink-600',
  },
  {
    id: 2,
    title: 'Stay safe',
    subtitle: 'Your privacy is our priority',
    color: 'from-blue-600 to-cyan-600',
  },
  {
    id: 3,
    title: 'Be respectful',
    subtitle: 'Treat others the way you want to be treated',
    color: 'from-violet-600 to-purple-600',
  },
];

const promoOffers = [
  {
    id: 1,
    discountAmount: '750',
    coins: 3600,
    price: 949,
  },
  {
    id: 2,
    discountAmount: '450',
    coins: 2500,
    price: 688,
  },
];

function FrshTalkLogo() {
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <svg className="w-6 h-6 sm:w-7 sm:h-7" viewBox="0 0 32 32" fill="none">
          <path
            d="M16 28l-1.8-1.6C7.4 20.4 3 16.5 3 11.5 3 7.4 6.2 4 10.2 4c2.2 0 4.3 1 5.8 2.6C17.5 5 19.6 4 21.8 4 25.8 4 29 7.4 29 11.5c0 5-4.4 8.9-11.2 14.9L16 28z"
            fill="white"
          />
        </svg>
        <span className="absolute -bottom-1 -right-0.5 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#fbbf24] rounded-full" />
      </div>
      <span className="text-white text-lg sm:text-xl font-medium tracking-tight">FrshTalk</span>
    </div>
  );
}

function DiamondIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L2 9l10 13 10-13L12 2zm0 3.5L18.5 9 12 18.5 5.5 9 12 5.5z" />
    </svg>
  );
}

function MegaphoneIcon() {
  return (
    <svg className="w-12 h-12 sm:w-16 sm:h-16" viewBox="0 0 64 64" fill="none">
      <path d="M48 16L20 28v12l28 12V16z" fill="#f5e6d3" stroke="#d4c4b0" strokeWidth="2" />
      <path d="M20 28H12a4 4 0 00-4 4v4a4 4 0 004 4h8V28z" fill="#f5e6d3" stroke="#d4c4b0" strokeWidth="2" />
      <circle cx="52" cy="32" r="6" fill="#f5e6d3" stroke="#d4c4b0" strokeWidth="2" />
      <path d="M12 40v8a4 4 0 004 4h2a4 4 0 004-4v-8" stroke="#d4c4b0" strokeWidth="2" fill="none" />
    </svg>
  );
}

interface HomeScreenProps {
  onBack?: () => void;
}

export function HomeScreen({ onBack }: HomeScreenProps) {
  const [activeTab, setActiveTab] = useState<'home' | 'recents' | 'profile'>('home');
  const [currentBanner, setCurrentBanner] = useState(0);
  const [currentPromo, setCurrentPromo] = useState(0);
  const [coins] = useState(100);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showNewDostts, setShowNewDostts] = useState(true);
  const [connectingUser, setConnectingUser] = useState<(typeof users)[0] | null>(null);
  const [isVideoCall, setIsVideoCall] = useState(false);
  const [showWallet, setShowWallet] = useState(false);
  const [profileScreen, setProfileScreen] = useState<'main' | 'transactions' | 'language' | 'help' | 'account' | 'referral' | 'achievements' | 'crisis' | 'analytics' | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [showListenerVerification, setShowListenerVerification] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % bannerSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPromo((prev) => (prev + 1) % promoOffers.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!showNewDostts) {
        setShowNewDostts(true);
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [showNewDostts]);

  const handleRefreshNewDostts = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setShowNewDostts(false);
    }, 1000);
  };

  const handleVoiceCall = (user: (typeof users)[0]) => {
    setConnectingUser(user);
    setIsVideoCall(false);
  };

  const handleVideoCall = (user: (typeof users)[0]) => {
    setConnectingUser(user);
    setIsVideoCall(true);
  };

  const handleCancelCall = () => {
    setConnectingUser(null);
  };

  const handleRandomCall = () => {
    // Filter available listeners (not on call)
    const availableListeners = users.filter((user) => !user.isOnCall);

    if (availableListeners.length === 0) {
      // No listeners available - could show a toast/alert
      return;
    }

    // Pick random listener
    const randomIndex = Math.floor(Math.random() * availableListeners.length);
    const randomListener = availableListeners[randomIndex];

    // Start voice call automatically
    handleVoiceCall(randomListener);
  };

  const handleTabChange = (tab: 'home' | 'recents' | 'profile') => {
    setActiveTab(tab);
    if (tab === 'profile') {
      setProfileScreen('main');
    } else {
      setProfileScreen(null);
    }
  };

  const handleProfileNavigate = (screen: 'transactions' | 'language' | 'help' | 'account' | 'referral' | 'achievements' | 'crisis' | 'analytics') => {
    setProfileScreen(screen);
  };

  const handleLogout = () => {
    // Handle logout - could navigate back to welcome screen
    console.log('Logout clicked');
  };

  // Show wallet screen
  if (showWallet) {
    return <WalletScreen currentCoins={coins} onBack={() => setShowWallet(false)} />;
  }

  // Show listener verification screen
  if (showListenerVerification) {
    return (
      <ListenerVerificationScreen
        onBack={() => setShowListenerVerification(false)}
        onBecomeCustomer={() => {
          setShowListenerVerification(false);
          setActiveTab('home');
        }}
      />
    );
  }

  // Show connecting screen
  if (connectingUser) {
    return (
      <ConnectingScreen
        username={connectingUser.username}
        avatar={connectingUser.avatar}
        isVideoCall={isVideoCall}
        onCancel={handleCancelCall}
      />
    );
  }

  // Show profile screens
  if (activeTab === 'profile') {
    if (profileScreen === 'transactions') {
      return (
        <TransactionsScreen
          coins={coins}
          onBack={() => setProfileScreen('main')}
          onAddCoins={() => setShowWallet(true)}
        />
      );
    }

    if (profileScreen === 'language') {
      return <LanguageSettingsScreen onBack={() => setProfileScreen('main')} />;
    }

    if (profileScreen === 'help') {
      return <HelpSupportScreen onBack={() => setProfileScreen('main')} />;
    }

    if (profileScreen === 'account') {
      return <AccountSettingsScreen onBack={() => setProfileScreen('main')} />;
    }

    if (profileScreen === 'referral') {
      return <ReferralProgramScreen onBack={() => setProfileScreen('main')} />;
    }

    if (profileScreen === 'achievements') {
      return <AchievementsScreen onBack={() => setProfileScreen('main')} />;
    }

    if (profileScreen === 'crisis') {
      return <CrisisSupportScreen onBack={() => setProfileScreen('main')} />;
    }

    if (profileScreen === 'analytics') {
      return <AnalyticsDashboard onBack={() => setProfileScreen('main')} />;
    }

    // Main profile screen
    return (
      <div className="h-full w-full bg-gradient-to-b from-[#0F0A1E] via-[#1A0F2E] to-[#0F0A1E] flex flex-col">
        <header className="flex items-center justify-between px-3 py-3 flex-shrink-0 backdrop-blur-sm bg-white/5 border-b border-white/5">
          <FrshTalkLogo />

          <button
            onClick={() => setShowWallet(true)}
            className="flex items-center gap-1.5 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 hover:from-yellow-500/30 hover:to-orange-500/30 border border-yellow-500/30 transition-all rounded-full px-3 py-1.5 shadow-lg shadow-yellow-500/10"
          >
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-yellow-500/50">
              <span className="text-[10px] font-bold text-white">$</span>
            </div>
            <span className="text-white text-sm font-semibold">{coins}</span>
          </button>
        </header>

        <div className="flex-1 overflow-hidden">
          <ProfileScreen
            onNavigate={handleProfileNavigate}
            onWalletClick={() => setShowWallet(true)}
            onLogout={handleLogout}
            onSwitchToListener={() => setShowListenerVerification(true)}
          />
        </div>

        <div className="flex-shrink-0 bg-black/30 backdrop-blur-md border-t border-white/10">
          <div className="flex justify-around items-center py-2">
            <button onClick={() => handleTabChange('home')} className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-all duration-300 ${activeTab === 'home' ? 'text-white bg-violet-600/30' : 'text-white/50 hover:text-white/80'}`}>
              <Home className="w-5 h-5" />
              <span className="text-[10px] font-semibold">Home</span>
            </button>
            <button onClick={() => handleTabChange('recents')} className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-all duration-300 ${activeTab === 'recents' ? 'text-white bg-violet-600/30' : 'text-white/50 hover:text-white/80'}`}>
              <Clock className="w-5 h-5" />
              <span className="text-[10px] font-semibold">Recents</span>
            </button>
            <button onClick={() => handleTabChange('profile')} className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-all duration-300 ${activeTab === 'profile' ? 'text-white bg-violet-600/30' : 'text-white/50 hover:text-white/80'}`}>
              <User className="w-5 h-5" />
              <span className="text-[10px] font-semibold">Profile</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show recents screen
  if (activeTab === 'recents') {
    return (
      <div className="h-full w-full bg-gradient-to-b from-[#0F0A1E] via-[#1A0F2E] to-[#0F0A1E] flex flex-col">
        <RecentsScreen
          activeTab="recents"
          onTabChange={handleTabChange}
          onOpenWallet={() => setShowWallet(true)}
          coins={coins}
          onVoiceCall={(user) => {
            // Convert recent call user to listener format
            const listener = {
              id: user.id,
              username: user.name,
              avatar: user.avatar,
              voiceRate: 1,
              videoRate: 6,
              tags: [],
              isOnCall: false,
              rating: 4.8,
              reviewCount: 150,
              location: 'Unknown',
              isVerified: true,
            };
            handleVoiceCall(listener);
          }}
          onVideoCall={(user) => {
            // Convert recent call user to listener format
            const listener = {
              id: user.id,
              username: user.name,
              avatar: user.avatar,
              voiceRate: 1,
              videoRate: 6,
              tags: [],
              isOnCall: false,
              rating: 4.8,
              reviewCount: 150,
              location: 'Unknown',
              isVerified: true,
            };
            handleVideoCall(listener);
          }}
        />
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-gradient-to-b from-[#0F0A1E] via-[#1A0F2E] to-[#0F0A1E] flex flex-col">
      <header className="flex items-center justify-between px-3 py-3 flex-shrink-0 backdrop-blur-sm bg-white/5 border-b border-white/5">
        <FrshTalkLogo />

        <button
          onClick={() => setShowWallet(true)}
          className="flex items-center gap-1.5 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 hover:from-yellow-500/30 hover:to-orange-500/30 border border-yellow-500/30 transition-all rounded-full px-3 py-1.5 shadow-lg shadow-yellow-500/10"
        >
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-yellow-500/50">
            <span className="text-[10px] font-bold text-white">$</span>
          </div>
          <span className="text-white text-sm font-semibold">{coins}</span>
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-3 pb-4">
        {/* Smart Recommendations */}
        <div className="mb-3 mt-3">
          <div className="flex items-center justify-between mb-2.5 px-1">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
                <Star className="w-3.5 h-3.5 text-white fill-white" />
              </div>
              <h3 className="text-white font-semibold text-sm">For You</h3>
            </div>
          </div>
          <div className="flex gap-2.5 overflow-x-auto scrollbar-hide pb-1">
            {users.slice(0, 3).map((user) => (
              <div
                key={`rec-${user.id}`}
                className="flex-shrink-0 w-24 group cursor-pointer"
              >
                <div className="relative mb-1.5">
                  <div className="absolute inset-0 bg-gradient-to-br from-violet-500/50 to-fuchsia-500/50 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="relative w-24 h-24 object-cover rounded-xl border-2 border-violet-500/30 group-hover:border-violet-400/60 transition-all group-hover:scale-105 duration-300"
                  />
                  {user.isVerified && (
                    <div className="absolute -top-1 -right-1 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full p-0.5 shadow-lg shadow-blue-500/50">
                      <BadgeCheck className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <div className="absolute bottom-1 left-1 right-1 bg-black/70 backdrop-blur-md rounded-lg px-1.5 py-0.5 flex items-center justify-center gap-0.5 border border-white/10">
                    <Star className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400" />
                    <span className="text-white text-[10px] font-bold">{user.rating}</span>
                  </div>
                </div>
                <p className="text-white/90 text-[11px] font-medium truncate text-center">{user.username}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Location Filters */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-3 scrollbar-hide">
          {['All', 'Hyderabad', 'Bangalore', 'Vizag', 'Kurnool'].map((location) => (
            <button
              key={location}
              onClick={() => setSelectedLocation(location)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full whitespace-nowrap transition-all duration-300 ${
                selectedLocation === location
                  ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/30 scale-105'
                  : 'bg-white/5 backdrop-blur-sm text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              {location !== 'All' && <MapPin className="w-3.5 h-3.5" />}
              <span className="text-sm font-medium">{location}</span>
            </button>
          ))}
        </div>

        {showNewDostts && (
          <div className="flex justify-center mb-3">
            <button
              onClick={handleRefreshNewDostts}
              className="flex items-center gap-2 bg-gradient-to-r from-fuchsia-600/20 to-pink-600/20 hover:from-fuchsia-600/30 hover:to-pink-600/30 border border-fuchsia-500/30 transition-all duration-300 rounded-full px-4 py-2 shadow-lg shadow-fuchsia-500/20 hover:scale-105"
            >
              <div className="flex -space-x-2">
                <div className="w-6 h-6 rounded-full border-2 border-fuchsia-500/50 overflow-hidden shadow-lg">
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" alt="" className="w-full h-full object-cover" />
                </div>
                <div className="w-6 h-6 rounded-full border-2 border-fuchsia-500/50 overflow-hidden shadow-lg">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" alt="" className="w-full h-full object-cover" />
                </div>
                <div className="w-6 h-6 rounded-full border-2 border-fuchsia-500/50 overflow-hidden shadow-lg">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face" alt="" className="w-full h-full object-cover" />
                </div>
              </div>
              <span className="text-white text-sm font-semibold">New FrshTalks</span>
              {isRefreshing ? <RefreshCw className="w-4 h-4 text-white animate-spin" /> : <ArrowUp className="w-4 h-4 text-fuchsia-400" />}
            </button>
          </div>
        )}

        <div className="mb-3">
          <div className={`relative bg-gradient-to-r ${bannerSlides[currentBanner].color} rounded-2xl p-3.5 overflow-hidden border border-white/10 shadow-lg`}>
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-white text-base font-bold mb-0.5">{bannerSlides[currentBanner].title}</h3>
                <p className="text-white/90 text-xs font-medium">{bannerSlides[currentBanner].subtitle}</p>
              </div>
              <div className="flex-shrink-0 ml-2 scale-75 opacity-80">
                <MegaphoneIcon />
              </div>
            </div>

            <div className="relative flex justify-center gap-1 mt-2.5">
              {bannerSlides.map((_, index) => (
                <button key={index} onClick={() => setCurrentBanner(index)} className={`h-1.5 rounded-full transition-all ${index === currentBanner ? 'bg-white w-4' : 'bg-white/50 w-1.5'}`} />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {users
            .filter((user) => selectedLocation === 'All' || user.location === selectedLocation)
            .map((user) => (
            <div key={user.id} className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-violet-500/30 transition-all duration-300 shadow-lg">
              <div className="relative h-52 bg-gradient-to-b from-violet-900/20 to-fuchsia-900/20">
                <img src={user.avatar} alt={user.username} className="w-full h-full object-cover object-top" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                {user.isVerified && (
                  <div className="absolute top-2 right-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full p-1 shadow-lg shadow-blue-500/50">
                    <BadgeCheck className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>

              <div className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white text-base font-semibold">{user.username}</h4>
                  <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 px-2.5 py-1 rounded-full">
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                    <span className="text-white text-xs font-semibold">{user.rating}</span>
                    <span className="text-white/50 text-xs">({user.reviewCount})</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 mb-2">
                  <MapPin className="w-3.5 h-3.5 text-violet-400" />
                  <span className="text-white/70 text-xs">{user.location}</span>
                </div>

                {user.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {user.tags.map((tag, index) => (
                      <span key={index} className="bg-white/10 backdrop-blur-sm border border-white/10 text-white/90 text-xs px-2.5 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {user.isOnCall ? (
                  <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-xl py-2 px-3">
                    <p className="text-center text-orange-300 text-sm font-medium">On call, wait time ~ {user.waitTime} minutes</p>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button onClick={() => handleVoiceCall(user)} className="flex-1 flex items-center justify-center gap-1.5 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 hover:from-emerald-600/30 hover:to-teal-600/30 border border-emerald-500/30 transition-all duration-300 rounded-xl py-2.5 shadow-lg shadow-emerald-500/10">
                      <DiamondIcon className="w-4 h-4 text-emerald-400" />
                      <span className="text-white text-sm font-semibold">{user.voiceRate}/min</span>
                      <Phone className="w-4 h-4 text-emerald-400" />
                    </button>
                    <button onClick={() => handleVideoCall(user)} className="flex-1 flex items-center justify-center gap-1.5 bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 hover:from-violet-600/30 hover:to-fuchsia-600/30 border border-violet-500/30 transition-all duration-300 rounded-xl py-2.5 shadow-lg shadow-violet-500/10">
                      <DiamondIcon className="w-4 h-4 text-violet-400" />
                      <span className="text-white text-sm font-semibold">{user.videoRate}/min</span>
                      <Video className="w-4 h-4 text-violet-400" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <button onClick={() => setShowWallet(true)} className="fixed bottom-20 left-2 z-10 text-left group">
        <div className="bg-gradient-to-br from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 transition-all duration-300 rounded-2xl px-3 py-2.5 shadow-xl shadow-emerald-500/30 border border-emerald-400/30 w-[180px] group-hover:scale-105">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-white text-xs font-bold leading-tight">Flat ₹{promoOffers[currentPromo].discountAmount} off</p>
              <p className="text-white/95 text-[11px] mt-0.5 font-medium">
                {promoOffers[currentPromo].coins} coins @ ₹{promoOffers[currentPromo].price} <span className="ml-0.5">&#9654;</span>
              </p>
            </div>
            <div className="flex-shrink-0 ml-1.5">
              <div className="relative w-9 h-9">
                <div className="absolute top-0 left-0 w-5 h-5 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 border-2 border-yellow-600 shadow-lg shadow-yellow-500/50" />
                <div className="absolute top-1.5 left-1.5 w-5 h-5 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 border-2 border-yellow-600 shadow-lg shadow-yellow-500/50" />
                <div className="absolute top-3 left-3 w-5 h-5 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 border-2 border-yellow-600 shadow-lg shadow-yellow-500/50" />
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-1 mt-1.5">
            {promoOffers.map((_, index) => (
              <span key={index} className={`w-1 h-1 rounded-full transition-all ${index === currentPromo ? 'bg-white w-3' : 'bg-white/50'}`} />
            ))}
          </div>
        </div>
      </button>

      <button
        onClick={handleRandomCall}
        className="fixed bottom-20 right-3 flex items-center gap-1.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 transition-all duration-300 text-white px-4 py-2.5 rounded-full shadow-xl shadow-violet-500/40 border border-violet-400/30 z-10 hover:scale-105 active:scale-95"
      >
        <Shuffle className="w-4 h-4" />
        <span className="text-sm font-semibold">Random</span>
      </button>

      <div className="flex-shrink-0 bg-black/30 backdrop-blur-md border-t border-white/10">
        <div className="flex justify-around items-center py-2">
          <button onClick={() => handleTabChange('home')} className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-all duration-300 ${activeTab === 'home' ? 'text-white bg-violet-600/30' : 'text-white/50 hover:text-white/80'}`}>
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Home</span>
          </button>
          <button onClick={() => handleTabChange('recents')} className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-all duration-300 ${activeTab === 'recents' ? 'text-white bg-violet-600/30' : 'text-white/50 hover:text-white/80'}`}>
            <Clock className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Recents</span>
          </button>
          <button onClick={() => handleTabChange('profile')} className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-all duration-300 ${activeTab === 'profile' ? 'text-white bg-violet-600/30' : 'text-white/50 hover:text-white/80'}`}>
            <User className="w-5 h-5" />
            <span className="text-[10px] font-semibold">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}