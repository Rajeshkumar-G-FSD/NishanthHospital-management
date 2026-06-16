import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Plus, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { getAll, addDocument, updateDocument, deleteDocument, formatTimestamp } from '../services/firebaseService';
import Modal from './Modal';

export interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
}

export interface Field {
  key: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'date' | 'select' | 'textarea' | 'number';
  options?: string[];
  required?: boolean;
  placeholder?: string;
}

interface CRUDModuleProps {
  title: string;
  collectionName: string;
  columns: Column[];
  fields: Field[];
  singularLabel?: string;
  pageSize?: number;
}

const STATUS_COLORS: Record<string, string> = {
  Active: 'bg-green-100 text-green-700',
  Inactive: 'bg-gray-100 text-gray-600',
  Scheduled: 'bg-blue-100 text-blue-700',
  Confirmed: 'bg-indigo-100 text-indigo-700',
  Completed: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700',
  Pending: 'bg-yellow-100 text-yellow-700',
  Admitted: 'bg-purple-100 text-purple-700',
  Discharged: 'bg-teal-100 text-teal-700',
  Available: 'bg-green-100 text-green-700',
  Occupied: 'bg-red-100 text-red-700',
  Critical: 'bg-red-100 text-red-700',
  Stable: 'bg-green-100 text-green-700',
  Approved: 'bg-green-100 text-green-700',
  Rejected: 'bg-red-100 text-red-700',
  Paid: 'bg-green-100 text-green-700',
  Unpaid: 'bg-red-100 text-red-700',
  Draft: 'bg-gray-100 text-gray-600',
  Published: 'bg-green-100 text-green-700',
  'In Stock': 'bg-green-100 text-green-700',
  'Low Stock': 'bg-yellow-100 text-yellow-700',
  'Out of Stock': 'bg-red-100 text-red-700',
  'On Leave': 'bg-yellow-100 text-yellow-700',
  Sent: 'bg-blue-100 text-blue-700',
  Unread: 'bg-purple-100 text-purple-700',
  Read: 'bg-gray-100 text-gray-600',
  Overdue: 'bg-red-100 text-red-700',
  Due: 'bg-yellow-100 text-yellow-700',
  Processing: 'bg-blue-100 text-blue-700',
  'Partially Paid': 'bg-orange-100 text-orange-700',
};

export function StatusBadge({ value }: { value: string }) {
  const cls = STATUS_COLORS[value] ?? 'bg-gray-100 text-gray-600';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>
      {value || '—'}
    </span>
  );
}

