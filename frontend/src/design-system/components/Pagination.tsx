import React from 'react';
import { cn } from '../utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
  className,
}) => {
  return (
    <div className={cn('flex flex-wrap items-center justify-between gap-[16px] py-[12px] text-[13px] text-text-secondary select-none', className)}>
      <div className="flex items-center gap-[12px]">
        {typeof totalItems === 'number' && (
          <span className="tabular-nums">
            Showing <span className="font-medium text-text-primary">{Math.min((currentPage - 1) * pageSize + 1, totalItems)}</span> to{' '}
            <span className="font-medium text-text-primary">{Math.min(currentPage * pageSize, totalItems)}</span> of{' '}
            <span className="font-medium text-text-primary">{totalItems}</span> results
          </span>
        )}
        {onPageSizeChange && (
          <div className="flex items-center gap-[6px]">
            <span className="text-text-tertiary">Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="bg-white border border-border-default rounded-[6px] px-[8px] py-[3px] text-[12px] text-text-primary outline-none focus:border-accent-primary"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="flex items-center gap-[6px]">
        <button
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="h-[32px] px-[10px] rounded-[6px] border border-border-default bg-white text-text-primary hover:bg-subtle disabled:text-text-disabled disabled:bg-subtle disabled:cursor-not-allowed flex items-center gap-[4px] text-[13px]"
        >
          <ChevronLeft size={16} />
          <span>Previous</span>
        </button>

        <span className="px-[8px] text-[13px] tabular-nums font-medium text-text-primary">
          Page {currentPage} of {Math.max(1, totalPages)}
        </span>

        <button
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="h-[32px] px-[10px] rounded-[6px] border border-border-default bg-white text-text-primary hover:bg-subtle disabled:text-text-disabled disabled:bg-subtle disabled:cursor-not-allowed flex items-center gap-[4px] text-[13px]"
        >
          <span>Next</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};
