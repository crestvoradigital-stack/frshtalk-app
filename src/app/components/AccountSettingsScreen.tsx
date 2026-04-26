import { ArrowLeft, ExternalLink, ChevronRight, Shield, Link, Globe, Trash2, Ban, Flag } from 'lucide-react';

interface AccountSettingsScreenProps {
  onBack: () => void;
}

export function AccountSettingsScreen({ onBack }: AccountSettingsScreenProps) {
  return (
    <div className="h-full w-full bg-[#0d0d0d] flex flex-col overflow-y-auto">
      {/* Header */}
      <header className="flex items-center px-4 py-4 flex-shrink-0">
        <button onClick={onBack} className="text-white">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-white text-xl font-semibold ml-4">Account Settings</h1>
      </header>

      <div className="px-4 pb-6 space-y-3">
        {/* External Links */}
        <button className="w-full bg-[#3a3a3a] hover:bg-[#4a4a4a] transition-colors rounded-2xl px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link className="w-5 h-5 text-white/70" />
            <span className="text-white font-medium">Privacy Policy</span>
          </div>
          <ExternalLink className="w-5 h-5 text-white/50" />
        </button>

        <button className="w-full bg-[#3a3a3a] hover:bg-[#4a4a4a] transition-colors rounded-2xl px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-white/70" />
            <span className="text-white font-medium">Safety Center</span>
          </div>
          <ExternalLink className="w-5 h-5 text-white/50" />
        </button>

        <button className="w-full bg-[#3a3a3a] hover:bg-[#4a4a4a] transition-colors rounded-2xl px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-white/70" />
            <span className="text-white font-medium">Community Guidelines</span>
          </div>
          <ExternalLink className="w-5 h-5 text-white/50" />
        </button>

        {/* Internal Navigation Links */}
        <button className="w-full bg-[#3a3a3a] hover:bg-[#4a4a4a] transition-colors rounded-2xl px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trash2 className="w-5 h-5 text-white/70" />
            <span className="text-white font-medium">Delete Account</span>
          </div>
          <ChevronRight className="w-5 h-5 text-white/50" />
        </button>

        <button className="w-full bg-[#3a3a3a] hover:bg-[#4a4a4a] transition-colors rounded-2xl px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Ban className="w-5 h-5 text-white/70" />
            <span className="text-white font-medium">Blocked Listeners</span>
          </div>
          <ChevronRight className="w-5 h-5 text-white/50" />
        </button>

        <button className="w-full bg-[#3a3a3a] hover:bg-[#4a4a4a] transition-colors rounded-2xl px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Flag className="w-5 h-5 text-white/70" />
            <span className="text-white font-medium">Report Overview</span>
          </div>
          <ChevronRight className="w-5 h-5 text-white/50" />
        </button>
      </div>
    </div>
  );
}
