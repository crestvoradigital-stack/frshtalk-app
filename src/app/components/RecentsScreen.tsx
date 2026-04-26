import { Home, Phone, Users, Clock, PhoneCall, Video, MoreVertical, Heart, Coins, User } from 'lucide-react';
import { useState } from 'react';

interface RecentsScreenProps {
  activeTab: 'home' | 'recents' | 'profile';
  onTabChange: (tab: 'home' | 'recents' | 'profile') => void;
  onOpenWallet: () => void;
  coins?: number;
  onVoiceCall?: (user: { id: number; name: string; avatar: string }) => void;
  onVideoCall?: (user: { id: number; name: string; avatar: string }) => void;
}

const recentCalls = [
  {
    id: 1,
    name: 'ramaa_0502',
    avatar: 'https://images.unsplash.com/photo-1672462478040-a5920e2c23d8?w=100&h=100&fit=crop',
    time: '11:19 PM',
    duration: '08 m',
    type: 'incoming'
  },
  {
    id: 2,
    name: 'amala0225',
    avatar: 'https://images.unsplash.com/photo-1749700332031-cf99864959ea?w=100&h=100&fit=crop',
    time: '11:08 PM',
    duration: '03 m',
    type: 'incoming'
  },
  {
    id: 3,
    name: 'chandrika_1610',
    avatar: 'https://images.unsplash.com/photo-1676337415964-11046dda455e?w=100&h=100&fit=crop',
    time: '11:00 PM',
    duration: '03 m',
    type: 'missed'
  },
  {
    id: 4,
    name: 'shruthi_0129',
    avatar: 'https://images.unsplash.com/photo-1614436201459-156d322d38c6?w=100&h=100&fit=crop',
    time: '10:59 PM',
    duration: '01 m',
    type: 'missed'
  },
  {
    id: 5,
    name: 'vishalakshi_1512',
    avatar: 'https://images.unsplash.com/photo-1716428325370-c3f667316f39?w=100&h=100&fit=crop',
    time: '10:57 PM',
    duration: '02 m',
    type: 'missed',
    online: true
  },
  {
    id: 6,
    name: 'smithasri1711',
    avatar: 'https://images.unsplash.com/photo-1603775493298-e06a5f21e46c?w=100&h=100&fit=crop',
    time: '10:56 PM',
    duration: '01 m',
    type: 'missed'
  }
];

