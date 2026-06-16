import CRUDModule from '../components/CRUDModule';
import { StatusBadge } from '../components/CRUDModule';

export default function MedicinePurchase() {
  return (
    <CRUDModule
      title="Medicine Purchases"
      collectionName="medicinePurchases"
      singularLabel="Purchase"
      columns={[
        { key: 'purchaseId', label: 'Purchase ID' },
        { key: 'supplier', label: 'Supplier' },
        { key: 'medicineName', label: 'Medicine' },
        { key: 'quantity', label: 'Qty' },
        { key: 'unitPrice', label: 'Unit Price (₹)' },
        { key: 'totalAmount', label: 'Total (₹)' },
        { key: 'purchaseDate', label: 'Date' },
        { key: 'status', label: 'Status', render: v => <StatusBadge value={v} /> },
      ]}
      fields={[
        { key: 'purchaseId', label: 'Purchase ID', type: 'text', required: true, placeholder: 'PUR-001' },
        { key: 'supplier', label: 'Supplier Name', type: 'text', required: true, placeholder: 'ABC Pharma Pvt Ltd' },
        { key: 'medicineName', label: 'Medicine Name', type: 'text', required: true },
        { key: 'category', label: 'Category', type: 'select', options: ['Tablet', 'Syrup', 'Injection', 'Capsule', 'Drop', 'Cream', 'Soap', 'Other'] },
        { key: 'quantity', label: 'Quantity', type: 'number', required: true, placeholder: '100' },
        { key: 'unit', label: 'Unit', type: 'select', options: ['Strips', 'Bottles', 'Vials', 'Ampoules', 'Packs', 'Pieces'] },
        { key: 'unitPrice', label: 'Unit Price (₹)', type: 'number', required: true, placeholder: '50' },
        { key: 'totalAmount', label: 'Total Amount (₹)', type: 'number', placeholder: '5000' },
        { key: 'purchaseDate', label: 'Purchase Date', type: 'date', required: true },
        { key: 'expiryDate', label: 'Expiry Date', type: 'date' },
        { key: 'invoiceNo', label: 'Invoice Number', type: 'text', placeholder: 'INV-2024-001' },
        { key: 'batchNo', label: 'Batch Number', type: 'text', placeholder: 'BT-001' },
        { key: 'status', label: 'Status', type: 'select', options: ['Pending', 'Received', 'Partially Received', 'Cancelled'] },
        { key: 'notes', label: 'Notes', type: 'textarea' },
      ]}
    />
  );
}
