import { useState, useEffect } from 'react';
import { BarChart2, Download } from 'lucide-react';
import { getCount, getCountWhere } from '../services/firebaseService';

interface ReportRow { label: string; value: number | string }
interface Report { title: string; rows: ReportRow[]; loading: boolean }

export default function Reports() {
  const [reports, setReports] = useState<Record<string, Report>>({
    clinical: { title: 'Clinical Summary', rows: [], loading: true },
    financial: { title: 'Financial Summary', rows: [], loading: true },
    operations: { title: 'Operations Summary', rows: [], loading: true },
  });

  useEffect(() => {
    const load = async () => {
      const [
        patients, doctors, departments, admissions, opdVisits,
        emergencyCases, ivfCycles, surgeries, nicuPatients, vaccinations,
        invoices, pendingInvoices, paidInvoices, medicines, inventory,
        beds, occupiedBeds, employees, labOrders, labTests,
      ] = await Promise.allSettled([
        getCount('patients'),
        getCount('doctors'),
        getCount('departments'),
        getCount('admissions'),
        getCount('opdVisits'),
        getCount('emergencyCases'),
        getCount('ivfCycles'),
        getCount('surgeries'),
        getCount('nicuPatients'),
        getCount('vaccinations'),
        getCount('invoices'),
        getCountWhere('invoices', 'status', 'Pending'),
        getCountWhere('invoices', 'status', 'Paid'),
        getCount('medicines'),
        getCount('inventory'),
        getCount('beds'),
        getCountWhere('beds', 'status', 'Occupied'),
        getCount('employees'),
        getCount('labOrders'),
        getCount('labTests'),
      ]);

      const val = (r: PromiseSettledResult<number>) => r.status === 'fulfilled' ? r.value : 0;

      setReports({
        clinical: {
          title: 'Clinical Summary',
          loading: false,
          rows: [
            { label: 'Total Patients Registered', value: val(patients) },
            { label: 'Total Doctors', value: val(doctors) },
            { label: 'Total Departments', value: val(departments) },
            { label: 'Total Admissions (IPD)', value: val(admissions) },
            { label: 'Total OPD Visits', value: val(opdVisits) },
            { label: 'Emergency Cases', value: val(emergencyCases) },
            { label: 'IVF Cycles', value: val(ivfCycles) },
            { label: 'Surgeries', value: val(surgeries) },
            { label: 'NICU Patients', value: val(nicuPatients) },
            { label: 'Vaccinations Given', value: val(vaccinations) },
          ],
        },
        financial: {
          title: 'Financial Summary',
          loading: false,
          rows: [
            { label: 'Total Invoices', value: val(invoices) },
            { label: 'Pending Invoices', value: val(pendingInvoices) },
            { label: 'Paid Invoices', value: val(paidInvoices) },
            { label: 'Medicines in Pharmacy', value: val(medicines) },
            { label: 'Inventory Items', value: val(inventory) },
          ],
        },
        operations: {
          title: 'Operations Summary',
          loading: false,
          rows: [
            { label: 'Total Beds', value: val(beds) },
            { label: 'Occupied Beds', value: val(occupiedBeds) },
            { label: 'Available Beds', value: val(beds) - val(occupiedBeds) },
            { label: 'Bed Occupancy Rate', value: val(beds) > 0 ? `${Math.round((val(occupiedBeds) / val(beds)) * 100)}%` : '0%' },
            { label: 'Total Employees', value: val(employees) },
            { label: 'Lab Tests Catalog', value: val(labTests) },
            { label: 'Lab Orders', value: val(labOrders) },
          ],
        },
      });
    };
    load();
  }, []);

  const exportCSV = (report: Report) => {
    const csv = ['Label,Value', ...report.rows.map(r => `"${r.label}",${r.value}`)].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.title.replace(/\s+/g, '_')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <BarChart2 className="w-5 h-5 text-rose-500" />
        <h2 className="text-xl font-bold text-gray-900">Reports</h2>
      </div>
      <p className="text-sm text-gray-500 -mt-4">Live aggregate counts from Firestore. Export to CSV for spreadsheet analysis.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {Object.values(reports).map(report => (
          <div key={report.title} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800 text-sm">{report.title}</h3>
              <button
                onClick={() => exportCSV(report)}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-rose-600 transition-colors"
              >
                <Download className="w-3.5 h-3.5" /> CSV
              </button>
            </div>
            <div className="divide-y divide-gray-50">
              {report.loading ? (
                <div className="py-8 text-center text-gray-400 text-sm">Loading…</div>
              ) : report.rows.map(row => (
                <div key={row.label} className="flex items-center justify-between px-5 py-2.5">
                  <span className="text-xs text-gray-600">{row.label}</span>
                  <span className="text-sm font-semibold text-gray-900 tabular-nums">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
