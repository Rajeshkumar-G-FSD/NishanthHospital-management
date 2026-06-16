import { useState, useEffect } from 'react';
import { Activity, RefreshCw, Search } from 'lucide-react';
import { getAll, formatTimestamp } from '../services/firebaseService';

interface AuditEntry {
  id: string;
  action: string;
  collection: string;
  docId: string;
  userEmail: string;
  timestamp: any;
}

const ACTION_COLORS: Record<string, string> = {
  CREATE: 'bg-green-100 text-green-700',
  UPDATE: 'bg-blue-100 text-blue-700',
  DELETE: 'bg-red-100 text-red-700',
};

export default function AuditLogs() {
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const data = await getAll('auditLogs') as AuditEntry[];
      const sorted = data.sort((a, b) => {
        const ta = a.timestamp?.toDate?.()?.getTime() ?? 0;
        const tb = b.timestamp?.toDate?.()?.getTime() ?? 0;
        return tb - ta;
      });
      setLogs(sorted);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = logs.filter(l =>
    [l.action, l.collection, l.docId, l.userEmail].some(
      v => (v ?? '').toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-rose-500" />
          <h2 className="text-xl font-bold text-gray-900">Audit Logs</h2>
        </div>
        <button onClick={load} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Search logs…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-72 focus:outline-none focus:ring-2 focus:ring-rose-400"
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
            <RefreshCw className="w-4 h-4 animate-spin mr-2" /> Loading logs…
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">#</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Collection</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Document ID</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.length === 0 ? (
                    <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-400 text-sm">No audit logs found</td></tr>
                  ) : filtered.map((log, idx) => (
                    <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3 text-gray-300 text-xs">{idx + 1}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${ACTION_COLORS[log.action] ?? 'bg-gray-100 text-gray-600'}`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-700 font-medium text-xs">{log.collection}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs font-mono">{log.docId?.slice(0, 16) ?? '—'}</td>
                      <td className="px-4 py-3 text-gray-600 text-xs">{log.userEmail}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                        {log.timestamp?.toDate
                          ? log.timestamp.toDate().toLocaleString('en-IN')
                          : formatTimestamp(log.timestamp)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50/50 text-xs text-gray-400">
              {filtered.length} of {logs.length} log entries · Read-only
            </div>
          </>
        )}
      </div>
    </div>
  );
}
