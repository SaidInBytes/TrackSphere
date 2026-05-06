import { useState } from 'react';
import type { CreateReportPayload, ReportPriority, ReportStatus } from '../types/report';
import { PlusCircle, X } from 'lucide-react';

interface CreateReportFormProps {
  onSubmit: (payload: CreateReportPayload) => void;
}

const EMPTY_FORM: CreateReportPayload = {
  title: '',
  description: '',
  status: 'open',
  priority: 'medium',
  category: '',
  createdBy: '',
};

const inputClass =
  'w-full bg-dark-700 text-white text-sm rounded-lg px-3 py-2.5 border border-dark-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-gray-600';

export function CreateReportForm({ onSubmit }: CreateReportFormProps) {
  const [form, setForm] = useState<CreateReportPayload>(EMPTY_FORM);
  const [open, setOpen] = useState(false);

  const set = <K extends keyof CreateReportPayload>(key: K, value: CreateReportPayload[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
    setForm(EMPTY_FORM);
    setOpen(false);
  };

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 transition-colors text-white text-sm font-medium px-4 py-2.5 rounded-xl shadow"
      >
        <PlusCircle size={17} />
        Ny rapport
      </button>

      {/* Modal overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-dark-800 rounded-2xl border border-dark-700 shadow-2xl w-full max-w-lg">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-dark-700">
              <h2 className="text-white font-semibold text-lg">Skapa rapport</h2>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form body */}
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Titel *</label>
                <input
                  required
                  placeholder="Beskriv problemet kortfattat..."
                  value={form.title}
                  onChange={(e) => set('title', e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="text-xs text-gray-400 mb-1 block">Beskrivning</label>
                <textarea
                  rows={3}
                  placeholder="Detaljer, steg för att reproducera, etc..."
                  value={form.description}
                  onChange={(e) => set('description', e.target.value)}
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => set('status', e.target.value as ReportStatus)}
                    className={inputClass}
                  >
                    <option value="open">Öppen</option>
                    <option value="in-progress">Pågående</option>
                    <option value="closed">Stängd</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Prioritet</label>
                  <select
                    value={form.priority}
                    onChange={(e) => set('priority', e.target.value as ReportPriority)}
                    className={inputClass}
                  >
                    <option value="low">Låg</option>
                    <option value="medium">Medium</option>
                    <option value="high">Hög</option>
                    <option value="critical">Kritisk</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Kategori *</label>
                  <input
                    required
                    placeholder="Bug, Feature, ..."
                    value={form.category}
                    onChange={(e) => set('category', e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Skapad av *</label>
                  <input
                    required
                    placeholder="Ditt namn"
                    value={form.createdBy}
                    onChange={(e) => set('createdBy', e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="text-sm text-gray-400 hover:text-white transition-colors px-4 py-2"
                >
                  Avbryt
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 transition-colors text-white text-sm font-medium px-5 py-2.5 rounded-xl"
                >
                  Skapa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
