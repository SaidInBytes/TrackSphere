import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { DashboardStats } from '../types/report';

interface ReportPieChartProps {
  stats: DashboardStats;
}

const SLICES = [
  { key: 'open',        label: 'Open',        color: '#f87171' },
  { key: 'closed',      label: 'Closed',      color: '#4ade80' },
  { key: 'inProgress',  label: 'In Progress', color: '#facc15' },
] as const;

// Custom tooltip rendered over the dark background
function ChartTooltip({ active, payload }: { active?: boolean; payload?: { name: string; value: number }[] }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1a1d27] border border-[#2e3347] rounded-xl px-4 py-2 shadow-xl text-sm">
      <p className="text-white font-semibold">{payload[0].name}</p>
      <p className="text-gray-300">{payload[0].value} reports</p>
    </div>
  );
}

export function ReportPieChart({ stats }: ReportPieChartProps) {
  const inProgress = stats.total - stats.open - stats.closed;

  const data = [
    { name: 'Open',        value: stats.open },
    { name: 'Closed',      value: stats.closed },
    { name: 'In Progress', value: Math.max(0, inProgress) },
  ].filter((d) => d.value > 0);

  if (data.length === 0) {
    return (
      <div className="bg-[#1a1d27] rounded-2xl p-6 border border-[#2e3347] flex items-center justify-center h-[300px]">
        <p className="text-gray-500 text-sm">No data available</p>
      </div>
    );
  }

  const colors = data.map(
    (d) => SLICES.find((s) => s.label === d.name)?.color ?? '#6366f1',
  );

  return (
    <div className="bg-[#1a1d27] rounded-2xl p-6 border border-[#2e3347] shadow-lg h-full">
      <h2 className="text-base font-semibold text-white mb-1">Status Distribution</h2>
      <p className="text-xs text-gray-500 mb-4">Based on filtered reports</p>

      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={68}
            outerRadius={100}
            paddingAngle={4}
            dataKey="value"
            stroke="none"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={colors[i]} />
            ))}
          </Pie>
          <Tooltip content={<ChartTooltip />} />
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={(value) => (
              <span style={{ color: '#9ca3af', fontSize: 12 }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
