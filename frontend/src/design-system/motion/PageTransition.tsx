import { motion, type HTMLMotionProps } from 'framer-motion';
import type { ReactNode } from 'react';
import { pageTransition } from '../../lib/motion/presets';

export interface PageTransitionProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  className?: string;
}

export const PageTransition = ({ children, className = 'min-h-full', ...props }: PageTransitionProps) => (
  <motion.div
    variants={pageTransition}
    initial="initial"
    animate="animate"
    exit="exit"
    className={className}
    {...props}
  >
    {children}
  </motion.div>
);

export default PageTransition;
