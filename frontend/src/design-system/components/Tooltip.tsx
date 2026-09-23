import React, { useState } from 'react';
import { cn } from '../utils';

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  className,
}) => {
  const [visible, setVisible] = useState(false);

  const positionStyles = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-[6px]',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-[6px]',
    left: 'right-full top-1/2 -translate-y-1/2 mr-[6px]',
    right: 'left-full top-1/2 -translate-y-1/2 ml-[6px]',
  };

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {visible && content && (
        <div
          role="tooltip"
          className={cn(
            'absolute z-50 px-[8px] py-[4px] text-[12px] font-normal leading-[16px] text-white bg-stone-900 rounded-[6px] shadow-sm pointer-events-none whitespace-nowrap',
            positionStyles[position],
            className
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
};
