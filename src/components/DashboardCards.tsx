import { FileText, AlertCircle, CheckCircle, CalendarClock } from 'lucide-react';
import type { DashboardStats } from '../types/report';

interface CardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  accent: string;   // border-left + icon bg tint colour
  trend?: string;   // optional subtitle / trend line
}

// Single stat  flexible accent colour passed as Tailwind class stringcard 
function Card({ label, value, icon, accent, trend }: CardProps) {
  return (
    <div
      className={`relative bg-[#1a1d27] rounded-2xl p-6 flex items-center gap-5
        border border-[#2e3347] shadow-lg overflow-hidden
        hover:border-opacity-80 hover:shadow-xl transition-all duration-200`}
    >
      {/* Coloured left accent bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl ${accent}`} />

      {/* Icon bubble */}
      <div className={`p-3 rounded-xl bg-[#242736] ${accent.replace('bg-', 'text-')}`}>
        {icon}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-400 truncate">{label}</p>
        <p className="text-3xl font-bold text-white mt-0.5 tabular-nums">{value}</p>
        {trend && <p className="text-xs text-gray-500 mt-1">{trend}</p>}
      </div>
    </div>
  );
}

interface DashboardCardsProps {
  stats: DashboardStats;
}

// Renders the 4-card KPI row at the top of the dashboard
export function DashboardCards({ stats }: DashboardCardsProps) {
  const cards: CardProps[] = [
    {
      label: 'Total Reports',
      value: stats.total,
      icon: <FileText size={22} />,
      accent: 'bg-indigo-500',
      trend: 'All time',
    },
    {
      label: 'Open Reports',
      value: stats.open,
      icon: <AlertCircle size={22} />,
      accent: 'bg-red-500',
      trend: 'Needs attention',
    },
    {
      label: 'Closed Reports',
      value: stats.closed,
      icon: <CheckCircle size={22} />,
      accent: 'bg-emerald-500',
      trend: 'Resolved',
    },
    {
      label: 'Reports Today',
      value: stats.today,
      icon: <CalendarClock size={22} />,
      accent: 'bg-amber-500',
      trend: new Date().toLocaleDateString('sv-SE'),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((c) => (
        <Card key={c.label} {...c} />
      ))}
    </div>
  );
}
