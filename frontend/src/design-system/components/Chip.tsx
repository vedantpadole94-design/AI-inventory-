import React from 'react';
import { cn } from '../utils';
import { X } from 'lucide-react';

export interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  avatar?: React.ReactNode;
  icon?: React.ReactNode;
  onDismiss?: () => void;
  active?: boolean;
}

export const Chip: React.FC<ChipProps> = ({
  className,
  avatar,
  icon,
  onDismiss,
  active = false,
  children,
  onClick,
  ...props
}) => {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-[6px] h-[28px] px-[10px] rounded-full text-[13px] font-normal transition-colors duration-150 select-none border',
        active
          ? 'bg-accent-subtle text-accent-primary border-blue-200 font-medium'
          : 'bg-white text-text-secondary border-border-default hover:bg-subtle hover:text-text-primary',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      {...props}
    >
      {avatar && <span className="shrink-0 -ml-[4px]">{avatar}</span>}
      {icon && <span className="shrink-0 text-text-tertiary">{icon}</span>}
      <span>{children}</span>
      {onDismiss && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDismiss();
          }}
          className="hover:text-text-primary ml-[2px] p-[2px] rounded-full hover:bg-black/5 text-text-tertiary"
        >
          <X size={12} />
        </button>
      )}
    </span>
  );
};
