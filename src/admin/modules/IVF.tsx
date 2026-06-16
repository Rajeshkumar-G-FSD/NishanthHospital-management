import { useState } from 'react';
import CRUDModule from '../components/CRUDModule';
import { StatusBadge } from '../components/CRUDModule';

const TABS = ['IVF Patients', 'IVF Cycles', 'Embryos'] as const;
type Tab = typeof TABS[number];

export default function IVF() {
  const [tab, setTab] = useState<Tab>('IVF Patients');

  return (
    <div className="h-full flex flex-col">
      <div className="flex gap-1 px-6 pt-6 border-b border-gray-100 bg-white">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${tab === t ? 'bg-rose-50 text-rose-600 border-b-2 border-rose-500' : 'text-gray-500 hover:text-gray-700'}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'IVF Patients' && (
        <CRUDModule
          title="IVF Patients"
          collectionName="ivfPatients"
          singularLabel="IVF Patient"
          columns={[
            { key: 'coupleId', label: 'Couple ID' },
            { key: 'husbandName', label: 'Husband' },
            { key: 'wifeName', label: 'Wife' },
            { key: 'registrationDate', label: 'Registered On' },
            { key: 'primaryDiagnosis', label: 'Diagnosis' },
            { key: 'status', label: 'Status', render: v => <StatusBadge value={v} /> },
          ]}
          fields={[
            { key: 'coupleId', label: 'Couple ID', type: 'text', required: true },
            { key: 'husbandName', label: 'Husband Name', type: 'text', required: true },
            { key: 'husbandAge', label: 'Husband Age', type: 'number' },
            { key: 'wifeName', label: 'Wife Name', type: 'text', required: true },
            { key: 'wifeAge', label: 'Wife Age', type: 'number' },
            { key: 'mobile', label: 'Contact Number', type: 'tel', required: true },
            { key: 'email', label: 'Email', type: 'email' },
            { key: 'registrationDate', label: 'Registration Date', type: 'date' },
            { key: 'primaryDiagnosis', label: 'Primary Diagnosis', type: 'text' },
            { key: 'referredBy', label: 'Referred By', type: 'text' },
            { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Under Assessment', 'On Treatment', 'Completed', 'Inactive'] },
          ]}
        />
      )}

      {tab === 'IVF Cycles' && (
        <CRUDModule
          title="IVF Cycles"
          collectionName="ivfCycles"
          singularLabel="Cycle"
          columns={[
            { key: 'cycleId', label: 'Cycle ID' },
            { key: 'coupleId', label: 'Couple ID' },
            { key: 'type', label: 'Type' },
            { key: 'startDate', label: 'Start Date' },
            { key: 'stage', label: 'Stage' },
            { key: 'status', label: 'Status', render: v => <StatusBadge value={v} /> },
          ]}
          fields={[
            { key: 'cycleId', label: 'Cycle ID', type: 'text', required: true },
            { key: 'coupleId', label: 'Couple ID', type: 'text', required: true },
            { key: 'type', label: 'Procedure Type', type: 'select', options: ['IVF', 'ICSI', 'IUI', 'FET', 'Donor IVF', 'Surrogacy', 'Fertility Assessment'] },
            { key: 'startDate', label: 'Start Date', type: 'date', required: true },
            { key: 'stage', label: 'Current Stage', type: 'select', options: ['Stimulation', 'Egg Retrieval', 'Fertilisation', 'Embryo Culture', 'Transfer', 'Luteal Support', 'Pregnancy Test', 'Completed'] },
            { key: 'doctor', label: 'Treating Doctor', type: 'text' },
            { key: 'eggsRetrieved', label: 'Eggs Retrieved', type: 'number' },
            { key: 'embryosFormed', label: 'Embryos Formed', type: 'number' },
            { key: 'embryosTransferred', label: 'Embryos Transferred', type: 'number' },
            { key: 'outcomeDate', label: 'Outcome Date', type: 'date' },
            { key: 'status', label: 'Status', type: 'select', options: ['Active', 'On Hold', 'Completed - Success', 'Completed - Failure', 'Cancelled'] },
            { key: 'notes', label: 'Notes', type: 'textarea' },
          ]}
        />
      )}

      {tab === 'Embryos' && (
        <CRUDModule
          title="Embryo Records"
          collectionName="embryos"
          singularLabel="Embryo Record"
          columns={[
            { key: 'embryoId', label: 'Embryo ID' },
            { key: 'cycleId', label: 'Cycle ID' },
            { key: 'grade', label: 'Grade' },
            { key: 'day', label: 'Day' },
            { key: 'cryopreserved', label: 'Cryopreserved' },
            { key: 'status', label: 'Status', render: v => <StatusBadge value={v} /> },
          ]}
          fields={[
            { key: 'embryoId', label: 'Embryo ID', type: 'text', required: true },
            { key: 'cycleId', label: 'Cycle ID', type: 'text', required: true },
            { key: 'grade', label: 'Embryo Grade', type: 'select', options: ['Grade A', 'Grade B', 'Grade C', 'Grade D', 'Blastocyst'] },
            { key: 'day', label: 'Day (D3/D5)', type: 'text', placeholder: 'e.g. D3 or D5' },
            { key: 'cryopreserved', label: 'Cryopreserved', type: 'select', options: ['Yes', 'No'] },
            { key: 'cryoDate', label: 'Cryo Date', type: 'date' },
            { key: 'thawDate', label: 'Thaw Date', type: 'date' },
            { key: 'status', label: 'Status', type: 'select', options: ['Available', 'Transferred', 'Discarded', 'Donated'] },
            { key: 'notes', label: 'Notes', type: 'textarea' },
          ]}
        />
      )}
    </div>
  );
}
