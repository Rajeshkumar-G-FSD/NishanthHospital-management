import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, Calendar, User, Phone, Heart, CheckCircle2, Sparkles,
  AlertCircle, MapPin, MessageSquare, Stethoscope, Award,
  ShieldAlert, Users, Video, ChevronLeft, ChevronRight
} from 'lucide-react';
import { BookingRequest } from '../types';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';

enum OperationType {
  CREATE = 'create', UPDATE = 'update', DELETE = 'delete',
  LIST = 'list', GET = 'get', WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null; email?: string | null; emailVerified?: boolean | null;
    isAnonymous?: boolean | null; tenantId?: string | null;
    providerInfo?: { providerId?: string | null; email?: string | null; }[];
  };
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid, email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified, isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(p => ({ providerId: p.providerId, email: p.email })) || []
    },
    operationType, path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedDoctor?: string;
}

const DEPARTMENTS = [
  'Gynaecology', 'Fertility Specialist', 'Consultant Anesthesiologist & Managing Director',
  'Urologist & Andrologist', 'Consultant Paediatrician & Neonatologist',
  'Consultant Obstetrician', 'Obstetrics & Gynecology', 'Consultant Fetal Medicine Specialist'
];

const DOCTORS = [
  'Dr. Sumathi Padmanaban', 'Dr. Sruthi Abhishant', 'Dr. Padmanaban',
  'Dr. Abhishant Padmanaban', 'Dr. Anbarasan', 'Dr. Sowbharnika C.P',
  'Dr. Kokilavani', 'Dr. Guha Preetha'
];

const DOCTOR_TO_DEPARTMENT: Record<string, string> = {
  'Dr. Sumathi Padmanaban': 'Gynaecology', 'Dr. Sruthi Abhishant': 'Fertility Specialist',
  'Dr. Padmanaban': 'Consultant Anesthesiologist & Managing Director',
  'Dr. Abhishant Padmanaban': 'Urologist & Andrologist',
  'Dr. Anbarasan': 'Consultant Paediatrician & Neonatologist',
  'Dr. Sowbharnika C.P': 'Consultant Obstetrician',
  'Dr. Kokilavani': 'Obstetrics & Gynecology', 'Dr. Guha Preetha': 'Consultant Fetal Medicine Specialist'
};

const GUARDIAN_PREFIXES = [
  { value: 'H/O', label: 'H/O (Husband of)' },
  { value: 'F/O', label: 'F/O (Father of)' },
  { value: 'Guardian of', label: 'Guardian of' }
];

const formatWhatsAppMessage = (data: BookingRequest) => {
  const text = `*New Appointment Request - Nishanth Hospital*
----------------------------------------
*Patient Name:* ${data.name}
*Relation:* ${data.guardianPrefix} ${data.guardianName}
*Consultation Type:* ${data.appointmentType || 'Physical'}
*Department:* ${data.department}
*Doctor:* ${data.doctor}
*Date:* ${data.date}
*Primary Contact:* ${data.contactNumber}
${data.secondaryContactNumber ? `*Secondary Contact:* ${data.secondaryContactNumber}` : ''}
*Address:* ${data.address}
${data.comments ? `*Patient Comments:* ${data.comments}` : ''}
----------------------------------------
_Stored securely in Hospital Records._`;
  return `https://wa.me/918072117912?text=${encodeURIComponent(text)}`;
};

/* ─── Shared input / select style ─── */
const fieldCls = "w-full px-3.5 py-2.5 rounded-xl text-sm font-medium outline-none transition-all";
const fieldStyle = { background: '#FAFAFA', border: '1.5px solid #D2D2D7', color: '#1D1D1F' } as React.CSSProperties;
const iconCls = "absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none";

