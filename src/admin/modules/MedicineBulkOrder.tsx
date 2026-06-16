import CRUDModule from '../components/CRUDModule';
import { StatusBadge } from '../components/CRUDModule';

export default function MedicineBulkOrder() {
  return (
    <CRUDModule
      title="Medicine Bulk Orders"
      collectionName="bulkOrders"
      singularLabel="Bulk Order"
      columns={[
        { key: 'orderId', label: 'Order ID' },
        { key: 'supplier', label: 'Supplier' },
        { key: 'orderDate', label: 'Order Date' },
        { key: 'expectedDelivery', label: 'Expected Delivery' },
        { key: 'totalItems', label: 'Items' },
        { key: 'totalValue', label: 'Total Value (₹)' },
        { key: 'status', label: 'Status', render: v => <StatusBadge value={v} /> },
      ]}
      fields={[
        { key: 'orderId', label: 'Order ID', type: 'text', required: true, placeholder: 'BO-001' },
        { key: 'supplier', label: 'Supplier Name', type: 'text', required: true, placeholder: 'Pharma Distributor Ltd' },
        { key: 'supplierContact', label: 'Supplier Contact', type: 'tel', placeholder: '9876543210' },
        { key: 'orderDate', label: 'Order Date', type: 'date', required: true },
        { key: 'expectedDelivery', label: 'Expected Delivery Date', type: 'date' },
        { key: 'totalItems', label: 'Total Items (count)', type: 'number', placeholder: '20' },
        { key: 'totalValue', label: 'Total Order Value (₹)', type: 'number', required: true, placeholder: '50000' },
        { key: 'discount', label: 'Discount (%)', type: 'number', placeholder: '5' },
        { key: 'netAmount', label: 'Net Amount (₹)', type: 'number', placeholder: '47500' },
        { key: 'paymentTerms', label: 'Payment Terms', type: 'select', options: ['Advance', '30 Days Credit', '60 Days Credit', 'COD'] },
        { key: 'status', label: 'Status', type: 'select', options: ['Draft', 'Ordered', 'Processing', 'Partially Received', 'Received', 'Cancelled'] },
        { key: 'medicines', label: 'Medicine List (comma separated)', type: 'textarea', placeholder: 'Paracetamol 500mg x50, Amoxicillin 250mg x100' },
        { key: 'notes', label: 'Notes', type: 'textarea' },
      ]}
    />
  );
}
