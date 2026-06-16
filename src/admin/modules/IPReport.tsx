import { useState, useEffect } from 'react';
import { RefreshCw, Search, Download, BedDouble, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { getAll } from '../services/firebaseService';
import { StatusBadge } from '../components/CRUDModule';

export default function IPReport() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [wardFilter, setWardFilter] = useState('All');
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAll('admissions');
      setRecords(data);
    } catch (e: any) {
      setError(e.message ?? 'Failed to load IP reports');
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
    const matchesWard = wardFilter === 'All' || r.ward === wardFilter;
    return matchesSearch && matchesStatus && matchesWard;
  });

  const wards = ['All', ...Array.from(new Set(records.map(r => r.ward).filter(Boolean)))];

  const stats = {
    total: records.length,
    admitted: records.filter(r => r.status === 'Admitted').length,
    discharged: records.filter(r => r.status === 'Discharged').length,
    icu: records.filter(r => r.ward === 'ICU' || r.ward === 'NICU').length,
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">IP Report</h2>
          <p className="text-sm text-gray-500 mt-0.5">Inpatient admissions and discharge records</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg" title="Refresh">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button className="flex items-center gap-1.5 border border-gray-200 text-gray-600 px-3 py-2 rounded-lg text-sm hover:bg-gray-50">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Admissions', value: stats.total, icon: <BedDouble className="w-5 h-5" />, color: 'bg-purple-50 text-purple-600' },
          { label: 'Currently Admitted', value: stats.admitted, icon: <Clock className="w-5 h-5" />, color: 'bg-blue-50 text-blue-600' },
          { label: 'Discharged', value: stats.discharged, icon: <CheckCircle className="w-5 h-5" />, color: 'bg-green-50 text-green-600' },
          { label: 'ICU / NICU', value: stats.icu, icon: <AlertCircle className="w-5 h-5" />, color: 'bg-red-50 text-red-600' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-3 shadow-sm">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${s.color}`}>{s.icon}</div>
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
          <input type="text" placeholder="Search admissions…" value={search} onChange={e => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-56 focus:outline-none focus:ring-2 focus:ring-rose-400" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white">
          {['All', 'Admitted', 'Under Observation', 'Discharged', 'Transferred'].map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select value={wardFilter} onChange={e => setWardFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white">
          {wards.map(w => <option key={w} value={w}>{w}</option>)}
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
                  {['#', 'Admission ID', 'Patient ID', 'Doctor', 'Admitted On', 'Ward', 'Bed No.', 'Discharge Date', 'Status'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr><td colSpan={9} className="px-4 py-12 text-center text-gray-400 text-sm">No admission records found</td></tr>
                ) : filtered.map((r, idx) => (
                  <tr key={r.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3 text-gray-300 text-xs">{idx + 1}</td>
                    <td className="px-4 py-3 text-gray-700 font-medium">{r.admissionId || '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{r.patientId || '—'}</td>
                    <td className="px-4 py-3 text-gray-700">{r.doctorId || '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{r.admissionDate || '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{r.ward || '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{r.bedNumber || '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{r.dischargeDate || '—'}</td>
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
