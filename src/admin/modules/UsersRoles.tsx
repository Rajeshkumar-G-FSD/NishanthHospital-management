import { useState } from 'react';
import CRUDModule from '../components/CRUDModule';
import { StatusBadge } from '../components/CRUDModule';

const TABS = ['Users', 'Roles'] as const;
type Tab = typeof TABS[number];

const ROLES = [
  'Super Admin', 'Hospital Admin', 'Doctor', 'Nurse', 'Receptionist',
  'Lab Technician', 'Pharmacist', 'Accountant', 'HR Manager', 'Patient',
];

const DEPARTMENTS = [
  'Obstetrics & Gynaecology', 'Fertility Centre', 'Urology & Andrology',
  'Paediatrics', 'Neonatology', 'Anaesthesiology', 'Emergency',
  'Laboratory', 'Radiology', 'Pharmacy', 'Nursing', 'Administration',
  'Accounts', 'IT', 'HR', 'Other',
];

export default function UsersRoles() {
  const [tab, setTab] = useState<Tab>('Users');

  return (
    <div className="h-full flex flex-col">
      <div className="flex gap-1 px-6 pt-6 border-b border-gray-100 bg-white">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              tab === t
                ? 'bg-rose-50 text-rose-600 border-b-2 border-rose-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'Users' && (
        <CRUDModule
          title="System Users"
          collectionName="systemUsers"
          singularLabel="User"
          columns={[
            { key: 'name', label: 'Name' },
            { key: 'email', label: 'Email' },
            { key: 'role', label: 'Role' },
            { key: 'department', label: 'Department' },
            { key: 'lastLogin', label: 'Last Login' },
            { key: 'status', label: 'Status', render: v => <StatusBadge value={v} /> },
          ]}
          fields={[
            { key: 'name', label: 'Full Name', type: 'text', required: true },
            { key: 'email', label: 'Email Address', type: 'email', required: true },
            { key: 'mobile', label: 'Mobile', type: 'tel' },
            {
              key: 'role', label: 'Role', type: 'select',
              options: ROLES, required: true,
            },
            {
              key: 'department', label: 'Department', type: 'select',
              options: DEPARTMENTS,
            },
            { key: 'employeeId', label: 'Employee / Doctor ID', type: 'text' },
            { key: 'lastLogin', label: 'Last Login Date', type: 'date' },
            {
              key: 'accessLevel', label: 'Access Level', type: 'select',
              options: ['Full Access', 'Read & Write', 'Read Only', 'Restricted', 'Module Specific'],
            },
            {
              key: 'status', label: 'Status', type: 'select',
              options: ['Active', 'Inactive', 'Suspended', 'Pending Verification'],
            },
            { key: 'notes', label: 'Notes', type: 'textarea' },
          ]}
        />
      )}

      {tab === 'Roles' && (
        <CRUDModule
          title="Roles & Permissions"
          collectionName="roles"
          singularLabel="Role"
          columns={[
            { key: 'roleName', label: 'Role Name' },
            { key: 'accessLevel', label: 'Access Level' },
            { key: 'description', label: 'Description' },
            { key: 'status', label: 'Status', render: v => <StatusBadge value={v} /> },
          ]}
          fields={[
            { key: 'roleName', label: 'Role Name', type: 'text', required: true },
            { key: 'description', label: 'Description', type: 'textarea' },
            {
              key: 'accessLevel', label: 'Access Level', type: 'select',
              options: ['Full Access', 'Read & Write', 'Read Only', 'Restricted', 'Module Specific'],
              required: true,
            },
            {
              key: 'dashboardAccess', label: 'Dashboard Access', type: 'select',
              options: ['Yes', 'No'],
            },
            { key: 'allowedModules', label: 'Allowed Modules (comma separated)', type: 'textarea' },
            { key: 'deniedModules', label: 'Denied Modules (comma separated)', type: 'textarea' },
            {
              key: 'canExport', label: 'Can Export Data', type: 'select',
              options: ['Yes', 'No'],
            },
            {
              key: 'canDelete', label: 'Can Delete Records', type: 'select',
              options: ['Yes', 'No'],
            },
            {
              key: 'status', label: 'Status', type: 'select',
              options: ['Active', 'Inactive'],
            },
          ]}
        />
      )}
    </div>
  );
}
