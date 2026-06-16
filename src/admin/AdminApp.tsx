import { useEffect, useState } from 'react';
import AdminLogin from './AdminLogin';
import Dashboard from './modules/Dashboard';
import Appointments from './modules/Appointments';
import Patients from './modules/Patients';
import Doctors from './modules/Doctors';
import Departments from './modules/Departments';
import OPD from './modules/OPD';
import IPD from './modules/IPD';
import Beds from './modules/Beds';
import Emergency from './modules/Emergency';
import Laboratory from './modules/Laboratory';
import Radiology from './modules/Radiology';
import Pharmacy from './modules/Pharmacy';
import Inventory from './modules/Inventory';
import Billing from './modules/Billing';
import Insurance from './modules/Insurance';
import IVF from './modules/IVF';
import OT from './modules/OT';
import NICU from './modules/NICU';
import Vaccination from './modules/Vaccination';
import HR from './modules/HR';
import Schedule from './modules/Schedule';
import Messages from './modules/Messages';
import UsersRoles from './modules/UsersRoles';
import CMS from './modules/CMS';
import Notifications from './modules/Notifications';
import Reports from './modules/Reports';
import AuditLogs from './modules/AuditLogs';
import Settings from './modules/Settings';
// New modules
import MedicinePurchase from './modules/MedicinePurchase';
import MedicineSale from './modules/MedicineSale';
import MedicineBulkOrder from './modules/MedicineBulkOrder';
import BulkOrderReport from './modules/BulkOrderReport';
import StockReport from './modules/StockReport';
import ManualLabTests from './modules/ManualLabTests';
import OperationRegister from './modules/OperationRegister';
import Camp from './modules/Camp';
import OPReports from './modules/OPReports';
import IPReport from './modules/IPReport';
import PatientReports from './modules/PatientReports';
import RadiologyReports from './modules/RadiologyReports';
import LabReports from './modules/LabReports';
import PharmacyOPReports from './modules/PharmacyOPReports';
import PharmacyIPReports from './modules/PharmacyIPReports';

import { getCount } from './services/firebaseService';
import {
  LayoutDashboard, Calendar, Users, Stethoscope,
  AlertTriangle, FlaskConical,
  Pill, Package, Receipt, UserCheck, Bell, BarChart2,
  Settings as SettingsIcon, ChevronLeft, ChevronRight, LogOut,
  Menu, X, ExternalLink, CalendarCheck,
  Search, Mail, ChevronDown, ChevronUp,
  BedDouble, Activity, Syringe, Heart, Baby,
  ShoppingCart, ClipboardList, FileText, Tent, Scissors,
  ShieldCheck, MessageSquare, Globe, BookOpen, Scan,
  TestTube, TrendingUp, Building2,
} from 'lucide-react';

type ModuleKey =
  | 'dashboard'
  | 'appointments' | 'patients' | 'doctors' | 'departments'
  | 'opd' | 'ipd' | 'beds' | 'emergency'
  | 'laboratory' | 'manuallabtests' | 'radiology'
  | 'pharmacy' | 'medicinepurchase' | 'medicinesale' | 'medicinebulkorder' | 'inventory'
  | 'billing' | 'insurance'
  | 'ivf' | 'ot' | 'operationregister' | 'nicu' | 'vaccination' | 'camp'
  | 'hr' | 'schedule' | 'messages' | 'usersroles'
  | 'cms' | 'notifications' | 'reports' | 'auditlogs' | 'settings'
  | 'opreports' | 'ipreport' | 'patientreports' | 'radiologyreports' | 'labreports'
  | 'pharmacyopreports' | 'pharmacyipreports' | 'bulkorderreport' | 'stockreport';

interface NavItem {
  key: ModuleKey;
  label: string;
  icon: React.ReactNode;
  collection?: string;
}

