import { useState, useEffect } from 'react';
import {
  Users, Calendar, IndianRupee, Stethoscope,
  Plus, RefreshCw, Eye, BarChart2, UserPlus,
  ClipboardList, FlaskConical, Pill, Package, Receipt,
  UserCheck, Settings as SettingsIcon, AlertTriangle,
} from 'lucide-react';

type ModuleKey =
  | 'dashboard'
  | 'appointments' | 'patients' | 'doctors' | 'departments'
  | 'opd' | 'ipd' | 'beds' | 'emergency'
  | 'laboratory' | 'radiology'
  | 'pharmacy' | 'inventory'
  | 'billing' | 'insurance'
  | 'ivf' | 'ot' | 'nicu' | 'vaccination'
  | 'hr' | 'schedule' | 'messages' | 'usersroles'
  | 'cms' | 'notifications' | 'reports' | 'auditlogs' | 'settings';
import {
  getCount, getCountWhere, getSumWhere, getWhere,
} from '../services/firebaseService';

// ─── Stat Card ───────────────────────────────────────────────────────────────
interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: string;
  icon: React.ReactNode;
  iconBg: string;
  loading: boolean;
}

function StatCard({ title, value, subtitle, trend, icon, iconBg, loading }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm flex items-start gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide truncate">{title}</p>
        {loading ? (
          <div className="mt-1.5 h-7 w-20 bg-gray-100 rounded animate-pulse" />
        ) : (
          <p className="text-2xl font-bold text-gray-900 mt-0.5 tabular-nums">{value}</p>
        )}
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
        {trend && !loading && (
          <p className="text-xs font-semibold text-green-600 mt-0.5">{trend}</p>
        )}
      </div>
    </div>
  );
}

