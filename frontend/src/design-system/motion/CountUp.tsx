import { useEffect, useState } from 'react';
import { animate } from 'framer-motion';
import { usePrefersReducedMotion } from '../../lib/motion/hooks';

export interface CountUpProps {
  /** Target number to count up to */
  to: number;
  /** Duration in seconds. Default: 1.2 */
  duration?: number;
  /** Optional formatter for the value (e.g., currency) */
  formatter?: (value: number) => string;
  /** Decimals to show. Default: 0 */
  decimals?: number;
  /** Optional className */
  className?: string;
}

/**
 * CountUp — Animated number counter.
 * Starts from 0 to target on mount using Motion's animate() with ease.out.
 * Tabular-nums style prevents jitter.
 */
export const CountUp = ({
  to,
  duration = 1.2,
  formatter = (n) => n.toLocaleString(),
  decimals = 0,
  className,
}: CountUpProps) => {
  const prefersReduced = usePrefersReducedMotion();
  const [value, setValue] = useState(prefersReduced ? to : 0);

  useEffect(() => {
    if (prefersReduced) {
      setValue(to);
      return;
    }

    const controls = animate(0, to, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => setValue(latest),
    });

    return () => controls.stop();
  }, [to, duration, prefersReduced]);

  return (
    <span className={className} style={{ fontVariantNumeric: 'tabular-nums' }}>
      {formatter(Number(value.toFixed(decimals)))}
    </span>
  );
};
