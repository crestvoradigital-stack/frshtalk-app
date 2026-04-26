import { ArrowLeft, Gift, Users, Copy, Share2, Check } from 'lucide-react';
import { useState } from 'react';

interface ReferralProgramScreenProps {
  onBack: () => void;
}

export function ReferralProgramScreen({ onBack }: ReferralProgramScreenProps) {
  const [copied, setCopied] = useState(false);
  const referralCode = 'FRSH2026';
  const referralLink = 'https://frshtalk.com/ref/FRSH2026';
  const referralsCount = 3;
  const coinsEarned = 300;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join FrshTalk',
          text: `Join me on FrshTalk and get 100 free coins! Use my code: ${referralCode}`,
          url: referralLink,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    }
  };

  return (
    <div className="h-full w-full bg-[#0d0d0d] flex flex-col">
      {/* Header */}
      <header className="flex items-center px-4 py-4 flex-shrink-0">
        <button onClick={onBack} className="text-white">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-white text-xl font-semibold ml-4">Referral Program</h1>
      </header>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {/* Reward Banner */}
        <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 rounded-2xl p-6 mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-20">
            <Gift className="w-32 h-32 text-white" />
          </div>
          <div className="relative z-10">
            <h2 className="text-white text-2xl font-bold mb-2">Invite Friends,</h2>
            <h3 className="text-white text-xl font-semibold mb-4">Get 100 Coins Each!</h3>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 inline-flex">
              <Users className="w-5 h-5 text-white" />
              <span className="text-white font-medium">You both get rewarded</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-[#1a1a1a] rounded-xl p-4">
            <p className="text-white/60 text-xs mb-1">Total Referrals</p>
            <p className="text-white text-3xl font-bold">{referralsCount}</p>
          </div>
          <div className="bg-[#1a1a1a] rounded-xl p-4">
            <p className="text-white/60 text-xs mb-1">Coins Earned</p>
            <div className="flex items-center gap-2">
              <p className="text-white text-3xl font-bold">{coinsEarned}</p>
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                <span className="text-xs font-bold text-white">$</span>
              </div>
            </div>
          </div>
        </div>

        {/* How it Works */}
        <div className="bg-[#1a1a1a] rounded-xl p-5 mb-6">
          <h3 className="text-white text-lg font-semibold mb-4">How it works</h3>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
                1
              </div>
              <div>
                <p className="text-white font-medium mb-1">Share your code</p>
                <p className="text-white/60 text-sm">Send your referral link to friends</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
                2
              </div>
              <div>
                <p className="text-white font-medium mb-1">They sign up</p>
                <p className="text-white/60 text-sm">Your friend joins using your code</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
                3
              </div>
              <div>
                <p className="text-white font-medium mb-1">Both get 100 coins</p>
                <p className="text-white/60 text-sm">You and your friend each receive 100 free coins!</p>
              </div>
            </div>
          </div>
        </div>

        {/* Referral Code */}
        <div className="bg-[#1a1a1a] rounded-xl p-5 mb-4">
          <p className="text-white/60 text-sm mb-2">Your Referral Code</p>
          <div className="flex items-center gap-2 mb-3">
            <div className="flex-1 bg-[#2a2a2a] rounded-lg px-4 py-3">
              <p className="text-white text-xl font-mono font-bold tracking-wider">{referralCode}</p>
            </div>
            <button
              onClick={handleCopy}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg transition-colors"
            >
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
          <p className="text-white/40 text-xs break-all">{referralLink}</p>
        </div>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 rounded-full flex items-center justify-center gap-2 transition-all shadow-lg"
        >
          <Share2 className="w-5 h-5" />
          Share with Friends
        </button>

        {/* Recent Referrals */}
        <div className="mt-6">
          <h3 className="text-white text-lg font-semibold mb-3">Recent Referrals</h3>
          <div className="space-y-2">
            {[
              { name: 'Priya K.', date: 'Mar 15, 2026', coins: 100 },
              { name: 'Arjun M.', date: 'Mar 10, 2026', coins: 100 },
              { name: 'Sneha R.', date: 'Mar 05, 2026', coins: 100 },
            ].map((referral, index) => (
              <div key={index} className="bg-[#1a1a1a] rounded-lg p-3 flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">{referral.name}</p>
                  <p className="text-white/60 text-xs">{referral.date}</p>
                </div>
                <div className="flex items-center gap-1 text-green-500">
                  <span className="font-semibold">+{referral.coins}</span>
                  <div className="w-4 h-4 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                    <span className="text-[8px] font-bold text-white">$</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
