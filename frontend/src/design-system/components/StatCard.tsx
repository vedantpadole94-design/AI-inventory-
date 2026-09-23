import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { CountUp } from './CountUp';
import { ease } from '../../lib/motion/presets';

export interface StatCardProps {
  label: string;
  value: React.ReactNode;
  countTo?: number;
  decimals?: number;
  formatter?: (n: number) => string;
  trend?: {
    value: string;
    direction: 'up' | 'down' | 'neutral';
    label?: string;
  };
  sparklineData?: number[];
  icon?: React.ReactNode;
  accentColor?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  countTo,
  decimals = 0,
  formatter,
  trend,
  sparklineData,
  icon,
  accentColor,
  className,
}) => {
  const trendColors = {
    up: 'text-semantic-success bg-semantic-success-bg border-emerald-200',
    down: 'text-semantic-danger bg-semantic-danger-bg border-rose-200',
    neutral: 'text-text-secondary bg-subtle border-border-default',
  };

  const trendIcons = {
    up: <TrendingUp size={12} className="stroke-[2.5]" />,
    down: <TrendingDown size={12} className="stroke-[2.5]" />,
    neutral: <Minus size={12} className="stroke-[2.5]" />,
  };

  // Generate SVG path for mini sparkline with smooth draw-in animation
  const renderSparkline = () => {
    if (!sparklineData || sparklineData.length < 2) return null;
    const width = 80;
    const height = 28;
    const min = Math.min(...sparklineData);
    const max = Math.max(...sparklineData);
    const range = max - min || 1;

    const pathD = sparklineData
      .map((val, idx) => {
        const x = (idx / (sparklineData.length - 1)) * width;
        const y = height - ((val - min) / range) * (height - 6) - 3;
        return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(' ');

    const strokeColor =
      trend?.direction === 'up'
        ? '#15803D'
        : trend?.direction === 'down'
        ? '#B91C1C'
        : accentColor || '#4F46E5';

    return (
      <svg width={width} height={height} className="overflow-visible">
        <motion.path
          d={pathD}
          fill="none"
          stroke={strokeColor}
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: ease.out }}
        />
      </svg>
    );
  };

  return (
    <div
      className={cn(
        'bg-surface border border-border-default rounded-[12px] p-[20px] shadow-xs flex flex-col justify-between',
        'transition-[transform,box-shadow,border-color] duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]',
        'hover:-translate-y-[2px] hover:border-accent-light hover:shadow-md',
        className
      )}
    >
      <div className="flex items-center justify-between gap-[12px] mb-[12px]">
        <span className="text-[13px] font-medium text-text-secondary">{label}</span>
        {icon && <span className="text-text-tertiary">{icon}</span>}
      </div>

      <div className="flex items-baseline justify-between gap-[12px]">
        <div className="text-[28px] font-semibold text-text-primary leading-[34px] tracking-[-0.01em] tabular-nums">
          {countTo !== undefined ? (
            <CountUp to={countTo} decimals={decimals} formatter={formatter} />
          ) : (
            value
          )}
        </div>
        {sparklineData && <div className="self-end pb-[2px]">{renderSparkline()}</div>}
      </div>

      {trend && (
        <div className="flex items-center gap-[6px] mt-[10px] text-[12px]">
          <span
            className={cn(
              'inline-flex items-center gap-[3px] px-[6px] py-[2px] rounded-full border font-medium leading-none select-none',
              trendColors[trend.direction]
            )}
          >
            {trendIcons[trend.direction]}
            <span className="tabular-nums">{trend.value}</span>
          </span>
          {trend.label && <span className="text-text-tertiary">{trend.label}</span>}
        </div>
      )}
    </div>
  );
};
