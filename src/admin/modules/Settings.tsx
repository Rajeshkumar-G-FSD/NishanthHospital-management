import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Save, RefreshCw } from 'lucide-react';
import { db } from '../../firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

interface SettingsData {
  hospitalName: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  logo: string;
  registrationNo: string;
  workingHours: string;
  emergencyNumber: string;
  smsApiKey: string;
  smsSenderId: string;
  emailSmtp: string;
  emailPort: string;
  emailUser: string;
  razorpayKeyId: string;
  currency: string;
  timezone: string;
  dateFormat: string;
}

const DEFAULT: SettingsData = {
  hospitalName: 'Nishanth Hospital',
  tagline: "Erode's Premier Women & Child Care Centre",
  address: '279, EVN Rd, Erode, Tamil Nadu 638009',
  phone: '+91 98429 60060',
  email: 'Nishanthhospitalerode@gmail.com',
  website: 'https://nishanthhospital.com',
  logo: 'https://i.postimg.cc/d1Mjps1w/Nishanth-logo.avif',
  registrationNo: '',
  workingHours: 'Mon–Sat: 8:00 AM – 8:00 PM | Emergency: 24×7',
  emergencyNumber: '+91 98429 60060',
  smsApiKey: '',
  smsSenderId: '',
  emailSmtp: '',
  emailPort: '587',
  emailUser: '',
  razorpayKeyId: '',
  currency: 'INR',
  timezone: 'Asia/Kolkata',
  dateFormat: 'DD/MM/YYYY',
};

const SECTIONS = [
  {
    title: 'Hospital Information',
    fields: [
      { key: 'hospitalName', label: 'Hospital Name' },
      { key: 'tagline', label: 'Tagline' },
      { key: 'registrationNo', label: 'Registration Number' },
      { key: 'address', label: 'Address' },
      { key: 'phone', label: 'Phone Number' },
      { key: 'email', label: 'Email' },
      { key: 'website', label: 'Website URL' },
      { key: 'logo', label: 'Logo URL' },
      { key: 'workingHours', label: 'Working Hours' },
      { key: 'emergencyNumber', label: 'Emergency Number' },
    ],
  },
  {
    title: 'SMS Configuration',
    fields: [
      { key: 'smsApiKey', label: 'SMS API Key' },
      { key: 'smsSenderId', label: 'SMS Sender ID' },
    ],
  },
  {
    title: 'Email Configuration',
    fields: [
      { key: 'emailSmtp', label: 'SMTP Host' },
      { key: 'emailPort', label: 'SMTP Port' },
      { key: 'emailUser', label: 'SMTP Username' },
    ],
  },
  {
    title: 'Payment Gateway',
    fields: [
      { key: 'razorpayKeyId', label: 'Razorpay Key ID' },
      { key: 'currency', label: 'Currency Code' },
    ],
  },
  {
    title: 'System Preferences',
    fields: [
      { key: 'timezone', label: 'Timezone' },
      { key: 'dateFormat', label: 'Date Format' },
    ],
  },
];

export default function Settings() {
  const [data, setData] = useState<SettingsData>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const snap = await getDoc(doc(db, 'settings', 'hospitalInfo'));
        if (snap.exists()) setData({ ...DEFAULT, ...(snap.data() as SettingsData) });
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      await setDoc(doc(db, 'settings', 'hospitalInfo'), { ...data, updatedAt: serverTimestamp() }, { merge: true });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e: any) {
      setError(e.message ?? 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
        <RefreshCw className="w-4 h-4 animate-spin mr-2" /> Loading settings…
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-rose-500" />
          <h2 className="text-xl font-bold text-gray-900">Settings</h2>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-1.5 bg-rose-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-rose-700 disabled:opacity-50 transition-colors"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving…' : saved ? 'Saved!' : 'Save Settings'}
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{error}</div>
      )}
      {saved && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">Settings saved successfully.</div>
      )}

      {SECTIONS.map(section => (
        <div key={section.title} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50/50">
            <h3 className="text-sm font-semibold text-gray-700">{section.title}</h3>
          </div>
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {section.fields.map(f => (
              <div key={f.key}>
                <label className="block text-xs font-medium text-gray-600 mb-1">{f.label}</label>
                <input
                  type="text"
                  value={data[f.key as keyof SettingsData]}
                  onChange={e => setData(p => ({ ...p, [f.key]: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
