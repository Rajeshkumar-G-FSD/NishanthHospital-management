import CRUDModule from '../components/CRUDModule';
import { StatusBadge } from '../components/CRUDModule';

export default function IPD() {
  return (
    <CRUDModule
      title="IPD Admissions"
      collectionName="admissions"
      singularLabel="Admission"
      columns={[
        { key: 'admissionId', label: 'Admission ID' },
        { key: 'patientId', label: 'Patient ID' },
        { key: 'doctorId', label: 'Doctor' },
        { key: 'admissionDate', label: 'Admitted On' },
        { key: 'ward', label: 'Ward' },
        { key: 'bedNumber', label: 'Bed No.' },
        { key: 'status', label: 'Status', render: v => <StatusBadge value={v} /> },
      ]}
      fields={[
        { key: 'admissionId', label: 'Admission ID', type: 'text', required: true, placeholder: 'ADM-001' },
        { key: 'patientId', label: 'Patient ID', type: 'text', required: true },
        { key: 'doctorId', label: 'Doctor ID', type: 'text', required: true },
        { key: 'admissionDate', label: 'Admission Date', type: 'date', required: true },
        { key: 'ward', label: 'Ward', type: 'select', options: ['General Ward', 'Private Room', 'Semi-Private', 'ICU', 'NICU', 'Labour Room', 'Post-Op'] },
        { key: 'bedNumber', label: 'Bed Number', type: 'text' },
        { key: 'diagnosis', label: 'Diagnosis', type: 'textarea' },
        { key: 'dischargeDate', label: 'Discharge Date', type: 'date' },
        { key: 'status', label: 'Status', type: 'select', options: ['Admitted', 'Under Observation', 'Discharged', 'Transferred'] },
        { key: 'notes', label: 'Notes', type: 'textarea' },
      ]}
    />
  );
}
