import { motion, useScroll, useSpring } from 'framer-motion';

export interface ScrollProgressProps {
  className?: string;
  color?: string;
}

export const ScrollProgress = ({
  className = '',
  color = '#4F46E5',
}: ScrollProgressProps) => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX, transformOrigin: '0%', backgroundColor: color }}
      className={`fixed top-0 left-0 right-0 h-[2.5px] z-50 pointer-events-none ${className}`}
    />
  );
};

export default ScrollProgress;
