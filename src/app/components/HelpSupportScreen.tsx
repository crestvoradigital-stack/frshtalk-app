import { ArrowLeft, ChevronRight, MessageSquare, CreditCard, HelpCircle } from 'lucide-react';

interface HelpSupportScreenProps {
  onBack: () => void;
}

export function HelpSupportScreen({ onBack }: HelpSupportScreenProps) {
  return (
    <div className="h-full w-full bg-[#0d0d0d] flex flex-col overflow-y-auto">
      {/* Header */}
      <header className="flex items-center px-4 py-4 flex-shrink-0">
        <button onClick={onBack} className="text-white">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-white text-xl font-semibold ml-4">Help & Support</h1>
      </header>

      <div className="px-4 pb-6 space-y-6">
        {/* Your Tickets */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-white font-medium">Your Tickets</h2>
            <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded">2 Active</span>
          </div>
          
          <button className="w-full bg-[#3a3a3a] hover:bg-[#4a4a4a] transition-colors rounded-2xl px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-purple-400" />
              </div>
              <div className="text-left">
                <p className="text-white font-medium">Raised Ticket</p>
                <p className="text-white/60 text-sm">0 Actions Pending</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-white/50" />
          </button>
        </div>

        {/* Select by Category */}
        <div>
          <h2 className="text-white font-medium mb-3">Select by Category</h2>
          
          <div className="space-y-3">
            <button className="w-full bg-[#3a3a3a] hover:bg-[#4a4a4a] transition-colors rounded-2xl px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-purple-400" />
                </div>
                <div className="text-left">
                  <p className="text-white font-medium">Recent Session</p>
                  <p className="text-white/60 text-sm">Regarding Audio and Video calls</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-white/50" />
            </button>

            <button className="w-full bg-[#3a3a3a] hover:bg-[#4a4a4a] transition-colors rounded-2xl px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-purple-400" />
                </div>
                <div className="text-left">
                  <p className="text-white font-medium">Recent Payments</p>
                  <p className="text-white/60 text-sm">Regarding Wallet and Payments</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-white/50" />
            </button>
          </div>
        </div>

        {/* Quick Help */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-white font-medium">Quick Help</h2>
            <button className="text-purple-400 text-sm hover:text-purple-300 transition-colors">
              View all
            </button>
          </div>
          
          <div className="space-y-3">
            <button className="w-full bg-[#3a3a3a] hover:bg-[#4a4a4a] transition-colors rounded-2xl px-5 py-4 flex items-center justify-between text-left">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <HelpCircle className="w-4 h-4 text-white/70" />
                </div>
                <p className="text-white text-sm">Why am I unable to connect with any Listeners?</p>
              </div>
              <ChevronRight className="w-5 h-5 text-white/50 flex-shrink-0" />
            </button>

            <button className="w-full bg-[#3a3a3a] hover:bg-[#4a4a4a] transition-colors rounded-2xl px-5 py-4 flex items-center justify-between text-left">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <HelpCircle className="w-4 h-4 text-white/70" />
                </div>
                <p className="text-white text-sm">How do I change my language ?</p>
              </div>
              <ChevronRight className="w-5 h-5 text-white/50 flex-shrink-0" />
            </button>

            <button className="w-full bg-[#3a3a3a] hover:bg-[#4a4a4a] transition-colors rounded-2xl px-5 py-4 flex items-center justify-between text-left">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <HelpCircle className="w-4 h-4 text-white/70" />
                </div>
                <p className="text-white text-sm">Why are coins not added to my wallet even after recharge?</p>
              </div>
              <ChevronRight className="w-5 h-5 text-white/50 flex-shrink-0" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}