import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface LineDefinition {
  dataKey: string;
  color: string;
  name?: string;
  dashed?: boolean;
}

interface LineChart2DProps {
  data: Record<string, any>[];
  xKey: string;
  lines: LineDefinition[];
  title?: string;
  height?: number;
  showArea?: boolean;
  showLegend?: boolean;
}

const LineChart2D = ({
  data,
  xKey,
  lines,
  title,
  height = 300,
  showArea = false,
  showLegend = true,
}: LineChart2DProps) => {
  const ChartComponent = showArea ? AreaChart : LineChart;

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      {title && <h3 className="mb-4 font-semibold text-slate-800">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <ChartComponent data={data}>
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
          {showLegend && <Legend />}
          {lines.map((line, index) =>
            showArea ? (
              <Area
                key={`${line.dataKey}-${index}`}
                type="monotone"
                dataKey={line.dataKey}
                name={line.name ?? line.dataKey}
                stroke={line.color}
                fill={line.color}
                fillOpacity={0.15}
                strokeWidth={2}
                strokeDasharray={line.dashed ? '5 5' : undefined}
                animationDuration={800}
              />
            ) : (
              <Line
                key={`${line.dataKey}-${index}`}
                type="monotone"
                dataKey={line.dataKey}
                name={line.name ?? line.dataKey}
                stroke={line.color}
                strokeWidth={2}
                strokeDasharray={line.dashed ? '5 5' : undefined}
                dot={false}
                activeDot={{ r: 6 }}
                animationDuration={800}
              />
            ),
          )}
        </ChartComponent>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChart2D;
