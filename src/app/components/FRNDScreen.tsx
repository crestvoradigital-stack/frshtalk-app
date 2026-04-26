import { Home, Phone, Users, Clock, Search, Bell, MapPin, Heart } from 'lucide-react';

interface FRNDScreenProps {
  activeTab: 'home' | 'connect' | 'frnd' | 'recents';
  onTabChange: (tab: 'home' | 'connect' | 'frnd' | 'recents') => void;
  onOpenWallet: () => void;
}

const profiles = [
  {
    id: 1,
    name: 'alfina_0812',
    age: 23,
    location: '5 km',
    avatar: 'https://images.unsplash.com/photo-1676337415964-11046dda455e?w=400&h=400&fit=crop',
    status: 'Currently Unavailable',
    tags: []
  },
  {
    id: 2,
    name: 'suhana0203',
    age: 25,
    location: '3 km',
    avatar: 'https://images.unsplash.com/photo-1672462478040-a5920e2c23d8?w=400&h=400&fit=crop',
    status: 'Family over relationship 💯',
    tags: ['3 km', '8 hour']
  },
  {
    id: 3,
    name: 'user_name',
    age: 24,
    location: '7 km',
    avatar: 'https://images.unsplash.com/photo-1603775493298-e06a5f21e46c?w=400&h=400&fit=crop',
    status: '✨ Random',
    tags: []
  }
];

export function FRNDScreen({ activeTab, onTabChange, onOpenWallet }: FRNDScreenProps) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#1A1525]">
      <div className="p-3 sm:p-4 flex-shrink-0">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <img
              src="https://images.unsplash.com/photo-1592234789031-94bf65f630ed?w=50&h=50&fit=crop"
              alt="Profile"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover"
            />
            <h1 className="text-white text-lg sm:text-xl">FrshTalk</h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button className="active:scale-95 transition-transform">
              <Search className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </button>
            <button className="relative active:scale-95 transition-transform">
              <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              <div className="absolute top-0 right-0 w-2 h-2 bg-yellow-400 rounded-full" />
            </button>
          </div>
        </div>

        <div className="bg-[#2D2463] rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-3 sm:mb-4">
          <p className="text-white/70 text-xs sm:text-sm mb-1">Stay respectful</p>
          <p className="text-white/50 text-[11px] sm:text-xs">
            Treat others the way you'd like to be treated
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 sm:px-4 space-y-3 sm:space-y-4 pb-4">
        {profiles.map((profile) => (
          <div key={profile.id} className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden">
            <div className="relative">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-full h-56 sm:h-64 object-cover"
              />
              <button className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full active:scale-95 transition-transform">
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </button>
            </div>

            <div className="p-3 sm:p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-gray-900 text-base sm:text-lg">{profile.name}</h3>
                  <p className="text-gray-500 text-xs sm:text-sm">{profile.age} year</p>
                </div>
                {profile.tags.length > 0 && (
                  <div className="flex gap-1.5 sm:gap-2">
                    {profile.tags.map((tag, i) => (
                      <span key={i} className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full text-[11px] sm:text-xs text-gray-600">
                        {tag.includes('km') ? <MapPin className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4">{profile.status}</p>

              {profile.id === 2 && (
                <button className="w-full py-2.5 sm:py-3 bg-purple-600 text-white rounded-full flex items-center justify-center gap-2 text-sm sm:text-base active:scale-95 transition-transform">
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Random</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10 bg-white flex-shrink-0 safe-area-bottom">
        <div className="flex items-center justify-around py-1.5 sm:py-2">
          <button
            onClick={() => onTabChange('home')}
            className="flex flex-col items-center gap-0.5 sm:gap-1 py-2 px-3 sm:px-4"
          >
            <Home className={`w-5 h-5 sm:w-6 sm:h-6 ${activeTab === 'home' ? 'text-gray-900' : 'text-gray-400'}`} />
            <span className={`text-[10px] sm:text-xs ${activeTab === 'home' ? 'text-gray-900' : 'text-gray-400'}`}>Home</span>
          </button>
          <button
            onClick={() => onTabChange('connect')}
            className="flex flex-col items-center gap-0.5 sm:gap-1 py-2 px-3 sm:px-4"
          >
            <Phone className={`w-5 h-5 sm:w-6 sm:h-6 ${activeTab === 'connect' ? 'text-gray-900' : 'text-gray-400'}`} />
            <span className={`text-[10px] sm:text-xs ${activeTab === 'connect' ? 'text-gray-900' : 'text-gray-400'}`}>Connect</span>
          </button>
          <button
            onClick={() => onTabChange('frnd')}
            className="flex flex-col items-center gap-0.5 sm:gap-1 py-2 px-3 sm:px-4"
          >
            <Users className={`w-5 h-5 sm:w-6 sm:h-6 ${activeTab === 'frnd' ? 'text-gray-900' : 'text-gray-400'}`} />
            <span className={`text-[10px] sm:text-xs ${activeTab === 'frnd' ? 'text-gray-900' : 'text-gray-400'}`}>FRND</span>
          </button>
          <button
            onClick={() => onTabChange('recents')}
            className="flex flex-col items-center gap-0.5 sm:gap-1 py-2 px-3 sm:px-4"
          >
            <Clock className={`w-5 h-5 sm:w-6 sm:h-6 ${activeTab === 'recents' ? 'text-gray-900' : 'text-gray-400'}`} />
            <span className={`text-[10px] sm:text-xs ${activeTab === 'recents' ? 'text-gray-900' : 'text-gray-400'}`}>Recents</span>
          </button>
        </div>
      </div>
    </div>
  );
}
