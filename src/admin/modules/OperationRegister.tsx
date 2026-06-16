import CRUDModule from '../components/CRUDModule';
import { StatusBadge } from '../components/CRUDModule';

export default function OperationRegister() {
  return (
    <CRUDModule
      title="Operation Register"
      collectionName="operationRegister"
      singularLabel="Operation"
      columns={[
        { key: 'opId', label: 'Op. ID' },
        { key: 'patientName', label: 'Patient' },
        { key: 'operationType', label: 'Operation' },
        { key: 'surgeon', label: 'Surgeon' },
        { key: 'opDate', label: 'Date' },
        { key: 'ward', label: 'OT' },
        { key: 'duration', label: 'Duration' },
        { key: 'status', label: 'Status', render: v => <StatusBadge value={v} /> },
      ]}
      fields={[
        { key: 'opId', label: 'Operation ID', type: 'text', required: true, placeholder: 'OP-001' },
        { key: 'patientId', label: 'Patient ID', type: 'text', required: true, placeholder: 'PAT-001' },
        { key: 'patientName', label: 'Patient Name', type: 'text', required: true },
        { key: 'age', label: 'Patient Age', type: 'text', placeholder: '45 / Female' },
        { key: 'operationType', label: 'Operation Type', type: 'text', required: true, placeholder: 'Appendectomy / C-Section / Hernia Repair' },
        { key: 'surgeon', label: 'Lead Surgeon', type: 'text', required: true, placeholder: 'Dr. Nishanth' },
        { key: 'assistantSurgeon', label: 'Assistant Surgeon', type: 'text' },
        { key: 'anaesthetist', label: 'Anaesthetist', type: 'text' },
        { key: 'scrubNurse', label: 'Scrub Nurse', type: 'text' },
        { key: 'opDate', label: 'Operation Date', type: 'date', required: true },
        { key: 'opTime', label: 'Operation Time', type: 'text', placeholder: '10:30 AM' },
        { key: 'duration', label: 'Duration (mins)', type: 'number', placeholder: '90' },
        { key: 'ward', label: 'OT Room / Theatre', type: 'select', options: ['OT 1', 'OT 2', 'OT 3', 'Minor OT', 'Emergency OT', 'NICU OT'] },
        { key: 'anaesthesiaType', label: 'Anaesthesia Type', type: 'select', options: ['General', 'Regional', 'Local', 'Spinal', 'Epidural'] },
        { key: 'bloodTransfusion', label: 'Blood Transfusion', type: 'select', options: ['None', 'Yes - 1 Unit', 'Yes - 2 Units', 'Yes - 3+ Units'] },
        { key: 'diagnosis', label: 'Pre-Op Diagnosis', type: 'textarea' },
        { key: 'procedure', label: 'Procedure Performed', type: 'textarea' },
        { key: 'complications', label: 'Complications (if any)', type: 'textarea' },
        { key: 'postOpNotes', label: 'Post-Op Notes', type: 'textarea' },
        { key: 'status', label: 'Status', type: 'select', options: ['Scheduled', 'In Progress', 'Completed', 'Postponed', 'Cancelled'] },
      ]}
    />
  );
}
