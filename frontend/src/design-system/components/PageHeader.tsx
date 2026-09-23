import React from 'react';
import { cn } from '../utils';
import { Breadcrumb, BreadcrumbItem } from './Breadcrumb';

export interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  breadcrumbs,
  actions,
  className,
}) => {
  return (
    <div className={cn('flex flex-col gap-[8px] pb-[20px] mb-[20px] border-b border-border-default', className)}>
      {breadcrumbs && <Breadcrumb items={breadcrumbs} className="mb-[2px]" />}
      <div className="flex flex-wrap items-center justify-between gap-[16px]">
        <div>
          <h1 className="text-[24px] font-semibold text-text-primary leading-[32px] tracking-[-0.01em]">
            {title}
          </h1>
          {description && (
            <p className="text-[14px] text-text-secondary mt-[2px] leading-[20px]">
              {description}
            </p>
          )}
        </div>
        {actions && <div className="flex items-center gap-[10px] shrink-0">{actions}</div>}
      </div>
    </div>
  );
};
