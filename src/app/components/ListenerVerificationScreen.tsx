import { ArrowLeft } from 'lucide-react';
import { Info } from 'lucide-react';

interface ListenerVerificationScreenProps {
  onBack: () => void;
  onBecomeCustomer: () => void;
}

export function ListenerVerificationScreen({ onBack, onBecomeCustomer }: ListenerVerificationScreenProps) {
  return (
    <div className="h-full w-full bg-gradient-to-b from-[#1a0f3e] via-[#2d1b5e] to-[#1a0f3e] flex flex-col">
      {/* Header */}
      <div className="flex items-center px-4 py-4">
        <button 
          onClick={onBack}
          className="text-white/90 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col px-6 pt-8">
        {/* Title */}
        <h1 className="text-white text-[28px] font-semibold leading-tight mb-4">
          Listener verification in progress...
        </h1>

        {/* Description */}
        <p className="text-white/80 text-base leading-relaxed mb-8">
          For Listener verification, our team will reach out to you within 24hrs via phone call. Till then you can connect with listeners.
        </p>

        {/* Become a Customer Button */}
        <button
          onClick={onBecomeCustomer}
          className="w-full py-3.5 rounded-full border-2 border-white/80 text-white text-base font-medium hover:bg-white/10 transition-all mb-12"
        >
          Become a Customer
        </button>

        {/* Gradient Smiley Illustration */}
        <div className="flex-1 flex items-center justify-center relative">
          <div className="w-64 h-64 relative">
            {/* Gradient blob background */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-400 via-purple-500 to-blue-500 opacity-90 blur-2xl"></div>
            
            {/* Smiley face */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                {/* Face circle */}
                <div className="w-40 h-40 rounded-full bg-gradient-to-br from-pink-400 via-purple-500 to-blue-500 opacity-95 flex items-center justify-center">
                  {/* Eyes */}
                  <div className="flex gap-6 mb-6">
                    <div className="w-5 h-8 bg-white rounded-full"></div>
                    <div className="w-5 h-8 bg-white rounded-full"></div>
                  </div>
                </div>
                {/* Mouth */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-16 h-10 bg-white rounded-b-full"></div>
              </div>
            </div>

            {/* Wavy line decoration */}
            <svg 
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12"
              width="100" 
              height="120" 
              viewBox="0 0 100 120"
              fill="none"
            >
              <path 
                d="M10 60 Q 25 40, 40 60 T 70 60" 
                stroke="rgba(255, 255, 255, 0.3)" 
                strokeWidth="3" 
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Info box at bottom */}
        <div className="mb-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-4 border border-white/20">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-white/90 flex-shrink-0 mt-0.5" />
              <p className="text-white/90 text-sm leading-relaxed">
                Becoming a listener is completely free, no payment required.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
