import CRUDModule from '../components/CRUDModule';
import { StatusBadge } from '../components/CRUDModule';

export default function Vaccination() {
  return (
    <CRUDModule
      title="Vaccinations"
      collectionName="vaccinations"
      singularLabel="Vaccination Record"
      columns={[
        { key: 'vaccinationId', label: 'ID' },
        { key: 'patientId', label: 'Patient / Child ID' },
        { key: 'vaccine', label: 'Vaccine' },
        { key: 'dose', label: 'Dose' },
        { key: 'vaccinationDate', label: 'Date Given' },
        { key: 'nextDueDate', label: 'Next Due' },
        { key: 'status', label: 'Status', render: v => <StatusBadge value={v} /> },
      ]}
      fields={[
        { key: 'vaccinationId', label: 'Vaccination ID', type: 'text', required: true },
        { key: 'patientId', label: 'Patient / Child ID', type: 'text', required: true },
        { key: 'childName', label: 'Child Name', type: 'text' },
        { key: 'motherName', label: 'Mother Name', type: 'text' },
        { key: 'vaccine', label: 'Vaccine Name', type: 'select', options: ['BCG', 'Hepatitis B', 'OPV', 'DPT', 'Hib', 'PCV', 'IPV', 'MMR', 'Varicella', 'Typhoid', 'Hepatitis A', 'Meningococcal', 'HPV', 'COVID-19', 'Influenza', 'Other'] },
        { key: 'dose', label: 'Dose Number', type: 'text', placeholder: 'e.g. Dose 1, Booster' },
        { key: 'vaccinationDate', label: 'Vaccination Date', type: 'date', required: true },
        { key: 'nextDueDate', label: 'Next Due Date', type: 'date' },
        { key: 'administeredBy', label: 'Administered By', type: 'text' },
        { key: 'batchNumber', label: 'Vaccine Batch No.', type: 'text' },
        { key: 'siteOfInjection', label: 'Site of Injection', type: 'text', placeholder: 'e.g. Left thigh' },
        { key: 'status', label: 'Status', type: 'select', options: ['Completed', 'Due', 'Overdue', 'Skipped'] },
        { key: 'adverseReaction', label: 'Adverse Reaction (if any)', type: 'textarea' },
      ]}
    />
  );
}
