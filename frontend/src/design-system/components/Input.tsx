import React, { forwardRef } from 'react';
import { cn } from '../utils';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  label?: string;
  hint?: string;
  error?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  className,
  label,
  hint,
  error,
  prefix,
  suffix,
  disabled,
  id,
  ...props
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full flex flex-col gap-[6px]">
      {label && (
        <label htmlFor={inputId} className="text-[13px] font-medium text-text-primary select-none flex items-center justify-between">
          <span>{label}</span>
        </label>
      )}
      <div className={cn(
        'relative flex items-center bg-white border rounded-[8px] shadow-xs transition-colors duration-150',
        error ? 'border-semantic-danger focus-within:ring-2 focus-within:ring-semantic-danger/20' : 'border-border-default focus-within:border-accent-primary focus-within:ring-2 focus-within:ring-accent-primary/10',
        disabled && 'bg-subtle cursor-not-allowed opacity-75'
      )}>
        {prefix && (
          <div className="pl-[12px] flex items-center pointer-events-none text-text-tertiary">
            {prefix}
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          className={cn(
            'w-full h-[38px] px-[12px] text-[14px] text-text-primary placeholder:text-text-disabled bg-transparent outline-none disabled:cursor-not-allowed',
            prefix ? 'pl-[8px]' : '',
            suffix ? 'pr-[8px]' : '',
            className
          )}
          {...props}
        />
        {suffix && (
          <div className="pr-[12px] flex items-center text-text-tertiary">
            {suffix}
          </div>
        )}
      </div>
      {error ? (
        <p className="text-[12px] text-semantic-danger font-normal">{error}</p>
      ) : hint ? (
        <p className="text-[12px] text-text-tertiary font-normal">{hint}</p>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';
