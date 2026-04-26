import { Wallet, CreditCard, Languages, Headphones, HelpCircle, Settings, LogOut, Edit, ChevronRight, Gift, Trophy, AlertCircle, BarChart3 } from 'lucide-react';

interface ProfileScreenProps {
  onNavigate: (screen: 'transactions' | 'language' | 'help' | 'account' | 'referral' | 'achievements' | 'crisis' | 'analytics') => void;
  onWalletClick?: () => void;
  onLogout?: () => void;
  onSwitchToListener?: () => void;
}

export function ProfileScreen({ onNavigate, onWalletClick, onLogout, onSwitchToListener }: ProfileScreenProps) {
  return (
    <div className="h-full w-full bg-[#0d0d0d] flex flex-col overflow-y-auto">
      {/* Profile Card */}
      <div className="px-4 pt-6 pb-4">
        <div className="bg-[#3a3a3a] rounded-2xl p-6 relative">
          <button className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors">
            <Edit className="w-5 h-5" />
          </button>
          
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full overflow-hidden mb-3 border-4 border-[#4a4a4a]">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face" 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-white text-xl font-semibold">jklm</h2>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-4 pb-4 space-y-3">
        <div className="bg-[#3a3a3a] rounded-2xl overflow-hidden">
          <button
            onClick={onWalletClick}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#4a4a4a] transition-colors border-b border-[#2a2a2a]"
          >
            <div className="flex items-center gap-3">
              <Wallet className="w-5 h-5 text-white/70" />
              <span className="text-white font-medium">Wallet</span>
            </div>
            <ChevronRight className="w-5 h-5 text-white/50" />
          </button>

          <button 
            onClick={() => onNavigate('transactions')}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#4a4a4a] transition-colors border-b border-[#2a2a2a]"
          >
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-white/70" />
              <span className="text-white font-medium">Transactions</span>
            </div>
            <ChevronRight className="w-5 h-5 text-white/50" />
          </button>

          <button 
            onClick={() => onNavigate('language')}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#4a4a4a] transition-colors border-b border-[#2a2a2a]"
          >
            <div className="flex items-center gap-3">
              <Languages className="w-5 h-5 text-white/70" />
              <span className="text-white font-medium">Language Settings</span>
            </div>
            <ChevronRight className="w-5 h-5 text-white/50" />
          </button>

          <button
            onClick={onSwitchToListener}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#4a4a4a] transition-colors border-b border-[#2a2a2a]"
          >
            <div className="flex items-center gap-3">
              <Headphones className="w-5 h-5 text-white/70" />
              <span className="text-white font-medium">Switch to Listener</span>
            </div>
            <ChevronRight className="w-5 h-5 text-white/50" />
          </button>

          <button 
            onClick={() => onNavigate('help')}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#4a4a4a] transition-colors border-b border-[#2a2a2a]"
          >
            <div className="flex items-center gap-3">
              <HelpCircle className="w-5 h-5 text-white/70" />
              <span className="text-white font-medium">Help & Support</span>
              <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded">2 tickets</span>
            </div>
            <ChevronRight className="w-5 h-5 text-white/50" />
          </button>

          <button
            onClick={() => onNavigate('account')}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#4a4a4a] transition-colors border-b border-[#2a2a2a]"
          >
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-white/70" />
              <span className="text-white font-medium">Account Settings</span>
            </div>
            <ChevronRight className="w-5 h-5 text-white/50" />
          </button>

          <button
            onClick={() => onNavigate('referral')}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#4a4a4a] transition-colors border-b border-[#2a2a2a]"
          >
            <div className="flex items-center gap-3">
              <Gift className="w-5 h-5 text-white/70" />
              <span className="text-white font-medium">Refer & Earn</span>
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs px-2 py-0.5 rounded">New</span>
            </div>
            <ChevronRight className="w-5 h-5 text-white/50" />
          </button>

          <button
            onClick={() => onNavigate('achievements')}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#4a4a4a] transition-colors border-b border-[#2a2a2a]"
          >
            <div className="flex items-center gap-3">
              <Trophy className="w-5 h-5 text-white/70" />
              <span className="text-white font-medium">Achievements</span>
            </div>
            <ChevronRight className="w-5 h-5 text-white/50" />
          </button>

          <button
            onClick={() => onNavigate('crisis')}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#4a4a4a] transition-colors border-b border-[#2a2a2a]"
          >
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="text-white font-medium">Crisis Support</span>
            </div>
            <ChevronRight className="w-5 h-5 text-white/50" />
          </button>

          <button
            onClick={() => onNavigate('analytics')}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#4a4a4a] transition-colors"
          >
            <div className="flex items-center gap-3">
              <BarChart3 className="w-5 h-5 text-white/70" />
              <span className="text-white font-medium">Analytics</span>
            </div>
            <ChevronRight className="w-5 h-5 text-white/50" />
          </button>
        </div>

        {/* Logout Button */}
        <div className="bg-[#3a3a3a] rounded-2xl overflow-hidden">
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#4a4a4a] transition-colors"
          >
            <div className="flex items-center gap-3">
              <LogOut className="w-5 h-5 text-white/70" />
              <span className="text-white font-medium">Log Out</span>
            </div>
            <ChevronRight className="w-5 h-5 text-white/50" />
          </button>
        </div>
      </div>

      {/* Version */}
      <div className="text-center py-6 text-white/40 text-sm">
        version 1.1.17
      </div>
    </div>
  );
}