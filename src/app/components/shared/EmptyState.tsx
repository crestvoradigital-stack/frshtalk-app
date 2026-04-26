import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center py-12 px-6 text-center"
      role="status"
      aria-live="polite"
    >
      <div className="w-16 h-16 rounded-full bg-[#2a2a2a] flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-white/50" aria-hidden="true" />
      </div>
      <h3 className="text-white text-lg font-medium mb-2">{title}</h3>
      <p className="text-white/70 text-sm mb-6 max-w-sm">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="bg-[#6366f1] hover:bg-[#5558e3] text-white px-6 py-2.5 rounded-full font-medium transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
