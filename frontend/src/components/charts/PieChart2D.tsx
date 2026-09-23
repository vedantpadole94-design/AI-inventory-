import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

interface PieChart2DProps {
  data: Record<string, any>[];
  dataKey: string;
  nameKey: string;
  title?: string;
  height?: number;
  donut?: boolean;
}

const COLORS = ['#4A90E2', '#2BBBAD', '#FFA000', '#7C4DFF', '#FF6B6B', '#4CAF50', '#FF9800', '#2196F3', '#F44336', '#9C27B0'];

const PieChart2D = ({
  data,
  dataKey,
  nameKey,
  title,
  height = 300,
  donut = true,
}: PieChart2DProps) => {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      {title && <h3 className="mb-4 font-semibold text-slate-800">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            dataKey={dataKey}
            nameKey={nameKey}
            cx="50%"
            cy="50%"
            innerRadius={donut ? 60 : 0}
            outerRadius={100}
            paddingAngle={2}
            animationDuration={800}
            label={({ name, percent }) => `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${String(entry[nameKey] ?? index)}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              borderRadius: '12px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 4px 12px rgba(15, 23, 42, 0.08)',
              fontSize: '13px',
            }}
          />
          <Legend verticalAlign="bottom" height={36} iconType="circle" iconSize={8} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChart2D;