interface NavGroup {
  label: string;
  key: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Overview',
    key: 'overview',
    items: [
      { key: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    ],
  },
  {
    label: 'Patients & OPD',
    key: 'patients',
    items: [
      { key: 'patients', label: 'Patients', icon: <Users className="w-4 h-4" />, collection: 'patients' },
      { key: 'appointments', label: 'Appointments', icon: <Calendar className="w-4 h-4" />, collection: 'appointments' },
      { key: 'schedule', label: 'Schedule', icon: <CalendarCheck className="w-4 h-4" />, collection: 'schedules' },
      { key: 'opd', label: 'OP Entries', icon: <ClipboardList className="w-4 h-4" />, collection: 'opdVisits' },
      { key: 'ipd', label: 'Inpatient Register', icon: <BedDouble className="w-4 h-4" />, collection: 'admissions' },
      { key: 'beds', label: 'Beds', icon: <BedDouble className="w-4 h-4" />, collection: 'beds' },
      { key: 'doctors', label: 'Doctors', icon: <Stethoscope className="w-4 h-4" />, collection: 'doctors' },
      { key: 'departments', label: 'Departments', icon: <Building2 className="w-4 h-4" />, collection: 'departments' },
    ],
  },
  {
    label: 'Diagnostics',
    key: 'diagnostics',
    items: [
      { key: 'laboratory', label: 'Lab Tests', icon: <FlaskConical className="w-4 h-4" />, collection: 'labTests' },
      { key: 'manuallabtests', label: 'Manual Lab Tests', icon: <TestTube className="w-4 h-4" />, collection: 'manualLabTests' },
      { key: 'radiology', label: 'Radiology', icon: <Scan className="w-4 h-4" />, collection: 'radiology' },
    ],
  },
  {
    label: 'Pharmacy',
    key: 'pharmacy',
    items: [
      { key: 'pharmacy', label: 'Pharmacy', icon: <Pill className="w-4 h-4" />, collection: 'medicines' },
      { key: 'medicinepurchase', label: 'Medicine Purchase', icon: <ShoppingCart className="w-4 h-4" />, collection: 'medicinePurchases' },
      { key: 'medicinesale', label: 'Medicine Sale', icon: <ShoppingCart className="w-4 h-4" />, collection: 'medicineSales' },
      { key: 'medicinebulkorder', label: 'Medicine Bulk Order', icon: <Package className="w-4 h-4" />, collection: 'bulkOrders' },
      { key: 'inventory', label: 'Inventory', icon: <Package className="w-4 h-4" />, collection: 'inventory' },
    ],
  },
  {
    label: 'Specialties & Operations',
    key: 'specialties',
    items: [
      { key: 'emergency', label: 'Emergency', icon: <AlertTriangle className="w-4 h-4" />, collection: 'emergencyCases' },
      { key: 'ot', label: 'Operation Theatre', icon: <Activity className="w-4 h-4" />, collection: 'surgeries' },
      { key: 'operationregister', label: 'Operation Register', icon: <Scissors className="w-4 h-4" />, collection: 'operationRegister' },
      { key: 'nicu', label: 'NICU', icon: <Baby className="w-4 h-4" />, collection: 'nicuPatients' },
      { key: 'ivf', label: 'IVF', icon: <Heart className="w-4 h-4" />, collection: 'ivfCycles' },
      { key: 'vaccination', label: 'Vaccination', icon: <Syringe className="w-4 h-4" />, collection: 'vaccinations' },
      { key: 'camp', label: 'Camp', icon: <Tent className="w-4 h-4" />, collection: 'camps' },
    ],
  },
  {
    label: 'Finance',
    key: 'finance',
    items: [
      { key: 'billing', label: 'Billing', icon: <Receipt className="w-4 h-4" />, collection: 'invoices' },
      { key: 'insurance', label: 'Insurance', icon: <ShieldCheck className="w-4 h-4" />, collection: 'insuranceClaims' },
    ],
  },
  {
    label: 'Reports',
    key: 'reports',
    items: [
      { key: 'opreports', label: 'OP Reports', icon: <FileText className="w-4 h-4" /> },
      { key: 'ipreport', label: 'IP Report', icon: <FileText className="w-4 h-4" /> },
      { key: 'patientreports', label: 'Patient Reports', icon: <Users className="w-4 h-4" /> },
      { key: 'radiologyreports', label: 'Radiology Reports', icon: <Scan className="w-4 h-4" /> },
      { key: 'labreports', label: 'Lab Reports', icon: <FlaskConical className="w-4 h-4" /> },
      { key: 'pharmacyopreports', label: 'Pharmacy OP Reports', icon: <Pill className="w-4 h-4" /> },
      { key: 'pharmacyipreports', label: 'Pharmacy IP Reports', icon: <Pill className="w-4 h-4" /> },
      { key: 'bulkorderreport', label: 'Bulk Order Report', icon: <ShoppingCart className="w-4 h-4" /> },
      { key: 'stockreport', label: 'Stock Report', icon: <Package className="w-4 h-4" /> },
      { key: 'reports', label: 'Summary Reports', icon: <BarChart2 className="w-4 h-4" /> },
    ],
  },
  {
    label: 'HR & Staff',
    key: 'hr',
    items: [
      { key: 'hr', label: 'Staff (HR)', icon: <UserCheck className="w-4 h-4" />, collection: 'employees' },
      { key: 'messages', label: 'Messages', icon: <MessageSquare className="w-4 h-4" />, collection: 'messages' },
    ],
  },
  {
    label: 'Administration',
    key: 'admin',
    items: [
      { key: 'usersroles', label: 'Users & Roles', icon: <ShieldCheck className="w-4 h-4" />, collection: 'users' },
      { key: 'cms', label: 'Website (CMS)', icon: <Globe className="w-4 h-4" /> },
      { key: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" />, collection: 'notifications' },
      { key: 'auditlogs', label: 'Audit Logs', icon: <BookOpen className="w-4 h-4" />, collection: 'auditLogs' },
      { key: 'settings', label: 'Settings', icon: <SettingsIcon className="w-4 h-4" /> },
    ],
  },
];

const MODULE_COMPONENTS: Record<ModuleKey, React.ComponentType<any>> = {
  dashboard: Dashboard,
  appointments: Appointments,
  patients: Patients,
  doctors: Doctors,
  departments: Departments,
  opd: OPD,
  ipd: IPD,
  beds: Beds,
  emergency: Emergency,
  schedule: Schedule,
  laboratory: Laboratory,
  manuallabtests: ManualLabTests,
  radiology: Radiology,
  pharmacy: Pharmacy,
  medicinepurchase: MedicinePurchase,
  medicinesale: MedicineSale,
  medicinebulkorder: MedicineBulkOrder,
  inventory: Inventory,
  billing: Billing,
  insurance: Insurance,
  ivf: IVF,
  ot: OT,
  operationregister: OperationRegister,
  nicu: NICU,
  vaccination: Vaccination,
  camp: Camp,
  hr: HR,
  messages: Messages,
  usersroles: UsersRoles,
  cms: CMS,
  notifications: Notifications,
  reports: Reports,
  auditlogs: AuditLogs,
  settings: Settings,
  opreports: OPReports,
  ipreport: IPReport,
  patientreports: PatientReports,
  radiologyreports: RadiologyReports,
  labreports: LabReports,
  pharmacyopreports: PharmacyOPReports,
  pharmacyipreports: PharmacyIPReports,
  bulkorderreport: BulkOrderReport,
  stockreport: StockReport,
};

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({
  activeModule,
  onSelect,
  collapsed,
  onCollapse,
  onMobileClose,
  mobile,
  counts,
}: {
  activeModule: ModuleKey;
  onSelect: (m: ModuleKey) => void;
  collapsed: boolean;
  onCollapse: () => void;
  onMobileClose?: () => void;
  mobile?: boolean;
  counts: Record<string, number>;
}) {
  const isExpanded = !collapsed || mobile;
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(NAV_GROUPS.map(g => [g.key, true]))
  );

