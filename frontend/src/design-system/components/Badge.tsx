import React from 'react';
import { cn } from '../utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'neutral' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'neutral',
  size = 'md',
  dot = false,
  children,
  ...props
}) => {
  const variants = {
    neutral: 'bg-subtle text-text-secondary border border-border-default',
    success: 'bg-semantic-success-bg text-semantic-success border border-emerald-200',
    warning: 'bg-semantic-warning-bg text-semantic-warning border border-amber-200',
    danger: 'bg-semantic-danger-bg text-semantic-danger border border-rose-200',
    info: 'bg-semantic-info-bg text-semantic-info border border-cyan-200',
  };

  const dots = {
    neutral: 'bg-text-tertiary',
    success: 'bg-semantic-success',
    warning: 'bg-semantic-warning',
    danger: 'bg-semantic-danger',
    info: 'bg-semantic-info',
  };

  const sizes = {
    sm: 'text-[11px] h-[20px] px-[6px] gap-[4px] font-medium',
    md: 'text-[12px] h-[24px] px-[8px] gap-[6px] font-medium',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full leading-none select-none tracking-[0.01em]',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {dot && <span className={cn('w-[6px] h-[6px] rounded-full shrink-0', dots[variant])} />}
      {children}
    </span>
  );
};
