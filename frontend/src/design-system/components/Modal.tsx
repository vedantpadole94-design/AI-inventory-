import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils';
import { X } from 'lucide-react';
import { IconButton } from './IconButton';
import { modalEnter, ease, durations } from '../../lib/motion/presets';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  className,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

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

  const sizes = {
    sm: 'max-w-[400px]',
    md: 'max-w-[520px]',
    lg: 'max-w-[680px]',
    xl: 'max-w-[840px]',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-[16px] sm:p-[24px]">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: durations.fast, ease: ease.out }}
            className="fixed inset-0 bg-stone-900/40 backdrop-blur-[4px]"
            onClick={onClose}
          />

          {/* Modal Content */}
          <motion.div
            ref={modalRef}
            variants={modalEnter}
            initial="initial"
            animate="animate"
            exit="exit"
            className={cn(
              'relative w-full bg-surface rounded-[16px] border border-border-default shadow-lg overflow-hidden flex flex-col z-10 max-h-[90vh]',
              sizes[size],
              className
            )}
          >
            {(title || description) && (
              <div className="flex items-start justify-between p-[20px] pb-[16px] border-b border-border-default">
                <div>
                  {title && <h3 className="text-[18px] font-semibold text-text-primary leading-[24px] tracking-tight">{title}</h3>}
                  {description && <p className="text-[13px] text-text-secondary mt-[4px]">{description}</p>}
                </div>
                <IconButton icon={<X size={18} />} onClick={onClose} size="sm" variant="ghost" />
              </div>
            )}
            <div className="p-[20px] overflow-y-auto flex-1">{children}</div>
            {footer && (
              <div className="p-[16px] px-[20px] bg-subtle/60 border-t border-border-default flex items-center justify-end gap-[10px]">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
