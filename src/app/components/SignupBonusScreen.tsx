import { useState, useEffect } from 'react';
import { Gift, Sparkles } from 'lucide-react';

interface SignupBonusScreenProps {
  onClaim: () => void;
}

export function SignupBonusScreen({ onClaim }: SignupBonusScreenProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [coinsAnimating, setCoinsAnimating] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowConfetti(true), 300);
    setTimeout(() => setCoinsAnimating(true), 600);
  }, []);

  return (
    <div className="h-full w-full bg-gradient-to-b from-[#1a1035] via-[#2a1850] to-[#1a1035] flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {showConfetti && (
        <>
          <div className="absolute top-10 left-10 text-4xl animate-bounce">🎉</div>
          <div className="absolute top-20 right-12 text-3xl animate-bounce delay-100">✨</div>
          <div className="absolute top-32 left-16 text-2xl animate-bounce delay-200">🎊</div>
          <div className="absolute bottom-32 right-8 text-4xl animate-bounce delay-300">🎈</div>
          <div className="absolute bottom-20 left-20 text-3xl animate-bounce delay-150">⭐</div>
        </>
      )}

      <div className={`bg-gradient-to-br from-purple-600 to-pink-600 rounded-full p-6 mb-6 ${coinsAnimating ? 'animate-pulse' : ''}`}>
        <Gift className="w-16 h-16 text-white" />
      </div>

      <h1 className="text-white text-3xl font-bold mb-2 text-center">Welcome to FrshTalk!</h1>
      <p className="text-white/80 text-lg mb-8 text-center">You've received a signup bonus</p>

      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-8 mb-8 relative overflow-hidden">
        <div className="absolute top-2 right-2">
          <Sparkles className="w-6 h-6 text-white animate-spin" />
        </div>
        <div className="absolute bottom-2 left-2">
          <Sparkles className="w-5 h-5 text-white/70 animate-spin" style={{ animationDirection: 'reverse' }} />
        </div>

        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 border-4 border-yellow-600 shadow-xl" />
            <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 border-2 border-yellow-600" />
          </div>
          <p className="text-white text-5xl font-bold">100</p>
        </div>
        <p className="text-white/90 text-center text-sm">Free Coins</p>
      </div>

      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 mb-8 w-full max-w-sm">
        <p className="text-white text-base text-center mb-4 font-semibold">💡 What can you do with 100 coins?</p>
        <div className="text-center">
          <p className="text-white/90 text-sm font-medium">• Talk about anything that's on your mind</p>
        </div>
      </div>

      <button
        onClick={onClaim}
        className="w-full max-w-sm bg-white text-[#1a1035] font-bold py-4 rounded-full text-base shadow-lg hover:scale-105 transition-transform active:scale-95"
      >
        Claim My Bonus & Start Talking! 🎁
      </button>
    </div>
  );
}
