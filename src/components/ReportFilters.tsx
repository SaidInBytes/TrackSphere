import type { DateRange } from '../types/report';
import { Calendar, X } from 'lucide-react';

interface ReportFiltersProps {
  dateRange: DateRange;
  onChange: (range: DateRange) => void;
}

// Date range filter — controls which reports are visible in the table
export function ReportFilters({ dateRange, onChange }: ReportFiltersProps) {
  const handleClear = () => onChange({ from: '', to: '' });

  const hasFilter = dateRange.from !== '' || dateRange.to !== '';

  return (
    <div className="bg-dark-800 rounded-2xl p-4 border border-dark-700 shadow-lg flex flex-wrap gap-4 items-center">
      <Calendar size={18} className="text-indigo-400 shrink-0" />

      <div className="flex flex-wrap gap-3 flex-1">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400">Från</label>
          <input
            type="date"
            value={dateRange.from}
            onChange={(e) => onChange({ ...dateRange, from: e.target.value })}
            className="bg-dark-700 text-white text-sm rounded-lg px-3 py-2 border border-dark-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 [color-scheme:dark]"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400">Till</label>
          <input
            type="date"
            value={dateRange.to}
            onChange={(e) => onChange({ ...dateRange, to: e.target.value })}
            className="bg-dark-700 text-white text-sm rounded-lg px-3 py-2 border border-dark-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 [color-scheme:dark]"
          />
        </div>
      </div>

      {/* Only show clear button when a filter is active */}
      {hasFilter && (
        <button
          onClick={handleClear}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors mt-auto pb-0.5"
        >
          <X size={15} />
          Rensa filter
        </button>
      )}
    </div>
  );
}
