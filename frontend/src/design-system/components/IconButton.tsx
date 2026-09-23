import React, { forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '../utils';
import { ease, durations } from '../../lib/motion/presets';
import { usePrefersReducedMotion } from '../../lib/motion/hooks';

export interface IconButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  tooltip?: string;
  icon: React.ReactNode;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(({
  className,
  variant = 'ghost',
  size = 'md',
  tooltip,
  icon,
  disabled,
  ...props
}, ref) => {
  const prefersReduced = usePrefersReducedMotion();

  const baseStyles = 'inline-flex items-center justify-center rounded-[8px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed select-none relative cursor-pointer';

  const variants = {
    primary: 'bg-accent-primary text-white hover:bg-accent-hover active:bg-indigo-800 focus-visible:ring-accent-primary disabled:bg-muted disabled:text-text-disabled',
    secondary: 'bg-surface text-text-primary border border-border-default hover:bg-subtle active:bg-muted focus-visible:ring-text-primary shadow-xs disabled:bg-subtle disabled:text-text-disabled',
    ghost: 'bg-transparent text-text-secondary hover:bg-subtle hover:text-text-primary active:bg-muted focus-visible:ring-text-primary disabled:text-text-disabled',
    danger: 'bg-transparent text-semantic-danger hover:bg-semantic-danger-bg focus-visible:ring-semantic-danger disabled:text-text-disabled',
  };

  const sizes = {
    sm: 'w-[32px] h-[32px]',
    md: 'w-[38px] h-[38px]',
    lg: 'w-[44px] h-[44px]',
  };

  const motionProps = prefersReduced || disabled
    ? {}
    : {
        whileHover: { scale: 1.04 },
        whileTap: { scale: 0.96 },
        transition: { duration: durations.instant, ease: ease.soft },
      };

  return (
    <motion.button
      ref={ref}
      disabled={disabled}
      title={tooltip}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...motionProps}
      {...props}
    >
      <span className="inline-flex items-center justify-center">{icon}</span>
      {tooltip && <span className="sr-only">{tooltip}</span>}
    </motion.button>
  );
});

IconButton.displayName = 'IconButton';
