import CRUDModule from '../components/CRUDModule';
import { StatusBadge } from '../components/CRUDModule';

export default function Camp() {
  return (
    <CRUDModule
      title="Medical Camps"
      collectionName="camps"
      singularLabel="Camp"
      columns={[
        { key: 'campId', label: 'Camp ID' },
        { key: 'campName', label: 'Camp Name' },
        { key: 'location', label: 'Location' },
        { key: 'date', label: 'Date' },
        { key: 'organizer', label: 'Organizer' },
        { key: 'patientsAttended', label: 'Patients' },
        { key: 'status', label: 'Status', render: v => <StatusBadge value={v} /> },
      ]}
      fields={[
        { key: 'campId', label: 'Camp ID', type: 'text', required: true, placeholder: 'CAMP-001' },
        { key: 'campName', label: 'Camp Name', type: 'text', required: true, placeholder: 'Free Health Checkup Camp' },
        { key: 'campType', label: 'Camp Type', type: 'select', options: ['General Health', 'Eye', 'Dental', 'Gynaecology', 'Paediatric', 'Diabetic', 'Blood Donation', 'Vaccination', 'Multi-Specialty'] },
        { key: 'date', label: 'Camp Date', type: 'date', required: true },
        { key: 'startTime', label: 'Start Time', type: 'text', placeholder: '09:00 AM' },
        { key: 'endTime', label: 'End Time', type: 'text', placeholder: '04:00 PM' },
        { key: 'location', label: 'Location / Venue', type: 'text', required: true, placeholder: 'Community Hall, Village Name' },
        { key: 'address', label: 'Full Address', type: 'textarea' },
        { key: 'organizer', label: 'Organizer / Coordinator', type: 'text', required: true },
        { key: 'doctorsAssigned', label: 'Doctors Assigned', type: 'text', placeholder: 'Dr. Nishanth, Dr. Abhinaya' },
        { key: 'staffAssigned', label: 'Support Staff', type: 'text', placeholder: 'Nurse Sarah, Tech Ravi' },
        { key: 'patientsExpected', label: 'Patients Expected', type: 'number', placeholder: '200' },
        { key: 'patientsAttended', label: 'Patients Attended', type: 'number', placeholder: '185' },
        { key: 'medicinesDistributed', label: 'Medicines Distributed (value ₹)', type: 'number', placeholder: '5000' },
        { key: 'sponsoredBy', label: 'Sponsored By', type: 'text', placeholder: 'Rotary Club / NGO Name' },
        { key: 'notes', label: 'Notes / Summary', type: 'textarea' },
        { key: 'status', label: 'Status', type: 'select', options: ['Planned', 'Ongoing', 'Completed', 'Cancelled', 'Postponed'] },
      ]}
    />
  );
}
