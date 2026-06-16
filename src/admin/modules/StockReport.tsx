import { useState, useEffect } from 'react';
import { RefreshCw, Search, Download, Package, AlertTriangle, CheckCircle } from 'lucide-react';
import { getAll } from '../services/firebaseService';

export default function StockReport() {
  const [medicines, setMedicines] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'medicines' | 'inventory'>('medicines');
  const [search, setSearch] = useState('');
  const [stockFilter, setStockFilter] = useState('All');
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [med, inv] = await Promise.allSettled([getAll('medicines'), getAll('inventory')]);
      if (med.status === 'fulfilled') setMedicines(med.value);
      if (inv.status === 'fulfilled') setInventory(inv.value);
    } catch (e: any) {
      setError(e.message ?? 'Failed to load stock report');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const source = activeTab === 'medicines' ? medicines : inventory;

  const filtered = source.filter(r => {
    const matchesSearch = !search || Object.values(r).some(v =>
      String(v ?? '').toLowerCase().includes(search.toLowerCase())
    );
    const stock = Number(r.stock ?? r.quantity ?? 0);
    const threshold = Number(r.threshold ?? r.minQuantity ?? 10);
    const matchesStock =
      stockFilter === 'All' ? true :
      stockFilter === 'Low Stock' ? stock > 0 && stock < threshold :
      stockFilter === 'Out of Stock' ? stock === 0 :
      stockFilter === 'In Stock' ? stock >= threshold : true;
    return matchesSearch && matchesStock;
  });

  const getStockStatus = (r: any) => {
    const stock = Number(r.stock ?? r.quantity ?? 0);
    const threshold = Number(r.threshold ?? r.minQuantity ?? 10);
    if (stock === 0) return 'Out of Stock';
    if (stock < threshold) return 'Low Stock';
    return 'In Stock';
  };

  const stockStatusColor: Record<string, string> = {
    'In Stock': 'bg-green-100 text-green-700',
    'Low Stock': 'bg-yellow-100 text-yellow-700',
    'Out of Stock': 'bg-red-100 text-red-700',
  };

  const totalLow = source.filter(r => {
    const stock = Number(r.stock ?? r.quantity ?? 0);
    const threshold = Number(r.threshold ?? r.minQuantity ?? 10);
    return stock > 0 && stock < threshold;
  }).length;

  const totalOut = source.filter(r => Number(r.stock ?? r.quantity ?? 0) === 0).length;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Stock Report</h2>
          <p className="text-sm text-gray-500 mt-0.5">Medicine and inventory stock levels and alerts</p>
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
          { label: 'Total Items', value: source.length, icon: <Package className="w-5 h-5" />, color: 'bg-blue-50 text-blue-600' },
          { label: 'In Stock', value: source.filter(r => getStockStatus(r) === 'In Stock').length, icon: <CheckCircle className="w-5 h-5" />, color: 'bg-green-50 text-green-600' },
          { label: 'Low Stock', value: totalLow, icon: <AlertTriangle className="w-5 h-5" />, color: 'bg-yellow-50 text-yellow-600' },
          { label: 'Out of Stock', value: totalOut, icon: <AlertTriangle className="w-5 h-5" />, color: 'bg-red-50 text-red-600' },
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

      {/* Tabs */}
      <div className="flex gap-1 mb-4 bg-gray-100 p-1 rounded-lg w-fit">
        {(['medicines', 'inventory'] as const).map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-colors ${
              activeTab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}>
            {t}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder={`Search ${activeTab}…`} value={search} onChange={e => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-56 focus:outline-none focus:ring-2 focus:ring-rose-400" />
        </div>
        <select value={stockFilter} onChange={e => setStockFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none bg-white">
          {['All', 'In Stock', 'Low Stock', 'Out of Stock'].map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>}

      {totalLow > 0 && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2 text-sm text-yellow-800">
          <AlertTriangle className="w-4 h-4 text-yellow-500 shrink-0" />
          <span><strong>{totalLow}</strong> item{totalLow !== 1 ? 's' : ''} with low stock require restocking.</span>
        </div>
      )}

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
                  {['#', 'Name', 'Category', 'Unit', 'Current Stock', 'Min. Threshold', 'Price (₹)', 'Stock Status'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr><td colSpan={8} className="px-4 py-12 text-center text-gray-400 text-sm">No items found</td></tr>
                ) : filtered.map((r, idx) => {
                  const status = getStockStatus(r);
                  const stock = Number(r.stock ?? r.quantity ?? 0);
                  const threshold = Number(r.threshold ?? r.minQuantity ?? 10);
                  return (
                    <tr key={r.id} className={`hover:bg-gray-50/50 ${status === 'Out of Stock' ? 'bg-red-50/30' : status === 'Low Stock' ? 'bg-yellow-50/30' : ''}`}>
                      <td className="px-4 py-3 text-gray-300 text-xs">{idx + 1}</td>
                      <td className="px-4 py-3 font-medium text-gray-800">
                        <div className="flex items-center gap-2">
                          {(status === 'Low Stock' || status === 'Out of Stock') && (
                            <AlertTriangle className={`w-3.5 h-3.5 shrink-0 ${status === 'Out of Stock' ? 'text-red-500' : 'text-yellow-500'}`} />
                          )}
                          {r.name || r.itemName || '—'}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{r.category || '—'}</td>
                      <td className="px-4 py-3 text-gray-500">{r.unit || '—'}</td>
                      <td className="px-4 py-3 font-bold tabular-nums" style={{ color: status === 'Out of Stock' ? '#ef4444' : status === 'Low Stock' ? '#d97706' : '#059669' }}>
                        {stock}
                      </td>
                      <td className="px-4 py-3 text-gray-500">{threshold}</td>
                      <td className="px-4 py-3 text-gray-700">{r.price || r.unitPrice || '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${stockStatusColor[status]}`}>{status}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50/50 text-xs text-gray-400">
          {filtered.length} item{filtered.length !== 1 ? 's' : ''} — {activeTab === 'medicines' ? 'Pharmacy medicines' : 'General inventory'}
        </div>
      </div>
    </div>
  );
}
