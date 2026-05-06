import type { ReportStatus, ReportPriority } from '../types/report';

const STATUS_STYLE: Record<ReportStatus, string> = {
  open:          'bg-red-500/15 text-red-400 border border-red-500/30',
  'in-progress': 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
  closed:        'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
};

const STATUS_LABEL: Record<ReportStatus, string> = {
  open:          'Open',
  'in-progress': 'In Progress',
  closed:        'Closed',
};

interface StatusBadgeProps { status: ReportStatus; size?: 'sm' | 'md'; }

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const padding = size === 'md' ? 'px-3 py-1 text-sm' : 'px-2.5 py-0.5 text-xs';
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${padding} ${STATUS_STYLE[status]}`}>
      {STATUS_LABEL[status]}
    </span>
  );
}

const PRIORITY_STYLE: Record<ReportPriority, string> = {
  low:      'bg-gray-500/15 text-gray-400',
  medium:   'bg-blue-500/15 text-blue-400',
  high:     'bg-orange-500/15 text-orange-400',
  critical: 'bg-red-600/20 text-red-400',
};

interface PriorityBadgeProps { priority: ReportPriority; size?: 'sm' | 'md'; }

export function PriorityBadge({ priority, size = 'sm' }: PriorityBadgeProps) {
  const padding = size === 'md' ? 'px-3 py-1 text-sm' : 'px-2.5 py-0.5 text-xs';
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${padding} ${PRIORITY_STYLE[priority]}`}>
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </span>
  );
}
