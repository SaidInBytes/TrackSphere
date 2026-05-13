import { useState } from 'react';
import { X, Save, Loader2, CheckCircle } from 'lucide-react';
import type { Report, CreateReportPayload, ReportStatus, ReportPriority } from '../types/report';

interface EditReportModalProps {
  report: Report;
  onSave: (payload: Partial<CreateReportPayload>) => Promise<void>;
  onClose: () => void;
}

const inputClass =
  'w-full bg-[#242736] text-white text-sm rounded-xl px-3 py-2.5 border border-[#2e3347] ' +
  'focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-gray-600';

export function EditReportModal({ report, onSave, onClose }: EditReportModalProps) {
  const [form, setForm] = useState<CreateReportPayload>({
    title:       report.title,
    description: report.description,
    status:      report.status,
    priority:    report.priority,
    category:    report.category,
    location:    report.location,
    createdBy:   report.createdBy,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const set = <K extends keyof CreateReportPayload>(key: K, value: CreateReportPayload[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onSave(form);
      setSuccess(true);
      setTimeout(onClose, 1200);
    } catch (err) {
      setError((err as Error).message ?? 'Failed to update report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#1a1d27] rounded-2xl border border-[#2e3347] shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2e3347]">
          <h2 className="text-white font-semibold">Edit Report</h2>
          <button onClick={onClose} aria-label="Close" className="text-gray-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {success ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-emerald-400">
            <CheckCircle size={40} />
            <p className="font-medium">Report updated!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl px-3 py-2">
                {error}
              </div>
            )}

            <div>
              <label className="text-xs text-gray-400 mb-1.5 block">Title *</label>
              <input required value={form.title}
                onChange={(e) => set('title', e.target.value)} className={inputClass} />
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-1.5 block">Description</label>
              <textarea rows={3} value={form.description}
                onChange={(e) => set('description', e.target.value)}
                className={`${inputClass} resize-none`} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">Status</label>
                <select value={form.status} onChange={(e) => set('status', e.target.value as ReportStatus)} className={inputClass}>
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">Priority</label>
                <select value={form.priority} onChange={(e) => set('priority', e.target.value as ReportPriority)} className={inputClass}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">Category *</label>
                <input required value={form.category}
                  onChange={(e) => set('category', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">Location</label>
                <input value={form.location}
                  onChange={(e) => set('location', e.target.value)} className={inputClass} />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-1.5 block">Reporter</label>
              <input value={form.createdBy}
                onChange={(e) => set('createdBy', e.target.value)} className={inputClass} />
            </div>

            <div className="flex justify-end gap-3 pt-1">
              <button type="button" onClick={onClose} disabled={loading}
                className="text-sm text-gray-400 hover:text-white transition-colors px-4 py-2">
                Cancel
              </button>
              <button type="submit" disabled={loading}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 transition-colors text-white text-sm font-medium px-5 py-2.5 rounded-xl">
                {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                {loading ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
