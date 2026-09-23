import React, { useState } from 'react';
import { cn } from '../utils';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Avatar: React.FC<AvatarProps> = ({
  className,
  src,
  name,
  size = 'md',
  ...props
}) => {
  const [hasError, setHasError] = useState(false);

  const getInitials = (str: string) => {
    if (!str) return 'U';
    const parts = str.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return str.substring(0, 2).toUpperCase();
  };

  const sizes = {
    sm: 'w-[28px] h-[28px] text-[11px]',
    md: 'w-[36px] h-[36px] text-[13px]',
    lg: 'w-[44px] h-[44px] text-[15px]',
    xl: 'w-[56px] h-[56px] text-[18px]',
  };

  // Consistent background color based on name string
  const getBgColor = (str: string) => {
    const colors = [
      'bg-blue-100 text-blue-800',
      'bg-slate-100 text-slate-800',
      'bg-emerald-100 text-emerald-800',
      'bg-amber-100 text-amber-800',
      'bg-cyan-100 text-cyan-800',
      'bg-purple-100 text-purple-800',
    ];
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center rounded-full font-medium shrink-0 select-none overflow-hidden border border-border-default',
        sizes[size],
        getBgColor(name),
        className
      )}
      {...props}
    >
      {src && !hasError ? (
        <img
          src={src}
          alt={name}
          onError={() => setHasError(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        <span>{getInitials(name)}</span>
      )}
    </div>
  );
};
