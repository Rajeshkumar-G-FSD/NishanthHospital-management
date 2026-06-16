import { useState } from 'react';
import CRUDModule from '../components/CRUDModule';
import { StatusBadge } from '../components/CRUDModule';

const TABS = ['Orders', 'Reports'] as const;
type Tab = typeof TABS[number];

export default function Radiology() {
  const [tab, setTab] = useState<Tab>('Orders');

  return (
    <div className="h-full flex flex-col">
      <div className="flex gap-1 px-6 pt-6 border-b border-gray-100 bg-white">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${tab === t ? 'bg-rose-50 text-rose-600 border-b-2 border-rose-500' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'Orders' && (
        <CRUDModule
          title="Radiology Orders"
          collectionName="radiologyOrders"
          singularLabel="Order"
          columns={[
            { key: 'orderId', label: 'Order ID' },
            { key: 'patientId', label: 'Patient ID' },
            { key: 'type', label: 'Scan Type' },
            { key: 'orderedDate', label: 'Date' },
            { key: 'orderedBy', label: 'Ordered By' },
            { key: 'status', label: 'Status', render: v => <StatusBadge value={v} /> },
          ]}
          fields={[
            { key: 'orderId', label: 'Order ID', type: 'text', required: true },
            { key: 'patientId', label: 'Patient ID', type: 'text', required: true },
            { key: 'type', label: 'Scan Type', type: 'select', options: ['X-Ray', 'Ultrasound', 'CT Scan', 'MRI', 'Doppler', 'Mammography', 'Other'] },
            { key: 'bodyPart', label: 'Body Part / Area', type: 'text' },
            { key: 'orderedDate', label: 'Ordered Date', type: 'date', required: true },
            { key: 'scheduledDate', label: 'Scheduled Date', type: 'date' },
            { key: 'orderedBy', label: 'Ordered By (Doctor)', type: 'text' },
            { key: 'clinicalIndication', label: 'Clinical Indication', type: 'textarea' },
            { key: 'status', label: 'Status', type: 'select', options: ['Scheduled', 'In Progress', 'Completed', 'Cancelled'] },
          ]}
        />
      )}

      {tab === 'Reports' && (
        <CRUDModule
          title="Radiology Reports"
          collectionName="radiologyReports"
          singularLabel="Report"
          columns={[
            { key: 'reportId', label: 'Report ID' },
            { key: 'orderId', label: 'Order ID' },
            { key: 'patientId', label: 'Patient ID' },
            { key: 'type', label: 'Scan Type' },
            { key: 'reportDate', label: 'Date' },
            { key: 'status', label: 'Status', render: v => <StatusBadge value={v} /> },
          ]}
          fields={[
            { key: 'reportId', label: 'Report ID', type: 'text', required: true },
            { key: 'orderId', label: 'Order ID', type: 'text', required: true },
            { key: 'patientId', label: 'Patient ID', type: 'text', required: true },
            { key: 'type', label: 'Scan Type', type: 'select', options: ['X-Ray', 'Ultrasound', 'CT Scan', 'MRI', 'Doppler', 'Mammography', 'Other'] },
            { key: 'reportDate', label: 'Report Date', type: 'date', required: true },
            { key: 'findings', label: 'Findings', type: 'textarea' },
            { key: 'impression', label: 'Impression / Conclusion', type: 'textarea' },
            { key: 'radiologistName', label: 'Radiologist', type: 'text' },
            { key: 'status', label: 'Status', type: 'select', options: ['Draft', 'Pending Review', 'Approved', 'Delivered'] },
          ]}
        />
      )}
    </div>
  );
}
