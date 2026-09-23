import { motion, type HTMLMotionProps } from 'framer-motion';
import type { ReactNode } from 'react';
import { ease, durations } from '../../lib/motion/presets';
import { usePrefersReducedMotion } from '../../lib/motion/hooks';

export interface ScrollRevealProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  className?: string;
}

export const ScrollReveal = ({
  children,
  delay = 0,
  direction = 'up',
  className = '',
  ...props
}: ScrollRevealProps) => {
  const prefersReduced = usePrefersReducedMotion();

  const offsets = {
    up: { y: 16, x: 0 },
    down: { y: -16, x: 0 },
    left: { y: 0, x: 16 },
    right: { y: 0, x: -16 },
    none: { y: 0, x: 0 },
  };

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, ...offsets[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: durations.slow, delay, ease: ease.out }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
