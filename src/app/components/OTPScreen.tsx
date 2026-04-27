import { useState, useRef, useEffect } from 'react';
import { Edit2, RefreshCw, ArrowLeft } from 'lucide-react';

interface OTPScreenProps {
  phoneNumber?: string;
  onVerify: (otp?: string) => void;
  onBack?: () => void;
  onResend?: () => void;
}

export function OTPScreen({ phoneNumber = '9393589369', onVerify, onBack, onResend }: OTPScreenProps) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(58);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  // Format phone number with country code if not already present
  const displayPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const isOTPComplete = otp.every((digit) => digit !== '');

  const handleVerify = () => {
    const otpValue = otp.join('');
    onVerify(otpValue);
  };

  const handleResend = () => {
    setTimer(58);
    onResend?.();
  };

  return (
    <div className="h-full w-full flex flex-col p-6 safe-area-inset bg-gradient-to-b from-[#1a1035] via-[#2a1850] to-[#1a1035]">
      {onBack && (
        <button onClick={onBack} className="text-white/90 hover:text-white mb-4 self-start">
          <ArrowLeft className="w-6 h-6" />
        </button>
      )}

      <h1 className="text-white text-2xl sm:text-3xl mb-2">Verify OTP</h1>
      <div className="flex items-center gap-2 mb-8 sm:mb-12">
        <p className="text-white/70 text-sm">OTP sent to {displayPhone}</p>
        {onBack && <button onClick={onBack}><Edit2 className="w-4 h-4 text-white/70" /></button>}
      </div>

      <div className="mb-8">
        <p className="text-white/70 text-xs sm:text-sm mb-4 tracking-wider">ENTER OTP</p>
        <div className="flex gap-2 justify-center mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-11 h-11 sm:w-12 sm:h-12 bg-white rounded-xl text-center text-lg sm:text-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          ))}
        </div>

        <div className="flex items-center justify-center gap-2 text-white/70 text-sm">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span>Auto-fetching OTP</span>
        </div>
      </div>

      <div className="text-center mb-8">
        <p className="text-white text-sm mb-2">Didn't receive the OTP?</p>
        {timer > 0 ? (
          <p className="text-white/70 text-sm">Retry in 00:{timer.toString().padStart(2, '0')}</p>
        ) : (
          <button onClick={handleResend} className="text-[#6366f1] text-sm hover:underline">
            Resend OTP
          </button>
        )}
      </div>

      <div className="flex-1" />

      <button
        onClick={handleVerify}
        disabled={!isOTPComplete}
        className="w-full max-w-sm mx-auto py-3.5 sm:py-4 bg-white text-[#2D2463] rounded-full text-base sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-transform"
      >
        Verify OTP
      </button>
    </div>
  );
}
