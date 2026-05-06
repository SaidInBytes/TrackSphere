import { useState } from 'react';
import type { Report } from '../types/report';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface ReportTableProps {
  reports: Report[];
}

// Badge styling per status value
const statusStyles: Record<Report['status'], string> = {
  open: 'bg-red-500/20 text-red-400',
  'in-progress': 'bg-yellow-500/20 text-yellow-400',
  closed: 'bg-green-500/20 text-green-400',
};

const statusLabels: Record<Report['status'], string> = {
  open: 'Öppen',
  'in-progress': 'Pågående',
  closed: 'Stängd',
};

// Badge styling per priority
const priorityStyles: Record<Report['priority'], string> = {
  low: 'bg-gray-500/20 text-gray-400',
  medium: 'bg-blue-500/20 text-blue-400',
  high: 'bg-orange-500/20 text-orange-400',
  critical: 'bg-red-600/30 text-red-400 font-semibold',
};

const priorityLabels: Record<Report['priority'], string> = {
  low: 'Låg',
  medium: 'Medium',
  high: 'Hög',
  critical: 'Kritisk',
};

type SortKey = 'createdAt' | 'priority' | 'status' | 'title';
type SortDir = 'asc' | 'desc';

const PRIORITY_ORDER: Record<Report['priority'], number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

export function ReportTable({ reports }: ReportTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('createdAt');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  // Toggle sort direction or switch sort key
  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sorted = [...reports].sort((a, b) => {
    let cmp = 0;
    if (sortKey === 'createdAt') {
      cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    } else if (sortKey === 'priority') {
      cmp = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    } else if (sortKey === 'status') {
      cmp = a.status.localeCompare(b.status);
    } else if (sortKey === 'title') {
      cmp = a.title.localeCompare(b.title);
    }
    return sortDir === 'asc' ? cmp : -cmp;
  });

  const SortIcon = ({ col }: { col: SortKey }) =>
    sortKey === col ? (
      sortDir === 'asc' ? (
        <ChevronUp size={14} className="inline ml-1" />
      ) : (
        <ChevronDown size={14} className="inline ml-1" />
      )
    ) : (
      <ChevronDown size={14} className="inline ml-1 opacity-20" />
    );

  if (reports.length === 0) {
    return (
      <div className="bg-dark-800 rounded-2xl p-8 border border-dark-700 text-center text-gray-500">
        Inga rapporter matchar dina filter.
      </div>
    );
  }

  return (
    <div className="bg-dark-800 rounded-2xl border border-dark-700 shadow-lg overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="border-b border-dark-700 text-gray-400">
            {(
              [
                { label: 'Titel', key: 'title' },
                { label: 'Status', key: 'status' },
                { label: 'Prioritet', key: 'priority' },
                { label: 'Kategori', key: null },
                { label: 'Skapad av', key: null },
                { label: 'Datum', key: 'createdAt' },
              ] as { label: string; key: SortKey | null }[]
            ).map(({ label, key }) => (
              <th
                key={label}
                className={`px-5 py-4 font-medium ${key ? 'cursor-pointer select-none hover:text-white transition-colors' : ''}`}
                onClick={key ? () => handleSort(key) : undefined}
              >
                {label}
                {key && <SortIcon col={key} />}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((report) => (
            <tr
              key={report.id}
              className="border-b border-dark-700 last:border-0 hover:bg-dark-700/50 transition-colors"
            >
              <td className="px-5 py-3.5 text-white font-medium max-w-[240px]">
                <span className="truncate block">{report.title}</span>
              </td>
              <td className="px-5 py-3.5">
                <span className={`px-2.5 py-1 rounded-full text-xs ${statusStyles[report.status]}`}>
                  {statusLabels[report.status]}
                </span>
              </td>
              <td className="px-5 py-3.5">
                <span className={`px-2.5 py-1 rounded-full text-xs ${priorityStyles[report.priority]}`}>
                  {priorityLabels[report.priority]}
                </span>
              </td>
              <td className="px-5 py-3.5 text-gray-400">{report.category}</td>
              <td className="px-5 py-3.5 text-gray-400">{report.createdBy}</td>
              <td className="px-5 py-3.5 text-gray-400 whitespace-nowrap">
                {new Date(report.createdAt).toLocaleDateString('sv-SE')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
