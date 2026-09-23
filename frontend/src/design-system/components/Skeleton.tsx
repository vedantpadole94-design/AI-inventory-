import React from 'react';
import { cn } from '../utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'rectangular' | 'circular';
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'text',
  width,
  height,
  style,
  ...props
}) => {
  const variants = {
    text: 'h-[14px] w-full rounded-[4px]',
    rectangular: 'rounded-[8px] w-full h-[120px]',
    circular: 'rounded-full w-[40px] h-[40px]',
  };

  return (
    <div
      className={cn(
        'bg-muted/70 animate-shimmer overflow-hidden',
        variants[variant],
        className
      )}
      style={{
        width,
        height,
        ...style,
      }}
      {...props}
    />
  );
};
