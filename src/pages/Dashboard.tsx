import { useState, useMemo } from 'react';
import { LayoutDashboard, Bell, Settings } from 'lucide-react';
import { getReports, addReport } from '../utils/reportStorage';
import { DashboardCards } from '../components/DashboardCards';
import { ReportPieChart } from '../components/ReportPieChart';
import { ReportFilters } from '../components/ReportFilters';
import { ReportTable } from '../components/ReportTable';
import { CreateReportForm } from '../components/CreateReportForm';
import type { Report, DateRange, DashboardStats, CreateReportPayload } from '../types/report';

function isToday(isoString: string): boolean {
  const d = new Date(isoString);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth()    === now.getMonth()    &&
    d.getDate()     === now.getDate()
  );
}

export function Dashboard() {
  // Load from localStorage on mount; falls back to mockReports on first visit
  const [reports, setReports] = useState<Report[]>(() => getReports());
  const [dateRange, setDateRange] = useState<DateRange>({ from: '', to: '' });

  const filtered = useMemo(() => {
    return reports.filter((r) => {
      const d = new Date(r.createdAt);
      if (dateRange.from && d < new Date(dateRange.from)) return false;
      if (dateRange.to   && d > new Date(dateRange.to + 'T23:59:59Z')) return false;
      return true;
    });
  }, [reports, dateRange]);

  const stats: DashboardStats = useMemo(
    () => ({
      total:  filtered.length,
      open:   filtered.filter((r) => r.status === 'open').length,
      closed: filtered.filter((r) => r.status === 'closed').length,
      today:  filtered.filter((r) => isToday(r.createdAt)).length,
    }),
    [filtered],
  );

  const handleCreate = (payload: CreateReportPayload) => {
    const newReport: Report = {
      ...payload,
      id: String(Date.now()),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    // Persist to localStorage and update local state atomically
    const updated = addReport(newReport);
    setReports(updated);
  };

  return (
    <div className="min-h-screen bg-[#0f1117] text-white">
      <header className="bg-[#1a1d27] border-b border-[#2e3347] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 rounded-xl p-1.5">
              <LayoutDashboard size={18} className="text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">TrackSphere</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-[#242736] transition-colors">
              <Bell size={18} />
            </button>
            <button className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-[#242736] transition-colors">
              <Settings size={18} />
            </button>
            <div className="w-px h-6 bg-[#2e3347] mx-1" />
            <CreateReportForm onSubmit={handleCreate} />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">
            Welcome back — here's what's happening today.
          </p>
        </div>

        <DashboardCards stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2">
            <ReportPieChart stats={stats} />
          </div>
          <div className="lg:col-span-3 flex flex-col justify-center">
            <ReportFilters
              dateRange={dateRange}
              onChange={setDateRange}
              totalVisible={filtered.length}
              totalAll={reports.length}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold">All Reports</h2>
            <span className="text-xs text-gray-500 bg-[#1a1d27] border border-[#2e3347] px-2.5 py-1 rounded-full">
              {filtered.length} results
            </span>
          </div>
          <ReportTable reports={filtered} />
        </div>
      </main>
    </div>
  );
}
