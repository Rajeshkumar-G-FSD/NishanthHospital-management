import { useState } from 'react';
import CRUDModule from '../components/CRUDModule';
import { StatusBadge } from '../components/CRUDModule';

const TABS = ['Inbox', 'Sent', 'Announcements'] as const;
type Tab = typeof TABS[number];

const CATEGORIES = ['General', 'Appointment', 'Lab Report', 'Billing', 'Emergency', 'HR', 'Admin', 'Other'];

export default function Messages() {
  const [tab, setTab] = useState<Tab>('Inbox');

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

      {tab === 'Inbox' && (
        <CRUDModule
          title="Inbox"
          collectionName="messagesInbox"
          singularLabel="Message"
          columns={[
            { key: 'subject', label: 'Subject' },
            { key: 'from', label: 'From' },
            { key: 'category', label: 'Category' },
            { key: 'date', label: 'Date' },
            { key: 'status', label: 'Status', render: v => <StatusBadge value={v} /> },
          ]}
          fields={[
            { key: 'subject', label: 'Subject', type: 'text', required: true },
            { key: 'from', label: 'From (Name / ID)', type: 'text', required: true },
            { key: 'fromEmail', label: 'Sender Email', type: 'email' },
            { key: 'to', label: 'To (Name / ID)', type: 'text', required: true },
            { key: 'date', label: 'Date', type: 'date', required: true },
            { key: 'category', label: 'Category', type: 'select', options: CATEGORIES },
            { key: 'message', label: 'Message Body', type: 'textarea', required: true },
            {
              key: 'status', label: 'Status', type: 'select',
              options: ['Unread', 'Read', 'Replied', 'Archived', 'Deleted'],
            },
          ]}
        />
      )}

      {tab === 'Sent' && (
        <CRUDModule
          title="Sent Messages"
          collectionName="messagesSent"
          singularLabel="Message"
          columns={[
            { key: 'subject', label: 'Subject' },
            { key: 'to', label: 'To' },
            { key: 'category', label: 'Category' },
            { key: 'date', label: 'Date' },
            { key: 'status', label: 'Status', render: v => <StatusBadge value={v} /> },
          ]}
          fields={[
            { key: 'subject', label: 'Subject', type: 'text', required: true },
            { key: 'to', label: 'To (Name / ID)', type: 'text', required: true },
            { key: 'toEmail', label: 'Recipient Email', type: 'email' },
            { key: 'date', label: 'Date Sent', type: 'date', required: true },
            { key: 'category', label: 'Category', type: 'select', options: CATEGORIES },
            { key: 'message', label: 'Message Body', type: 'textarea', required: true },
            {
              key: 'status', label: 'Status', type: 'select',
              options: ['Sent', 'Delivered', 'Read', 'Failed'],
            },
          ]}
        />
      )}

      {tab === 'Announcements' && (
        <CRUDModule
          title="Announcements"
          collectionName="announcements"
          singularLabel="Announcement"
          columns={[
            { key: 'title', label: 'Title' },
            { key: 'audience', label: 'Audience' },
            { key: 'priority', label: 'Priority' },
            { key: 'startDate', label: 'From' },
            { key: 'endDate', label: 'To' },
            { key: 'status', label: 'Status', render: v => <StatusBadge value={v} /> },
          ]}
          fields={[
            { key: 'title', label: 'Announcement Title', type: 'text', required: true },
            {
              key: 'audience', label: 'Target Audience', type: 'select',
              options: ['All Staff', 'Doctors', 'Nurses', 'Admin', 'Lab Staff', 'Pharmacy Staff', 'All Patients', 'Specific Department'],
            },
            { key: 'content', label: 'Announcement Content', type: 'textarea', required: true },
            { key: 'startDate', label: 'Start Date', type: 'date', required: true },
            { key: 'endDate', label: 'End Date', type: 'date' },
            {
              key: 'priority', label: 'Priority', type: 'select',
              options: ['Low', 'Normal', 'High', 'Urgent'],
            },
            {
              key: 'status', label: 'Status', type: 'select',
              options: ['Draft', 'Active', 'Expired', 'Cancelled'],
            },
          ]}
        />
      )}
    </div>
  );
}
