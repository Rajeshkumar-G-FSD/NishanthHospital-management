import { useState } from 'react';
import CRUDModule from '../components/CRUDModule';
import { StatusBadge } from '../components/CRUDModule';

const TABS = ['Invoices', 'Payments'] as const;
type Tab = typeof TABS[number];

export default function Billing() {
  const [tab, setTab] = useState<Tab>('Invoices');

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

      {tab === 'Invoices' && (
        <CRUDModule
          title="Invoices"
          collectionName="invoices"
          singularLabel="Invoice"
          columns={[
            { key: 'invoiceId', label: 'Invoice ID' },
            { key: 'patientId', label: 'Patient ID' },
            { key: 'type', label: 'Bill Type' },
            { key: 'amount', label: 'Amount (₹)' },
            { key: 'invoiceDate', label: 'Date' },
            { key: 'dueDate', label: 'Due Date' },
            { key: 'status', label: 'Status', render: v => <StatusBadge value={v} /> },
          ]}
          fields={[
            { key: 'invoiceId', label: 'Invoice ID', type: 'text', required: true, placeholder: 'INV-001' },
            { key: 'patientId', label: 'Patient ID', type: 'text', required: true },
            { key: 'type', label: 'Bill Type', type: 'select', options: ['OP Billing', 'IP Billing', 'Pharmacy Billing', 'Lab Billing', 'Radiology', 'Consultation', 'Procedure', 'Package'] },
            { key: 'amount', label: 'Total Amount (₹)', type: 'number', required: true },
            { key: 'discount', label: 'Discount (₹)', type: 'number' },
            { key: 'taxAmount', label: 'Tax (₹)', type: 'number' },
            { key: 'netAmount', label: 'Net Amount (₹)', type: 'number' },
            { key: 'invoiceDate', label: 'Invoice Date', type: 'date', required: true },
            { key: 'dueDate', label: 'Due Date', type: 'date' },
            { key: 'status', label: 'Status', type: 'select', options: ['Pending', 'Paid', 'Partially Paid', 'Overdue', 'Cancelled', 'Refunded'] },
            { key: 'notes', label: 'Notes', type: 'textarea' },
          ]}
        />
      )}

      {tab === 'Payments' && (
        <CRUDModule
          title="Payments"
          collectionName="payments"
          singularLabel="Payment"
          columns={[
            { key: 'paymentId', label: 'Payment ID' },
            { key: 'invoiceId', label: 'Invoice ID' },
            { key: 'patientId', label: 'Patient ID' },
            { key: 'amount', label: 'Amount (₹)' },
            { key: 'method', label: 'Method' },
            { key: 'paymentDate', label: 'Date' },
            { key: 'status', label: 'Status', render: v => <StatusBadge value={v} /> },
          ]}
          fields={[
            { key: 'paymentId', label: 'Payment ID', type: 'text', required: true },
            { key: 'invoiceId', label: 'Invoice ID', type: 'text', required: true },
            { key: 'patientId', label: 'Patient ID', type: 'text' },
            { key: 'amount', label: 'Amount (₹)', type: 'number', required: true },
            { key: 'method', label: 'Payment Method', type: 'select', options: ['Cash', 'Card', 'UPI', 'Net Banking', 'Cheque', 'Insurance', 'DD'] },
            { key: 'transactionId', label: 'Transaction / Reference ID', type: 'text' },
            { key: 'paymentDate', label: 'Payment Date', type: 'date', required: true },
            { key: 'status', label: 'Status', type: 'select', options: ['Pending', 'Paid', 'Failed', 'Refunded'] },
            { key: 'notes', label: 'Notes', type: 'textarea' },
          ]}
        />
      )}
    </div>
  );
}
