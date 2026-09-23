import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../utils';

export interface DropdownMenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  danger?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export interface DropdownSection {
  title?: string;
  items: DropdownMenuItem[];
}

export interface DropdownMenuProps {
  trigger: React.ReactNode;
  sections: DropdownSection[];
  align?: 'left' | 'right';
  className?: string;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  trigger,
  sections,
  align = 'right',
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative inline-block" ref={containerRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div
          className={cn(
            'absolute z-50 mt-[6px] min-w-[200px] bg-white border border-border-default rounded-[10px] shadow-md py-[4px] focus:outline-none animate-in fade-in-50 zoom-in-95',
            align === 'right' ? 'right-0' : 'left-0',
            className
          )}
        >
          {sections.map((section, sIdx) => (
            <div key={sIdx} className={cn(sIdx > 0 && 'border-t border-border-default my-[4px] pt-[4px]')}>
              {section.title && (
                <div className="px-[12px] py-[6px] text-[11px] font-medium text-text-tertiary uppercase tracking-wider">
                  {section.title}
                </div>
              )}
              {section.items.map((item) => (
                <button
                  key={item.id}
                  disabled={item.disabled}
                  onClick={() => {
                    if (!item.disabled && item.onClick) {
                      item.onClick();
                      setIsOpen(false);
                    }
                  }}
                  className={cn(
                    'w-full text-left px-[12px] py-[7px] text-[13px] flex items-center gap-[8px] transition-colors',
                    item.disabled
                      ? 'text-text-disabled cursor-not-allowed'
                      : item.danger
                      ? 'text-semantic-danger hover:bg-semantic-danger-bg'
                      : 'text-text-primary hover:bg-subtle'
                  )}
                >
                  {item.icon && <span className="text-text-tertiary">{item.icon}</span>}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
