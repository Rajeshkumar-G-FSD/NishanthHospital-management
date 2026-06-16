import { useState } from 'react';
import CRUDModule from '../components/CRUDModule';
import { StatusBadge } from '../components/CRUDModule';

const TABS = ['Medicines', 'Sales', 'Purchase Orders'] as const;
type Tab = typeof TABS[number];

export default function Pharmacy() {
  const [tab, setTab] = useState<Tab>('Medicines');

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

      {tab === 'Medicines' && (
        <CRUDModule
          title="Medicines"
          collectionName="medicines"
          singularLabel="Medicine"
          columns={[
            { key: 'medicineId', label: 'ID' },
            { key: 'name', label: 'Name' },
            { key: 'category', label: 'Category' },
            { key: 'batchNo', label: 'Batch No.' },
            { key: 'expiryDate', label: 'Expiry' },
            { key: 'stock', label: 'Stock' },
            { key: 'price', label: 'Price (₹)' },
          ]}
          fields={[
            { key: 'medicineId', label: 'Medicine ID', type: 'text', required: true, placeholder: 'MED-001' },
            { key: 'name', label: 'Medicine Name', type: 'text', required: true },
            { key: 'genericName', label: 'Generic Name', type: 'text' },
            { key: 'category', label: 'Category', type: 'select', options: ['Tablet', 'Capsule', 'Syrup', 'Injection', 'Ointment', 'Drops', 'Inhaler', 'Other'] },
            { key: 'manufacturer', label: 'Manufacturer', type: 'text' },
            { key: 'vendor', label: 'Vendor', type: 'text' },
            { key: 'batchNo', label: 'Batch Number', type: 'text' },
            { key: 'expiryDate', label: 'Expiry Date', type: 'date' },
            { key: 'stock', label: 'Stock Qty', type: 'number' },
            { key: 'unit', label: 'Unit', type: 'select', options: ['Tabs', 'Caps', 'ml', 'mg', 'Units', 'Strips', 'Vials'] },
            { key: 'price', label: 'Price (₹)', type: 'number' },
            { key: 'reorderLevel', label: 'Reorder Level', type: 'number' },
          ]}
        />
      )}

      {tab === 'Sales' && (
        <CRUDModule
          title="Pharmacy Sales"
          collectionName="pharmacySales"
          singularLabel="Sale"
          columns={[
            { key: 'saleId', label: 'Sale ID' },
            { key: 'patientId', label: 'Patient ID' },
            { key: 'medicineId', label: 'Medicine' },
            { key: 'quantity', label: 'Qty' },
            { key: 'totalAmount', label: 'Amount (₹)' },
            { key: 'saleDate', label: 'Date' },
            { key: 'status', label: 'Status', render: v => <StatusBadge value={v} /> },
          ]}
          fields={[
            { key: 'saleId', label: 'Sale ID', type: 'text', required: true },
            { key: 'patientId', label: 'Patient ID', type: 'text' },
            { key: 'medicineId', label: 'Medicine ID', type: 'text', required: true },
            { key: 'quantity', label: 'Quantity', type: 'number', required: true },
            { key: 'unitPrice', label: 'Unit Price (₹)', type: 'number' },
            { key: 'discount', label: 'Discount (%)', type: 'number' },
            { key: 'totalAmount', label: 'Total Amount (₹)', type: 'number' },
            { key: 'saleDate', label: 'Sale Date', type: 'date', required: true },
            { key: 'paymentMethod', label: 'Payment Method', type: 'select', options: ['Cash', 'Card', 'UPI', 'Insurance', 'Credit'] },
            { key: 'status', label: 'Status', type: 'select', options: ['Pending', 'Paid', 'Cancelled'] },
          ]}
        />
      )}

      {tab === 'Purchase Orders' && (
        <CRUDModule
          title="Purchase Orders"
          collectionName="purchaseOrders"
          singularLabel="Purchase Order"
          columns={[
            { key: 'poId', label: 'PO ID' },
            { key: 'vendor', label: 'Vendor' },
            { key: 'orderDate', label: 'Order Date' },
            { key: 'totalAmount', label: 'Amount (₹)' },
            { key: 'status', label: 'Status', render: v => <StatusBadge value={v} /> },
          ]}
          fields={[
            { key: 'poId', label: 'PO ID', type: 'text', required: true },
            { key: 'vendor', label: 'Vendor Name', type: 'text', required: true },
            { key: 'orderDate', label: 'Order Date', type: 'date', required: true },
            { key: 'expectedDelivery', label: 'Expected Delivery', type: 'date' },
            { key: 'items', label: 'Items Description', type: 'textarea' },
            { key: 'totalAmount', label: 'Total Amount (₹)', type: 'number' },
            { key: 'status', label: 'Status', type: 'select', options: ['Pending', 'Approved', 'Ordered', 'Received', 'Cancelled'] },
            { key: 'notes', label: 'Notes', type: 'textarea' },
          ]}
        />
      )}
    </div>
  );
}
