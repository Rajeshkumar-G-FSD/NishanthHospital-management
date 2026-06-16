import CRUDModule from '../components/CRUDModule';
import { StatusBadge } from '../components/CRUDModule';

export default function Inventory() {
  return (
    <CRUDModule
      title="Inventory"
      collectionName="inventory"
      singularLabel="Item"
      columns={[
        { key: 'itemId', label: 'Item ID' },
        { key: 'name', label: 'Item Name' },
        { key: 'category', label: 'Category' },
        { key: 'quantity', label: 'Qty' },
        { key: 'unit', label: 'Unit' },
        { key: 'reorderLevel', label: 'Reorder Lvl' },
        { key: 'status', label: 'Status', render: (_v, row) => {
          const qty = Number(row.quantity ?? 0);
          const reorder = Number(row.reorderLevel ?? 0);
          const status = qty <= 0 ? 'Out of Stock' : qty <= reorder ? 'Low Stock' : 'In Stock';
          return <StatusBadge value={status} />;
        }},
      ]}
      fields={[
        { key: 'itemId', label: 'Item ID', type: 'text', required: true, placeholder: 'INV-001' },
        { key: 'name', label: 'Item Name', type: 'text', required: true },
        { key: 'category', label: 'Category', type: 'select', options: ['Medical Equipment', 'Surgical Supplies', 'Consumables', 'Linen', 'Office Supplies', 'IT Equipment', 'Furniture', 'Other'] },
        { key: 'quantity', label: 'Quantity', type: 'number', required: true },
        { key: 'unit', label: 'Unit', type: 'text', placeholder: 'e.g. Pieces, Boxes' },
        { key: 'reorderLevel', label: 'Reorder Level', type: 'number' },
        { key: 'location', label: 'Storage Location', type: 'text' },
        { key: 'supplier', label: 'Supplier', type: 'text' },
        { key: 'purchaseDate', label: 'Purchase Date', type: 'date' },
        { key: 'cost', label: 'Unit Cost (₹)', type: 'number' },
        { key: 'notes', label: 'Notes', type: 'textarea' },
      ]}
    />
  );
}
