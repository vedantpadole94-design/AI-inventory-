import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils';
import { X } from 'lucide-react';
import { IconButton } from './IconButton';
import { drawerEnter, ease, durations } from '../../lib/motion/presets';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: string;
  className?: string;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  width = 'w-full max-w-[600px]',
  className,
}) => {
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: durations.normal, ease: ease.out }}
            className="fixed inset-0 bg-stone-900/35 backdrop-blur-[3px]"
            onClick={onClose}
          />

          {/* Drawer Panel */}
          <motion.div
            ref={drawerRef}
            variants={drawerEnter}
            initial="initial"
            animate="animate"
            exit="exit"
            className={cn(
              'relative h-full bg-surface border-l border-border-default shadow-lg z-10 flex flex-col',
              width,
              className
            )}
          >
            <div className="flex items-start justify-between p-[20px] border-b border-border-default">
              <div>
                {title && <h3 className="text-[18px] font-semibold text-text-primary leading-[24px] tracking-tight">{title}</h3>}
                {description && <p className="text-[13px] text-text-secondary mt-[4px]">{description}</p>}
              </div>
              <IconButton icon={<X size={18} />} onClick={onClose} size="sm" variant="ghost" />
            </div>
            <div className="p-[20px] overflow-y-auto flex-1">{children}</div>
            {footer && (
              <div className="p-[16px] px-[20px] bg-subtle/50 border-t border-border-default flex items-center justify-end gap-[10px]">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