export function RecentsScreen({
  activeTab,
  onTabChange,
  onOpenWallet,
  coins = 117,
  onVoiceCall,
  onVideoCall
}: RecentsScreenProps) {
  const [selectedView, setSelectedView] = useState<'recents' | 'favourites'>('recents');
  const [favouriteAlerts, setFavouriteAlerts] = useState(false);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="p-3 sm:p-4 flex-shrink-0 backdrop-blur-sm bg-white/5 border-b border-white/5">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h1 className="text-white text-xl sm:text-2xl font-bold">Sessions</h1>
          <button
            onClick={onOpenWallet}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-full active:scale-95 transition-all shadow-lg shadow-yellow-500/10"
          >
            <Coins className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400" />
            <span className="text-white text-xs sm:text-sm font-semibold">{coins}</span>
          </button>
        </div>

        <div className="flex gap-2 sm:gap-3">
          <button
            onClick={() => setSelectedView('recents')}
            className={`flex items-center gap-1.5 sm:gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-2xl active:scale-95 transition-all duration-300 ${
              selectedView === 'recents'
                ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 shadow-lg shadow-violet-500/30'
                : 'bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10'
            }`}
          >
            <Phone className={`w-4 h-4 sm:w-5 sm:h-5 ${selectedView === 'recents' ? 'text-white' : 'text-white/60'}`} />
            <span className={`text-sm sm:text-base font-semibold ${selectedView === 'recents' ? 'text-white' : 'text-white/60'}`}>Recents</span>
          </button>
          <button
            onClick={() => setSelectedView('favourites')}
            className={`flex items-center gap-1.5 sm:gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-2xl active:scale-95 transition-all duration-300 ${
              selectedView === 'favourites'
                ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 shadow-lg shadow-violet-500/30'
                : 'bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10'
            }`}
          >
            <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${selectedView === 'favourites' ? 'text-white' : 'text-white/60'}`} />
            <span className={`text-sm sm:text-base font-semibold ${selectedView === 'favourites' ? 'text-white' : 'text-white/60'}`}>Favourites</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {selectedView === 'favourites' ? (
          <div className="px-3 sm:px-4 py-2">
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-5 mb-4 shadow-lg">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="text-white text-sm sm:text-base mb-1 font-semibold">
                    Send notifications to favourite listeners when you want to speak?
                  </p>
                  <p className="text-white/70 text-xs mb-1.5">
                    They'll receive: "Someone is waiting for you, please join the call"
                  </p>
                  <button className="text-violet-400 text-xs sm:text-sm font-semibold hover:text-violet-300 transition-colors">
                    Learn more
                  </button>
                </div>
                <button
                  onClick={() => setFavouriteAlerts(!favouriteAlerts)}
                  className={`relative w-12 h-6 rounded-full transition-colors shadow-lg ${
                    favouriteAlerts ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600' : 'bg-white/20'
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow-md ${
                      favouriteAlerts ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Favourite user */}
            <div className="flex items-center gap-3 py-3">
              <div className="relative flex-shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop"
                  alt="vaishu2103"
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-violet-500/30"
                />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0F0A1E] shadow-lg shadow-emerald-500/50" />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-white text-sm sm:text-base font-semibold">vaishu2103</h3>
                <p className="text-emerald-400 text-xs sm:text-sm font-medium">Online</p>
              </div>

              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => onVoiceCall?.({ id: 999, name: 'vaishu2103', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop' })}
                  className="p-2 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-95 transition-all shadow-lg shadow-emerald-500/30"
                >
                  <PhoneCall className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={() => onVideoCall?.({ id: 999, name: 'vaishu2103', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop' })}
                  className="p-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 active:scale-95 transition-all shadow-lg shadow-violet-500/30"
                >
                  <Video className="w-5 h-5 text-white" />
                </button>
                <button className="p-1.5 rounded-full hover:bg-white/10 active:scale-95 transition-all">
                  <MoreVertical className="w-5 h-5 text-white/60" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="px-3 sm:px-4 py-2">
            <div className="flex items-center justify-center mb-3">
              <span className="text-white/50 text-xs font-semibold bg-white/5 px-3 py-1 rounded-full">Today</span>
            </div>

            {recentCalls.map((call) => (
              <div key={call.id} className="flex items-center gap-2.5 sm:gap-3 py-2.5 sm:py-3 hover:bg-white/5 rounded-xl px-2 transition-colors">
                <div className="relative flex-shrink-0">
                  <img
                    src={call.avatar}
                    alt={call.name}
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-white/10"
                  />
                  {call.online && (
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-emerald-500 rounded-full border-2 border-[#0F0A1E] shadow-lg shadow-emerald-500/50" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-white text-sm sm:text-base font-semibold truncate">{call.name}</h3>
                  <div className="flex items-center gap-1.5 text-white/60 text-xs sm:text-sm">
                    <Phone className="w-3 h-3 flex-shrink-0" style={{
                      transform: call.type === 'incoming' ? 'rotate(-135deg)' : 'rotate(135deg)',
                      color: call.type === 'missed' ? '#EF4444' : 'currentColor'
                    }} />
                    <span>{call.time}</span>
                    <span>•</span>
                    <span>{call.duration}</span>
                  </div>
                </div>

                <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
                  <button
                    onClick={() => onVoiceCall?.({ id: call.id, name: call.name, avatar: call.avatar })}
                    className="p-2 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-95 transition-all shadow-lg shadow-emerald-500/30"
                  >
                    <PhoneCall className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </button>
                  <button
                    onClick={() => onVideoCall?.({ id: call.id, name: call.name, avatar: call.avatar })}
                    className="p-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 active:scale-95 transition-all shadow-lg shadow-violet-500/30"
                  >
                    <Video className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </button>
                  <button className="p-1.5 rounded-full hover:bg-white/10 active:scale-95 transition-all">
                    <MoreVertical className="w-4 h-4 sm:w-5 sm:h-5 text-white/60" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="border-t border-white/10 bg-black/30 backdrop-blur-md flex-shrink-0 safe-area-bottom">
        <div className="flex items-center justify-around py-2">
          <button
            onClick={() => onTabChange('home')}
            className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-all duration-300 ${
              activeTab === 'home' ? 'text-white bg-violet-600/30' : 'text-white/50 hover:text-white/80'
            }`}
          >
            <Home className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-[10px] sm:text-xs font-semibold">Home</span>
          </button>
          <button
            onClick={() => onTabChange('recents')}
            className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-all duration-300 ${
              activeTab === 'recents' ? 'text-white bg-violet-600/30' : 'text-white/50 hover:text-white/80'
            }`}
          >
            <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-[10px] sm:text-xs font-semibold">Recents</span>
          </button>
          <button
            onClick={() => onTabChange('profile')}
            className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-all duration-300 ${
              activeTab === 'profile' ? 'text-white bg-violet-600/30' : 'text-white/50 hover:text-white/80'
            }`}
          >
            <User className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-[10px] sm:text-xs font-semibold">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}