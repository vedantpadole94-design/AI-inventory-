import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { pageTransition } from '../../lib/motion/presets';

interface PageTransitionProps {
  children: ReactNode;
}

const PageTransition = ({ children }: PageTransitionProps) => (
  <motion.div
    variants={pageTransition}
    initial="initial"
    animate="animate"
    exit="exit"
    className="min-h-full"
  >
    {children}
  </motion.div>
);

export default PageTransition;
