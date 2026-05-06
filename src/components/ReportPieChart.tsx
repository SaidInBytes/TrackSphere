import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { ReportStats } from '../types/report';

interface ReportPieChartProps {
  stats: ReportStats;
}

// Colour palette aligned with the dark theme
const COLORS: Record<string, string> = {
  Öppna: '#f87171',       // red-400
  Pågående: '#facc15',    // yellow-400
  Stängda: '#4ade80',     // green-400
};

export function ReportPieChart({ stats }: ReportPieChartProps) {
  const data = [
    { name: 'Öppna', value: stats.open },
    { name: 'Pågående', value: stats.inProgress },
    { name: 'Stängda', value: stats.closed },
  ].filter((d) => d.value > 0); // hide segments with zero value

  if (data.length === 0) {
    return (
      <div className="bg-dark-800 rounded-2xl p-6 border border-dark-700 shadow-lg flex items-center justify-center h-64">
        <p className="text-gray-500">Ingen data</p>
      </div>
    );
  }

  return (
    <div className="bg-dark-800 rounded-2xl p-6 border border-dark-700 shadow-lg">
      <h2 className="text-lg font-semibold text-white mb-4">Status-fördelning</h2>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={100}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((entry) => (
              <Cell key={entry.name} fill={COLORS[entry.name]} />
            ))}
          </Pie>
          {/* Custom tooltip respecting dark background */}
          <Tooltip
            contentStyle={{
              backgroundColor: '#1a1d27',
              border: '1px solid #2e3347',
              borderRadius: '0.75rem',
              color: '#fff',
            }}
          />
          <Legend
            formatter={(value) => (
              <span style={{ color: '#9ca3af', fontSize: 13 }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
