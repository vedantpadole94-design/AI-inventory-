import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface BarChart2DProps {
  data: Record<string, any>[];
  xKey: string;
  yKey: string;
  title?: string;
  color?: string;
  height?: number;
  showLegend?: boolean;
  horizontal?: boolean;
}

const COLORS = ['#4A90E2', '#2BBBAD', '#FFA000', '#7C4DFF', '#FF6B6B', '#4CAF50', '#FF9800', '#2196F3'];

const BarChart2D = ({
  data,
  xKey,
  yKey,
  title,
  color = '#4A90E2',
  height = 300,
  showLegend = false,
  horizontal = false,
}: BarChart2DProps) => {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      {title && <h3 className="mb-4 font-semibold text-slate-800">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} layout={horizontal ? 'vertical' : 'horizontal'}>
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
            formatter={(value: number | string) => [typeof value === 'number' ? value.toLocaleString() : value, yKey]}
            contentStyle={{
              borderRadius: '12px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 4px 12px rgba(15, 23, 42, 0.08)',
              fontSize: '13px',
            }}
          />
          {showLegend && <Legend />}
          <Bar dataKey={yKey} fill={color} radius={[6, 6, 0, 0]} animationDuration={800}>
            {data.map((entry, index) => (
              <Cell key={`cell-${String(entry[xKey] ?? index)}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChart2D;
