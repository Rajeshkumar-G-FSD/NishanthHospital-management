import { useState } from 'react';
import CRUDModule from '../components/CRUDModule';
import { StatusBadge } from '../components/CRUDModule';

const TABS = ['Surgeries', 'Operation Theatres'] as const;
type Tab = typeof TABS[number];

export default function OT() {
  const [tab, setTab] = useState<Tab>('Surgeries');

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

      {tab === 'Surgeries' && (
        <CRUDModule
          title="Surgeries"
          collectionName="surgeries"
          singularLabel="Surgery"
          columns={[
            { key: 'surgeryId', label: 'ID' },
            { key: 'patientId', label: 'Patient ID' },
            { key: 'surgeon', label: 'Surgeon' },
            { key: 'procedure', label: 'Procedure' },
            { key: 'scheduledDate', label: 'Date' },
            { key: 'theatre', label: 'OT No.' },
            { key: 'status', label: 'Status', render: v => <StatusBadge value={v} /> },
          ]}
          fields={[
            { key: 'surgeryId', label: 'Surgery ID', type: 'text', required: true },
            { key: 'patientId', label: 'Patient ID', type: 'text', required: true },
            { key: 'surgeon', label: 'Surgeon', type: 'text', required: true },
            { key: 'assistantSurgeon', label: 'Assistant Surgeon', type: 'text' },
            { key: 'anesthesiologist', label: 'Anesthesiologist', type: 'text' },
            { key: 'procedure', label: 'Procedure / Surgery Name', type: 'text', required: true },
            { key: 'anesthesiaType', label: 'Anesthesia Type', type: 'select', options: ['General', 'Spinal', 'Epidural', 'Local', 'Regional', 'Sedation'] },
            { key: 'scheduledDate', label: 'Scheduled Date', type: 'date', required: true },
            { key: 'scheduledTime', label: 'Scheduled Time', type: 'text', placeholder: '10:00 AM' },
            { key: 'theatre', label: 'OT Number', type: 'text', placeholder: 'OT-1' },
            { key: 'duration', label: 'Est. Duration (mins)', type: 'number' },
            { key: 'status', label: 'Status', type: 'select', options: ['Scheduled', 'In Progress', 'Completed', 'Postponed', 'Cancelled'] },
            { key: 'postOpNotes', label: 'Post-Op Notes', type: 'textarea' },
          ]}
        />
      )}

      {tab === 'Operation Theatres' && (
        <CRUDModule
          title="Operation Theatres"
          collectionName="operationTheatres"
          singularLabel="OT"
          columns={[
            { key: 'otId', label: 'OT ID' },
            { key: 'name', label: 'Name' },
            { key: 'type', label: 'Type' },
            { key: 'floor', label: 'Floor' },
            { key: 'status', label: 'Status', render: v => <StatusBadge value={v} /> },
          ]}
          fields={[
            { key: 'otId', label: 'OT ID', type: 'text', required: true, placeholder: 'OT-1' },
            { key: 'name', label: 'OT Name', type: 'text', required: true },
            { key: 'type', label: 'Type', type: 'select', options: ['Major OT', 'Minor OT', 'Labour Room', 'Emergency OT', 'Laparoscopy OT'] },
            { key: 'floor', label: 'Floor / Location', type: 'text' },
            { key: 'capacity', label: 'Capacity (persons)', type: 'number' },
            { key: 'status', label: 'Status', type: 'select', options: ['Available', 'Occupied', 'Under Maintenance', 'Cleaning'] },
            { key: 'lastSterilized', label: 'Last Sterilized', type: 'date' },
            { key: 'notes', label: 'Notes', type: 'textarea' },
          ]}
        />
      )}
    </div>
  );
}
