import CRUDModule from '../components/CRUDModule';
import { StatusBadge } from '../components/CRUDModule';

export default function Beds() {
  return (
    <CRUDModule
      title="Bed Management"
      collectionName="beds"
      singularLabel="Bed"
      columns={[
        { key: 'bedNumber', label: 'Bed No.' },
        { key: 'ward', label: 'Ward' },
        { key: 'type', label: 'Type' },
        { key: 'status', label: 'Status', render: v => <StatusBadge value={v} /> },
        { key: 'patientAssigned', label: 'Assigned Patient' },
      ]}
      fields={[
        { key: 'bedNumber', label: 'Bed Number', type: 'text', required: true, placeholder: 'B-101' },
        { key: 'ward', label: 'Ward', type: 'select', options: ['General Ward', 'Private Room', 'Semi-Private', 'ICU', 'NICU', 'Labour Room', 'Post-Op', 'Maternity'] },
        { key: 'type', label: 'Bed Type', type: 'select', options: ['General', 'Electric', 'ICU', 'Paediatric', 'Delivery', 'Orthopaedic'] },
        { key: 'status', label: 'Status', type: 'select', options: ['Available', 'Occupied', 'Under Maintenance', 'Reserved'] },
        { key: 'patientAssigned', label: 'Assigned Patient ID', type: 'text' },
        { key: 'floor', label: 'Floor', type: 'text', placeholder: 'e.g. Ground Floor' },
        { key: 'notes', label: 'Notes', type: 'textarea' },
      ]}
    />
  );
}
