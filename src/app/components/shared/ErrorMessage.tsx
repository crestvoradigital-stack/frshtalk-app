import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  fullScreen?: boolean;
}

export function ErrorMessage({ message, onRetry, fullScreen = false }: ErrorMessageProps) {
  const content = (
    <div
      className="flex flex-col items-center justify-center gap-4 text-center px-6"
      role="alert"
      aria-live="assertive"
    >
      <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
        <AlertCircle className="w-8 h-8 text-red-500" aria-hidden="true" />
      </div>
      <div>
        <h3 className="text-white font-medium mb-1">Oops! Something went wrong</h3>
        <p className="text-white/70 text-sm">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 bg-[#6366f1] hover:bg-[#5558e3] text-white px-6 py-2.5 rounded-full font-medium transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      )}
    </div>
  );

  if (fullScreen) {
    return <div className="fixed inset-0 bg-[#0d0d0d] flex items-center justify-center z-50">{content}</div>;
  }

  return <div className="py-12">{content}</div>;
}
