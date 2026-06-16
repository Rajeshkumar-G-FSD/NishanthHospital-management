import CRUDModule from '../components/CRUDModule';
import { StatusBadge } from '../components/CRUDModule';

export default function ManualLabTests() {
  return (
    <CRUDModule
      title="Manual Lab Tests"
      collectionName="manualLabTests"
      singularLabel="Manual Lab Test"
      columns={[
        { key: 'testId', label: 'Test ID' },
        { key: 'patientName', label: 'Patient' },
        { key: 'testName', label: 'Test Name' },
        { key: 'testType', label: 'Type' },
        { key: 'orderedBy', label: 'Ordered By' },
        { key: 'collectedOn', label: 'Sample Date' },
        { key: 'result', label: 'Result' },
        { key: 'status', label: 'Status', render: v => <StatusBadge value={v} /> },
      ]}
      fields={[
        { key: 'testId', label: 'Test ID', type: 'text', required: true, placeholder: 'MLT-001' },
        { key: 'patientId', label: 'Patient ID', type: 'text', placeholder: 'PAT-001' },
        { key: 'patientName', label: 'Patient Name', type: 'text', required: true },
        { key: 'age', label: 'Patient Age', type: 'text', placeholder: '35 / Male' },
        { key: 'testName', label: 'Test Name', type: 'text', required: true, placeholder: 'Complete Blood Count' },
        { key: 'testType', label: 'Test Type', type: 'select', options: ['Blood', 'Urine', 'Stool', 'Sputum', 'Swab', 'Biopsy', 'Culture', 'Other'] },
        { key: 'orderedBy', label: 'Ordered By Doctor', type: 'text', placeholder: 'Dr. Nishanth' },
        { key: 'collectedOn', label: 'Sample Collected On', type: 'date', required: true },
        { key: 'collectedBy', label: 'Collected By (Lab Tech)', type: 'text' },
        { key: 'result', label: 'Result / Report', type: 'textarea' },
        { key: 'normalRange', label: 'Normal Range Reference', type: 'text' },
        { key: 'remarks', label: 'Remarks / Interpretation', type: 'textarea' },
        { key: 'status', label: 'Status', type: 'select', options: ['Ordered', 'Sample Collected', 'Processing', 'Completed', 'Cancelled'] },
      ]}
    />
  );
}
