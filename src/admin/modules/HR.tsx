import { useState } from 'react';
import CRUDModule from '../components/CRUDModule';
import { StatusBadge } from '../components/CRUDModule';

const TABS = ['Employees', 'Attendance', 'Payroll', 'Leave Requests'] as const;
type Tab = typeof TABS[number];

export default function HR() {
  const [tab, setTab] = useState<Tab>('Employees');

  return (
    <div className="h-full flex flex-col">
      <div className="flex gap-1 px-6 pt-6 border-b border-gray-100 bg-white flex-wrap">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${tab === t ? 'bg-rose-50 text-rose-600 border-b-2 border-rose-500' : 'text-gray-500 hover:text-gray-700'}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'Employees' && (
        <CRUDModule
          title="Employees"
          collectionName="employees"
          singularLabel="Employee"
          columns={[
            { key: 'employeeId', label: 'Emp ID' },
            { key: 'name', label: 'Name' },
            { key: 'department', label: 'Department' },
            { key: 'role', label: 'Role' },
            { key: 'joinDate', label: 'Join Date' },
            { key: 'status', label: 'Status', render: v => <StatusBadge value={v} /> },
          ]}
          fields={[
            { key: 'employeeId', label: 'Employee ID', type: 'text', required: true },
            { key: 'name', label: 'Full Name', type: 'text', required: true },
            { key: 'department', label: 'Department', type: 'select', options: ['Obstetrics & Gynaecology', 'Fertility Centre', 'Urology', 'Paediatrics', 'Neonatology', 'Anaesthesiology', 'Laboratory', 'Radiology', 'Pharmacy', 'Nursing', 'Administration', 'Security', 'Housekeeping', 'IT', 'Other'] },
            { key: 'role', label: 'Role / Designation', type: 'text', required: true },
            { key: 'qualification', label: 'Qualification', type: 'text' },
            { key: 'contactNumber', label: 'Contact Number', type: 'tel' },
            { key: 'email', label: 'Email', type: 'email' },
            { key: 'joinDate', label: 'Join Date', type: 'date' },
            { key: 'salary', label: 'Basic Salary (₹)', type: 'number' },
            { key: 'shiftType', label: 'Shift', type: 'select', options: ['Morning', 'Afternoon', 'Night', 'Rotational', 'General'] },
            { key: 'status', label: 'Status', type: 'select', options: ['Active', 'On Leave', 'Probation', 'Resigned', 'Terminated'] },
          ]}
        />
      )}

      {tab === 'Attendance' && (
        <CRUDModule
          title="Attendance"
          collectionName="attendance"
          singularLabel="Attendance Record"
          columns={[
            { key: 'date', label: 'Date' },
            { key: 'employeeId', label: 'Emp ID' },
            { key: 'employeeName', label: 'Name' },
            { key: 'checkIn', label: 'Check In' },
            { key: 'checkOut', label: 'Check Out' },
            { key: 'status', label: 'Status', render: v => <StatusBadge value={v} /> },
          ]}
          fields={[
            { key: 'date', label: 'Date', type: 'date', required: true },
            { key: 'employeeId', label: 'Employee ID', type: 'text', required: true },
            { key: 'employeeName', label: 'Employee Name', type: 'text', required: true },
            { key: 'checkIn', label: 'Check In Time', type: 'text', placeholder: '09:00 AM' },
            { key: 'checkOut', label: 'Check Out Time', type: 'text', placeholder: '05:00 PM' },
            { key: 'workHours', label: 'Work Hours', type: 'number' },
            { key: 'status', label: 'Status', type: 'select', options: ['Present', 'Absent', 'Half Day', 'Late', 'On Leave', 'Holiday'] },
            { key: 'notes', label: 'Notes', type: 'textarea' },
          ]}
        />
      )}

      {tab === 'Payroll' && (
        <CRUDModule
          title="Payroll"
          collectionName="payroll"
          singularLabel="Payroll Record"
          columns={[
            { key: 'payrollId', label: 'Payroll ID' },
            { key: 'employeeId', label: 'Emp ID' },
            { key: 'employeeName', label: 'Name' },
            { key: 'month', label: 'Month' },
            { key: 'grossSalary', label: 'Gross (₹)' },
            { key: 'netSalary', label: 'Net (₹)' },
            { key: 'status', label: 'Status', render: v => <StatusBadge value={v} /> },
          ]}
          fields={[
            { key: 'payrollId', label: 'Payroll ID', type: 'text', required: true },
            { key: 'employeeId', label: 'Employee ID', type: 'text', required: true },
            { key: 'employeeName', label: 'Employee Name', type: 'text', required: true },
            { key: 'month', label: 'Month / Period', type: 'text', required: true, placeholder: 'e.g. June 2026' },
            { key: 'basicSalary', label: 'Basic Salary (₹)', type: 'number' },
            { key: 'allowances', label: 'Allowances (₹)', type: 'number' },
            { key: 'grossSalary', label: 'Gross Salary (₹)', type: 'number' },
            { key: 'deductions', label: 'Deductions (₹)', type: 'number' },
            { key: 'netSalary', label: 'Net Salary (₹)', type: 'number' },
            { key: 'paymentDate', label: 'Payment Date', type: 'date' },
            { key: 'paymentMethod', label: 'Payment Method', type: 'select', options: ['Bank Transfer', 'Cash', 'Cheque'] },
            { key: 'status', label: 'Status', type: 'select', options: ['Pending', 'Paid', 'Hold'] },
          ]}
        />
      )}

      {tab === 'Leave Requests' && (
        <CRUDModule
          title="Leave Requests"
          collectionName="leaveRequests"
          singularLabel="Leave Request"
          columns={[
            { key: 'employeeId', label: 'Emp ID' },
            { key: 'employeeName', label: 'Name' },
            { key: 'leaveType', label: 'Leave Type' },
            { key: 'startDate', label: 'From' },
            { key: 'endDate', label: 'To' },
            { key: 'status', label: 'Status', render: v => <StatusBadge value={v} /> },
          ]}
          fields={[
            { key: 'employeeId', label: 'Employee ID', type: 'text', required: true },
            { key: 'employeeName', label: 'Employee Name', type: 'text', required: true },
            { key: 'leaveType', label: 'Leave Type', type: 'select', options: ['Sick Leave', 'Casual Leave', 'Earned Leave', 'Maternity Leave', 'Paternity Leave', 'Unpaid Leave', 'Compensatory Off', 'Other'] },
            { key: 'startDate', label: 'Start Date', type: 'date', required: true },
            { key: 'endDate', label: 'End Date', type: 'date', required: true },
            { key: 'days', label: 'Number of Days', type: 'number' },
            { key: 'reason', label: 'Reason', type: 'textarea' },
            { key: 'approvedBy', label: 'Approved By', type: 'text' },
            { key: 'status', label: 'Status', type: 'select', options: ['Pending', 'Approved', 'Rejected', 'Cancelled'] },
          ]}
        />
      )}
    </div>
  );
}
