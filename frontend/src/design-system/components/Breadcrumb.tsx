import React from 'react';
import { cn } from '../utils';
import { Home, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className }) => {
  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center gap-[6px] text-[13px] text-text-tertiary select-none', className)}>
      <Link to="/" className="hover:text-text-primary transition-colors flex items-center">
        <Home size={14} />
      </Link>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            <ChevronRight size={12} className="text-text-disabled shrink-0" />
            {isLast || !item.href ? (
              <span className="font-medium text-text-primary truncate max-w-[200px]">{item.label}</span>
            ) : (
              <Link to={item.href} className="hover:text-text-primary transition-colors truncate max-w-[200px]">
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
