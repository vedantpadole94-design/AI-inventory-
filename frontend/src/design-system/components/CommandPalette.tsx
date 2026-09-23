import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils';
import { Search, ArrowRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { modalEnter, ease, durations } from '../../lib/motion/presets';

export interface CommandItem {
  id: string;
  title: string;
  category: string;
  path?: string;
  action?: () => void;
  icon?: React.ReactNode;
}

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  items: CommandItem[];
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  items,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (item: CommandItem) => {
    onClose();
    if (item.action) {
      item.action();
    } else if (item.path) {
      navigate(item.path);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleSelect(filteredItems[selectedIndex]);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[14vh] p-[16px]">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: durations.fast, ease: ease.out }}
            className="fixed inset-0 bg-stone-900/40 backdrop-blur-[4px]"
            onClick={onClose}
          />

          {/* Dialog Window */}
          <motion.div
            variants={modalEnter}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative w-full max-w-[560px] bg-surface rounded-[14px] border border-border-default shadow-lg overflow-hidden flex flex-col z-10"
          >
            <div className="flex items-center px-[16px] border-b border-border-default gap-[10px]">
              <Search size={18} className="text-text-tertiary shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Type a command or search..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleInputKeyDown}
                className="w-full h-[48px] text-[14px] text-text-primary placeholder:text-text-disabled outline-none bg-transparent"
              />
              <button
                onClick={onClose}
                className="text-text-tertiary hover:text-text-primary p-[4px] rounded transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="max-h-[340px] overflow-y-auto p-[8px]">
              {filteredItems.length === 0 ? (
                <div className="py-[32px] text-center text-[13px] text-text-tertiary">
                  No results found for "{query}"
                </div>
              ) : (
                filteredItems.map((item, idx) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={cn(
                      'flex items-center justify-between px-[12px] py-[8px] rounded-[8px] cursor-pointer text-[13px] transition-colors',
                      selectedIndex === idx ? 'bg-subtle text-text-primary' : 'text-text-secondary'
                    )}
                  >
                    <div className="flex items-center gap-[10px]">
                      {item.icon && <span className="text-text-tertiary">{item.icon}</span>}
                      <span className="font-medium text-text-primary">{item.title}</span>
                      <span className="text-[11px] text-text-tertiary px-[6px] py-[1px] rounded bg-muted/60">
                        {item.category}
                      </span>
                    </div>
                    <ArrowRight
                      size={14}
                      className={cn(
                        'text-text-tertiary transition-opacity',
                        selectedIndex === idx ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                  </div>
                ))
              )}
            </div>

            <div className="px-[16px] py-[10px] bg-subtle/60 border-t border-border-default flex items-center justify-between text-[11px] text-text-tertiary select-none">
              <div className="flex items-center gap-[12px]">
                <span>Navigate <kbd className="px-[4px] py-[1px] bg-white border border-border-default rounded">↑</kbd> <kbd className="px-[4px] py-[1px] bg-white border border-border-default rounded">↓</kbd></span>
                <span>Select <kbd className="px-[4px] py-[1px] bg-white border border-border-default rounded">↵</kbd></span>
                <span>Close <kbd className="px-[4px] py-[1px] bg-white border border-border-default rounded">esc</kbd></span>
              </div>
              <span className="font-mono text-[10px]">SmartProcure ⌘K</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
