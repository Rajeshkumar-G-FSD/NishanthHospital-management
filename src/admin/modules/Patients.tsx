import CRUDModule from '../components/CRUDModule';

export default function Patients() {
  return (
    <CRUDModule
      title="Patients"
      collectionName="patients"
      singularLabel="Patient"
      columns={[
        { key: 'patientCode', label: 'Code' },
        { key: 'UHID', label: 'UHID' },
        { key: 'fullName', label: 'Full Name' },
        { key: 'gender', label: 'Gender' },
        { key: 'DOB', label: 'DOB' },
        { key: 'bloodGroup', label: 'Blood Group' },
        { key: 'mobile', label: 'Mobile' },
      ]}
      fields={[
        { key: 'patientCode', label: 'Patient Code', type: 'text', required: true, placeholder: 'PAT-001' },
        { key: 'UHID', label: 'UHID', type: 'text', required: true, placeholder: 'UHID-001' },
        { key: 'fullName', label: 'Full Name', type: 'text', required: true },
        { key: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female', 'Other'] },
        { key: 'DOB', label: 'Date of Birth', type: 'date' },
        { key: 'bloodGroup', label: 'Blood Group', type: 'select', options: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'] },
        { key: 'mobile', label: 'Mobile', type: 'tel', required: true },
        { key: 'email', label: 'Email', type: 'email' },
        { key: 'address', label: 'Address', type: 'textarea' },
        { key: 'emergencyContact', label: 'Emergency Contact', type: 'tel' },
        { key: 'insuranceDetails', label: 'Insurance Details', type: 'text' },
      ]}
    />
  );
}
