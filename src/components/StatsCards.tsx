import type { ReportStats } from '../types/report';
import { BarChart2, AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string; // Tailwind border/text accent class
}

// Single stat card — reused for each metric
function StatCard({ label, value, icon, color }: StatCardProps) {
  return (
    <div className="bg-dark-800 rounded-2xl p-6 flex items-center gap-5 border border-dark-700 shadow-lg">
      <div className={`p-3 rounded-xl bg-dark-700 ${color}`}>{icon}</div>
      <div>
        <p className="text-sm text-gray-400">{label}</p>
        <p className="text-3xl font-bold text-white mt-0.5">{value}</p>
      </div>
    </div>
  );
}

interface StatsCardsProps {
  stats: ReportStats;
}

// Renders a responsive grid of stat cards derived from report statistics
export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      label: 'Total rapporter',
      value: stats.total,
      icon: <BarChart2 size={22} />,
      color: 'text-indigo-400',
    },
    {
      label: 'Öppna',
      value: stats.open,
      icon: <AlertCircle size={22} />,
      color: 'text-red-400',
    },
    {
      label: 'Pågående',
      value: stats.inProgress,
      icon: <Clock size={22} />,
      color: 'text-yellow-400',
    },
    {
      label: 'Stängda',
      value: stats.closed,
      icon: <CheckCircle size={22} />,
      color: 'text-green-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card) => (
        <StatCard key={card.label} {...card} />
      ))}
    </div>
  );
}
