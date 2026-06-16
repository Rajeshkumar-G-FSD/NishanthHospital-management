import CRUDModule from '../components/CRUDModule';
import { StatusBadge } from '../components/CRUDModule';

export default function Emergency() {
  return (
    <CRUDModule
      title="Emergency Cases"
      collectionName="emergencyCases"
      singularLabel="Emergency Case"
      columns={[
        { key: 'caseId', label: 'Case ID' },
        { key: 'patientName', label: 'Patient' },
        { key: 'type', label: 'Emergency Type' },
        { key: 'severity', label: 'Severity', render: v => <StatusBadge value={v} /> },
        { key: 'arrivalDate', label: 'Arrival Date' },
        { key: 'status', label: 'Status', render: v => <StatusBadge value={v} /> },
      ]}
      fields={[
        { key: 'caseId', label: 'Case ID', type: 'text', required: true, placeholder: 'EMG-001' },
        { key: 'patientName', label: 'Patient Name', type: 'text', required: true },
        { key: 'age', label: 'Age', type: 'number' },
        { key: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female', 'Other'] },
        { key: 'contactNumber', label: 'Contact Number', type: 'tel' },
        { key: 'type', label: 'Emergency Type', type: 'select', options: ['Obstetric', 'Paediatric', 'Cardiac', 'Trauma', 'Surgical', 'Medical', 'Gynaecological', 'Neonatal', 'Other'] },
        { key: 'severity', label: 'Severity', type: 'select', options: ['Critical', 'Serious', 'Moderate', 'Stable'] },
        { key: 'arrivalDate', label: 'Arrival Date', type: 'date', required: true },
        { key: 'assignedDoctor', label: 'Assigned Doctor', type: 'text' },
        { key: 'ambulanceUsed', label: 'Ambulance Used', type: 'select', options: ['Yes', 'No'] },
        { key: 'icuTransfer', label: 'ICU Transfer', type: 'select', options: ['Yes', 'No', 'Pending'] },
        { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Stable', 'Discharged', 'Referred', 'Deceased'] },
        { key: 'notes', label: 'Notes', type: 'textarea' },
      ]}
    />
  );
}
