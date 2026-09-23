import { motion, type HTMLMotionProps } from 'framer-motion';
import type { ReactNode } from 'react';
import { fadeInUp } from '../../lib/motion/presets';

export interface FadeInUpProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export const FadeInUp = ({ children, delay = 0, className, ...props }: FadeInUpProps) => {
  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      transition={{ ...fadeInUp.transition, delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};
