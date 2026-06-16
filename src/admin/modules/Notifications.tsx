import CRUDModule from '../components/CRUDModule';
import { StatusBadge } from '../components/CRUDModule';

export default function Notifications() {
  return (
    <CRUDModule
      title="Notifications"
      collectionName="notifications"
      singularLabel="Notification"
      columns={[
        { key: 'title', label: 'Title' },
        { key: 'channel', label: 'Channel' },
        { key: 'recipient', label: 'Recipient' },
        { key: 'type', label: 'Type' },
        { key: 'status', label: 'Status', render: v => <StatusBadge value={v} /> },
      ]}
      fields={[
        { key: 'title', label: 'Notification Title', type: 'text', required: true },
        { key: 'message', label: 'Message', type: 'textarea', required: true },
        { key: 'channel', label: 'Channel', type: 'select', options: ['SMS', 'Email', 'WhatsApp', 'Push Notification', 'In-App'] },
        { key: 'type', label: 'Notification Type', type: 'select', options: ['Appointment Reminder', 'Bill Due', 'Lab Report Ready', 'Discharge Summary', 'Follow-up', 'Promotion', 'Emergency Alert', 'General'] },
        { key: 'recipient', label: 'Recipient (Patient ID / Group)', type: 'text', required: true },
        { key: 'recipientPhone', label: 'Recipient Phone', type: 'tel' },
        { key: 'recipientEmail', label: 'Recipient Email', type: 'email' },
        { key: 'scheduledAt', label: 'Scheduled At', type: 'date' },
        { key: 'status', label: 'Status', type: 'select', options: ['Draft', 'Scheduled', 'Sent', 'Failed', 'Cancelled'] },
      ]}
    />
  );
}
