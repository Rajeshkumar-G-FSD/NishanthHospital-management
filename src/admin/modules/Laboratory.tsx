import { useState } from 'react';
import CRUDModule from '../components/CRUDModule';
import { StatusBadge } from '../components/CRUDModule';

const TABS = ['Lab Tests', 'Lab Orders', 'Lab Reports'] as const;
type Tab = typeof TABS[number];

export default function Laboratory() {
  const [tab, setTab] = useState<Tab>('Lab Tests');

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

      {tab === 'Lab Tests' && (
        <CRUDModule
          title="Lab Tests"
          collectionName="labTests"
          singularLabel="Test"
          columns={[
            { key: 'testId', label: 'Test ID' },
            { key: 'testName', label: 'Test Name' },
            { key: 'category', label: 'Category' },
            { key: 'price', label: 'Price (₹)' },
            { key: 'turnaroundTime', label: 'TAT' },
          ]}
          fields={[
            { key: 'testId', label: 'Test ID', type: 'text', required: true, placeholder: 'LAB-001' },
            { key: 'testName', label: 'Test Name', type: 'text', required: true },
            { key: 'category', label: 'Category', type: 'select', options: ['Haematology', 'Biochemistry', 'Microbiology', 'Serology', 'Hormone', 'Urine Analysis', 'Histopathology', 'Other'] },
            { key: 'price', label: 'Price (₹)', type: 'number' },
            { key: 'turnaroundTime', label: 'Turnaround Time', type: 'text', placeholder: 'e.g. 2 hours' },
            { key: 'description', label: 'Description', type: 'textarea' },
            { key: 'sampleType', label: 'Sample Type', type: 'text', placeholder: 'e.g. Blood, Urine' },
          ]}
        />
      )}

      {tab === 'Lab Orders' && (
        <CRUDModule
          title="Lab Orders"
          collectionName="labOrders"
          singularLabel="Order"
          columns={[
            { key: 'orderId', label: 'Order ID' },
            { key: 'patientId', label: 'Patient ID' },
            { key: 'testId', label: 'Test' },
            { key: 'orderedDate', label: 'Date' },
            { key: 'status', label: 'Status', render: v => <StatusBadge value={v} /> },
          ]}
          fields={[
            { key: 'orderId', label: 'Order ID', type: 'text', required: true },
            { key: 'patientId', label: 'Patient ID', type: 'text', required: true },
            { key: 'testId', label: 'Test ID', type: 'text', required: true },
            { key: 'orderedDate', label: 'Order Date', type: 'date', required: true },
            { key: 'sampleCollected', label: 'Sample Collected', type: 'select', options: ['Yes', 'No', 'Pending'] },
            { key: 'collectionDate', label: 'Collection Date', type: 'date' },
            { key: 'status', label: 'Status', type: 'select', options: ['Pending', 'Sample Collected', 'Processing', 'Completed', 'Cancelled'] },
            { key: 'notes', label: 'Notes', type: 'textarea' },
          ]}
        />
      )}

      {tab === 'Lab Reports' && (
        <CRUDModule
          title="Lab Reports"
          collectionName="labReports"
          singularLabel="Report"
          columns={[
            { key: 'reportId', label: 'Report ID' },
            { key: 'orderId', label: 'Order ID' },
            { key: 'patientId', label: 'Patient ID' },
            { key: 'reportDate', label: 'Date' },
            { key: 'approvedBy', label: 'Approved By' },
            { key: 'status', label: 'Status', render: v => <StatusBadge value={v} /> },
          ]}
          fields={[
            { key: 'reportId', label: 'Report ID', type: 'text', required: true },
            { key: 'orderId', label: 'Order ID', type: 'text', required: true },
            { key: 'patientId', label: 'Patient ID', type: 'text', required: true },
            { key: 'reportDate', label: 'Report Date', type: 'date', required: true },
            { key: 'findings', label: 'Findings', type: 'textarea' },
            { key: 'referenceRange', label: 'Reference Range', type: 'text' },
            { key: 'approvedBy', label: 'Approved By', type: 'text' },
            { key: 'status', label: 'Status', type: 'select', options: ['Draft', 'Pending Approval', 'Approved', 'Delivered'] },
          ]}
        />
      )}
    </div>
  );
}
