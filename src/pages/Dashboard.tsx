import { useState, useMemo } from 'react';
import { LayoutDashboard } from 'lucide-react';
import { mockReports } from '../data/mockReports';
import { StatsCards } from '../components/StatsCards';
import { ReportPieChart } from '../components/ReportPieChart';
import { ReportFilters } from '../components/ReportFilters';
import { ReportTable } from '../components/ReportTable';
import { CreateReportForm } from '../components/CreateReportForm';
import type { Report, DateRange, ReportStats, CreateReportPayload } from '../types/report';

export function Dashboard() {
  // Start with mock data; new reports are prepended on creation
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [dateRange, setDateRange] = useState<DateRange>({ from: '', to: '' });

  // Filter reports by date range whenever the filter or data changes
  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      const date = new Date(r.createdAt);
      if (dateRange.from && date < new Date(dateRange.from)) return false;
      if (dateRange.to && date > new Date(dateRange.to + 'T23:59:59Z')) return false;
      return true;
    });
  }, [reports, dateRange]);

  // Derive stats from filtered reports for cards and chart
  const stats: ReportStats = useMemo(
    () => ({
      total: filteredReports.length,
      open: filteredReports.filter((r) => r.status === 'open').length,
      inProgress: filteredReports.filter((r) => r.status === 'in-progress').length,
      closed: filteredReports.filter((r) => r.status === 'closed').length,
    }),
    [filteredReports],
  );

  const handleCreate = (payload: CreateReportPayload) => {
    const newReport: Report = {
      ...payload,
      id: String(Date.now()),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setReports((prev) => [newReport, ...prev]);
  };

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      {/* Top navigation bar */}
      <header className="bg-dark-800 border-b border-dark-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <LayoutDashboard size={22} className="text-indigo-400" />
          <span className="font-semibold text-lg tracking-tight">TrackSphere</span>
        </div>
        <CreateReportForm onSubmit={handleCreate} />
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6">
        {/* Page heading */}
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">
            Översikt av alla rapporter – {filteredReports.length} av {reports.length} visas
          </p>
        </div>

        {/* KPI cards */}
        <StatsCards stats={stats} />

        {/* Chart + filter row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1">
            <ReportPieChart stats={stats} />
          </div>
          <div className="lg:col-span-2 flex flex-col justify-center">
            <ReportFilters dateRange={dateRange} onChange={setDateRange} />
          </div>
        </div>

        {/* Report table */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Rapportlista</h2>
          <ReportTable reports={filteredReports} />
        </div>
      </main>
    </div>
  );
}
