import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronUp, ChevronDown, MapPin } from 'lucide-react';
import { StatusBadge, PriorityBadge } from './StatusBadge';
import type { Report } from '../types/report';

interface ReportTableProps {
  reports: Report[];
}

type SortKey = 'title' | 'category' | 'status' | 'location' | 'createdAt' | 'createdBy';
type SortDir = 'asc' | 'desc';

const PRIORITY_RANK: Record<Report['priority'], number> = {
  critical: 4, high: 3, medium: 2, low: 1,
};

function sortReports(list: Report[], key: SortKey, dir: SortDir): Report[] {
  return [...list].sort((a, b) => {
    let cmp = 0;
    if (key === 'createdAt') {
      cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    } else if (key === 'status') {
      cmp = PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
    } else {
      cmp = (a[key] as string).localeCompare(b[key] as string);
    }
    return dir === 'asc' ? cmp : -cmp;
  });
}

interface SortIconProps { active: boolean; dir: SortDir }
function SortIcon({ active, dir }: SortIconProps) {
  if (!active) return <ChevronDown size={13} className="ml-1 opacity-20 inline" />;
  return dir === 'asc'
    ? <ChevronUp size={13} className="ml-1 text-indigo-400 inline" />
    : <ChevronDown size={13} className="ml-1 text-indigo-400 inline" />;
}

export function ReportTable({ reports }: ReportTableProps) {
  const navigate = useNavigate();
  const [sortKey, setSortKey] = useState<SortKey>('createdAt');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const toggleSort = (key: SortKey) => {
    if (key === sortKey) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('asc'); }
  };

  const sorted = sortReports(reports, sortKey, sortDir);

  const columns: { label: string; key: SortKey | null }[] = [
    { label: 'Title',    key: 'title' },
    { label: 'Category', key: 'category' },
    { label: 'Status',   key: 'status' },
    { label: 'Location', key: 'location' },
    { label: 'Date',     key: 'createdAt' },
    { label: 'Reporter', key: 'createdBy' },
  ];

  if (reports.length === 0) {
    return (
      <div className="bg-[#1a1d27] rounded-2xl p-10 border border-[#2e3347] text-center text-gray-500 text-sm">
        No reports match the current filters.
      </div>
    );
  }

  return (
    <div className="bg-[#1a1d27] rounded-2xl border border-[#2e3347] shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b border-[#2e3347]">
              {columns.map(({ label, key }) => (
                <th
                  key={label}
                  onClick={key ? () => toggleSort(key) : undefined}
                  className={
                    'px-5 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap ' +
                    (key ? 'cursor-pointer select-none hover:text-white transition-colors' : '')
                  }
                >
                  {label}
                  {key && <SortIcon active={sortKey === key} dir={sortDir} />}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => (
              <tr
                key={r.id}
                onClick={() => navigate(`/reports/${r.id}`)}
                className="border-b border-[#2e3347] last:border-0 hover:bg-[#242736]/60 transition-colors cursor-pointer"
              >
                <td className="px-5 py-3.5 font-medium text-white max-w-[220px]">
                  <span className="truncate block">{r.title}</span>
                  <PriorityBadge priority={r.priority} size="sm" />
                </td>
                <td className="px-5 py-3.5">
                  <span className="bg-[#242736] text-gray-300 px-2.5 py-1 rounded-lg text-xs">
                    {r.category}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <StatusBadge status={r.status} size="sm" />
                </td>
                <td className="px-5 py-3.5 text-gray-400 whitespace-nowrap">
                  <span className="flex items-center gap-1">
                    <MapPin size={12} className="text-gray-500" />
                    {r.location}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-gray-400 whitespace-nowrap">
                  {new Date(r.createdAt).toLocaleDateString('sv-SE')}
                </td>
                <td className="px-5 py-3.5 text-gray-300 whitespace-nowrap">
                  {r.createdBy}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-5 py-3 border-t border-[#2e3347] text-xs text-gray-500">
        {reports.length} {reports.length === 1 ? 'report' : 'reports'}
      </div>
    </div>
  );
}
