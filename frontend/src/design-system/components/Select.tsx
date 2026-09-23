import React, { forwardRef } from 'react';
import { cn } from '../utils';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  error?: string;
  options: SelectOption[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  className,
  label,
  hint,
  error,
  options,
  disabled,
  id,
  ...props
}, ref) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full flex flex-col gap-[6px]">
      {label && (
        <label htmlFor={selectId} className="text-[13px] font-medium text-text-primary select-none">
          {label}
        </label>
      )}
      <div className={cn(
        'relative flex items-center bg-white border rounded-[8px] shadow-xs transition-colors duration-150',
        error ? 'border-semantic-danger focus-within:ring-2 focus-within:ring-semantic-danger/20' : 'border-border-default focus-within:border-accent-primary focus-within:ring-2 focus-within:ring-accent-primary/10',
        disabled && 'bg-subtle cursor-not-allowed opacity-75'
      )}>
        <select
          ref={ref}
          id={selectId}
          disabled={disabled}
          className={cn(
            'w-full h-[38px] pl-[12px] pr-[36px] text-[14px] text-text-primary bg-transparent outline-none appearance-none cursor-pointer disabled:cursor-not-allowed',
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute right-[12px] pointer-events-none text-text-tertiary">
          <ChevronDown size={16} />
        </div>
      </div>
      {error ? (
        <p className="text-[12px] text-semantic-danger font-normal">{error}</p>
      ) : hint ? (
        <p className="text-[12px] text-text-tertiary font-normal">{hint}</p>
      ) : null}
    </div>
  );
});

Select.displayName = 'Select';
