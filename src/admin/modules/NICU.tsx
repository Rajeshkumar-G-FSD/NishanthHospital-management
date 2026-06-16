import CRUDModule from '../components/CRUDModule';
import { StatusBadge } from '../components/CRUDModule';

export default function NICU() {
  return (
    <CRUDModule
      title="NICU Patients"
      collectionName="nicuPatients"
      singularLabel="NICU Patient"
      columns={[
        { key: 'nicuId', label: 'NICU ID' },
        { key: 'babyName', label: 'Baby Name' },
        { key: 'motherName', label: 'Mother' },
        { key: 'admissionDate', label: 'Admitted On' },
        { key: 'gestationalAge', label: 'Gest. Age (wks)' },
        { key: 'birthWeight', label: 'Birth Wt. (kg)' },
        { key: 'status', label: 'Status', render: v => <StatusBadge value={v} /> },
      ]}
      fields={[
        { key: 'nicuId', label: 'NICU ID', type: 'text', required: true },
        { key: 'babyName', label: 'Baby Name / ID', type: 'text', required: true },
        { key: 'motherName', label: 'Mother Name', type: 'text', required: true },
        { key: 'fatherName', label: 'Father Name', type: 'text' },
        { key: 'admissionDate', label: 'Admission Date', type: 'date', required: true },
        { key: 'dateOfBirth', label: 'Date of Birth', type: 'date' },
        { key: 'gestationalAge', label: 'Gestational Age (weeks)', type: 'number' },
        { key: 'birthWeight', label: 'Birth Weight (kg)', type: 'number' },
        { key: 'gender', label: 'Baby Gender', type: 'select', options: ['Male', 'Female', 'Not Determined'] },
        { key: 'admissionDiagnosis', label: 'Admission Diagnosis', type: 'textarea' },
        { key: 'neonatologist', label: 'Neonatologist', type: 'text' },
        { key: 'bedNumber', label: 'NICU Bed/Incubator', type: 'text' },
        { key: 'ventilationSupport', label: 'Ventilation Support', type: 'select', options: ['None', 'Oxygen', 'CPAP', 'Ventilator'] },
        { key: 'dischargeDate', label: 'Discharge Date', type: 'date' },
        { key: 'status', label: 'Status', type: 'select', options: ['Critical', 'Stable', 'Improving', 'Discharged', 'Transferred', 'Expired'] },
        { key: 'notes', label: 'Clinical Notes', type: 'textarea' },
      ]}
    />
  );
}
