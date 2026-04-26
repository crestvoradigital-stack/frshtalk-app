import { useState } from 'react';
import { ArrowLeft, Info, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router';
import { LoadingSpinner } from './shared/LoadingSpinner';
import { ErrorMessage } from './shared/ErrorMessage';

interface ListenerVerificationScreenProps {
  onBack?: () => void;
  onBecomeCustomer?: () => void;
}

type VerificationStatus = 'pending' | 'submitting' | 'submitted' | 'error';

export function ListenerVerificationScreen({
  onBack,
  onBecomeCustomer,
}: ListenerVerificationScreenProps) {
  const navigate = useNavigate();
  const [status, setStatus] = useState<VerificationStatus>('pending');
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    experience: '',
    availability: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setError(null);

    try {
      // TODO: Call actual API to submit listener verification
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setStatus('submitted');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit verification');
      setStatus('error');
    }
  };

  const handleBackClick = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const handleBecomeCustomer = () => {
    if (onBecomeCustomer) {
      onBecomeCustomer();
    } else {
      navigate('/home');
    }
  };

  if (status === 'submitted') {
    return (
      <div className="h-full w-full bg-gradient-to-b from-[#1a0f3e] via-[#2d1b5e] to-[#1a0f3e] flex flex-col items-center justify-center px-6">
        <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
          <CheckCircle className="w-12 h-12 text-green-500" aria-hidden="true" />
        </div>

        <h1 className="text-white text-2xl font-semibold mb-3 text-center">
          Application Submitted!
        </h1>

        <p className="text-white/80 text-base text-center mb-8 max-w-sm">
          Thank you for applying! Our team will review your application and reach out within 24
          hours.
        </p>

        <button
          onClick={handleBecomeCustomer}
          className="w-full max-w-sm bg-white text-[#1a0f3e] px-6 py-4 rounded-full font-semibold hover:bg-white/90 transition-all active:scale-95"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-gradient-to-b from-[#1a0f3e] via-[#2d1b5e] to-[#1a0f3e] flex flex-col">
      {/* Header */}
      <header className="flex items-center px-4 py-4">
        <button
          onClick={handleBackClick}
          className="text-white/90 hover:text-white transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 pt-4 pb-8">
        <h1 className="text-white text-[28px] font-semibold leading-tight mb-2">
          Become a Listener
        </h1>

        <p className="text-white/80 text-base leading-relaxed mb-6">
          Help people by listening to their stories. Fill out the application below and we'll get
          back to you within 24 hours.
        </p>

        {status === 'error' && error && (
          <div className="mb-6">
            <ErrorMessage message={error} onRetry={handleSubmit} />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-white text-sm mb-2">
              Full Name *
            </label>
            <input
              id="fullName"
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full bg-white/10 backdrop-blur-sm text-white placeholder-white/40 px-4 py-3.5 rounded-xl border-2 border-white/20 focus:border-white/40 focus:outline-none transition-colors"
              placeholder="Enter your full name"
              disabled={status === 'submitting'}
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-white text-sm mb-2">
              Email Address *
            </label>
            <input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-white/10 backdrop-blur-sm text-white placeholder-white/40 px-4 py-3.5 rounded-xl border-2 border-white/20 focus:border-white/40 focus:outline-none transition-colors"
              placeholder="your.email@example.com"
              disabled={status === 'submitting'}
            />
          </div>

          {/* Experience */}
          <div>
            <label htmlFor="experience" className="block text-white text-sm mb-2">
              Why do you want to be a listener? *
            </label>
            <textarea
              id="experience"
              required
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              className="w-full bg-white/10 backdrop-blur-sm text-white placeholder-white/40 px-4 py-3.5 rounded-xl border-2 border-white/20 focus:border-white/40 focus:outline-none transition-colors resize-none"
              placeholder="Tell us about your motivation..."
              rows={4}
              disabled={status === 'submitting'}
            />
          </div>

          {/* Availability */}
          <div>
            <label htmlFor="availability" className="block text-white text-sm mb-2">
              Availability (hours per week) *
            </label>
            <select
              id="availability"
              required
              value={formData.availability}
              onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
              className="w-full bg-white/10 backdrop-blur-sm text-white px-4 py-3.5 rounded-xl border-2 border-white/20 focus:border-white/40 focus:outline-none transition-colors"
              disabled={status === 'submitting'}
            >
              <option value="">Select availability</option>
              <option value="5-10">5-10 hours</option>
              <option value="10-20">10-20 hours</option>
              <option value="20-30">20-30 hours</option>
              <option value="30+">30+ hours</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={status === 'submitting'}
            className="w-full bg-white text-[#1a0f3e] font-semibold py-4 rounded-full shadow-lg hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
          >
            {status === 'submitting' ? (
              <span className="flex items-center justify-center gap-2">
                <LoadingSpinner size="sm" />
                Submitting Application...
              </span>
            ) : (
              'Submit Application'
            )}
          </button>

          {/* Become Customer Button */}
          <button
            type="button"
            onClick={handleBecomeCustomer}
            className="w-full py-3.5 rounded-full border-2 border-white/80 text-white font-medium hover:bg-white/10 transition-all active:scale-95"
            disabled={status === 'submitting'}
          >
            Continue as Customer
          </button>
        </form>

        {/* Info Box */}
        <div className="mt-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-4 border border-white/20">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-white/90 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <div className="space-y-2">
                <p className="text-white/90 text-sm leading-relaxed">
                  Becoming a listener is completely free, no payment required.
                </p>
                <p className="text-white/70 text-xs leading-relaxed">
                  We'll verify your application and contact you within 24 hours via phone call.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
