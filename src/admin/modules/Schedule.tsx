import { useState } from 'react';
import CRUDModule from '../components/CRUDModule';
import { StatusBadge } from '../components/CRUDModule';

const TABS = ['Doctor Schedules', 'OT Schedules', 'Shift Rosters'] as const;
type Tab = typeof TABS[number];

const DEPARTMENTS = [
  'Obstetrics & Gynaecology', 'Fertility Centre', 'Urology & Andrology',
  'Paediatrics', 'Neonatology', 'Anaesthesiology', 'Emergency',
  'Laboratory', 'Radiology', 'Pharmacy', 'General Medicine', 'Other',
];

export default function Schedule() {
  const [tab, setTab] = useState<Tab>('Doctor Schedules');

  return (
    <div className="h-full flex flex-col">
      <div className="flex gap-1 px-6 pt-6 border-b border-gray-100 bg-white flex-wrap">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              tab === t
                ? 'bg-rose-50 text-rose-600 border-b-2 border-rose-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'Doctor Schedules' && (
        <CRUDModule
          title="Doctor Schedules"
          collectionName="schedules"
          singularLabel="Schedule"
          columns={[
            { key: 'doctorName', label: 'Doctor' },
            { key: 'department', label: 'Department' },
            { key: 'dayOfWeek', label: 'Day' },
            { key: 'startTime', label: 'Start' },
            { key: 'endTime', label: 'End' },
            { key: 'maxPatients', label: 'Max Patients' },
            { key: 'status', label: 'Status', render: v => <StatusBadge value={v} /> },
          ]}
          fields={[
            { key: 'doctorId', label: 'Doctor ID', type: 'text', placeholder: 'DOC-001' },
            { key: 'doctorName', label: 'Doctor Name', type: 'text', required: true },
            {
              key: 'department', label: 'Department', type: 'select',
              options: DEPARTMENTS,
            },
            {
              key: 'dayOfWeek', label: 'Day of Week', type: 'select', required: true,
              options: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            },
            { key: 'startTime', label: 'Start Time', type: 'text', required: true, placeholder: '09:00 AM' },
            { key: 'endTime', label: 'End Time', type: 'text', required: true, placeholder: '05:00 PM' },
            { key: 'slotDuration', label: 'Slot Duration (mins)', type: 'number', placeholder: '15' },
            { key: 'maxPatients', label: 'Max Patients / Session', type: 'number' },
            { key: 'consultationFee', label: 'Consultation Fee (₹)', type: 'number' },
            { key: 'roomNumber', label: 'Room / Cabin No.', type: 'text' },
            {
              key: 'status', label: 'Status', type: 'select',
              options: ['Active', 'Inactive', 'On Leave', 'Temporarily Closed'],
            },
            { key: 'notes', label: 'Notes', type: 'textarea' },
          ]}
        />
      )}

      {tab === 'OT Schedules' && (
        <CRUDModule
          title="OT Schedules"
          collectionName="otSchedules"
          singularLabel="OT Schedule"
          columns={[
            { key: 'theatre', label: 'OT No.' },
            { key: 'surgeon', label: 'Surgeon' },
            { key: 'procedure', label: 'Procedure' },
            { key: 'scheduledDate', label: 'Date' },
            { key: 'scheduledTime', label: 'Time' },
            { key: 'status', label: 'Status', render: v => <StatusBadge value={v} /> },
          ]}
          fields={[
            { key: 'theatre', label: 'Operation Theatre', type: 'text', required: true, placeholder: 'OT-1' },
            { key: 'patientId', label: 'Patient ID', type: 'text', required: true },
            { key: 'surgeon', label: 'Surgeon', type: 'text', required: true },
            { key: 'assistantSurgeon', label: 'Assistant Surgeon', type: 'text' },
            { key: 'anesthesiologist', label: 'Anesthesiologist', type: 'text' },
            { key: 'procedure', label: 'Procedure', type: 'text', required: true },
            { key: 'scheduledDate', label: 'Scheduled Date', type: 'date', required: true },
            { key: 'scheduledTime', label: 'Scheduled Time', type: 'text', placeholder: '10:00 AM' },
            { key: 'estimatedDuration', label: 'Est. Duration (mins)', type: 'number' },
            {
              key: 'anesthesiaType', label: 'Anesthesia Type', type: 'select',
              options: ['General', 'Spinal', 'Epidural', 'Local', 'Regional', 'Sedation'],
            },
            {
              key: 'status', label: 'Status', type: 'select',
              options: ['Scheduled', 'Confirmed', 'In Progress', 'Completed', 'Postponed', 'Cancelled'],
            },
            { key: 'notes', label: 'Notes', type: 'textarea' },
          ]}
        />
      )}

      {tab === 'Shift Rosters' && (
        <CRUDModule
          title="Shift Rosters"
          collectionName="shiftRosters"
          singularLabel="Shift"
          columns={[
            { key: 'employeeName', label: 'Employee' },
            { key: 'department', label: 'Department' },
            { key: 'shiftDate', label: 'Date' },
            { key: 'shiftType', label: 'Shift' },
            { key: 'startTime', label: 'Start' },
            { key: 'endTime', label: 'End' },
            { key: 'status', label: 'Status', render: v => <StatusBadge value={v} /> },
          ]}
          fields={[
            { key: 'employeeId', label: 'Employee ID', type: 'text' },
            { key: 'employeeName', label: 'Employee Name', type: 'text', required: true },
            { key: 'department', label: 'Department', type: 'select', options: DEPARTMENTS },
            { key: 'role', label: 'Role / Designation', type: 'text' },
            { key: 'shiftDate', label: 'Shift Date', type: 'date', required: true },
            {
              key: 'shiftType', label: 'Shift Type', type: 'select', required: true,
              options: ['Morning', 'Afternoon', 'Night', 'Rotational', 'General', 'On-Call'],
            },
            { key: 'startTime', label: 'Start Time', type: 'text', placeholder: '07:00 AM' },
            { key: 'endTime', label: 'End Time', type: 'text', placeholder: '03:00 PM' },
            {
              key: 'status', label: 'Status', type: 'select',
              options: ['Scheduled', 'Present', 'Absent', 'Swapped', 'On Leave', 'Cancelled'],
            },
            { key: 'notes', label: 'Notes', type: 'textarea' },
          ]}
        />
      )}
    </div>
  );
}
