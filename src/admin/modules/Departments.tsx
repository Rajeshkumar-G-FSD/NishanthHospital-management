import CRUDModule from '../components/CRUDModule';
import { StatusBadge } from '../components/CRUDModule';

export default function Departments() {
  return (
    <CRUDModule
      title="Departments"
      collectionName="departments"
      singularLabel="Department"
      columns={[
        { key: 'name', label: 'Department Name' },
        { key: 'type', label: 'Type' },
        { key: 'headDoctor', label: 'Head Doctor' },
        { key: 'location', label: 'Location' },
        { key: 'status', label: 'Status', render: v => <StatusBadge value={v} /> },
      ]}
      fields={[
        { key: 'name', label: 'Department Name', type: 'text', required: true },
        { key: 'type', label: 'Type', type: 'select', options: ['Clinical', 'Surgical', 'Diagnostic', 'Support', 'Administration'] },
        { key: 'headDoctor', label: 'Head Doctor', type: 'text' },
        { key: 'location', label: 'Location / Floor', type: 'text', placeholder: 'e.g. Ground Floor, Block A' },
        { key: 'contactExtension', label: 'Extension Number', type: 'text' },
        { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Inactive'] },
        { key: 'description', label: 'Description', type: 'textarea' },
      ]}
    />
  );
}
