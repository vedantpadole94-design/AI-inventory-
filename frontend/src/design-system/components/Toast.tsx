import React from 'react';
import { cn } from '../utils';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastProps {
  variant?: 'success' | 'error' | 'info';
  title: string;
  description?: string;
  onClose?: () => void;
  className?: string;
}

export const Toast: React.FC<ToastProps> = ({
  variant = 'info',
  title,
  description,
  onClose,
  className,
}) => {
  const icons = {
    success: <CheckCircle2 size={18} className="text-semantic-success shrink-0" />,
    error: <AlertCircle size={18} className="text-semantic-danger shrink-0" />,
    info: <Info size={18} className="text-semantic-info shrink-0" />,
  };

  const borders = {
    success: 'border-emerald-200',
    error: 'border-rose-200',
    info: 'border-cyan-200',
  };

  return (
    <div
      className={cn(
        'w-full max-w-[360px] bg-white border rounded-[10px] p-[14px] shadow-md flex items-start gap-[12px] pointer-events-auto',
        borders[variant],
        className
      )}
    >
      <div className="mt-[2px]">{icons[variant]}</div>
      <div className="flex-1">
        <h4 className="text-[14px] font-semibold text-text-primary leading-[18px]">{title}</h4>
        {description && <p className="text-[13px] text-text-secondary mt-[3px] leading-[18px]">{description}</p>}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-text-tertiary hover:text-text-primary p-[2px] rounded hover:bg-subtle"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};