  const toggleGroup = (key: string) =>
    setOpenGroups(p => ({ ...p, [key]: !p[key] }));

  return (
    <aside
      className="h-full flex flex-col transition-all duration-200 shadow-xl"
      style={{ background: 'linear-gradient(180deg, #1a2540 0%, #1e2d52 100%)', width: isExpanded ? 240 : 64 }}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-3 shrink-0" style={{ height: 64, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        {isExpanded && (
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <img
                src="https://i.postimg.cc/d1Mjps1w/Nishanth-logo.avif"
                alt="Nishanth Hospital"
                className="h-7 w-auto object-contain brightness-0 invert"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-bold leading-tight truncate">Nishanth</p>
              <p className="text-xs leading-tight truncate" style={{ color: '#a0aec0' }}>Hospital</p>
            </div>
          </div>
        )}
        {!isExpanded && (
          <div className="mx-auto w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <img
              src="https://i.postimg.cc/d1Mjps1w/Nishanth-logo.avif"
              alt="Nishanth Hospital"
              className="h-6 w-auto object-contain brightness-0 invert"
              referrerPolicy="no-referrer"
            />
          </div>
        )}
        {mobile ? (
          <button onClick={onMobileClose} className="ml-auto p-1 rounded-lg hover:bg-white/10 transition-colors" style={{ color: '#a0aec0' }}>
            <X className="w-4 h-4" />
          </button>
        ) : isExpanded ? (
          <button onClick={onCollapse} className="p-1 rounded-lg hover:bg-white/10 transition-colors ml-auto" style={{ color: '#a0aec0' }}>
            <ChevronLeft className="w-4 h-4" />
          </button>
        ) : (
          <button onClick={onCollapse} className="absolute right-0 translate-x-full top-5 bg-white shadow-md rounded-r-md p-1 text-gray-500 hover:text-blue-600 transition-colors z-10">
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto" style={{ padding: '8px 8px' }}>
        <div className="space-y-0.5">
          {NAV_GROUPS.map(group => {
            const isGroupOpen = openGroups[group.key] !== false;
            return (
              <div key={group.key}>
                {/* Group Header */}
                {isExpanded && (
                  <button
                    onClick={() => toggleGroup(group.key)}
                    className="w-full flex items-center justify-between px-3 py-2 text-[10px] font-semibold uppercase tracking-widest transition-colors hover:text-white"
                    style={{ color: isGroupOpen ? 'rgba(160,174,192,0.7)' : 'rgba(160,174,192,0.4)', marginTop: 8 }}
                  >
                    <span>{group.label}</span>
                    {isGroupOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                )}
                {!isExpanded && <div className="my-1.5 mx-2" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }} />}

                {/* Group Items */}
                {(isGroupOpen || !isExpanded) && (
                  <div className="space-y-0.5">
                    {group.items.map(item => {
                      const active = activeModule === item.key;
                      const count = item.collection != null ? (counts[item.collection] ?? null) : null;
                      return (
                        <button
                          key={item.key}
                          onClick={() => { onSelect(item.key); onMobileClose?.(); }}
                          title={!isExpanded ? item.label : undefined}
                          className="w-full flex items-center gap-3 rounded-lg text-sm transition-all duration-150"
                          style={{
                            padding: isExpanded ? '7px 12px' : '8px',
                            justifyContent: isExpanded ? 'flex-start' : 'center',
                            background: active ? 'rgba(99,102,241,0.25)' : 'transparent',
                            color: active ? '#818cf8' : '#94a3b8',
                            borderLeft: active ? '3px solid #6366f1' : '3px solid transparent',
                          }}
                          onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLButtonElement).style.color = '#e2e8f0'; } }}
                          onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = '#94a3b8'; } }}
                        >
                          <span className="shrink-0">{item.icon}</span>
                          {isExpanded && (
                            <>
                              <span className="truncate text-left font-medium flex-1 text-xs">{item.label}</span>
                              {count !== null && (
                                <span
                                  className="shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded-full min-w-[20px] text-center"
                                  style={{
                                    background: count === 0 ? 'rgba(255,255,255,0.06)' : 'rgba(99,102,241,0.3)',
                                    color: count === 0 ? 'rgba(148,163,184,0.5)' : '#a5b4fc',
                                  }}
                                >
                                  {count > 999 ? '999+' : count}
                                </span>
                              )}
                            </>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      {/* Back to site */}
      {isExpanded && (
        <div className="px-2 pb-3 pt-2 shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <a
            href="/"
            className="flex items-center gap-2 px-3 py-2 text-xs rounded-lg transition-colors"
            style={{ color: 'rgba(160,174,192,0.6)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLAnchorElement).style.color = '#e2e8f0'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'; (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(160,174,192,0.6)'; }}
          >
            <ExternalLink className="w-3.5 h-3.5 shrink-0" />
            Back to Website
          </a>
        </div>
      )}
    </aside>
  );
}

// ─── Admin Layout ─────────────────────────────────────────────────────────────
function AdminLayout({ onLogout }: { onLogout: () => void }) {
  const [activeModule, setActiveModule] = useState<ModuleKey>('dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [counts, setCounts] = useState<Record<string, number>>({});

  const activeLabel = NAV_GROUPS.flatMap(g => g.items).find(i => i.key === activeModule)?.label ?? 'Dashboard';

  useEffect(() => {
    const collections = [
      'appointments', 'patients', 'doctors', 'schedules', 'invoices', 'inventory',
      'labTests', 'medicines', 'employees', 'emergencyCases', 'opdVisits', 'admissions',
      'beds', 'departments', 'surgeries', 'nicuPatients', 'ivfCycles', 'vaccinations',
      'camps', 'medicinePurchases', 'medicineSales', 'bulkOrders', 'manualLabTests',
      'operationRegister', 'radiology', 'insuranceClaims', 'users', 'notifications',
      'auditLogs', 'messages',
    ];
    Promise.allSettled(collections.map(c => getCount(c))).then(results => {
      const next: Record<string, number> = {};
      collections.forEach((c, i) => {
        const r = results[i];
        if (r.status === 'fulfilled') next[c] = r.value;
      });
      setCounts(next);
    });
  }, []);

  const ActiveComponent = MODULE_COMPONENTS[activeModule];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-full shrink-0">
        <Sidebar
          activeModule={activeModule}
          onSelect={setActiveModule}
          collapsed={collapsed}
          onCollapse={() => setCollapsed(p => !p)}
          counts={counts}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <div className="relative w-60 h-full shrink-0">
            <Sidebar
              activeModule={activeModule}
              onSelect={setActiveModule}
              collapsed={false}
              onCollapse={() => {}}
              onMobileClose={() => setMobileOpen(false)}
              mobile
              counts={counts}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 shrink-0 shadow-sm gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <Menu className="w-4 h-4" />
            </button>
            <div className="hidden md:flex items-center gap-1 text-xs text-gray-400">
              <span>Admin</span>
              <span>/</span>
              <span className="font-semibold text-gray-700">{activeLabel}</span>
            </div>
            <h1 className="md:hidden text-sm font-semibold text-gray-900">{activeLabel}</h1>
          </div>

          {/* Search */}
          <div className="hidden sm:flex items-center gap-2 flex-1 max-w-sm mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search anything..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-300 text-gray-700 placeholder-gray-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <Mail className="w-4 h-4" />
            </button>
            <div className="w-px h-6 bg-gray-200 mx-1" />
            <div className="flex items-center gap-2 pl-1">
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-semibold shrink-0">
                A
              </div>
              <div className="hidden sm:block leading-tight">
                <p className="text-xs font-semibold text-gray-800">Admin</p>
                <p className="text-[10px] text-gray-400">Super Admin</p>
              </div>
              <ChevronDown className="hidden sm:block w-3.5 h-3.5 text-gray-400" />
            </div>
            <button
              onClick={onLogout}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-1"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Module Content */}
        <main className="flex-1 overflow-y-auto">
          {activeModule === 'dashboard'
            ? <Dashboard key="dashboard" onNavigate={setActiveModule} />
            : <ActiveComponent key={activeModule} />}
        </main>
      </div>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function AdminApp() {
  const [authed, setAuthed] = useState(sessionStorage.getItem('admin_auth') === '1');

  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth');
    setAuthed(false);
  };

  if (!authed) return <AdminLogin onLogin={() => setAuthed(true)} />;

  return <AdminLayout onLogout={handleLogout} />;
}
