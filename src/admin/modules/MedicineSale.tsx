import CRUDModule from '../components/CRUDModule';
import { StatusBadge } from '../components/CRUDModule';

export default function MedicineSale() {
  return (
    <CRUDModule
      title="Medicine Sales"
      collectionName="medicineSales"
      singularLabel="Sale"
      columns={[
        { key: 'saleId', label: 'Sale ID' },
        { key: 'patientName', label: 'Patient' },
        { key: 'medicineName', label: 'Medicine' },
        { key: 'quantity', label: 'Qty' },
        { key: 'totalAmount', label: 'Total (₹)' },
        { key: 'saleDate', label: 'Date' },
        { key: 'saleType', label: 'Type' },
        { key: 'status', label: 'Status', render: v => <StatusBadge value={v} /> },
      ]}
      fields={[
        { key: 'saleId', label: 'Sale ID', type: 'text', required: true, placeholder: 'SAL-001' },
        { key: 'patientId', label: 'Patient ID', type: 'text', placeholder: 'PAT-001' },
        { key: 'patientName', label: 'Patient Name', type: 'text', required: true },
        { key: 'medicineName', label: 'Medicine Name', type: 'text', required: true },
        { key: 'category', label: 'Category', type: 'select', options: ['Tablet', 'Syrup', 'Injection', 'Capsule', 'Drop', 'Cream', 'Other'] },
        { key: 'quantity', label: 'Quantity', type: 'number', required: true, placeholder: '10' },
        { key: 'unitPrice', label: 'Unit Price (₹)', type: 'number', placeholder: '20' },
        { key: 'totalAmount', label: 'Total Amount (₹)', type: 'number', required: true, placeholder: '200' },
        { key: 'saleDate', label: 'Sale Date', type: 'date', required: true },
        { key: 'prescribedBy', label: 'Prescribed By', type: 'text', placeholder: 'Dr. Name' },
        { key: 'saleType', label: 'Sale Type', type: 'select', options: ['OP', 'IP', 'OTC', 'Camp'] },
        { key: 'paymentMode', label: 'Payment Mode', type: 'select', options: ['Cash', 'Card', 'UPI', 'Insurance', 'Credit'] },
        { key: 'status', label: 'Status', type: 'select', options: ['Paid', 'Pending', 'Partially Paid'] },
        { key: 'notes', label: 'Notes', type: 'textarea' },
      ]}
    />
  );
}
