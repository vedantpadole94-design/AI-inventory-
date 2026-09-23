import React, { forwardRef } from 'react';
import { cn } from '../utils';
import { Check } from 'lucide-react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({
  className,
  label,
  description,
  disabled,
  checked,
  id,
  ...props
}, ref) => {
  const checkboxId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <label htmlFor={checkboxId} className={cn('flex items-start gap-[10px] select-none cursor-pointer', disabled && 'cursor-not-allowed opacity-60')}>
      <div className="relative flex items-center justify-center mt-[2px]">
        <input
          ref={ref}
          type="checkbox"
          id={checkboxId}
          disabled={disabled}
          checked={checked}
          className="peer sr-only"
          {...props}
        />
        <div className={cn(
          'w-[18px] h-[18px] rounded-[4px] border border-border-strong bg-white transition-all duration-150',
          'peer-checked:bg-accent-primary peer-checked:border-accent-primary',
          'peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-accent-primary',
          className
        )}>
          {checked && <Check size={14} className="text-white stroke-[3] mx-auto mt-[1px]" />}
        </div>
      </div>
      {(label || description) && (
        <div className="flex flex-col">
          {label && <span className="text-[14px] text-text-primary font-normal leading-[20px]">{label}</span>}
          {description && <span className="text-[12px] text-text-tertiary leading-[16px]">{description}</span>}
        </div>
      )}
    </label>
  );
});

Checkbox.displayName = 'Checkbox';

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(({
  className,
  label,
  description,
  disabled,
  checked,
  id,
  ...props
}, ref) => {
  const radioId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <label htmlFor={radioId} className={cn('flex items-start gap-[10px] select-none cursor-pointer', disabled && 'cursor-not-allowed opacity-60')}>
      <div className="relative flex items-center justify-center mt-[2px]">
        <input
          ref={ref}
          type="radio"
          id={radioId}
          disabled={disabled}
          checked={checked}
          className="peer sr-only"
          {...props}
        />
        <div className={cn(
          'w-[18px] h-[18px] rounded-full border border-border-strong bg-white transition-all duration-150 flex items-center justify-center',
          'peer-checked:border-accent-primary',
          'peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-accent-primary',
          className
        )}>
          {checked && <div className="w-[8px] h-[8px] rounded-full bg-accent-primary" />}
        </div>
      </div>
      {(label || description) && (
        <div className="flex flex-col">
          {label && <span className="text-[14px] text-text-primary font-normal leading-[20px]">{label}</span>}
          {description && <span className="text-[12px] text-text-tertiary leading-[16px]">{description}</span>}
        </div>
      )}
    </label>
  );
});

Radio.displayName = 'Radio';