export default function CRUDModule({
  title,
  collectionName,
  columns,
  fields,
  singularLabel,
  pageSize = 10,
}: CRUDModuleProps) {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editRecord, setEditRecord] = useState<any | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const singular = singularLabel ?? title.replace(/s$/, '');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAll(collectionName);
      setRecords(data);
      setPage(1);
    } catch (e: any) {
      setError(e.message ?? 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [collectionName]);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => {
    setEditRecord(null);
    setFormData({});
    setError('');
    setShowModal(true);
  };

  const openEdit = (record: any) => {
    setEditRecord(record);
    const init: Record<string, string> = {};
    fields.forEach(f => { init[f.key] = record[f.key] != null ? String(record[f.key]) : ''; });
    setFormData(init);
    setError('');
    setShowModal(true);
  };

  const handleSave = async () => {
    // Validate required fields
    const missing = fields.filter(f => f.required && !formData[f.key]?.trim());
    if (missing.length > 0) {
      setError(`Required fields missing: ${missing.map(f => f.label).join(', ')}`);
      return;
    }

    setSaving(true);
    setError('');
    try {
      // Build payload, coercing number fields to actual numbers
      const payload: Record<string, any> = {};
      fields.forEach(f => {
        const raw = formData[f.key];
        if (raw === undefined || raw === '') return;
        if (f.type === 'number') {
          const n = parseFloat(raw);
          payload[f.key] = isNaN(n) ? raw : n;
        } else {
          payload[f.key] = raw;
        }
      });

      if (editRecord) {
        await updateDocument(collectionName, editRecord.id, payload);
      } else {
        await addDocument(collectionName, payload);
      }
      await load();
      setShowModal(false);
    } catch (e: any) {
      setError(e.message ?? 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDocument(collectionName, id);
      setDeleteId(null);
      await load();
    } catch (e: any) {
      setError(e.message ?? 'Delete failed');
    }
  };

  const filtered = records.filter(r =>
    columns.some(c => {
      const v = r[c.key];
      return String(v ?? '').toLowerCase().includes(search.toLowerCase());
    })
  );

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageStart = (safePage - 1) * pageSize;
  const pageRows = filtered.slice(pageStart, pageStart + pageSize);

  const renderCell = (col: Column, row: any) => {
    const val = row[col.key];
    if (col.render) return col.render(val, row);
    if (val === null || val === undefined) return <span className="text-gray-300">—</span>;
    if (val?.toDate) return formatTimestamp(val);
    const str = String(val);
    if (STATUS_COLORS[str]) return <StatusBadge value={str} />;
    if (str.length > 60) return <span title={str}>{str.slice(0, 60)}…</span>;
    return str;
  };

  return (
    <div className="p-6 h-full">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={load}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={openAdd}
            className="flex items-center gap-1.5 bg-rose-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-rose-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add {singular}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>
      )}

      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <input
          type="text"
          placeholder={`Search ${title.toLowerCase()}…`}
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-72 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white"
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
            <RefreshCw className="w-4 h-4 animate-spin mr-2" /> Loading…
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider w-8">#</th>
                    {columns.map(c => (
                      <th key={c.key} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        {c.label}
                      </th>
                    ))}
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {pageRows.length === 0 ? (
                    <tr>
                      <td colSpan={columns.length + 2} className="px-4 py-12 text-center text-gray-400 text-sm">
                        No {title.toLowerCase()} found
                      </td>
                    </tr>
                  ) : pageRows.map((r, idx) => (
                    <tr key={r.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3 text-gray-300 text-xs">{pageStart + idx + 1}</td>
                      {columns.map(c => (
                        <td key={c.key} className="px-4 py-3 text-gray-700 whitespace-nowrap">
                          {renderCell(c, r)}
                        </td>
                      ))}
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <button
                          onClick={() => openEdit(r)}
                          className="text-blue-600 hover:text-blue-800 font-medium mr-3 text-xs hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteId(r.id)}
                          className="text-red-500 hover:text-red-700 font-medium text-xs hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer: count + pagination */}
            <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between text-xs text-gray-400">
              <span>
                {filtered.length === 0
                  ? `No ${title.toLowerCase()} found`
                  : `Showing ${pageStart + 1}–${Math.min(pageStart + pageSize, filtered.length)} of ${filtered.length}`}
              </span>
              {totalPages > 1 && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={safePage === 1}
                    className="p-1 rounded hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-2 text-gray-500">Page {safePage} / {totalPages}</span>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={safePage === totalPages}
                    className="p-1 rounded hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Add / Edit Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editRecord ? `Edit ${singular}` : `Add ${singular}`} size="lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fields.map(f => (
            <div key={f.key} className={f.type === 'textarea' ? 'sm:col-span-2' : ''}>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                {f.label}{f.required && <span className="text-red-500 ml-0.5">*</span>}
              </label>
              {f.type === 'textarea' ? (
                <textarea
                  value={formData[f.key] ?? ''}
                  onChange={e => setFormData(p => ({ ...p, [f.key]: e.target.value }))}
                  rows={3}
                  placeholder={f.placeholder}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 resize-none"
                />
              ) : f.type === 'select' ? (
                <select
                  value={formData[f.key] ?? ''}
                  onChange={e => setFormData(p => ({ ...p, [f.key]: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white"
                >
                  <option value="">Select {f.label}</option>
                  {f.options?.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : (
                <input
                  type={f.type}
                  value={formData[f.key] ?? ''}
                  onChange={e => setFormData(p => ({ ...p, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
              )}
            </div>
          ))}
        </div>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        <div className="flex justify-end gap-3 mt-5 pt-4 border-t border-gray-100">
          <button
            onClick={() => setShowModal(false)}
            className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 text-sm bg-rose-600 text-white rounded-lg hover:bg-rose-700 disabled:opacity-50 transition-colors font-medium"
          >
            {saving ? 'Saving…' : editRecord ? 'Update' : 'Add'}
          </button>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Confirm Delete" size="sm">
        <p className="text-sm text-gray-600 mb-5">
          Are you sure you want to delete this record? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setDeleteId(null)}
            className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => handleDelete(deleteId!)}
            className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}