export default function BookingModal({ isOpen, onClose, preselectedDoctor }: BookingModalProps) {
  const [formData, setFormData] = useState<BookingRequest>({
    name: '', contactNumber: '', secondaryContactNumber: '', guardianPrefix: 'H/O',
    guardianName: '', department: DEPARTMENTS[0], doctor: DOCTORS[0],
    date: '', address: '', comments: '', appointmentType: 'Physical',
  });

  React.useEffect(() => {
    if (isOpen) {
      if (preselectedDoctor && DOCTORS.includes(preselectedDoctor)) {
        setFormData(prev => ({
          ...prev, doctor: preselectedDoctor,
          department: DOCTOR_TO_DEPARTMENT[preselectedDoctor] || DEPARTMENTS[0]
        }));
      } else {
        setFormData(prev => ({ ...prev, doctor: DOCTORS[0], department: DEPARTMENTS[0] }));
      }
    }
  }, [isOpen, preselectedDoctor]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentDateView, setCurrentDateView] = useState(() => new Date(2026, 4, 1));
  const datepickerRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (datepickerRef.current && !datepickerRef.current.contains(e.target as Node)) setShowDatePicker(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const weekdays = ['Su','Mo','Tu','We','Th','Fr','Sa'];

  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y: number, m: number) => new Date(y, m, 1).getDay();

  const handlePrevMonth = () => setCurrentDateView(prev => { const d = new Date(prev); d.setMonth(prev.getMonth() - 1); return d; });
  const handleNextMonth = () => setCurrentDateView(prev => { const d = new Date(prev); d.setMonth(prev.getMonth() + 1); return d; });

  const handleSelectDate = (day: number) => {
    const y = currentDateView.getFullYear();
    const m = String(currentDateView.getMonth() + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    setFormData(prev => ({ ...prev, date: `${y}-${m}-${d}` }));
    setShowDatePicker(false);
  };

  const selectToday = () => {
    const t = new Date(2026, 4, 26);
    const y = t.getFullYear(); const m = String(t.getMonth() + 1).padStart(2, '0'); const d = String(t.getDate()).padStart(2, '0');
    setFormData(prev => ({ ...prev, date: `${y}-${m}-${d}` }));
    setCurrentDateView(new Date(y, t.getMonth(), 1)); setShowDatePicker(false);
  };

  const selectTomorrow = () => {
    const t = new Date(2026, 4, 26); t.setDate(t.getDate() + 1);
    const y = t.getFullYear(); const m = String(t.getMonth() + 1).padStart(2, '0'); const d = String(t.getDate()).padStart(2, '0');
    setFormData(prev => ({ ...prev, date: `${y}-${m}-${d}` }));
    setCurrentDateView(new Date(y, t.getMonth(), 1)); setShowDatePicker(false);
  };

  const isDateBeforeToday = (y: number, m: number, d: number) => {
    const today = new Date(2026, 4, 26); today.setHours(0, 0, 0, 0);
    return new Date(y, m, d) < today;
  };

  const isSelectedDate = (y: number, m: number, d: number) => {
    if (!formData.date) return false;
    const [fY, fM, fD] = formData.date.split('-').map(Number);
    return fY === y && fM === (m + 1) && fD === d;
  };

  const isTodayDate = (y: number, m: number, d: number) => {
    const t = new Date(2026, 4, 26);
    return t.getFullYear() === y && t.getMonth() === m && t.getDate() === d;
  };

  const formatDateBeautifully = (dateStr: string) => {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-');
    return new Date(Number(y), Number(m) - 1, Number(d)).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!formData.name.trim()) { setErrorMsg('Patient full name is required.'); return; }
    if (!formData.contactNumber.trim()) { setErrorMsg('Primary contact number is required.'); return; }
    if (!formData.guardianName.trim()) { setErrorMsg('Guardian / companion name is required.'); return; }
    if (!formData.date) { setErrorMsg('Please select a preferred appointment date.'); return; }
    if (!formData.address.trim()) { setErrorMsg('Residential address is required.'); return; }

    setIsSubmitting(true);
    const appointmentsRef = collection(db, 'appointments');
    const newDocRef = doc(appointmentsRef);

    const payload = {
      name: formData.name.trim(), contactNumber: formData.contactNumber.trim(),
      secondaryContactNumber: formData.secondaryContactNumber?.trim() || '',
      guardianPrefix: formData.guardianPrefix || 'H/O', guardianName: formData.guardianName.trim(),
      department: formData.department, doctor: formData.doctor, date: formData.date,
      address: formData.address.trim(), comments: formData.comments?.trim() || '',
      appointmentType: formData.appointmentType || 'Physical', createdAt: serverTimestamp()
    };

    setDoc(newDocRef, payload)
      .then(() => {
        setIsSubmitting(false); setIsSuccess(true);
        try {
          const d: BookingRequest = { ...formData, ...payload };
          window.open(formatWhatsAppMessage(d), '_blank');
        } catch (e) {
          console.warn('WhatsApp redirect blocked by browser.', e);
        }
      })
      .catch((error) => {
        setIsSubmitting(false);
        try { handleFirestoreError(error, OperationType.WRITE, `appointments/${newDocRef.id}`); }
        catch { setErrorMsg('Failed to submit. Please check connection and try again.'); }
      });
  };

  const resetForm = () => {
    setFormData({ name: '', contactNumber: '', secondaryContactNumber: '', guardianPrefix: 'H/O', guardianName: '', department: DEPARTMENTS[0], doctor: DOCTORS[0], date: '', address: '', comments: '', appointmentType: 'Physical' });
    setIsSuccess(false); setErrorMsg('');
  };

  /* ─── Label style ─── */
  const labelStyle = { fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: '#6E6E73', display: 'block', marginBottom: '6px' };

  /* ─── Section header ─── */
  const SectionHeader = ({ num, label }: { num: string; label: string }) => (
    <div className="flex items-center gap-2 pb-2" style={{ borderBottom: '1px solid #E5E5EA', marginBottom: '12px' }}>
      <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black text-white" style={{ background: '#DC2626' }}>{num}</span>
      <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6E6E73' }}>{label}</span>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
          id="booking-modal-overlay"
        >
          <div className="absolute inset-0 cursor-pointer" onClick={onClose} />

          <motion.div
            id="booking-modal-content"
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ type: 'spring', duration: 0.4, bounce: 0.08 }}
            className="relative w-full max-w-2xl rounded-3xl overflow-hidden my-auto z-10 flex flex-col"
            style={{
              background: '#FFFFFF',
              border: '1px solid #E5E5EA',
              boxShadow: '0 24px 80px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.08)',
              maxHeight: '92vh',
            }}
          >
            {/* Accent strip */}
            <div className="h-1 w-full shrink-0" style={{ background: 'linear-gradient(to right, #DC2626, #F59E0B, #16A34A)' }} />

            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full z-50 cursor-pointer transition-all duration-200"
              style={{ color: '#6E6E73', background: 'rgba(0,0,0,0.04)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(220,38,38,0.08)'; (e.currentTarget as HTMLButtonElement).style.color = '#DC2626'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,0,0,0.04)'; (e.currentTarget as HTMLButtonElement).style.color = '#6E6E73'; }}
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {!isSuccess ? (
              <form onSubmit={handleSubmit} className="flex flex-col min-h-0 h-full overflow-hidden">

                {/* Modal header */}
                <div className="p-5 sm:p-6 pr-14 shrink-0" style={{ borderBottom: '1px solid #F2F2F2' }}>
                  <div className="flex items-center gap-2 mb-1" style={{ color: '#DC2626', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    <Heart className="w-3.5 h-3.5" />
                    Nishanth Hospital Reservation
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ color: '#1D1D1F' }}>
                    Book Appointment
                  </h3>
                  <p className="text-xs mt-1" style={{ color: '#AEAEB2' }}>
                    Fill in patient details to secure your clinical slot with our specialists.
                  </p>
                </div>

                {/* Form fields */}
                <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">

                  {/* Error */}
                  {errorMsg && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-3 p-3.5 rounded-xl text-sm"
                      style={{ background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.15)', color: '#DC2626' }}
                    >
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span className="font-semibold">{errorMsg}</span>
                    </motion.div>
                  )}

                  {/* 1. Patient */}
                  <div>
                    <SectionHeader num="1" label="Patient & Companion Identity" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label style={labelStyle}>Patient Full Name *</label>
                        <div className="relative">
                          <User className={iconCls} style={{ color: '#AEAEB2' }} />
                          <input type="text" name="name" value={formData.name} onChange={handleInputChange}
                            placeholder="Enter patient full name"
                            className={`${fieldCls} pl-10`} style={fieldStyle} required id="input-name"
                          />
                        </div>
                      </div>
                      <div>
                        <label style={labelStyle}>Relation Prefix & Companion *</label>
                        <div className="flex gap-2">
                          <select name="guardianPrefix" value={formData.guardianPrefix} onChange={handleInputChange}
                            className="px-2 py-2.5 rounded-xl text-xs font-semibold cursor-pointer outline-none"
                            style={{ ...fieldStyle, minWidth: '80px' }} id="select-guardian-prefix"
                          >
                            {GUARDIAN_PREFIXES.map(p => <option key={p.value} value={p.value}>{p.value}</option>)}
                          </select>
                          <input type="text" name="guardianName" value={formData.guardianName} onChange={handleInputChange}
                            placeholder="Companion name" className={`${fieldCls} flex-1`} style={fieldStyle} required id="input-guardian-name"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2. Contact */}
                  <div>
                    <SectionHeader num="2" label="Contact Channels" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label style={labelStyle}>Primary Contact *</label>
                        <div className="relative">
                          <Phone className={iconCls} style={{ color: '#AEAEB2' }} />
                          <input type="tel" name="contactNumber" value={formData.contactNumber} onChange={handleInputChange}
                            placeholder="+91 98429 60060" className={`${fieldCls} pl-10`} style={fieldStyle} required id="input-contact"
                          />
                        </div>
                      </div>
                      <div>
                        <label style={labelStyle}>Secondary Contact</label>
                        <div className="relative">
                          <Phone className={iconCls} style={{ color: '#AEAEB2' }} />
                          <input type="tel" name="secondaryContactNumber" value={formData.secondaryContactNumber} onChange={handleInputChange}
                            placeholder="+91 94875 66960" className={`${fieldCls} pl-10`} style={fieldStyle} id="input-sec-contact"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3. Department & Doctor */}
                  <div>
                    <SectionHeader num="3" label="Department & Doctor" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label style={labelStyle}>Department *</label>
                        <div className="relative">
                          <Stethoscope className={iconCls} style={{ color: '#AEAEB2' }} />
                          <select name="department" value={formData.department} onChange={handleInputChange}
                            className={`${fieldCls} pl-10 cursor-pointer`} style={fieldStyle} id="select-department"
                          >
                            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label style={labelStyle}>Consultant Doctor *</label>
                        <div className="relative">
                          <Users className={iconCls} style={{ color: '#AEAEB2' }} />
                          <select name="doctor" value={formData.doctor} onChange={handleInputChange}
                            className={`${fieldCls} pl-10 cursor-pointer`} style={fieldStyle} id="select-doctor"
                          >
                            {DOCTORS.map(d => <option key={d} value={d}>{d}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 4. Scheduling */}
                  <div>
                    <SectionHeader num="4" label="Scheduling & Location" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                      {/* Date picker */}
                      <div className="relative" ref={datepickerRef}>
                        <label style={labelStyle} onClick={() => setShowDatePicker(!showDatePicker)} className="cursor-pointer">
                          Appointment Date *
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowDatePicker(!showDatePicker)}
                          className="relative w-full pl-10 pr-4 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between cursor-pointer transition-all min-h-[44px]"
                          style={{ ...fieldStyle, textAlign: 'left' }}
                          id="custom-date-trigger"
                        >
                          <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: '#AEAEB2' }} />
                          <span style={{ color: formData.date ? '#1D1D1F' : '#AEAEB2' }}>
                            {formData.date ? formatDateBeautifully(formData.date) : 'Select appointment date'}
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md" style={{ background: '#F5F5F7', color: '#6E6E73', border: '1px solid #E5E5EA' }}>
                            Pick
                          </span>
                        </button>

                        <AnimatePresence>
                          {showDatePicker && (
                            <motion.div
                              initial={{ opacity: 0, y: 8, scale: 0.97 }}
                              animate={{ opacity: 1, y: 4, scale: 1 }}
                              exit={{ opacity: 0, y: 8, scale: 0.97 }}
                              className="absolute left-0 w-full max-w-sm z-50 select-none"
                              style={{ background: '#FFFFFF', border: '1.5px solid #D2D2D7', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', padding: '16px' }}
                              id="custom-datepicker-dropdown"
                            >
                              {/* Quick picks */}
                              <div className="flex gap-2 pb-3 border-b mb-3" style={{ borderColor: '#F2F2F2' }}>
                                <button type="button" onClick={selectToday} className="px-3 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-all"
                                  style={{ background: 'rgba(220,38,38,0.08)', color: '#DC2626', border: '1px solid rgba(220,38,38,0.15)' }}>
                                  Today (May 26)
                                </button>
                                <button type="button" onClick={selectTomorrow} className="px-3 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-all"
                                  style={{ background: 'rgba(245,158,11,0.08)', color: '#D97706', border: '1px solid rgba(245,158,11,0.15)' }}>
                                  Tomorrow
                                </button>
                              </div>

                              {/* Month nav */}
                              <div className="flex items-center justify-between mb-3">
                                <span className="text-sm font-bold" style={{ color: '#1D1D1F' }}>
                                  {months[currentDateView.getMonth()]} {currentDateView.getFullYear()}
                                </span>
                                <div className="flex gap-1">
                                  <button type="button" onClick={handlePrevMonth} className="p-1.5 rounded-lg cursor-pointer transition-all" style={{ color: '#6E6E73' }}
                                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#F5F5F7'; }} onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}>
                                    <ChevronLeft className="w-4 h-4" />
                                  </button>
                                  <button type="button" onClick={handleNextMonth} className="p-1.5 rounded-lg cursor-pointer transition-all" style={{ color: '#6E6E73' }}
                                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#F5F5F7'; }} onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}>
                                    <ChevronRight className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>

                              {/* Weekday headers */}
                              <div className="grid grid-cols-7 gap-1 text-center mb-1">
                                {weekdays.map(w => <div key={w} style={{ fontSize: '10px', fontWeight: 800, color: '#AEAEB2', letterSpacing: '0.05em' }}>{w}</div>)}
                              </div>

                              {/* Days */}
                              <div className="grid grid-cols-7 gap-1 text-center">
                                {Array.from({ length: getFirstDayOfMonth(currentDateView.getFullYear(), currentDateView.getMonth()) }).map((_, i) => <div key={`e-${i}`} className="w-8 h-8" />)}
                                {Array.from({ length: getDaysInMonth(currentDateView.getFullYear(), currentDateView.getMonth()) }).map((_, i) => {
                                  const day = i + 1;
                                  const y = currentDateView.getFullYear(); const m = currentDateView.getMonth();
                                  const disabled = isDateBeforeToday(y, m, day);
                                  const selected = isSelectedDate(y, m, day);
                                  const today = isTodayDate(y, m, day);
                                  return (
                                    <button
                                      type="button"
                                      key={`d-${day}`}
                                      disabled={disabled}
                                      onClick={() => handleSelectDate(day)}
                                      className="w-8 h-8 rounded-full text-xs font-semibold flex items-center justify-center transition-all"
                                      style={{
                                        background: selected ? '#DC2626' : 'transparent',
                                        color: disabled ? '#D2D2D7' : selected ? '#FFFFFF' : today ? '#DC2626' : '#1D1D1F',
                                        border: today && !selected ? '1.5px solid #DC2626' : 'none',
                                        cursor: disabled ? 'not-allowed' : 'pointer',
                                        opacity: disabled ? 0.4 : 1,
                                      }}
                                    >
                                      {day}
                                    </button>
                                  );
                                })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Appointment type */}
                      <div>
                        <label style={labelStyle}>Appointment Type *</label>
                        <div className="relative">
                          <Video className={iconCls} style={{ color: '#AEAEB2' }} />
                          <select name="appointmentType" value={formData.appointmentType || 'Physical'} onChange={handleInputChange}
                            className={`${fieldCls} pl-10 cursor-pointer`} style={fieldStyle} id="select-appointment-type"
                          >
                            <option value="Physical">Physical Appointment (At Hospital)</option>
                            <option value="Virtual">Virtual Appointment (Online Consult)</option>
                          </select>
                        </div>
                      </div>

                      {/* Address */}
                      <div className="sm:col-span-2">
                        <label style={labelStyle}>Residential Address *</label>
                        <div className="relative">
                          <MapPin className={iconCls} style={{ color: '#AEAEB2' }} />
                          <input type="text" name="address" value={formData.address} onChange={handleInputChange}
                            placeholder="Enter home / clinic correspondence address"
                            className={`${fieldCls} pl-10`} style={fieldStyle} required id="input-address"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Comments */}
                    <div className="mt-4">
                      <label style={labelStyle}>Health Concerns &amp; Notes</label>
                      <div className="relative">
                        <MessageSquare className="absolute left-3.5 top-3.5 w-4 h-4" style={{ color: '#AEAEB2' }} />
                        <textarea name="comments" value={formData.comments} onChange={handleInputChange}
                          placeholder="Briefly share any chronic history, ongoing issues, or specific requests…"
                          rows={3}
                          className={`${fieldCls} pl-10 resize-none`} style={fieldStyle} id="input-comments"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit bar */}
                <div className="p-4 sm:p-5 shrink-0 flex flex-col sm:flex-row gap-4 items-center justify-between" style={{ borderTop: '1px solid #F2F2F2', background: '#FAFAFA' }}>
                  <span className="flex items-center gap-2 text-xs" style={{ color: '#AEAEB2' }}>
                    <Award className="w-4 h-4 shrink-0" style={{ color: '#F59E0B' }} />
                    Secure Neonatal ICU &amp; Specialised Care
                  </span>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-semibold text-sm text-white cursor-pointer transition-all min-w-[200px]"
                    style={{ background: '#DC2626', boxShadow: '0 2px 12px rgba(220,38,38,0.25)' }}
                    id="submit-booking-btn"
                  >
                    {isSubmitting ? (
                      <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    ) : (
                      <>
                        <span>Request Appointment Slot</span>
                        <Sparkles className="w-3.5 h-3.5" />
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            ) : (
              /* Success state */
              <motion.div
                id="booking-success-message"
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 sm:p-8 text-center space-y-6 flex-1 overflow-y-auto"
              >
                {/* Check icon */}
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full" style={{ background: 'rgba(22,163,74,0.1)', border: '1px solid rgba(22,163,74,0.2)' }}>
                  <CheckCircle2 className="w-8 h-8" style={{ color: '#16A34A' }} />
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: '#1D1D1F' }}>
                    Appointment Requested, {formData.name.split(' ')[0]}!
                  </h4>
                  <p className="text-sm max-w-sm mx-auto" style={{ color: '#6E6E73' }}>
                    A confirmation summary will be sent to:{' '}
                    <span className="font-semibold" style={{ color: '#16A34A' }}>{formData.contactNumber}</span>
                  </p>
                </div>

                {/* Ticket */}
                <div className="max-w-md mx-auto rounded-2xl overflow-hidden text-left shadow-sm" style={{ background: '#FAFAFA', border: '1px solid #E5E5EA' }}>
                  {/* Ticket header */}
                  <div className="absolute top-3 right-4 font-mono text-[9px]" style={{ color: '#AEAEB2' }}>
                    NISHANTH-ID: {Math.floor(Math.random() * 89999) + 10000}
                  </div>

                  <div className="p-4 flex items-center gap-2" style={{ background: 'rgba(220,38,38,0.05)', borderBottom: '1px solid rgba(220,38,38,0.1)' }}>
                    <Sparkles className="w-4 h-4 shrink-0" style={{ color: '#DC2626' }} />
                    <span className="text-[11px] font-black uppercase tracking-wider" style={{ color: '#1D1D1F' }}>Clinical Intake Ticket</span>
                  </div>

                  <div className="p-4 space-y-3 text-xs">
                    {[
                      { label: 'Patient', value: formData.name, bold: true },
                      { label: formData.guardianPrefix, value: formData.guardianName },
                      { label: 'Specialty', value: formData.department, color: '#DC2626' },
                      { label: 'Doctor', value: formData.doctor, bold: true },
                    ].map(row => (
                      <div key={row.label} className="flex justify-between items-center py-1.5" style={{ borderBottom: '1px solid #F2F2F2' }}>
                        <span className="font-semibold uppercase tracking-wide" style={{ fontSize: '9px', color: '#AEAEB2' }}>{row.label}</span>
                        <span className={row.bold ? 'font-bold' : 'font-medium'} style={{ color: row.color || '#1D1D1F' }}>{row.value}</span>
                      </div>
                    ))}
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div>
                        <span className="block font-semibold uppercase tracking-wide mb-0.5" style={{ fontSize: '9px', color: '#AEAEB2' }}>Appt Date</span>
                        <span className="font-bold font-mono" style={{ color: '#1D1D1F', fontSize: '13px' }}>{formData.date}</span>
                      </div>
                      <div>
                        <span className="block font-semibold uppercase tracking-wide mb-0.5" style={{ fontSize: '9px', color: '#AEAEB2' }}>Address</span>
                        <span className="font-medium truncate block" style={{ color: '#6E6E73' }}>{formData.address}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 flex justify-between items-center text-[10px]" style={{ background: '#F5F5F7', borderTop: '1px solid #E5E5EA' }}>
                    <span className="font-bold" style={{ color: '#16A34A' }}>● Priority Status: Active</span>
                    <span style={{ color: '#AEAEB2' }}>Erode, Tamil Nadu</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3 max-w-md mx-auto w-full pt-2">
                  <a
                    href={formatWhatsAppMessage(formData)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 cursor-pointer transition-all"
                    style={{ background: '#25D366', boxShadow: '0 2px 12px rgba(37,211,102,0.25)' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#1DB954'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#25D366'; }}
                    id="whatsapp-forward-btn"
                  >
                    <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                      <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 001.332 4.977L2 22l5.176-1.355a9.932 9.932 0 004.83 1.258h.005c5.507 0 9.99-4.478 9.99-9.984A9.99 9.99 0 0012.012 2zm6.915 14.153c-.285.803-1.424 1.48-1.956 1.579-.47.087-1.085.127-1.742-.084a14.28 14.28 0 01-5.787-3.79c-1.385-1.383-2.316-3.08-2.585-3.553-.27-.474-.029-.731.21-.971.215-.215.474-.553.71-.829.237-.277.316-.475.474-.79.158-.316.08-.593-.04-.83s-1.077-2.585-1.472-3.535c-.386-.926-.774-.803-1.077-.818a16.89 16.89 0 00-1.22-.016c-.435 0-1.144.163-1.742.818-.596.654-2.277 2.222-2.277 5.418s2.327 6.275 2.651 6.702c.324.428 4.582 6.993 11.102 9.81 1.551.67 2.762 1.07 3.708 1.368 1.558.496 2.977.426 4.097.259 1.25-.187 2.854-1.168 3.255-2.243.402-1.074.402-1.996.28-2.194-.12-.198-.44-.316-.925-.553z"/>
                    </svg>
                    Send to WhatsApp
                  </a>

                  <div className="flex gap-3">
                    <button onClick={onClose}
                      className="flex-1 py-3 rounded-xl font-semibold text-sm cursor-pointer transition-all"
                      style={{ background: '#FFFFFF', border: '1.5px solid #D2D2D7', color: '#6E6E73' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#DC2626'; (e.currentTarget as HTMLButtonElement).style.color = '#DC2626'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#D2D2D7'; (e.currentTarget as HTMLButtonElement).style.color = '#6E6E73'; }}
                      id="success-close-btn"
                    >
                      Close
                    </button>
                    <button onClick={resetForm}
                      className="flex-1 py-3 rounded-xl font-semibold text-sm text-white cursor-pointer transition-all"
                      style={{ background: '#1D1D1F' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#2C2C2E'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#1D1D1F'; }}
                      id="success-rebook-btn"
                    >
                      Book Another
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
