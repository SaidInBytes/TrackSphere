import { Calendar, X } from 'lucide-react';
import type { DateRange } from '../types/report';

interface ReportFiltersProps {
  dateRange: DateRange;
  onChange: (range: DateRange) => void;
  totalVisible: number;
  totalAll: number;
}

const inputClass =
  'bg-[#242736] text-white text-sm rounded-xl px-3 py-2 border border-[#2e3347] ' +
  'focus:outline-none focus:ring-2 focus:ring-indigo-500 [color-scheme:dark] w-full';

export function ReportFilters({
  dateRange,
  onChange,
  totalVisible,
  totalAll,
}: ReportFiltersProps) {
  const isFiltered = dateRange.from !== '' || dateRange.to !== '';

  return (
    <div className="bg-[#1a1d27] rounded-2xl p-5 border border-[#2e3347] shadow-lg">
      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-indigo-400" />
          <span className="text-sm font-semibold text-white">Date Filter</span>
        </div>
        {isFiltered && (
          <button
            onClick={() => onChange({ from: '', to: '' })}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
          >
            <X size={13} />
            Clear
          </button>
        )}
      </div>

      {/* Date inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label htmlFor="filter-from" className="text-xs text-gray-500 mb-1.5 block">From</label>
          <input
            id="filter-from"
            type="date"
            value={dateRange.from}
            onChange={(e) => onChange({ ...dateRange, from: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="filter-to" className="text-xs text-gray-500 mb-1.5 block">To</label>
          <input
            id="filter-to"
            type="date"
            value={dateRange.to}
            onChange={(e) => onChange({ ...dateRange, to: e.target.value })}
            className={inputClass}
          />
        </div>
      </div>

      {/* Result count */}
      <p className="text-xs text-gray-500 mt-4">
        Showing{' '}
        <span className="text-indigo-400 font-semibold">{totalVisible}</span>
        {' '}of{' '}
        <span className="text-white font-semibold">{totalAll}</span>
        {' '}reports
      </p>
    </div>
  );
}
