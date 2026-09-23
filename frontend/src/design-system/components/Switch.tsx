import { forwardRef } from 'react';
import { cn } from '../utils';

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
}

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(({
  checked,
  onChange,
  label,
  description,
  disabled = false,
}, ref) => {
  return (
    <div className={cn('flex items-center justify-between gap-[16px]', disabled && 'opacity-60 cursor-not-allowed')}>
      {(label || description) && (
        <div className="flex flex-col">
          {label && <span className="text-[14px] font-medium text-text-primary leading-[20px]">{label}</span>}
          {description && <span className="text-[12px] text-text-tertiary leading-[16px]">{description}</span>}
        </div>
      )}
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={cn(
          'relative inline-flex h-[22px] w-[40px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2',
          checked ? 'bg-accent-primary' : 'bg-border-strong',
          disabled && 'cursor-not-allowed'
        )}
      >
        <span
          className={cn(
            'pointer-events-none inline-block h-[18px] w-[18px] transform rounded-full bg-white shadow-xs transition duration-200 ease-in-out',
            checked ? 'translate-x-[18px]' : 'translate-x-0'
          )}
        />
      </button>
    </div>
  );
});

Switch.displayName = 'Switch';
