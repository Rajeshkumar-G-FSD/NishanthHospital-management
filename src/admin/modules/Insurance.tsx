import { useState } from 'react';
import CRUDModule from '../components/CRUDModule';
import { StatusBadge } from '../components/CRUDModule';

const TABS = ['Providers', 'Claims'] as const;
type Tab = typeof TABS[number];

export default function Insurance() {
  const [tab, setTab] = useState<Tab>('Providers');

  return (
    <div className="h-full flex flex-col">
      <div className="flex gap-1 px-6 pt-6 border-b border-gray-100 bg-white">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${tab === t ? 'bg-rose-50 text-rose-600 border-b-2 border-rose-500' : 'text-gray-500 hover:text-gray-700'}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'Providers' && (
        <CRUDModule
          title="Insurance Providers"
          collectionName="insuranceProviders"
          singularLabel="Provider"
          columns={[
            { key: 'name', label: 'Provider Name' },
            { key: 'tpaCode', label: 'TPA Code' },
            { key: 'type', label: 'Type' },
            { key: 'contactPerson', label: 'Contact Person' },
            { key: 'contactNumber', label: 'Phone' },
            { key: 'status', label: 'Status', render: v => <StatusBadge value={v} /> },
          ]}
          fields={[
            { key: 'name', label: 'Provider Name', type: 'text', required: true },
            { key: 'tpaCode', label: 'TPA Code', type: 'text', required: true },
            { key: 'type', label: 'Type', type: 'select', options: ['Government', 'Private', 'TPA', 'Corporate'] },
            { key: 'contactPerson', label: 'Contact Person', type: 'text' },
            { key: 'contactNumber', label: 'Contact Number', type: 'tel' },
            { key: 'email', label: 'Email', type: 'email' },
            { key: 'address', label: 'Address', type: 'textarea' },
            { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive', 'Suspended'] },
          ]}
        />
      )}

      {tab === 'Claims' && (
        <CRUDModule
          title="Insurance Claims"
          collectionName="insuranceClaims"
          singularLabel="Claim"
          columns={[
            { key: 'claimId', label: 'Claim ID' },
            { key: 'patientId', label: 'Patient ID' },
            { key: 'provider', label: 'Provider' },
            { key: 'amount', label: 'Amount (₹)' },
            { key: 'claimDate', label: 'Date' },
            { key: 'status', label: 'Status', render: v => <StatusBadge value={v} /> },
          ]}
          fields={[
            { key: 'claimId', label: 'Claim ID', type: 'text', required: true },
            { key: 'patientId', label: 'Patient ID', type: 'text', required: true },
            { key: 'invoiceId', label: 'Invoice ID', type: 'text' },
            { key: 'provider', label: 'Insurance Provider', type: 'text', required: true },
            { key: 'policyNumber', label: 'Policy Number', type: 'text' },
            { key: 'amount', label: 'Claim Amount (₹)', type: 'number', required: true },
            { key: 'approvedAmount', label: 'Approved Amount (₹)', type: 'number' },
            { key: 'claimDate', label: 'Claim Date', type: 'date', required: true },
            { key: 'status', label: 'Status', type: 'select', options: ['Pending', 'Submitted', 'Under Review', 'Approved', 'Rejected', 'Paid', 'Closed'] },
            { key: 'notes', label: 'Notes', type: 'textarea' },
          ]}
        />
      )}
    </div>
  );
}
