import React from 'react';
import { cn } from '../utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  gradient?: boolean;
  accent?: string;
}

export const Card: React.FC<CardProps> = ({
  className,
  children,
  gradient = false,
  accent,
  style,
  ...props
}) => {
  const cardStyle: React.CSSProperties = {
    ...style,
    ...(accent
      ? {
          background: gradient
            ? `linear-gradient(135deg, ${accent}08 0%, #FFFFFF 100%)`
            : undefined,
        }
      : gradient
      ? {
          background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.03) 0%, #FFFFFF 100%)',
        }
      : {}),
  };

  return (
    <div
      style={cardStyle}
      className={cn(
        'bg-surface border border-border-default rounded-[12px] shadow-xs overflow-hidden flex flex-col',
        'transition-[transform,box-shadow,border-color] duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]',
        'hover:-translate-y-[2px] hover:border-border-strong hover:shadow-md',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}> = ({ title, description, action, className, children }) => {
  if (children) {
    return <div className={cn('p-[20px] pb-[16px] border-b border-border-default', className)}>{children}</div>;
  }
  return (
    <div className={cn('p-[20px] pb-[16px] border-b border-border-default flex items-start justify-between gap-[16px]', className)}>
      <div>
        {title && <h3 className="text-[16px] font-semibold text-text-primary leading-[22px] tracking-tight">{title}</h3>}
        {description && <p className="text-[13px] text-text-secondary mt-[2px]">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};

export const CardBody: React.FC<CardProps> = ({ className, children, ...props }) => {
  return (
    <div className={cn('p-[20px] flex-1', className)} {...props}>
      {children}
    </div>
  );
};

export const CardFooter: React.FC<CardProps> = ({ className, children, ...props }) => {
  return (
    <div className={cn('p-[16px] px-[20px] bg-subtle/50 border-t border-border-default flex items-center justify-between', className)} {...props}>
      {children}
    </div>
  );
};
