import CRUDModule from '../components/CRUDModule';
import { StatusBadge } from '../components/CRUDModule';

export default function Doctors() {
  return (
    <CRUDModule
      title="Doctors"
      collectionName="doctors"
      singularLabel="Doctor"
      columns={[
        { key: 'doctorId', label: 'ID' },
        { key: 'name', label: 'Name' },
        { key: 'specialization', label: 'Specialization' },
        { key: 'qualification', label: 'Qualification' },
        { key: 'experience', label: 'Experience (yrs)' },
        { key: 'consultationFee', label: 'Fee (₹)' },
        { key: 'availability', label: 'Availability', render: v => <StatusBadge value={v} /> },
      ]}
      fields={[
        { key: 'doctorId', label: 'Doctor ID', type: 'text', required: true, placeholder: 'DOC-001' },
        { key: 'name', label: 'Full Name', type: 'text', required: true },
        { key: 'specialization', label: 'Specialization', type: 'select', options: ['Obstetrics & Gynaecology', 'Fertility Specialist', 'Urology', 'Paediatrics', 'Neonatology', 'Anaesthesiology', 'Fetal Medicine', 'General Medicine', 'Other'] },
        { key: 'qualification', label: 'Qualification', type: 'text', placeholder: 'MBBS, MS, DNB' },
        { key: 'registrationNumber', label: 'Registration No.', type: 'text' },
        { key: 'experience', label: 'Experience (years)', type: 'number' },
        { key: 'consultationFee', label: 'Consultation Fee (₹)', type: 'number' },
        { key: 'availability', label: 'Availability', type: 'select', options: ['Active', 'On Leave', 'Inactive'] },
        { key: 'email', label: 'Email', type: 'email' },
        { key: 'mobile', label: 'Mobile', type: 'tel' },
      ]}
    />
  );
}