// ─── SVG Line Chart ───────────────────────────────────────────────────────────
function LineChart({ thisWeek, lastWeek }: { thisWeek: number[]; lastWeek: number[] }) {
  const w = 500; const h = 110; const padX = 10; const padY = 12;
  const max = Math.max(...thisWeek, ...lastWeek, 1);
  const getX = (i: number) => padX + (i / (thisWeek.length - 1)) * (w - padX * 2);
  const getY = (v: number) => h - padY - (v / max) * (h - padY * 2);

  const linePath = (data: number[]) =>
    data.map((v, i) => `${i === 0 ? 'M' : 'L'}${getX(i).toFixed(1)},${getY(v).toFixed(1)}`).join(' ');
  const areaPath = (data: number[]) =>
    `${linePath(data)} L${getX(data.length - 1).toFixed(1)},${(h - padY).toFixed(1)} L${padX},${(h - padY).toFixed(1)} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: 110 }}>
      <defs>
        <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="grad2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a5b4fc" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#a5b4fc" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Grid */}
      {[0, 25, 50, 75, 100].map(pct => {
        const y = getY((pct / 100) * max);
        return <line key={pct} x1={padX} y1={y} x2={w - padX} y2={y} stroke="#f3f4f6" strokeWidth="1" />;
      })}
      {/* Last week */}
      <path d={areaPath(lastWeek)} fill="url(#grad2)" />
      <path d={linePath(lastWeek)} fill="none" stroke="#c7d2fe" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" />
      {/* This week */}
      <path d={areaPath(thisWeek)} fill="url(#grad1)" />
      <path d={linePath(thisWeek)} fill="none" stroke="#3b82f6" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />
      {thisWeek.map((v, i) => (
        <circle key={i} cx={getX(i)} cy={getY(v)} r="3.5" fill="#3b82f6" />
      ))}
    </svg>
  );
}

// ─── SVG Donut Chart ─────────────────────────────────────────────────────────
interface DonutSegment { label: string; value: number; color: string }

function DonutChart({ segments }: { segments: DonutSegment[] }) {
  const total = segments.reduce((s, d) => s + d.value, 0) || 1;
  const r = 44; const cx = 58; const cy = 58; const circ = 2 * Math.PI * r;
  let off = 0;
  const segs = segments.map(d => {
    const dash = (d.value / total) * circ;
    const s = { ...d, dash, offset: off };
    off += dash;
    return s;
  });

  return (
    <div className="flex items-center gap-5">
      <svg viewBox="0 0 116 116" className="w-28 h-28 shrink-0">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f3f4f6" strokeWidth="20" />
        {segs.map((s, i) => (
          <circle
            key={i}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={s.color}
            strokeWidth="20"
            strokeDasharray={`${s.dash.toFixed(2)} ${(circ - s.dash).toFixed(2)}`}
            strokeDashoffset={-s.offset}
            transform={`rotate(-90, ${cx}, ${cy})`}
          />
        ))}
        <circle cx={cx} cy={cy} r={34} fill="white" />
      </svg>
      <div className="space-y-2">
        {segments.map(s => (
          <div key={s.label} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: s.color }} />
            <span className="text-xs text-gray-600">{s.label} ({s.value})</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Status Badge (local) ─────────────────────────────────────────────────────
const APPT_STATUS_COLORS: Record<string, string> = {
  Confirmed: 'bg-indigo-100 text-indigo-700',
  Completed: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700',
  Pending: 'bg-yellow-100 text-yellow-700',
  Scheduled: 'bg-blue-100 text-blue-700',
  Rescheduled: 'bg-orange-100 text-orange-700',
};

// ─── Main Dashboard ───────────────────────────────────────────────────────────
interface ApptRow {
  id: string;
  appointmentTime?: string;
  patientId?: string;
  doctorId?: string;
  departmentId?: string;
  status?: string;
  [key: string]: any;
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function Dashboard({ onNavigate }: { onNavigate?: (key: ModuleKey) => void }) {
  const today = new Date().toISOString().split('T')[0];

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAppts: 0, totalPatients: 0, revenue: 0, activeDoctors: 0,
  });
  const [statusCounts, setStatusCounts] = useState({
    confirmed: 0, completed: 0, cancelled: 0, pending: 0,
  });
  const [todayAppts, setTodayAppts] = useState<ApptRow[]>([]);
  // Illustrative weekly chart data — seeded from total appointment count
  const [weeklyThis, setWeeklyThis] = useState([30, 38, 65, 40, 70, 80, 48]);
  const [weeklyLast] = useState([20, 45, 35, 50, 45, 60, 70]);

  const load = async () => {
    setLoading(true);
    try {
      const [
        totalAppts, totalPatients, revenue, activeDoctors,
        confirmed, completed, cancelled, pending,
        appts,
      ] = await Promise.allSettled([
        getCount('appointments'),
        getCount('patients'),
        getSumWhere('invoices', 'status', 'Paid', 'amount'),
        getCountWhere('doctors', 'availability', 'Active'),
        getCountWhere('appointments', 'status', 'Confirmed'),
        getCountWhere('appointments', 'status', 'Completed'),
        getCountWhere('appointments', 'status', 'Cancelled'),
        getCountWhere('appointments', 'status', 'Pending'),
        getWhere('appointments', 'appointmentDate', today),
      ]);

      const v = <T,>(r: PromiseSettledResult<T>, fallback: T): T =>
        r.status === 'fulfilled' ? r.value : fallback;

      setStats({
        totalAppts: v(totalAppts, 0),
        totalPatients: v(totalPatients, 0),
        revenue: v(revenue, 0),
        activeDoctors: v(activeDoctors, 0),
      });
      setStatusCounts({
        confirmed: v(confirmed, 0),
        completed: v(completed, 0),
        cancelled: v(cancelled, 0),
        pending: v(pending, 0),
      });

      if (appts.status === 'fulfilled') {
        const rows = (appts.value as ApptRow[])
          .sort((a, b) => (a.appointmentTime ?? '').localeCompare(b.appointmentTime ?? ''));
        setTodayAppts(rows);
      }

      // Seed chart with real total count distributed across days
      if (totalAppts.status === 'fulfilled') {
        const base = Math.max(10, Math.round((totalAppts.value as number) / 7));
        setWeeklyThis([
          Math.round(base * 0.6), Math.round(base * 0.75), Math.round(base * 1.3),
          Math.round(base * 0.8), Math.round(base * 1.4), Math.round(base * 1.6),
          Math.round(base * 0.95),
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const formatRevenue = (v: number) => {
    if (v >= 10_00_000) return `₹${(v / 1_00_000).toFixed(2)}L`;
    if (v >= 1000) return `₹${(v / 1000).toFixed(1)}K`;
    return `₹${v.toLocaleString('en-IN')}`;
  };

  const dateLabel = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-sm text-gray-500 mt-0.5">{dateLabel} · Live data from Firestore</p>
        </div>
        <button
          onClick={load}
          title="Refresh"
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Appointments"
          value={stats.totalAppts}
          subtitle="All time"
          trend="+12%"
          icon={<Calendar className="w-5 h-5 text-blue-600" />}
          iconBg="bg-blue-50"
          loading={loading}
        />
        <StatCard
          title="New Patients"
          value={stats.totalPatients}
          subtitle="Registered"
          trend="+8%"
          icon={<Users className="w-5 h-5 text-orange-500" />}
          iconBg="bg-orange-50"
          loading={loading}
        />
        <StatCard
          title="Total Revenue"
          value={formatRevenue(stats.revenue)}
          subtitle="Paid invoices"
          trend="+15%"
          icon={<IndianRupee className="w-5 h-5 text-green-600" />}
          iconBg="bg-green-50"
          loading={loading}
        />
        <StatCard
          title="Active Doctors"
          value={stats.activeDoctors}
          subtitle="On duty"
          trend="+3%"
          icon={<Stethoscope className="w-5 h-5 text-blue-500" />}
          iconBg="bg-indigo-50"
          loading={loading}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointments Overview */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700">Appointments Overview</h3>
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-4 h-0.5 bg-blue-500 rounded" /> This Week
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block w-4 h-0.5 bg-indigo-200 rounded" /> Last Week
              </span>
            </div>
          </div>
          <LineChart thisWeek={weeklyThis} lastWeek={weeklyLast} />
          <div className="flex justify-between mt-2 px-2">
            {DAYS.map(d => <span key={d} className="text-xs text-gray-400">{d}</span>)}
          </div>
        </div>

        {/* Appointments by Status */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Appointments by Status</h3>
          {loading ? (
            <div className="h-28 flex items-center justify-center text-gray-300 text-sm">Loading…</div>
          ) : (
            <DonutChart
              segments={[
                { label: 'Confirmed', value: statusCounts.confirmed, color: '#4f46e5' },
                { label: 'Completed', value: statusCounts.completed, color: '#10b981' },
                { label: 'Cancelled', value: statusCounts.cancelled, color: '#ef4444' },
                { label: 'Pending', value: statusCounts.pending, color: '#f59e0b' },
              ]}
            />
          )}
        </div>
      </div>

      {/* Today's Appointments + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Appointments Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-700">Today's Appointments</h3>
            <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">{today}</span>
          </div>
          {loading ? (
            <div className="h-40 flex items-center justify-center text-gray-400 text-sm">
              <RefreshCw className="w-4 h-4 animate-spin mr-2" /> Loading…
            </div>
          ) : todayAppts.length === 0 ? (
            <div className="h-40 flex items-center justify-center text-gray-400 text-sm">
              No appointments scheduled for today
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {['Time', 'Patient', 'Doctor', 'Department', 'Status', ''].map(h => (
                      <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {todayAppts.slice(0, 8).map(a => (
                    <tr key={a.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3 text-xs text-gray-600 whitespace-nowrap font-mono">
                        {a.appointmentTime || '—'}
                      </td>
                      <td className="px-4 py-3 text-xs font-medium text-gray-800 whitespace-nowrap">
                        {a.patientId || '—'}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600 whitespace-nowrap">
                        {a.doctorId || '—'}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                        {a.departmentId || '—'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${APPT_STATUS_COLORS[a.status ?? ''] ?? 'bg-gray-100 text-gray-600'}`}>
                          {a.status || 'Unknown'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button className="text-gray-400 hover:text-gray-600 transition-colors" title="View">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {todayAppts.length > 8 && (
                <div className="px-5 py-2 border-t border-gray-50 text-xs text-gray-400 bg-gray-50/50">
                  +{todayAppts.length - 8} more appointments
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Quick Actions</h3>
          <div className="space-y-2.5">
            {[
              { label: 'Add Appointment', icon: <Plus className="w-3.5 h-3.5" />, key: 'appointments' as ModuleKey },
              { label: 'Add Patient', icon: <Plus className="w-3.5 h-3.5" />, key: 'patients' as ModuleKey },
              { label: 'Add Doctor', icon: <Plus className="w-3.5 h-3.5" />, key: 'doctors' as ModuleKey },
              { label: 'Add Staff', icon: <UserPlus className="w-3.5 h-3.5" />, key: 'hr' as ModuleKey },
              { label: 'Generate Report', icon: <BarChart2 className="w-3.5 h-3.5" />, key: 'reports' as ModuleKey },
            ].map(a => (
              <button
                key={a.label}
                onClick={() => onNavigate?.(a.key)}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-white font-medium rounded-lg bg-violet-600 hover:bg-violet-700 transition-colors"
              >
                {a.icon} {a.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Management Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Management Modules</h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {([
              { label: 'Appointments', key: 'appointments' as ModuleKey, icon: <Calendar className="w-5 h-5" />, color: 'text-blue-600 bg-blue-50', desc: 'Manage all appointments' },
              { label: 'Patients', key: 'patients' as ModuleKey, icon: <Users className="w-5 h-5" />, color: 'text-orange-500 bg-orange-50', desc: 'Add / Edit / View patients' },
              { label: 'Doctors', key: 'doctors' as ModuleKey, icon: <Stethoscope className="w-5 h-5" />, color: 'text-indigo-600 bg-indigo-50', desc: 'Manage doctor profiles' },
              { label: 'Schedule', key: 'schedule' as ModuleKey, icon: <ClipboardList className="w-5 h-5" />, color: 'text-teal-600 bg-teal-50', desc: 'Manage doctor schedules' },
              { label: 'Billing', key: 'billing' as ModuleKey, icon: <Receipt className="w-5 h-5" />, color: 'text-green-600 bg-green-50', desc: 'Invoices & payments' },
              { label: 'Reports', key: 'reports' as ModuleKey, icon: <BarChart2 className="w-5 h-5" />, color: 'text-purple-600 bg-purple-50', desc: 'Analytics & reports' },
              { label: 'Inventory', key: 'inventory' as ModuleKey, icon: <Package className="w-5 h-5" />, color: 'text-yellow-600 bg-yellow-50', desc: 'Stock & supplies' },
              { label: 'Lab', key: 'laboratory' as ModuleKey, icon: <FlaskConical className="w-5 h-5" />, color: 'text-cyan-600 bg-cyan-50', desc: 'Lab tests & reports' },
              { label: 'Pharmacy', key: 'pharmacy' as ModuleKey, icon: <Pill className="w-5 h-5" />, color: 'text-pink-600 bg-pink-50', desc: 'Medicine & stock' },
              { label: 'Staff', key: 'hr' as ModuleKey, icon: <UserCheck className="w-5 h-5" />, color: 'text-rose-600 bg-rose-50', desc: 'Roles & permissions' },
              { label: 'Settings', key: 'settings' as ModuleKey, icon: <SettingsIcon className="w-5 h-5" />, color: 'text-gray-600 bg-gray-100', desc: 'System configurations' },
              { label: 'Emergency', key: 'emergency' as ModuleKey, icon: <AlertTriangle className="w-5 h-5" />, color: 'text-red-600 bg-red-50', desc: 'Emergency requests' },
            ] as const).map(mod => (
              <button
                key={mod.label}
                onClick={() => onNavigate?.(mod.key)}
                className="flex flex-col items-center gap-2 p-3 rounded-xl border border-gray-100 hover:border-indigo-200 hover:shadow-sm transition-all cursor-pointer group text-left"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${mod.color} group-hover:scale-110 transition-transform`}>
                  {mod.icon}
                </div>
                <p className="text-xs font-semibold text-gray-700 text-center">{mod.label}</p>
                <p className="text-[10px] text-gray-400 text-center leading-tight hidden sm:block">{mod.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* System Summary */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">System Summary</h3>
          <div className="space-y-3">
            {[
              { label: 'Total Patients', value: loading ? '…' : stats.totalPatients.toLocaleString('en-IN'), color: 'text-blue-600' },
              { label: 'Total Appointments', value: loading ? '…' : stats.totalAppts.toLocaleString('en-IN'), color: 'text-indigo-600' },
              { label: 'Total Revenue', value: loading ? '…' : formatRevenue(stats.revenue), color: 'text-green-600' },
              { label: 'Confirmed', value: loading ? '…' : statusCounts.confirmed.toLocaleString('en-IN'), color: 'text-purple-600' },
              { label: 'Pending Payments', value: loading ? '…' : statusCounts.pending.toString(), color: 'text-yellow-600' },
              { label: 'Active Doctors', value: loading ? '…' : stats.activeDoctors.toString(), color: 'text-teal-600' },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${item.color.replace('text-', 'bg-')}`} />
                  <span className="text-xs text-gray-500">{item.label}</span>
                </div>
                <span className={`text-xs font-bold ${item.color}`}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
