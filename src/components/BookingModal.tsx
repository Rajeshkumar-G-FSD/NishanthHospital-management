import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Calendar, 
  User, 
  Phone, 
  Heart, 
  CheckCircle2, 
  Sparkles, 
  AlertCircle, 
  MapPin, 
  MessageSquare, 
  Stethoscope, 
  Award,
  ShieldAlert,
  Sliders,
  Users,
  Video,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { BookingRequest } from '../types';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
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
  'Gynaecology',
  'Fertility Specialist',
  'Consultant Anesthesiologist & Managing Director',
  'Urologist & Andrologist',
  'Consultant Paediatrician & Neonatologist',
  'Consultant Obstetrician',
  'Obstetrics & Gynecology',
  'Consultant Fetal Medicine Specialist'
];

const DOCTORS = [
  'Dr. Sumathi Padmanaban',
  'Dr. Sruthi Abhishant',
  'Dr. Padmanaban',
  'Dr. Abhishant Padmanaban',
  'Dr. Anbarasan',
  'Dr. Sowbharnika C.P',
  'Dr. Kokilavani',
  'Dr. Guha Preetha'
];

const DOCTOR_TO_DEPARTMENT: Record<string, string> = {
  'Dr. Sumathi Padmanaban': 'Gynaecology',
  'Dr. Sruthi Abhishant': 'Fertility Specialist',
  'Dr. Padmanaban': 'Consultant Anesthesiologist & Managing Director',
  'Dr. Abhishant Padmanaban': 'Urologist & Andrologist',
  'Dr. Anbarasan': 'Consultant Paediatrician & Neonatologist',
  'Dr. Sowbharnika C.P': 'Consultant Obstetrician',
  'Dr. Kokilavani': 'Obstetrics & Gynecology',
  'Dr. Guha Preetha': 'Consultant Fetal Medicine Specialist'
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

export default function BookingModal({ isOpen, onClose, preselectedDoctor }: BookingModalProps) {
  const [formData, setFormData] = useState<BookingRequest>({
    name: '',
    contactNumber: '',
    secondaryContactNumber: '',
    guardianPrefix: 'H/O',
    guardianName: '',
    department: DEPARTMENTS[0],
    doctor: DOCTORS[0],
    date: '',
    address: '',
    comments: '',
    appointmentType: 'Physical',
  });

  // Sync form data when preselectedDoctor changes or modal opens
  React.useEffect(() => {
    if (isOpen) {
      if (preselectedDoctor && DOCTORS.includes(preselectedDoctor)) {
        const correspondingDept = DOCTOR_TO_DEPARTMENT[preselectedDoctor] || DEPARTMENTS[0];
        setFormData(prev => ({
          ...prev,
          doctor: preselectedDoctor,
          department: correspondingDept
        }));
      } else {
        // Default reset when no preselection
        setFormData(prev => ({
          ...prev,
          doctor: DOCTORS[0],
          department: DEPARTMENTS[0]
        }));
      }
    }
  }, [isOpen, preselectedDoctor]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Custom premium React Calendar Datepicker state & helpers
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentDateView, setCurrentDateView] = useState(() => {
    // Current date (May 2026 based on metadata)
    return new Date(2026, 4, 1); // Start with May 2026
  });

  const datepickerRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (datepickerRef.current && !datepickerRef.current.contains(event.target as Node)) {
        setShowDatePicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentDateView(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setCurrentDateView(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  const handleSelectDate = (day: number) => {
    const y = currentDateView.getFullYear();
    const m = String(currentDateView.getMonth() + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    const formattedDate = `${y}-${m}-${d}`;
    setFormData(prev => ({
      ...prev,
      date: formattedDate
    }));
    setShowDatePicker(false);
  };

  const selectToday = () => {
    const exactToday = new Date(2026, 4, 26); // May 26, 2026 is today
    const y = exactToday.getFullYear();
    const m = String(exactToday.getMonth() + 1).padStart(2, '0');
    const d = String(exactToday.getDate()).padStart(2, '0');
    setFormData(prev => ({ ...prev, date: `${y}-${m}-${d}` }));
    setCurrentDateView(new Date(y, exactToday.getMonth(), 1));
    setShowDatePicker(false);
  };

  const selectTomorrow = () => {
    const tomorrow = new Date(2026, 4, 26);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const y = tomorrow.getFullYear();
    const m = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const d = String(tomorrow.getDate()).padStart(2, '0');
    setFormData(prev => ({ ...prev, date: `${y}-${m}-${d}` }));
    setCurrentDateView(new Date(y, tomorrow.getMonth(), 1));
    setShowDatePicker(false);
  };

  const isDateBeforeToday = (year: number, month: number, day: number) => {
    const today = new Date(2026, 4, 26); // May 26, 2026
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(year, month, day);
    return compareDate < today;
  };

  const isSelectedDate = (year: number, month: number, day: number) => {
    if (!formData.date) return false;
    const [fYear, fMonth, fDay] = formData.date.split('-').map(Number);
    return fYear === year && fMonth === (month + 1) && fDay === day;
  };

  const isTodayDate = (year: number, month: number, day: number) => {
    const today = new Date(2026, 4, 26);
    return today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
  };

  const formatDateBeautifully = (dateStr: string) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split('-');
    const dateObj = new Date(Number(year), Number(month) - 1, Number(day));
    return dateObj.toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Form Validations
    if (!formData.name.trim()) {
      setErrorMsg('Patient full name is required.');
      return;
    }
    if (!formData.contactNumber.trim()) {
      setErrorMsg('Primary contact number is required.');
      return;
    }
    if (!formData.guardianName.trim()) {
      setErrorMsg('Guardian or H/O, F/O companion name is required.');
      return;
    }
    if (!formData.date) {
      setErrorMsg('Please select a preferred appointment date.');
      return;
    }
    if (!formData.address.trim()) {
      setErrorMsg('Patient residential address is required.');
      return;
    }

    setIsSubmitting(true);
    
    // Create new appointment reference and save to Firestore securely
    const appointmentsRef = collection(db, 'appointments');
    const newDocRef = doc(appointmentsRef);
    
    const payload = {
      name: formData.name.trim(),
      contactNumber: formData.contactNumber.trim(),
      secondaryContactNumber: formData.secondaryContactNumber?.trim() || '',
      guardianPrefix: formData.guardianPrefix || 'H/O',
      guardianName: formData.guardianName.trim(),
      department: formData.department,
      doctor: formData.doctor,
      date: formData.date,
      address: formData.address.trim(),
      comments: formData.comments?.trim() || '',
      appointmentType: formData.appointmentType || 'Physical',
      createdAt: serverTimestamp()
    };

    setDoc(newDocRef, payload)
      .then(() => {
        setIsSubmitting(false);
        setIsSuccess(true);
        try {
          const currentDataState: BookingRequest = {
            ...formData,
            name: payload.name,
            contactNumber: payload.contactNumber,
            secondaryContactNumber: payload.secondaryContactNumber,
            guardianPrefix: payload.guardianPrefix,
            guardianName: payload.guardianName,
            department: payload.department,
            doctor: payload.doctor,
            date: payload.date,
            address: payload.address,
            comments: payload.comments,
            appointmentType: payload.appointmentType
          };
          const whatsappUrl = formatWhatsAppMessage(currentDataState);
          window.open(whatsappUrl, '_blank');
        } catch (e) {
          console.warn('Automatic redirect to WhatsApp was blocked by standard browser policies inside sandbox preview. User can click the prominent Green Action Card CTA to manually forward.', e);
        }
      })
      .catch((error) => {
        setIsSubmitting(false);
        try {
          handleFirestoreError(error, OperationType.WRITE, `appointments/${newDocRef.id}`);
        } catch (wrappedErr: any) {
          setErrorMsg('Failed to submit appointment reservation to Firebase. Please check connection and try again.');
        }
      });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      contactNumber: '',
      secondaryContactNumber: '',
      guardianPrefix: 'H/O',
      guardianName: '',
      department: DEPARTMENTS[0],
      doctor: DOCTORS[0],
      date: '',
      address: '',
      comments: '',
      appointmentType: 'Physical',
    });
    setIsSuccess(false);
    setErrorMsg('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-lg overflow-y-auto" id="booking-modal-overlay">
          {/* Backdrop cancel action */}
          <div className="absolute inset-0 cursor-pointer" onClick={onClose} />

          <motion.div
            id="booking-modal-content"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.1 }}
            className="relative w-full max-w-2xl bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden my-auto z-10 flex flex-col max-h-[92vh] sm:max-h-[85vh]"
          >
            {/* Elegant premium accent gradient border strip */}
            <div className="h-1.5 w-full bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-400 shrink-0" />

            {/* Close Button Trigger styled with smooth pointer glow */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-300 cursor-pointer z-50"
              aria-label="Close modal"
              id="modal-close-btn"
            >
              <X className="w-5 h-5" />
            </button>

            {!isSuccess ? (
              <form 
                onSubmit={handleSubmit} 
                className="flex flex-col min-h-0 h-full overflow-hidden" 
                id="consultation-booking-form"
              >
                
                {/* Header branding info */}
                <div className="p-5 sm:p-6 space-y-1 pr-12 shrink-0 border-b border-white/5 bg-slate-900">
                  <div className="flex items-center space-x-2 text-rose-400 font-sans text-[10px] sm:text-xs font-bold uppercase tracking-widest">
                    <Heart className="w-3.5 h-3.5 fill-rose-400/10" />
                    <span>Nishanth Hospital Reservation Portal</span>
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-tight">
                    Book Consult Appointment
                  </h3>
                  <p className="text-slate-400 text-[10px] sm:text-xs font-sans font-medium">
                    Enter patient details below to secure clinical slots with our specialists.
                  </p>
                </div>

                {/* Main Form Fields Layout (Scrollable) */}
                <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                  {errorMsg && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center space-x-2.5 text-xs text-rose-300 bg-rose-500/10 p-3 rounded-xl border border-rose-500/20"
                    >
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      <span className="font-sans font-semibold">{errorMsg}</span>
                    </motion.div>
                  )}

                  {/* Section 1: Patient Basic Info */}
                  <div className="space-y-4">
                    <div className="text-[10px] font-bold text-slate-500 tracking-wider uppercase border-b border-white/5 pb-1">
                      1. Patient & Companion Identity
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name of patient */}
                      <div>
                        <label className="block text-[11px] font-sans font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                          Patient Full Name *
                        </label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Enter patient full name"
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-white/5 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10 text-white text-xs sm:text-sm font-sans font-medium outline-hidden transition-all"
                            required
                            id="input-name"
                          />
                        </div>
                      </div>

                      {/* Guardian Name Prefix & input */}
                      <div>
                        <label className="block text-[11px] font-sans font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                          Relationship Prefix & Companion Name *
                        </label>
                        <div className="flex gap-2">
                          {/* Prefix select */}
                          <select
                            name="guardianPrefix"
                            value={formData.guardianPrefix}
                            onChange={handleInputChange}
                            className="px-2 rounded-xl bg-slate-950 border border-white/5 focus:border-rose-500 text-slate-300 text-xs font-sans font-semibold outline-hidden cursor-pointer"
                            id="select-guardian-prefix"
                          >
                            {GUARDIAN_PREFIXES.map(pref => (
                              <option key={pref.value} value={pref.value}>
                                {pref.value}
                              </option>
                            ))}
                          </select>
                          {/* Input field */}
                          <div className="relative grow">
                            <input
                              type="text"
                              name="guardianName"
                              value={formData.guardianName}
                              onChange={handleInputChange}
                              placeholder="Name of companion"
                              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-white/5 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10 text-white text-xs sm:text-sm font-sans font-medium outline-hidden transition-all"
                              required
                              id="input-guardian-name"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Contact Options */}
                  <div className="space-y-4 pt-1">
                    <div className="text-[10px] font-bold text-slate-500 tracking-wider uppercase border-b border-white/5 pb-1">
                      2. Contact Channels
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Primary Contact phone */}
                      <div>
                        <label className="block text-[11px] font-sans font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                          Primary Contact Number *
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                          <input
                            type="tel"
                            name="contactNumber"
                            value={formData.contactNumber}
                            onChange={handleInputChange}
                            placeholder="e.g. +91 98429 60060"
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-white/5 focus:border-rose-500 text-white text-xs sm:text-sm font-sans font-medium outline-hidden transition-all"
                            required
                            id="input-contact"
                          />
                        </div>
                      </div>

                      {/* Secondary Contact number */}
                      <div>
                        <label className="block text-[11px] font-sans font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                          Secondary Contact Number
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                          <input
                            type="tel"
                            name="secondaryContactNumber"
                            value={formData.secondaryContactNumber}
                            onChange={handleInputChange}
                            placeholder="e.g. +91 94875 66960"
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-white/5 focus:border-rose-500 text-white text-xs sm:text-sm font-sans font-medium outline-hidden transition-all"
                            id="input-sec-contact"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Clinical Specialization & Doctor Selection */}
                  <div className="space-y-4 pt-1">
                    <div className="text-[10px] font-bold text-slate-500 tracking-wider uppercase border-b border-white/5 pb-1">
                      3. Specialty Department & Doctor
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Department Select dropdown */}
                      <div>
                        <label className="block text-[11px] font-sans font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                          Select Department *
                        </label>
                        <div className="relative">
                          <Stethoscope className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                          <select
                            name="department"
                            value={formData.department}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-white/5 focus:border-rose-500 text-white text-xs sm:text-sm font-sans font-semibold outline-hidden cursor-pointer"
                            id="select-department"
                          >
                            {DEPARTMENTS.map(dept => (
                              <option key={dept} value={dept}>
                                {dept}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Doctor Names drop-down option */}
                      <div>
                        <label className="block text-[11px] font-sans font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                          Select Consultant Doctor *
                        </label>
                        <div className="relative">
                          <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                          <select
                            name="doctor"
                            value={formData.doctor}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-white/5 focus:border-rose-500 text-white text-xs sm:text-sm font-sans font-semibold outline-hidden cursor-pointer"
                            id="select-doctor"
                          >
                            {DOCTORS.map(doc => (
                              <option key={doc} value={doc}>
                                {doc}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 4: Date, address and comments */}
                  <div className="space-y-4 pt-1">
                    <div className="text-[10px] font-bold text-slate-500 tracking-wider uppercase border-b border-white/5 pb-1">
                      4. Scheduling & Location
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Datepicker */}
                      <div className="relative" ref={datepickerRef}>
                        <label 
                          onClick={() => setShowDatePicker(!showDatePicker)}
                          className="block text-[11px] font-sans font-bold text-slate-400 uppercase tracking-widest mb-1.5 cursor-pointer hover:text-rose-400 transition-colors"
                        >
                          Appointment Date *
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowDatePicker(!showDatePicker)}
                          className="relative w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-white/5 focus:border-rose-500 text-left text-white text-xs sm:text-sm font-sans font-bold flex items-center justify-between cursor-pointer transition-all hover:border-white/15 min-h-[44px]"
                          id="custom-date-trigger"
                        >
                          <div className="flex items-center gap-2">
                            <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                            <span>
                              {formData.date ? formatDateBeautifully(formData.date) : "Select Appointment Date"}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest bg-slate-900 border border-white/10 px-2 py-0.5 rounded-md">
                            Choose
                          </span>
                        </button>

                        <AnimatePresence>
                          {showDatePicker && (
                            <motion.div
                              initial={{ opacity: 0, y: 10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 4, scale: 1 }}
                              exit={{ opacity: 0, y: 10, scale: 0.95 }}
                              className="absolute left-0 mt-1.5 w-full bg-slate-900 border border-white/10 rounded-2xl shadow-2xl p-4 z-50 select-none max-w-sm"
                              id="custom-datepicker-dropdown"
                            >
                              {/* Quick selection presets */}
                              <div className="flex items-center gap-1.5 pb-3 border-b border-white/5 mb-3 overflow-x-auto whitespace-nowrap">
                                <button
                                  type="button"
                                  onClick={selectToday}
                                  className="px-2.5 py-1 rounded-full text-[9px] font-sans font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/10 cursor-pointer transition-colors"
                                >
                                  Today (May 26)
                                </button>
                                <button
                                  type="button"
                                  onClick={selectTomorrow}
                                  className="px-2.5 py-1 rounded-full text-[9px] font-sans font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/10 cursor-pointer transition-colors"
                                >
                                  Tomorrow
                                </button>
                              </div>

                              {/* Calendar Navigate Month panel */}
                              <div className="flex items-center justify-between mb-3">
                                <span className="font-serif text-xs sm:text-sm font-bold text-white">
                                  {months[currentDateView.getMonth()]} {currentDateView.getFullYear()}
                                </span>
                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={handlePrevMonth}
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                                    aria-label="Previous Month"
                                  >
                                    <ChevronLeft className="w-4 h-4" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={handleNextMonth}
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                                    aria-label="Next Month"
                                  >
                                    <ChevronRight className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>

                              {/* Days of week header */}
                              <div className="grid grid-cols-7 gap-1 text-center mb-1 text-[10px] font-sans font-black text-slate-500 uppercase tracking-wider">
                                {weekdays.map(wd => (
                                  <div key={wd}>{wd}</div>
                                ))}
                              </div>

                              {/* Day numbers grid */}
                              <div className="grid grid-cols-7 gap-1 text-center">
                                {/* Padding days for the start of the month */}
                                {Array.from({ length: getFirstDayOfMonth(currentDateView.getFullYear(), currentDateView.getMonth()) }).map((_, idx) => (
                                  <div key={`empty-${idx}`} className="w-8 h-8" />
                                ))}

                                {/* Actual month days */}
                                {Array.from({ length: getDaysInMonth(currentDateView.getFullYear(), currentDateView.getMonth()) }).map((_, idx) => {
                                  const day = idx + 1;
                                  const y = currentDateView.getFullYear();
                                  const m = currentDateView.getMonth();
                                  const isDisabled = isDateBeforeToday(y, m, day);
                                  const isSelected = isSelectedDate(y, m, day);
                                  const isToday = isTodayDate(y, m, day);

                                  return (
                                    <button
                                      type="button"
                                      key={`day-${day}`}
                                      disabled={isDisabled}
                                      onClick={() => handleSelectDate(day)}
                                      className={`w-8 h-8 rounded-full text-xs font-sans font-semibold flex items-center justify-center transition-all ${
                                        isDisabled 
                                          ? 'text-slate-650 cursor-not-allowed opacity-30 bg-transparent'
                                          : isSelected
                                            ? 'bg-rose-500 text-white font-bold ring-2 ring-rose-400/20'
                                            : isToday
                                              ? 'border border-amber-500 text-amber-500 font-bold hover:bg-amber-500/10'
                                              : 'text-slate-300 hover:bg-white/5 hover:text-white cursor-pointer'
                                      }`}
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

                      {/* Appointment Type Selection */}
                      <div>
                        <label className="block text-[11px] font-sans font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                          Appointment Type *
                        </label>
                        <div className="relative">
                          <Video className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                          <select
                            name="appointmentType"
                            value={formData.appointmentType || 'Physical'}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-white/5 focus:border-rose-500 text-white text-xs sm:text-sm font-sans font-semibold outline-hidden cursor-pointer"
                            id="select-appointment-type"
                          >
                            <option value="Physical">Physical Appointment (At Hospital)</option>
                            <option value="Virtual">Virtual Appointment (Online Consult)</option>
                          </select>
                        </div>
                      </div>

                      {/* Home residential Address */}
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-sans font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                          Residential Address *
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                          <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            placeholder="Enter home/clinic correspondence address"
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-white/5 focus:border-rose-500 text-white text-xs sm:text-sm font-sans font-medium outline-hidden transition-all"
                            required
                            id="input-address"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Comments or Issues */}
                    <div>
                      <label className="block text-[11px] font-sans font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                        Describe Health Concerns & Issues
                      </label>
                      <div className="relative">
                        <MessageSquare className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                        <textarea
                          name="comments"
                          value={formData.comments}
                          onChange={handleInputChange}
                          placeholder="Briefly share any chronic history, ongoing issues, or specific birth plan requests..."
                          rows={2.5}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-white/5 focus:border-rose-500 text-white text-xs sm:text-sm font-sans font-medium outline-hidden resize-none transition-all"
                          id="input-comments"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sticky/Pinned Submission actions row - ALWAYS visible on mobile & web */}
                <div className="p-4 sm:p-5 shrink-0 bg-slate-950 border-t border-white/10 flex flex-col sm:flex-row gap-4 items-center justify-between z-20">
                  <span className="text-[10px] sm:text-[11px] text-slate-400 font-sans font-semibold flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Secure Neonatal ICU & Specialized Care</span>
                  </span>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-8 py-3 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 hover:opacity-90 text-white text-xs sm:text-sm font-sans font-bold shadow-xl shadow-rose-500/10 cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap min-w-[200px]"
                    id="submit-booking-btn"
                  >
                    {isSubmitting ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Request Secure Slot</span>
                        <Sparkles className="w-3.5 h-3.5 text-white/90" />
                      </>
                    )}
                  </motion.button>
                </div>

              </form>
            ) : (
              /* Success Greeting State representing a beautiful Clinical Digital Intake Ticket */
              <motion.div 
                id="booking-success-message"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-5 sm:p-8 text-center space-y-6 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-1">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                
                <div className="space-y-1">
                  <h4 className="font-serif text-2xl sm:text-3xl font-black text-white leading-tight">
                    Appointment Requested, {formData.name.split(' ')[0]}!
                  </h4>
                  <p className="text-slate-400 text-xs sm:text-sm font-sans font-medium max-w-sm mx-auto">
                    A digital verification intake summary has been sent to your primary hotline contact: <span className="text-emerald-300 font-bold">{formData.contactNumber}</span>
                  </p>
                </div>

                {/* Highly structured, elite visual clinical ticket pass */}
                <div className="max-w-md mx-auto rounded-2xl bg-slate-950 border border-white/10 overflow-hidden text-left relative shadow-xl">
                  {/* Digital ticket code watermark style inside header of ticket */}
                  <div className="absolute top-3 right-4 font-mono text-[9px] text-slate-600 font-bold tracking-widest">
                    NISHANTH-ID: {Math.floor(Math.random() * 89999) + 10000}
                  </div>

                  <div className="p-4 bg-gradient-to-r from-rose-500/15 via-pink-500/5 to-transparent border-b border-white/5 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-rose-400 shrink-0" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white font-sans">
                      Clinical Intake Ticket Pass
                    </span>
                  </div>

                  <div className="p-4 space-y-3 font-sans text-xs">
                    {/* Patient Name */}
                    <div className="grid grid-cols-12 gap-1 border-b border-white/5 pb-2">
                      <span className="col-span-4 text-slate-500 font-bold uppercase text-[9px] tracking-wider self-center">Patient:</span>
                      <span className="col-span-8 font-extrabold text-white text-sm">{formData.name}</span>
                    </div>

                    {/* Companion row */}
                    <div className="grid grid-cols-12 gap-1 border-b border-white/5 pb-2">
                      <span className="col-span-4 text-slate-500 font-bold uppercase text-[9px] tracking-wider self-center">{formData.guardianPrefix}:</span>
                      <span className="col-span-8 text-slate-300 font-bold">{formData.guardianName}</span>
                    </div>

                    {/* Specialties */}
                    <div className="grid grid-cols-12 gap-1 border-b border-white/5 pb-2">
                      <span className="col-span-4 text-slate-500 font-bold uppercase text-[9px] tracking-wider self-center">Specialty:</span>
                      <span className="col-span-8 text-rose-300 font-extrabold">{formData.department}</span>
                    </div>

                    {/* Consultant doctor */}
                    <div className="grid grid-cols-12 gap-1 border-b border-white/5 pb-2">
                      <span className="col-span-4 text-slate-500 font-bold uppercase text-[9px] tracking-wider self-center">Doctor:</span>
                      <span className="col-span-8 text-white font-black">{formData.doctor}</span>
                    </div>

                    {/* Selected Date & Address Info */}
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div>
                        <span className="block text-slate-500 font-bold uppercase text-[9px] tracking-wider mb-0.5">Appt Date:</span>
                        <span className="text-white font-extrabold font-mono text-[13px]">{formData.date}</span>
                      </div>
                      <div>
                        <span className="block text-slate-500 font-bold uppercase text-[9px] tracking-wider mb-0.5">Address:</span>
                        <span className="text-slate-300 font-bold text-[11px] truncate block">{formData.address}</span>
                      </div>
                    </div>
                  </div>

                  {/* Aesthetic stamp footer on pass */}
                  <div className="p-3 bg-slate-900 border-t border-white/5 text-[10px] text-slate-400 font-sans flex justify-between items-center text-center">
                    <span className="font-extrabold text-emerald-400">● Slot Priority Status: Instant VIP Request</span>
                    <span>Erode, Tamil Nadu</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3 max-w-md mx-auto pt-2 w-full">
                  <a
                    href={formatWhatsAppMessage(formData)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-sans font-extrabold tracking-wider uppercase transition-all shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 cursor-pointer text-center"
                    id="whatsapp-forward-btn"
                  >
                    <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                      <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 001.332 4.977L2 22l5.176-1.355a9.932 9.932 0 004.83 1.258h.005c5.507 0 9.99-4.478 9.99-9.984A9.99 9.99 0 0012.012 2zm6.915 14.153c-.285.803-1.424 1.48-1.956 1.579-.47.087-1.085.127-1.742-.084a14.28 14.28 0 01-5.787-3.79c-1.385-1.383-2.316-3.08-2.585-3.553-.27-.474-.029-.731.21-.971.215-.215.474-.553.71-.829.237-.277.316-.475.474-.79.158-.316.08-.593-.04-.83s-1.077-2.585-1.472-3.535c-.386-.926-.774-.803-1.077-.818a16.89 16.89 0 00-1.22-.016c-.435 0-1.144.163-1.742.818-.596.654-2.277 2.222-2.277 5.418s2.327 6.275 2.651 6.702c.324.428 4.582 6.993 11.102 9.81 1.551.67 2.762 1.07 3.708 1.368 1.558.496 2.977.426 4.097.259 1.25-.187 2.854-1.168 3.255-2.243.402-1.074.402-1.996.28-2.194-.12-.198-.44-.316-.925-.553z"/>
                    </svg>
                    <span>Send details to WhatsApp</span>
                  </a>

                  <div className="flex gap-3 w-full justify-center">
                    <button
                      onClick={onClose}
                      className="flex-1 px-4 py-2.5 rounded-full border border-white/10 text-slate-300 hover:text-white text-xs font-sans font-bold hover:bg-white/5 transition-colors cursor-pointer"
                      id="success-close-btn"
                    >
                      Close Portal
                    </button>
                    <button
                      onClick={resetForm}
                      className="flex-1 px-4 py-2.5 rounded-full bg-slate-800 hover:bg-slate-750 text-white text-xs font-sans font-bold transition-all cursor-pointer"
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
