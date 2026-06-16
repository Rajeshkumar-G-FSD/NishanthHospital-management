import { useState, useEffect } from 'react';
import { RefreshCw, Search, Download, Users, UserPlus, Calendar, MapPin } from 'lucide-react';
import { getAll, formatTimestamp } from '../services/firebaseService';

export default function PatientReports() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [genderFilter, setGenderFilter] = useState('All');
  const [bloodGroupFilter, setBloodGroupFilter] = useState('All');
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAll('patients');
      setRecords(data);
    } catch (e: any) {
      setError(e.message ?? 'Failed to load patient reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = records.filter(r => {
    const matchesSearch = !search || Object.values(r).some(v =>
      String(v ?? '').toLowerCase().includes(search.toLowerCase())
    );
    const matchesGender = genderFilter === 'All' || r.gender === genderFilter;
    const matchesBG = bloodGroupFilter === 'All' || r.bloodGroup === bloodGroupFilter;
    return matchesSearch && matchesGender && matchesBG;
  });

  const bloodGroups = ['All', ...Array.from(new Set(records.map(r => r.bloodGroup).filter(Boolean)))];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Patient Reports</h2>
          <p className="text-sm text-gray-500 mt-0.5">Complete patient database and demographic reports</p>
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
          { label: 'Total Patients', value: records.length, icon: <Users className="w-5 h-5" />, color: 'bg-blue-50 text-blue-600' },
          { label: 'Male', value: records.filter(r => r.gender === 'Male').length, icon: <UserPlus className="w-5 h-5" />, color: 'bg-indigo-50 text-indigo-600' },
          { label: 'Female', value: records.filter(r => r.gender === 'Female').length, icon: <UserPlus className="w-5 h-5" />, color: 'bg-pink-50 text-pink-600' },
          { label: 'Registered This Month', value: records.filter(r => {
            const d = r.createdAt?.toDate?.() || new Date(r.createdAt || 0);
            const now = new Date();
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
          }).length, icon: <Calendar className="w-5 h-5" />, color: 'bg-green-50 text-green-600' },
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
          <input type="text" placeholder="Search patients…" value={search} onChange={e => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-56 focus:outline-none focus:ring-2 focus:ring-rose-400" />
        </div>
        <select value={genderFilter} onChange={e => setGenderFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white">
          {['All', 'Male', 'Female', 'Other'].map(g => <option key={g} value={g}>{g}</option>)}
        </select>
        <select value={bloodGroupFilter} onChange={e => setBloodGroupFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white">
          {bloodGroups.map(b => <option key={b} value={b}>{b}</option>)}
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
                  {['#', 'Patient ID', 'Name', 'Age', 'Gender', 'Blood Group', 'Phone', 'Address', 'Registered On'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr><td colSpan={9} className="px-4 py-12 text-center text-gray-400 text-sm">No patient records found</td></tr>
                ) : filtered.map((r, idx) => (
                  <tr key={r.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3 text-gray-300 text-xs">{idx + 1}</td>
                    <td className="px-4 py-3 font-medium text-gray-700">{r.patientId || r.id?.slice(0, 8)}</td>
                    <td className="px-4 py-3 text-gray-900 font-medium">{r.name || '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{r.age || '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{r.gender || '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{r.bloodGroup || '—'}</td>
                    <td className="px-4 py-3 text-gray-600 font-mono text-xs">{r.phone || r.mobile || '—'}</td>
                    <td className="px-4 py-3 text-gray-500 max-w-[160px] truncate" title={r.address}>{r.address || '—'}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{formatTimestamp(r.createdAt)}</td>
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
