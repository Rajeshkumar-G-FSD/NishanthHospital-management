import { useState, useEffect } from 'react';
import { RefreshCw, Search, Download, FlaskConical, CheckCircle, Clock } from 'lucide-react';
import { getAll, formatTimestamp } from '../services/firebaseService';
import { StatusBadge } from '../components/CRUDModule';

export default function LabReports() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [labOrders, labTests, manualTests] = await Promise.allSettled([
        getAll('labOrders'),
        getAll('labTests'),
        getAll('manualLabTests'),
      ]);
      const combined: any[] = [
        ...(labOrders.status === 'fulfilled' ? labOrders.value.map(r => ({ ...r, _source: 'Lab Order' })) : []),
        ...(labTests.status === 'fulfilled' ? labTests.value.map(r => ({ ...r, _source: 'Lab Test' })) : []),
        ...(manualTests.status === 'fulfilled' ? manualTests.value.map(r => ({ ...r, _source: 'Manual Test' })) : []),
      ];
      setRecords(combined);
    } catch (e: any) {
      setError(e.message ?? 'Failed to load lab reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = records.filter(r => {
    const matchesSearch = !search || Object.values(r).some(v =>
      String(v ?? '').toLowerCase().includes(search.toLowerCase())
    );
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    const matchesType = typeFilter === 'All' || r.testType === typeFilter || r._source === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const types = ['All', 'Lab Order', 'Lab Test', 'Manual Test'];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Lab Reports</h2>
          <p className="text-sm text-gray-500 mt-0.5">Laboratory test orders, results, and manual lab entries</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button className="flex items-center gap-1.5 border border-gray-200 text-gray-600 px-3 py-2 rounded-lg text-sm hover:bg-gray-50">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Tests', value: records.length, color: 'bg-teal-50 text-teal-600' },
          { label: 'Completed', value: records.filter(r => r.status === 'Completed').length, color: 'bg-green-50 text-green-600' },
          { label: 'Pending / Processing', value: records.filter(r => ['Pending', 'Ordered', 'Processing', 'Sample Collected'].includes(r.status)).length, color: 'bg-yellow-50 text-yellow-600' },
          { label: 'Manual Tests', value: records.filter(r => r._source === 'Manual Test').length, color: 'bg-blue-50 text-blue-600' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-3 shadow-sm">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${s.color}`}><FlaskConical className="w-5 h-5" /></div>
            <div>
              <p className="text-xs text-gray-500 font-medium">{s.label}</p>
              <p className="text-2xl font-bold text-gray-900 tabular-nums">{loading ? '—' : s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search lab records…" value={search} onChange={e => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-56 focus:outline-none focus:ring-2 focus:ring-rose-400" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none bg-white">
          {['All', 'Ordered', 'Sample Collected', 'Processing', 'Completed', 'Cancelled'].map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none bg-white">
          {types.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
            <RefreshCw className="w-4 h-4 animate-spin mr-2" /> Loading…
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['#', 'Source', 'Test / Order ID', 'Patient', 'Test Name', 'Type', 'Doctor', 'Date', 'Result', 'Status'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr><td colSpan={10} className="px-4 py-12 text-center text-gray-400 text-sm">No lab records found</td></tr>
                ) : filtered.map((r, idx) => (
                  <tr key={`${r._source}-${r.id}`} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3 text-gray-300 text-xs">{idx + 1}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        r._source === 'Manual Test' ? 'bg-blue-50 text-blue-700' :
                        r._source === 'Lab Order' ? 'bg-purple-50 text-purple-700' :
                        'bg-teal-50 text-teal-700'
                      }`}>{r._source}</span>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-700">{r.orderId || r.testId || r.id?.slice(0, 8)}</td>
                    <td className="px-4 py-3 text-gray-600">{r.patientName || r.patientId || '—'}</td>
                    <td className="px-4 py-3 text-gray-700">{r.testName || '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{r.testType || '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{r.orderedBy || r.doctorId || '—'}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{r.orderDate || r.collectedOn || formatTimestamp(r.createdAt)}</td>
                    <td className="px-4 py-3 text-gray-500 max-w-[120px] truncate" title={r.result}>{r.result || '—'}</td>
                    <td className="px-4 py-3">{r.status ? <StatusBadge value={r.status} /> : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50/50 text-xs text-gray-400">
          {filtered.length} record{filtered.length !== 1 ? 's' : ''} found
        </div>
      </div>
    </div>
  );
}
