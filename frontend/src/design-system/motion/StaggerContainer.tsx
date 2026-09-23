import { motion, type HTMLMotionProps } from 'framer-motion';
import type { ReactNode } from 'react';
import { staggerContainer, staggerItem } from '../../lib/motion/presets';

export interface StaggerContainerProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  className?: string;
  viewportOnce?: boolean;
}

export const StaggerContainer = ({
  children,
  className = '',
  viewportOnce = true,
  ...props
}: StaggerContainerProps) => (
  <motion.div
    variants={staggerContainer}
    initial="hidden"
    whileInView="show"
    viewport={{ once: viewportOnce, margin: '-20px' }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
);

export interface StaggerItemProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  className?: string;
}

export const StaggerItem = ({ children, className = '', ...props }: StaggerItemProps) => (
  <motion.div variants={staggerItem} className={className} {...props}>
    {children}
  </motion.div>
);
