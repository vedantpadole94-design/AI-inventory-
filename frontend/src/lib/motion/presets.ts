import type { Variants } from 'framer-motion';

export const ease = {
  out: [0.22, 1, 0.36, 1] as const,
  in: [0.64, 0, 0.78, 0] as const,
  inOut: [0.65, 0, 0.35, 1] as const,
  soft: [0.4, 0, 0.2, 1] as const,
};

export const durations = {
  instant: 0.1,
  fast: 0.15,
  normal: 0.25,
  slow: 0.4,
  slower: 0.6,
} as const;

export const pageTransition: Variants = {
  initial: { opacity: 0, y: 8, filter: 'blur(4px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.35, ease: ease.out } },
  exit: { opacity: 0, y: -8, filter: 'blur(4px)', transition: { duration: durations.fast, ease: ease.in } },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.05 },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: durations.slow, ease: ease.out } },
};

export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: ease.out } },
};

export const cardHover = {
  rest: { y: 0, boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.06)' },
  hover: { y: -2, boxShadow: '0 12px 24px -8px rgb(79 70 229 / 0.15)', transition: { duration: durations.fast, ease: ease.soft } },
};

export const buttonPress = {
  rest: { scale: 1 },
  hover: { scale: 1.015, transition: { duration: durations.fast, ease: ease.soft } },
  tap: { scale: 0.985, transition: { duration: durations.instant, ease: ease.soft } },
};

export const modalEnter: Variants = {
  initial: { opacity: 0, scale: 0.96, y: 8 },
  animate: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.2, ease: ease.out } },
  exit: { opacity: 0, scale: 0.96, y: 8, transition: { duration: durations.fast, ease: ease.in } },
};

export const drawerEnter: Variants = {
  initial: { x: '100%' },
  animate: { x: 0, transition: { duration: 0.3, ease: ease.out } },
  exit: { x: '100%', transition: { duration: durations.normal, ease: ease.in } },
};

export const tabSwitch: Variants = {
  initial: { opacity: 0, x: 8 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.2, ease: ease.out } },
  exit: { opacity: 0, x: -8, transition: { duration: durations.fast, ease: ease.in } },
};
