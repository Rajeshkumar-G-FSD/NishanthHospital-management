import CRUDModule from '../components/CRUDModule';
import { StatusBadge } from '../components/CRUDModule';

export default function Appointments() {
  return (
    <CRUDModule
      title="Appointments"
      collectionName="appointments"
      singularLabel="Appointment"
      columns={[
        { key: 'appointmentId', label: 'Appt ID' },
        { key: 'patientId', label: 'Patient ID' },
        { key: 'doctorId', label: 'Doctor' },
        { key: 'appointmentDate', label: 'Date' },
        { key: 'appointmentTime', label: 'Time' },
        { key: 'consultationType', label: 'Type' },
        { key: 'status', label: 'Status', render: v => <StatusBadge value={v} /> },
      ]}
      fields={[
        { key: 'appointmentId', label: 'Appointment ID', type: 'text', required: true, placeholder: 'APPT-001' },
        { key: 'patientId', label: 'Patient ID', type: 'text', required: true },
        { key: 'doctorId', label: 'Doctor ID', type: 'text', required: true },
        { key: 'departmentId', label: 'Department', type: 'text' },
        { key: 'appointmentDate', label: 'Date', type: 'date', required: true },
        { key: 'appointmentTime', label: 'Time', type: 'text', placeholder: '10:00 AM' },
        { key: 'consultationType', label: 'Consultation Type', type: 'select', options: ['Online Booking', 'Walk-In', 'Video Consultation', 'Follow-up'] },
        { key: 'status', label: 'Status', type: 'select', options: ['Scheduled', 'Confirmed', 'Completed', 'Cancelled', 'Rescheduled'] },
        { key: 'notes', label: 'Notes', type: 'textarea', placeholder: 'Additional notes…' },
      ]}
    />
  );
}
