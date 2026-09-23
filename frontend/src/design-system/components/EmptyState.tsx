import React from 'react';
import { cn } from '../utils';

export interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className,
}) => {
  return (
    <div className={cn('flex flex-col items-center justify-center p-[40px] text-center max-w-[420px] mx-auto', className)}>
      <div className="w-[48px] h-[48px] rounded-full bg-subtle border border-border-default flex items-center justify-center text-text-secondary mb-[14px]">
        {icon}
      </div>
      <h3 className="text-[16px] font-semibold text-text-primary leading-[22px] mb-[6px]">{title}</h3>
      <p className="text-[13px] text-text-secondary leading-[18px] mb-[18px]">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};
