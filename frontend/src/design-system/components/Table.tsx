import React from 'react';
import { cn } from '../utils';

export interface Column<T> {
  key: string;
  header: React.ReactNode;
  render?: (row: T, index: number) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
  width?: string;
  sortable?: boolean;
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string | number;
  loading?: boolean;
  emptyState?: React.ReactNode;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (columnKey: string) => void;
  onRowClick?: (row: T) => void;
  className?: string;
}

export function Table<T>({
  columns,
  data,
  keyExtractor,
  loading = false,
  emptyState,
  sortColumn,
  sortDirection,
  onSort,
  onRowClick,
  className,
}: TableProps<T>) {
  return (
    <div className={cn('w-full overflow-x-auto border border-border-default rounded-[10px] bg-white shadow-xs', className)}>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-border-default bg-subtle/50 text-[12px] font-semibold text-text-secondary select-none">
            {columns.map((col) => (
              <th
                key={col.key}
                style={{ width: col.width }}
                onClick={() => col.sortable && onSort && onSort(col.key)}
                className={cn(
                  'py-[10px] px-[16px] tracking-wider uppercase',
                  col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left',
                  col.sortable && 'cursor-pointer hover:text-text-primary'
                )}
              >
                <div className={cn('inline-flex items-center gap-[4px]', col.align === 'right' && 'flex-row-reverse')}>
                  <span>{col.header}</span>
                  {col.sortable && sortColumn === col.key && (
                    <span className="text-accent-primary font-bold">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border-default text-[13px] text-text-primary">
          {loading ? (
            [...Array(5)].map((_, i) => (
              <tr key={i} className="animate-pulse">
                {columns.map((_, ci) => (
                  <td key={ci} className="py-[14px] px-[16px]">
                    <div className="h-[14px] bg-muted rounded animate-shimmer" />
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="py-[48px] text-center text-text-tertiary">
                {emptyState || 'No records found.'}
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr
                key={keyExtractor(row)}
                onClick={() => onRowClick && onRowClick(row)}
                className={cn(
                  'transition-colors duration-100 hover:bg-subtle/60',
                  onRowClick && 'cursor-pointer'
                )}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn(
                      'py-[12px] px-[16px] align-middle',
                      col.align === 'right' ? 'text-right tabular-nums' : col.align === 'center' ? 'text-center' : 'text-left'
                    )}
                  >
                    {col.render ? col.render(row, idx) : (row as Record<string, unknown>)[col.key] as React.ReactNode}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
