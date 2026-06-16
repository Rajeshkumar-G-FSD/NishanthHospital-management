import CRUDModule from '../components/CRUDModule';
import { StatusBadge } from '../components/CRUDModule';

export default function OPD() {
  return (
    <CRUDModule
      title="OPD Visits"
      collectionName="opdVisits"
      singularLabel="OPD Visit"
      columns={[
        { key: 'visitId', label: 'Visit ID' },
        { key: 'patientId', label: 'Patient ID' },
        { key: 'doctorId', label: 'Doctor' },
        { key: 'visitDate', label: 'Date' },
        { key: 'consultationType', label: 'Type' },
        { key: 'status', label: 'Status', render: v => <StatusBadge value={v} /> },
      ]}
      fields={[
        { key: 'visitId', label: 'Visit ID', type: 'text', required: true, placeholder: 'OPD-001' },
        { key: 'patientId', label: 'Patient ID', type: 'text', required: true },
        { key: 'doctorId', label: 'Doctor ID', type: 'text', required: true },
        { key: 'departmentId', label: 'Department', type: 'text' },
        { key: 'visitDate', label: 'Visit Date', type: 'date', required: true },
        { key: 'consultationType', label: 'Consultation Type', type: 'select', options: ['New', 'Follow-up', 'Emergency', 'Video'] },
        { key: 'symptoms', label: 'Symptoms', type: 'textarea' },
        { key: 'diagnosis', label: 'Diagnosis', type: 'textarea' },
        { key: 'prescription', label: 'Prescription', type: 'textarea' },
        { key: 'followUpDate', label: 'Follow-up Date', type: 'date' },
        { key: 'status', label: 'Status', type: 'select', options: ['Scheduled', 'In Progress', 'Completed', 'Cancelled'] },
      ]}
    />
  );
}
