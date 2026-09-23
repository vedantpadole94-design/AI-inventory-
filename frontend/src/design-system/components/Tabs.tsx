import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils';
import { ease, durations, tabSwitch } from '../../lib/motion/presets';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: 'underline' | 'pill';
  className?: string;
  id?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = 'underline',
  className,
  id = 'tabs',
}) => {
  return (
    <div
      className={cn(
        'flex items-center gap-[4px] overflow-x-auto no-scrollbar',
        variant === 'underline' && 'border-b border-border-default',
        variant === 'pill' && 'bg-subtle p-[3px] rounded-[8px] border border-border-default',
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;

        if (variant === 'pill') {
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={cn(
                'relative px-[12px] py-[6px] text-[13px] font-medium rounded-[6px] transition-colors flex items-center gap-[6px] select-none whitespace-nowrap cursor-pointer',
                isActive
                  ? 'text-text-primary font-semibold'
                  : 'text-text-secondary hover:text-text-primary'
              )}
            >
              {isActive && (
                <motion.span
                  layoutId={`active-tab-pill-${id}`}
                  className="absolute inset-0 bg-white rounded-[6px] shadow-xs border border-border-default/60 -z-0"
                  transition={{ duration: durations.fast, ease: ease.out }}
                />
              )}
              <span className="relative z-10 flex items-center gap-[6px]">
                {tab.icon && <span>{tab.icon}</span>}
                <span>{tab.label}</span>
                {typeof tab.count === 'number' && (
                  <span
                    className={cn(
                      'px-[6px] py-[0.5px] text-[11px] rounded-full tabular-nums',
                      isActive ? 'bg-subtle text-text-primary' : 'bg-muted/50 text-text-tertiary'
                    )}
                  >
                    {tab.count}
                  </span>
                )}
              </span>
            </button>
          );
        }

        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              'relative px-[14px] py-[10px] text-[14px] transition-colors -mb-[1px] flex items-center gap-[6px] select-none whitespace-nowrap cursor-pointer',
              isActive
                ? 'text-accent-primary font-semibold'
                : 'text-text-secondary hover:text-text-primary'
            )}
          >
            <span className="relative z-10 flex items-center gap-[6px]">
              {tab.icon && <span>{tab.icon}</span>}
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span
                  className={cn(
                    'px-[6px] py-[0.5px] text-[11px] rounded-full tabular-nums',
                    isActive ? 'bg-accent-subtle text-accent-primary' : 'bg-subtle text-text-tertiary'
                  )}
                >
                  {tab.count}
                </span>
              )}
            </span>
            {isActive && (
              <motion.span
                layoutId={`active-tab-underline-${id}`}
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent-primary z-10 rounded-full"
                transition={{ duration: durations.normal, ease: ease.out }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};

export const TabPanel: React.FC<{
  tabKey: string;
  children: React.ReactNode;
  className?: string;
}> = ({ tabKey, children, className }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={tabKey}
        variants={tabSwitch}
        initial="initial"
        animate="animate"
        exit="exit"
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};
