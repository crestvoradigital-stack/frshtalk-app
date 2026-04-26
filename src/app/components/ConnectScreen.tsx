import { Home, Phone, Users, Clock, ArrowLeft, MoreVertical, Heart, PhoneCall, Video } from 'lucide-react';

interface ConnectScreenProps {
  activeTab: 'home' | 'connect' | 'frnd' | 'recents';
  onTabChange: (tab: 'home' | 'connect' | 'frnd' | 'recents') => void;
  onOpenWallet: () => void;
}

export function ConnectScreen({ activeTab, onTabChange, onOpenWallet }: ConnectScreenProps) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#2D2463]">
      <div className="p-3 sm:p-4 flex items-center justify-between flex-shrink-0">
        <button onClick={() => onTabChange('home')} className="active:scale-95 transition-transform">
          <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </button>
        <button className="active:scale-95 transition-transform">
          <MoreVertical className="w-5 h-5 sm:w-6 sm:h-6 text-white/60" />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 relative">
        <div className="absolute top-0 left-6 sm:left-8 opacity-20">
          <Heart className="w-10 h-10 sm:w-12 sm:h-12 text-pink-400 fill-pink-400" />
        </div>
        <div className="absolute bottom-20 left-8 sm:left-12 opacity-20">
          <Heart className="w-12 h-12 sm:w-16 sm:h-16 text-pink-400 fill-pink-400" />
        </div>
        <div className="absolute top-16 sm:top-20 right-6 sm:right-8 opacity-20">
          <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-pink-400 fill-pink-400" />
        </div>
        <div className="absolute bottom-32 sm:bottom-40 right-8 sm:right-12 opacity-20">
          <Heart className="w-12 h-12 sm:w-14 sm:h-14 text-pink-400 fill-pink-400" />
        </div>

        <div className="mb-4 sm:mb-6 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 rounded-full border border-yellow-400/50">
          <span className="text-yellow-400 text-xs sm:text-sm">🔒 98% MATCH</span>
        </div>

        <div className="relative mb-4 sm:mb-6">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full blur-xl opacity-50" />
          <div className="relative">
            <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full overflow-hidden border-4 border-pink-500 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1672462478040-a5920e2c23d8?w=400&h=400&fit=crop"
                alt="vani"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-1.5 right-1.5 sm:bottom-2 sm:right-2 w-4 h-4 sm:w-5 sm:h-5 bg-green-500 rounded-full border-2 border-white" />
          </div>
        </div>

        <h1 className="text-white text-3xl sm:text-4xl mb-1.5 sm:mb-2">vani</h1>
        <p className="text-yellow-400 text-xs sm:text-sm mb-6 sm:mb-8">● Online Now</p>

        <div className="text-white/70 text-center text-sm sm:text-base mb-2">
          Finding your perfect match...
        </div>
        <div className="flex gap-1 mb-8 sm:mb-12">
          <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" />
          <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }} />
          <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
        </div>

        <div className="flex gap-3 sm:gap-4 w-full max-w-sm px-2">
          <button className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-3 sm:py-4 bg-green-500 rounded-xl sm:rounded-2xl text-white active:scale-95 transition-transform">
            <PhoneCall className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-sm sm:text-base">Voice Call</span>
          </button>
          <button className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-3 sm:py-4 bg-pink-500 rounded-xl sm:rounded-2xl text-white active:scale-95 transition-transform">
            <Video className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-sm sm:text-base">Video Call</span>
          </button>
        </div>
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
