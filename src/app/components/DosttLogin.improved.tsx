import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Phone } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { validatePhoneNumber, formatPhoneNumber } from '../../lib/validation';
import { storage } from '../../lib/storage';
import { LoadingSpinner } from './shared/LoadingSpinner';
import { ErrorMessage } from './shared/ErrorMessage';
import { OTPScreen } from './OTPScreen';

interface DosttLoginProps {
  onBack?: () => void;
  onVerified?: () => void;
}

export function DosttLogin({ onBack, onVerified }: DosttLoginProps) {
  const navigate = useNavigate();
  const { login, isLoading, error: authError } = useAuth();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSendingOTP, setIsSendingOTP] = useState(false);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 10) {
      setPhoneNumber(value);
      setError(null);
    }
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validatePhoneNumber(phoneNumber);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid phone number');
      return;
    }

    setIsSendingOTP(true);
    setError(null);

    try {
      // TODO: Call actual API to send OTP
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setShowOTP(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send OTP');
    } finally {
      setIsSendingOTP(false);
    }
  };

  const handleVerifyOTP = async (otp: string) => {
    try {
      await login(phoneNumber, otp);

      // Check if user has already claimed signup bonus
      const hasClaimedBonus = storage.getHasClaimedSignupBonus();

      if (hasClaimedBonus) {
        navigate('/home');
      } else {
        navigate('/signup-bonus');
      }
      onVerified?.();
    } catch (err) {
      throw err;
    }
  };

  const handleBackToPhone = () => {
    setShowOTP(false);
    setError(null);
  };

  if (showOTP) {
    return (
      <OTPScreen
        phoneNumber={phoneNumber}
        onVerify={handleVerifyOTP}
        onBack={handleBackToPhone}
        onResend={handleSendOTP}
      />
    );
  }

  return (
    <div className="h-full w-full bg-gradient-to-b from-[#1a1035] via-[#2a1850] to-[#1a1035] flex flex-col">
      {/* Header */}
      <header className="flex items-center px-4 py-4">
        <button
          onClick={() => (onBack ? onBack() : navigate(-1))}
          className="text-white/90 hover:text-white transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
      </header>

      {/* Content */}
      <div className="flex-1 flex flex-col px-6 pt-8">
        <h1 className="text-white text-[28px] font-semibold leading-tight mb-2">
          Login/Signup
        </h1>
        <p className="text-white/80 text-base leading-relaxed mb-8">
          Enter your phone number and we'll send you an OTP to verify
        </p>

        <form onSubmit={handleSendOTP} className="space-y-6">
          {/* Phone Number Input */}
          <div>
            <label htmlFor="phoneNumber" className="sr-only">
              Phone Number
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-white/70">
                <Phone className="w-5 h-5" aria-hidden="true" />
                <span className="text-base">+91</span>
              </div>
              <input
                id="phoneNumber"
                type="tel"
                value={phoneNumber}
                onChange={handlePhoneChange}
                placeholder="Enter phone number"
                className="w-full bg-white/10 backdrop-blur-sm text-white placeholder-white/40 pl-20 pr-4 py-4 rounded-2xl border-2 border-white/20 focus:border-white/40 focus:outline-none text-base transition-colors"
                autoFocus
                aria-invalid={error ? 'true' : 'false'}
                aria-describedby={error ? 'phone-error' : undefined}
                disabled={isSendingOTP}
              />
            </div>
            {phoneNumber && (
              <p className="text-white/60 text-sm mt-2" aria-live="polite">
                {formatPhoneNumber(phoneNumber)}
              </p>
            )}
            {error && (
              <p id="phone-error" className="text-red-400 text-sm mt-2" role="alert">
                {error}
              </p>
            )}
          </div>

          {/* Send OTP Button */}
          <button
            type="submit"
            disabled={phoneNumber.length !== 10 || isSendingOTP}
            className="w-full bg-white text-[#1a1035] font-semibold py-4 rounded-full text-base shadow-lg hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
          >
            {isSendingOTP ? (
              <span className="flex items-center justify-center gap-2">
                <LoadingSpinner size="sm" />
                Sending OTP...
              </span>
            ) : (
              'Send OTP'
            )}
          </button>
        </form>

        {/* Privacy Notice */}
        <p className="text-white/50 text-xs mt-8 text-center leading-relaxed">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>

        {/* Illustration */}
        <div className="flex-1 flex items-end justify-center pb-8">
          <div className="w-48 h-48 relative opacity-20">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-3xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
