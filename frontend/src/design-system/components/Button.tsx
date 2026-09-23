import React, { forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '../utils';
import { ease, durations } from '../../lib/motion/presets';
import { usePrefersReducedMotion } from '../../lib/motion/hooks';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  className,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  children,
  disabled,
  ...props
}, ref) => {
  const prefersReduced = usePrefersReducedMotion();

  const baseStyles = 'inline-flex items-center justify-center font-medium select-none rounded-[8px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed transition-colors cursor-pointer';

  const variants = {
    primary: 'bg-accent-primary text-white hover:bg-accent-hover active:bg-indigo-800 focus-visible:ring-accent-primary shadow-xs disabled:bg-muted disabled:text-text-disabled',
    secondary: 'bg-surface text-text-primary border border-border-default hover:bg-subtle active:bg-muted focus-visible:ring-text-primary shadow-xs disabled:bg-subtle disabled:text-text-disabled disabled:border-border-default',
    ghost: 'bg-transparent text-text-secondary hover:bg-subtle hover:text-text-primary active:bg-muted focus-visible:ring-text-primary disabled:text-text-disabled',
    danger: 'bg-semantic-danger text-white hover:bg-red-800 active:bg-red-900 focus-visible:ring-semantic-danger shadow-xs disabled:bg-muted disabled:text-text-disabled',
  };

  const sizes = {
    sm: 'text-[13px] h-[32px] px-[12px] gap-[6px]',
    md: 'text-[14px] h-[38px] px-[16px] gap-[8px]',
    lg: 'text-[14px] h-[44px] px-[20px] gap-[8px]',
  };

  const motionProps = prefersReduced || disabled || loading
    ? {}
    : {
        whileHover: { scale: 1.015 },
        whileTap: { scale: 0.985 },
        transition: { duration: durations.instant, ease: ease.soft },
      };

  return (
    <motion.button
      ref={ref}
      disabled={disabled || loading}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...motionProps}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin inline-block" />
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="inline-flex shrink-0">{icon}</span>}
          {children && <span>{children}</span>}
          {icon && iconPosition === 'right' && <span className="inline-flex shrink-0">{icon}</span>}
        </>
      )}
    </motion.button>
  );
});

Button.displayName = 'Button';
