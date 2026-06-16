import { useState, useEffect } from 'react';
import { RefreshCw, Search, Download, Pill, IndianRupee } from 'lucide-react';
import { getAll, formatTimestamp } from '../services/firebaseService';
import { StatusBadge } from '../components/CRUDModule';

export default function PharmacyOPReports() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAll('medicineSales');
      setRecords(data.filter(r => !r.saleType || r.saleType === 'OP' || r.saleType === 'OTC'));
    } catch (e: any) {
      setError(e.message ?? 'Failed to load pharmacy OP reports');
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
    const matchesFrom = !dateFrom || r.saleDate >= dateFrom;
    const matchesTo = !dateTo || r.saleDate <= dateTo;
    return matchesSearch && matchesStatus && matchesFrom && matchesTo;
  });

  const totalRevenue = filtered.reduce((sum, r) => sum + (Number(r.totalAmount) || 0), 0);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Pharmacy OP Reports</h2>
          <p className="text-sm text-gray-500 mt-0.5">Outpatient and over-the-counter medicine sales</p>
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
          { label: 'Total OP Sales', value: records.length, color: 'bg-blue-50 text-blue-600' },
          { label: 'Paid', value: records.filter(r => r.status === 'Paid').length, color: 'bg-green-50 text-green-600' },
          { label: 'Pending', value: records.filter(r => r.status === 'Pending').length, color: 'bg-yellow-50 text-yellow-600' },
          { label: 'Total Revenue (₹)', value: `₹${records.reduce((s, r) => s + (Number(r.totalAmount) || 0), 0).toLocaleString('en-IN')}`, color: 'bg-emerald-50 text-emerald-600' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-3 shadow-sm">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${s.color}`}><Pill className="w-5 h-5" /></div>
            <div>
              <p className="text-xs text-gray-500 font-medium">{s.label}</p>
              <p className={`font-bold text-gray-900 tabular-nums ${String(s.value).startsWith('₹') ? 'text-lg' : 'text-2xl'}`}>{loading ? '—' : s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search sales…" value={search} onChange={e => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-56 focus:outline-none focus:ring-2 focus:ring-rose-400" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none bg-white">
          {['All', 'Paid', 'Pending', 'Partially Paid'].map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" />
        <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" />
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
                  {['#', 'Sale ID', 'Patient', 'Medicine', 'Qty', 'Unit Price', 'Total', 'Date', 'Type', 'Status'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr><td colSpan={10} className="px-4 py-12 text-center text-gray-400 text-sm">No OP pharmacy sales found</td></tr>
                ) : filtered.map((r, idx) => (
                  <tr key={r.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3 text-gray-300 text-xs">{idx + 1}</td>
                    <td className="px-4 py-3 font-medium text-gray-700">{r.saleId || r.id?.slice(0, 8)}</td>
                    <td className="px-4 py-3 text-gray-700">{r.patientName || '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{r.medicineName || '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{r.quantity || '—'}</td>
                    <td className="px-4 py-3 text-gray-600">₹{r.unitPrice || '—'}</td>
                    <td className="px-4 py-3 font-semibold text-gray-800">₹{r.totalAmount || '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{r.saleDate || formatTimestamp(r.createdAt)}</td>
                    <td className="px-4 py-3"><span className="text-xs text-gray-500">{r.saleType || 'OP'}</span></td>
                    <td className="px-4 py-3">{r.status ? <StatusBadge value={r.status} /> : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between text-xs text-gray-400">
          <span>{filtered.length} record{filtered.length !== 1 ? 's' : ''}</span>
          {filtered.length > 0 && <span className="font-semibold text-gray-600">Total: ₹{totalRevenue.toLocaleString('en-IN')}</span>}
        </div>
      </div>
    </div>
  );
}
