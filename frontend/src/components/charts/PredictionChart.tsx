import { useMemo } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface PredictionChartProps {
  historicalData: Record<string, any>[];
  predictedData: Record<string, any>[];
  xKey: string;
  yKey: string;
  title?: string;
  height?: number;
}

const PredictionChart = ({
  historicalData,
  predictedData,
  xKey,
  yKey,
  title,
  height = 350,
}: PredictionChartProps) => {
  const combinedData = useMemo(() => {
    const historical = historicalData.map((row) => ({ ...row, type: 'Historical' }));
    const predicted = predictedData.map((row) => ({ ...row, type: 'Predicted' }));

    if (historical.length === 0 && predicted.length === 0) {
      return [];
    }

    if (historical.length > 0 && predicted.length > 0) {
      const lastHistorical = historical[historical.length - 1] as Record<string, any>;
      const firstPredicted = predicted[0] as Record<string, any>;
      const connectingPoint: Record<string, any> = {
        ...firstPredicted,
        [yKey]: Number(lastHistorical[yKey] ?? 0),
        [`${yKey}_predicted`]: Number(firstPredicted.value_predicted ?? 0),
        type: 'Predicted',
      };

      return [...historical, connectingPoint, ...predicted];
    }

    return [...historical, ...predicted];
  }, [historicalData, predictedData, yKey]);

  const dividerValue = historicalData[historicalData.length - 1]?.[xKey];

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      {title && <h3 className="mb-4 font-semibold text-slate-800">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={combinedData}>
          <defs>
            <linearGradient id="historicalFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4A90E2" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#4A90E2" stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="predictedFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
          <XAxis
            dataKey={xKey}
            tick={{ fontSize: 12, fill: '#475569' }}
            axisLine={{ stroke: '#CBD5E1' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#475569' }}
            axisLine={{ stroke: '#CBD5E1' }}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: '12px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 4px 12px rgba(15, 23, 42, 0.08)',
              fontSize: '13px',
            }}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey={yKey}
            name="Historical"
            stroke="#4A90E2"
            fill="url(#historicalFill)"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5 }}
          />
          <Area
            type="monotone"
            dataKey={`${yKey}_predicted`}
            name="Predicted"
            stroke="#F59E0B"
            fill="url(#predictedFill)"
            strokeWidth={2.5}
            strokeDasharray="8 4"
            dot={false}
            activeDot={{ r: 5 }}
          />
          {dividerValue && (
            <ReferenceLine
              x={dividerValue}
              stroke="#94A3B8"
              strokeDasharray="3 3"
              label={{ value: 'Now', position: 'top', fill: '#64748B', fontSize: 11 }}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
      <div className="mt-3 flex flex-wrap items-center gap-6 text-xs text-slate-500">
        <span className="flex items-center gap-2"><span className="h-0.5 w-3 bg-blue-500" />Historical</span>
        <span className="flex items-center gap-2"><span className="h-0.5 w-3 border-t-2 border-dashed border-amber-500 bg-amber-500" />Forecast</span>
        <span className="flex items-center gap-2"><span className="h-0.5 w-3 border-t-2 border-dashed border-slate-400 bg-slate-400" />Boundary</span>
      </div>
    </div>
  );
};

export default PredictionChart;
