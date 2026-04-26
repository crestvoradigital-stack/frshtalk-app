import { useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';

interface WalletScreenProps {
  currentCoins: number;
  onBack: () => void;
}

const coinPackages = [
  { id: 1, coins: 80, price: 62, originalPrice: null, discount: null, badge: null, tier: 'small' },
  { id: 2, coins: 300, price: 149, originalPrice: null, discount: null, badge: null, tier: 'small' },
  { id: 3, coins: 450, price: 251, originalPrice: null, discount: null, badge: null, tier: 'small' },
  { id: 4, coins: 1100, price: 550, originalPrice: null, discount: null, badge: null, tier: 'basket' },
  { id: 5, coins: 1800, price: 1055, originalPrice: null, discount: null, badge: 'Hot', tier: 'basket' },
  { id: 6, coins: 3500, price: 1049, originalPrice: 1549, discount: 500, badge: null, tier: 'basket' },
  { id: 7, coins: 5000, price: 1999, originalPrice: null, discount: null, badge: 'Hot', tier: 'barrel' },
  { id: 8, coins: 9000, price: 2651, originalPrice: 3251, discount: 600, badge: null, tier: 'barrel' },
  { id: 9, coins: 20000, price: 5000, originalPrice: 8000, discount: 3000, badge: 'Value Pack', tier: 'chest' },
  { id: 10, coins: 26000, price: 9999, originalPrice: null, discount: null, badge: null, tier: 'chest' },
  { id: 11, coins: 55000, price: 17999, originalPrice: null, discount: null, badge: null, tier: 'vault' },
  { id: 12, coins: 90000, price: 28999, originalPrice: null, discount: null, badge: null, tier: 'cart' },
];

const promoOffers = [
  { id: 1, discountAmount: '750', coins: 3600, originalPrice: 1699, price: 949 },
  { id: 2, discountAmount: '500', coins: 2500, originalPrice: 1250, price: 688 },
];

function CoinIcon({ tier, className }: { tier: string; className?: string }) {
  const baseClass = className || 'w-12 h-12 sm:w-14 sm:h-14';

  if (tier === 'small') {
    return (
      <div className={`${baseClass} relative`}>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex -space-x-1">
          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 border-2 border-yellow-600" />
          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 border-2 border-yellow-600" />
        </div>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 border-2 border-yellow-600" />
      </div>
    );
  }

  if (tier === 'basket') {
    return (
      <div className={`${baseClass} relative`}>
        <div className="w-full h-full flex items-end justify-center">
          <div className="relative">
            <div className="w-10 h-6 sm:w-12 sm:h-7 bg-gradient-to-b from-amber-600 to-amber-800 rounded-b-lg rounded-t-sm" />
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 flex -space-x-1">
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 border border-yellow-600" />
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 border border-yellow-600" />
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 border border-yellow-600" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (tier === 'barrel') {
    return (
      <div className={`${baseClass} relative flex items-end justify-center`}>
        <div className="relative">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-b from-amber-700 to-amber-900 rounded-lg">
            <div className="absolute top-1 left-0 right-0 h-1 bg-amber-600 rounded" />
            <div className="absolute bottom-2 left-0 right-0 h-1 bg-amber-600 rounded" />
          </div>
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 flex -space-x-0.5">
            <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 border border-yellow-600" />
            <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 border border-yellow-600" />
          </div>
        </div>
      </div>
    );
  }

  if (tier === 'chest') {
    return (
      <div className={`${baseClass} relative flex items-end justify-center`}>
        <div className="relative">
          <div className="w-11 h-8 sm:w-13 sm:h-10 bg-gradient-to-b from-slate-500 to-slate-700 rounded-md border-2 border-slate-400">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-yellow-400 rounded-sm" />
          </div>
          <div className="absolute -top-2 right-0 flex">
            <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 border border-yellow-600" />
          </div>
        </div>
      </div>
    );
  }

  if (tier === 'vault') {
    return (
      <div className={`${baseClass} relative flex items-end justify-center`}>
        <div className="relative">
          <div className="w-10 h-9 sm:w-12 sm:h-11 bg-gradient-to-b from-slate-600 to-slate-800 rounded-md border-2 border-cyan-400">
            <div className="absolute top-1 left-1 right-1 h-3 bg-gradient-to-r from-green-400 to-green-600 rounded-t" />
          </div>
          <div className="absolute -top-1 -right-1 flex">
            <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 border border-yellow-600" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${baseClass} relative flex items-end justify-center`}>
      <div className="relative">
        <div className="w-12 h-6 sm:w-14 sm:h-7 bg-gradient-to-b from-amber-700 to-amber-900 rounded-t-lg" />
        <div className="absolute bottom-0 left-0 w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-gray-600 border border-gray-500" />
        <div className="absolute bottom-0 right-0 w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-gray-600 border border-gray-500" />
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 flex -space-x-1">
          <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 border border-yellow-600" />
          <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 border border-yellow-600" />
          <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 border border-yellow-600" />
        </div>
      </div>
    </div>
  );
}

export function WalletScreen({ currentCoins, onBack }: WalletScreenProps) {
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [currentPromo, setCurrentPromo] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPromo((prev) => (prev + 1) % promoOffers.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const selectedPkg = coinPackages.find((p) => p.id === selectedPackage);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      <div className="bg-gradient-to-b from-[#1a1035] to-[#0a0a0a] px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="text-white p-1">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-white text-lg sm:text-xl font-semibold">Wallet</h1>
          </div>

          <div className="flex items-center gap-2 bg-[#2a2a2a] rounded-full px-3 py-1.5">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500" />
            <span className="text-white font-medium text-sm">{currentCoins}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-32">
        <div className="mt-4 mb-2">
          <div className="bg-gradient-to-r from-[#0d5c3d] to-[#1a7a52] rounded-xl sm:rounded-2xl p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-base sm:text-lg font-bold">Flat ₹{promoOffers[currentPromo].discountAmount} off</p>
                <p className="text-white/90 text-sm sm:text-base mt-0.5">
                  {promoOffers[currentPromo].coins} coins @ <span className="line-through opacity-70">₹{promoOffers[currentPromo].originalPrice}</span> ₹
                  {promoOffers[currentPromo].price} <span className="ml-1">▶</span>
                </p>
              </div>
              <div className="flex -space-x-1">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 border-2 border-yellow-600" />
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 border-2 border-yellow-600" />
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-1.5 mt-3">
            {promoOffers.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPromo(index)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${index === currentPromo ? 'bg-white' : 'bg-white/40'}`}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-4">
          {coinPackages.map((pkg) => (
            <button
              key={pkg.id}
              onClick={() => setSelectedPackage(pkg.id)}
              className={`relative bg-[#1a1a1a] rounded-xl sm:rounded-2xl p-3 sm:p-4 flex flex-col items-center transition-all ${
                selectedPackage === pkg.id ? 'ring-2 ring-purple-500 bg-gradient-to-b from-[#2a1a3a] to-[#1a1a1a]' : 'hover:bg-[#222]'
              }`}
            >
              {pkg.badge && (
                <div
                  className={`absolute -top-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium ${
                    pkg.badge === 'Hot' ? 'bg-gradient-to-r from-pink-500 to-orange-400 text-white' : 'bg-gradient-to-r from-purple-500 to-pink-400 text-white'
                  }`}
                >
                  <span className="flex items-center gap-0.5">✦ {pkg.badge}</span>
                </div>
              )}

              <CoinIcon tier={pkg.tier} className="w-10 h-10 sm:w-12 sm:h-12 mb-2" />

              <p className="text-white font-bold text-base sm:text-lg">{pkg.coins.toLocaleString()}</p>

              <div className="mt-1 text-center">
                {pkg.originalPrice ? (
                  <>
                    <p className="text-gray-400 text-xs line-through">₹{pkg.originalPrice}</p>
                    <p className="text-white text-sm sm:text-base font-medium">₹{pkg.price}</p>
                    <p className="text-teal-400 text-[10px] sm:text-xs font-medium">Flat ₹{pkg.discount} off</p>
                  </>
                ) : (
                  <p className="text-gray-300 text-sm sm:text-base">₹{pkg.price}</p>
                )}
              </div>
            </button>
          ))}
        </div>

        <div className="mt-6 text-center">
          <p className="text-white/80 text-sm sm:text-base flex items-center justify-center gap-2">
            10 <span className="w-4 h-4 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500" /> = 1 <span className="text-teal-400">◆</span>
          </p>
          <button className="text-purple-400 text-sm sm:text-base mt-1 underline underline-offset-2">Learn more about Diamonds</button>
        </div>
      </div>

      {selectedPackage && selectedPkg && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#0a0a0a] px-4 py-4 border-t border-gray-800">
          <button className="w-full py-3.5 sm:py-4 rounded-full bg-white text-black font-semibold text-base sm:text-lg hover:bg-gray-100 transition-colors">
            Add {selectedPkg.coins.toLocaleString()} coins
          </button>
        </div>
      )}
    </div>
  );
}
