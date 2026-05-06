import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Tag,
  MapPin,
  User,
  Calendar,
  RefreshCw,
  FileText,
  AlertTriangle,
} from 'lucide-react';
import { getReports } from '../utils/reportStorage';
import { StatusBadge, PriorityBadge } from '../components/StatusBadge';

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-[#2e3347] last:border-0">
      <span className="text-gray-500 mt-0.5 shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500 mb-0.5">{label}</p>
        <div className="text-sm text-white">{value}</div>
      </div>
    </div>
  );
}

export function ReportDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const report = getReports().find((r) => r.id === id);

  if (!report) {
    return (
      <div className="min-h-screen bg-[#0f1117] flex flex-col items-center justify-center gap-4 text-center px-4">
        <AlertTriangle size={40} className="text-amber-400" />
        <h1 className="text-xl font-bold text-white">Report not found</h1>
        <p className="text-gray-400 text-sm">
          The report with ID{' '}
          <span className="text-indigo-400 font-mono">{id}</span> does not exist.
        </p>
        <button
          onClick={() => navigate('/')}
          className="mt-2 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 transition-colors text-white text-sm font-medium px-4 py-2.5 rounded-xl"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1117] text-white">
      <header className="bg-[#1a1d27] border-b border-[#2e3347] sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
          >
            <ArrowLeft size={17} />
            Back
          </button>
          <div className="w-px h-5 bg-[#2e3347]" />
          <span className="text-sm text-gray-400 truncate">{report.title}</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={report.status} size="md" />
            <PriorityBadge priority={report.priority} size="md" />
          </div>
          <h1 className="text-2xl font-bold leading-snug">{report.title}</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 bg-[#1a1d27] rounded-2xl border border-[#2e3347] shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText size={15} className="text-indigo-400" />
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Description
              </h2>
            </div>
            {report.description ? (
              <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                {report.description}
              </p>
            ) : (
              <p className="text-gray-600 italic text-sm">No description provided.</p>
            )}
          </div>

          <div className="bg-[#1a1d27] rounded-2xl border border-[#2e3347] shadow-lg p-6">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Details
            </h2>
            <DetailRow
              icon={<Tag size={14} />}
              label="Category"
              value={
                <span className="bg-[#242736] text-gray-300 px-2.5 py-0.5 rounded-lg text-xs">
                  {report.category}
                </span>
              }
            />
            <DetailRow icon={<MapPin size={14} />} label="Location" value={report.location} />
            <DetailRow icon={<User size={14} />} label="Reported by" value={report.createdBy} />
            <DetailRow
              icon={<Calendar size={14} />}
              label="Created"
              value={new Date(report.createdAt).toLocaleString('sv-SE', {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}
            />
            <DetailRow
              icon={<RefreshCw size={14} />}
              label="Last updated"
              value={new Date(report.updatedAt).toLocaleString('sv-SE', {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}
            />
          </div>
        </div>

        <p className="text-xs text-gray-600 font-mono">ID: {report.id}</p>
      </main>
    </div>
  );
}
