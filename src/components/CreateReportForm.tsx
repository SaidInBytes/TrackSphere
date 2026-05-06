import { useState } from 'react';
import type { CreateReportPayload, ReportPriority, ReportStatus } from '../types/report';
import { PlusCircle, X, CheckCircle, Loader2 } from 'lucide-react';

interface CreateReportFormProps {
  onSubmit: (payload: CreateReportPayload) => Promise<void>;
}

const EMPTY_FORM: CreateReportPayload = {
  title: '', description: '', status: 'open',
  priority: 'medium', category: '', createdBy: '', location: '',
};

const inputClass =
  'w-full bg-[#242736] text-white text-sm rounded-xl px-3 py-2.5 border border-[#2e3347] ' +
  'focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-gray-600';

export function CreateReportForm({ onSubmit }: CreateReportFormProps) {
  const [form, setForm]       = useState<CreateReportPayload>(EMPTY_FORM);
  const [open, setOpen]       = useState(false);
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
      await onSubmit(form);
      setForm(EMPTY_FORM);
      setSuccess(true);
      setTimeout(() => { setSuccess(false); setOpen(false); }, 1500);
    } catch (err) {
      setError((err as Error).message ?? 'Failed to create report');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => { setOpen(false); setError(null); setSuccess(false); };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 transition-colors text-white text-sm font-medium px-4 py-2 rounded-xl shadow"
      >
        <PlusCircle size={16} />
        New Report
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#1a1d27] rounded-2xl border border-[#2e3347] shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#2e3347]">
              <h2 className="text-white font-semibold">Create Report</h2>
              <button onClick={handleClose} className="text-gray-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Success state */}
            {success ? (
              <div className="flex flex-col items-center justify-center gap-3 py-16 text-emerald-400">
                <CheckCircle size={40} />
                <p className="font-medium">Report created!</p>
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
                  <input required placeholder="Brief summary..." value={form.title}
                    onChange={(e) => set('title', e.target.value)} className={inputClass} />
                </div>

                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">Description</label>
                  <textarea rows={3} placeholder="Steps to reproduce, details..." value={form.description}
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
                    <input required placeholder="Bug, Feature..." value={form.category}
                      onChange={(e) => set('category', e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1.5 block">Location *</label>
                    <input required placeholder="City / Area" value={form.location}
                      onChange={(e) => set('location', e.target.value)} className={inputClass} />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block">Reporter *</label>
                  <input required placeholder="Your name" value={form.createdBy}
                    onChange={(e) => set('createdBy', e.target.value)} className={inputClass} />
                </div>

                <div className="flex justify-end gap-3 pt-1">
                  <button type="button" onClick={handleClose}
                    className="text-sm text-gray-400 hover:text-white transition-colors px-4 py-2" disabled={loading}>
                    Cancel
                  </button>
                  <button type="submit" disabled={loading}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 transition-colors text-white text-sm font-medium px-5 py-2.5 rounded-xl">
                    {loading && <Loader2 size={14} className="animate-spin" />}
                    {loading ? '' : 'Create'}Creating
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
