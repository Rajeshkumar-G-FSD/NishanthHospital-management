import React, { useState, useEffect } from 'react';
import { 
  KeyRound, 
  Users, 
  Search, 
  Calendar, 
  TrendingUp, 
  LogOut, 
  MessageSquare, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  ClipboardList, 
  Filter, 
  RefreshCw, 
  HeartHandshake,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  Briefcase,
  Share2,
  Facebook,
  Instagram,
  Youtube,
  MessageCircle,
  Pill,
  CheckSquare,
  Sparkles,
  AlertTriangle,
  Video,
  Laptop
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

// Model interface extension for viewing Firebase appointments
interface DirectBookingRecord {
  id: string;
  name: string;
  contactNumber: string;
  secondaryContactNumber?: string;
  guardianPrefix?: string;
  guardianName: string;
  department: string;
  doctor: string;
  date: string;
  address: string;
  comments?: string;
  appointmentType?: string;
  createdAt?: any;
}

// Interactive Subsystem Interfaces
interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  status: 'On-Duty' | 'Off-Duty' | 'On-Leave';
  joinedDate: string;
}

interface SocialPost {
  id: string;
  platform: 'facebook' | 'instagram' | 'whatsapp' | 'youtube';
  content: string;
  scheduledFor: string;
  status: 'Published' | 'Scheduled' | 'Draft';
  likes: number;
  shares: number;
}

interface AttendanceRecord {
  id: string;
  employeeName: string;
  role: string;
  checkInTime: string;
  status: 'Present' | 'Absent' | 'On-Leave' | 'Late';
  hoursEstimate: number;
}

interface MedicineItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  threshold: number;
  price: string;
  unit: string;
}

type TabType = 'appointments' | 'virtual-appointments' | 'employee' | 'social-media' | 'attendance' | 'medicine';

export default function DoctorPortal() {
  // Login Authentication State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('doctor_authenticated') === 'true';
  });
  const [loginError, setLoginError] = useState('');
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);

  // Active side panel tab selection
  const [activeTab, setActiveTab2] = useState<TabType>('appointments');

  // Firestore Fetched Records (For Appointments Tab)
  const [appointments, setAppointments] = useState<DirectBookingRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');

  // Dashboard Search & Filters (Appointments Tab)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('All');
  const [selectedDoctorFilter, setSelectedDoctorFilter] = useState('All');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<'All' | 'Physical' | 'Virtual'>('All');

  // Interactive Employee roster system states
  const [employees, setEmployees] = useState<Employee[]>([
    { id: 'emp1', name: 'Dr. Nishanth R.', role: 'Chief Neonatologist & Chairman', department: 'Neonatology', email: 'dr.nishanth@nishanthhospital.com', phone: '90453 11204', status: 'On-Duty', joinedDate: '2016-04-12' },
    { id: 'emp2', name: 'Dr. Abhinaya N.', role: 'Lead Pediatric Surgeon', department: 'Pediatrics', email: 'dr.abhinaya@nishanthhospital.com', phone: '98421 88310', status: 'On-Duty', joinedDate: '2018-09-25' },
    { id: 'emp3', name: 'Sister Sarah John', role: 'Head of NICU Nursing', department: 'Neonatal ICU', email: 'sarah.nurse@nishanthhospital.com', phone: '81244 55301', status: 'On-Duty', joinedDate: '2017-01-15' },
    { id: 'emp4', name: 'Sister M. Kanmani', role: 'Clinical Maternity Supervisor', department: 'Obstetrics', email: 'kanmani.m@nishanthhospital.com', phone: '90013 77489', status: 'Off-Duty', joinedDate: '2020-05-30' },
    { id: 'emp5', name: 'Dr. K. Sridhar', role: 'Visiting Fertility Specialist', department: 'Reproductive Medicine', email: 'sridhar.k@gmail.com', phone: '70114 90212', status: 'On-Leave', joinedDate: '2021-11-04' }
  ]);
  const [newEmpName, setNewEmpName] = useState('');
  const [newEmpRole, setNewEmpRole] = useState('');
  const [newEmpDept, setNewEmpDept] = useState('Neonatology');
  const [newEmpEmail, setNewEmpEmail] = useState('');
  const [newEmpPhone, setNewEmpPhone] = useState('');
  const [newEmpStatus, setNewEmpStatus] = useState<'On-Duty' | 'Off-Duty' | 'On-Leave'>('On-Duty');
  const [showAddEmpModal, setShowAddEmpModal] = useState(false);

  // Interactive Social Media marketing state
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>([
    { id: 'post1', platform: 'facebook', content: 'World Neonatal Care week begins. Learn how Nishanth Hospital has helped over 30,000+ safe infant deliveries since inception with state-of-the-art Level III NICU systems.', scheduledFor: 'Published', status: 'Published', likes: 245, shares: 89 },
    { id: 'post2', platform: 'instagram', content: 'Debunking Motherhood Myths! 🌸 Watch Dr. Abhinaya explain simple newborn lactation patterns to simplify early parenting struggles. #babycare #nishanthhospital', scheduledFor: 'Published', status: 'Published', likes: 512, shares: 201 },
    { id: 'post3', platform: 'whatsapp', content: 'Maternal Nutrition Alert: Simple iron-rich home recipes essential for breast-feeding moms in first 100 days. Group broadcast list reminder.', scheduledFor: '2026-05-28 09:30 AM', status: 'Scheduled', likes: 0, shares: 0 },
    { id: 'post4', platform: 'youtube', content: 'Virtual Hospital Tour 🏥: See our advanced premature infant care suites, incubator stations & round-the-clock intensive vital telemetry screens.', scheduledFor: '2026-06-01 18:00 PM', status: 'Draft', likes: 0, shares: 0 }
  ]);
  const [newSocialContent, setNewSocialContent] = useState('');
  const [newSocialPlatform, setNewSocialPlatform] = useState<'facebook' | 'instagram' | 'whatsapp' | 'youtube'>('instagram');
  const [newSocialSched, setNewSocialSched] = useState('');

  // Interactive Attendance Log roster state
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([
    { id: 'att1', employeeName: 'Dr. Nishanth R.', role: 'Chief Neonatologist', checkInTime: '08:00 AM', status: 'Present', hoursEstimate: 6.5 },
    { id: 'att2', employeeName: 'Dr. Abhinaya N.', role: 'Lead Pediatric Surgeon', checkInTime: '08:45 AM', status: 'Present', hoursEstimate: 5.7 },
    { id: 'att3', employeeName: 'Sister Sarah John', role: 'Head of NICU Nursing', checkInTime: '07:30 AM', status: 'Present', hoursEstimate: 7.0 },
    { id: 'att4', employeeName: 'Sister M. Kanmani', role: 'Maternity Nurse', checkInTime: '--:--', status: 'On-Leave', hoursEstimate: 0 },
    { id: 'att5', employeeName: 'Mr. R. Muthu', role: 'NICU Lab Tech Support', checkInTime: '09:12 AM', status: 'Late', hoursEstimate: 5.2 }
  ]);

  // Interactive Medicine Pharmacy stock inventory state
  const [medicines, setMedicines] = useState<MedicineItem[]>([
    { id: 'med1', name: 'Survanta Intratracheal Neonatal Suspension', category: 'NICU Crucial Pulmonary', stock: 12, threshold: 15, price: '₹4,500', unit: '8ml Vial' },
    { id: 'med2', name: 'Pediatric Injection Vitamin K1 Infant', category: 'Neonatal Prophylaxis', stock: 140, threshold: 50, price: '₹120', unit: 'Ampoule' },
    { id: 'med3', name: 'Amoxicillin & Clavulanate Infant Drops', category: 'Antibiotic Suspen', stock: 85, threshold: 30, price: '₹145', unit: '30ml Bottle' },
    { id: 'med4', name: 'Surfactant (Exosurf Specialty)', category: 'Respiratory Distress', stock: 4, threshold: 10, price: '₹7,800', unit: 'Vial' },
    { id: 'med5', name: 'Prenatal Multivitamin Supplement Tablets', category: 'Maternal Nutrition', stock: 320, threshold: 100, price: '₹450', unit: 'Strip of 30' },
    { id: 'med6', name: 'Neonate 10% Dextrose Sterile IV Fluid', category: 'Pediatric Electrolyte', stock: 18, threshold: 25, price: '₹95', unit: '500ml Pack' }
  ]);
  const [medicineSearch, setMedicineSearch] = useState('');

  // Load appointments if authenticated & current view includes Appointments
  useEffect(() => {
    if (isAuthenticated) {
      fetchClinicalAppointments();
    }
  }, [isAuthenticated]);

  const fetchClinicalAppointments = async () => {
    setIsLoading(true);
    setFetchError('');
    try {
      // Avoid index query issues in Firestore by querying without orderBy and sorting locally
      const q = collection(db, 'appointments');
      const querySnapshot = await getDocs(q);
      const records: DirectBookingRecord[] = [];
      
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        
        // Normalize appointment type to be highly robust and dynamic
        let finalType = 'Physical';
        if (data.appointmentType) {
          const typeLower = data.appointmentType.toString().trim().toLowerCase();
          if (
            typeLower.includes('virt') ||
            typeLower.includes('onli') ||
            typeLower.includes('video') ||
            typeLower.includes('tele') ||
            typeLower.includes('meet')
          ) {
            finalType = 'Virtual';
          }
        }

        records.push({
          id: docSnap.id,
          name: data.name || 'Anonymous',
          contactNumber: data.contactNumber || 'N/A',
          secondaryContactNumber: data.secondaryContactNumber || '',
          guardianPrefix: data.guardianPrefix || 'H/O',
          guardianName: data.guardianName || '',
          department: data.department || 'General',
          doctor: data.doctor || 'Assigned Duty Doctor',
          date: data.date || 'Flexible',
          address: data.address || '',
          comments: data.comments || '',
          appointmentType: finalType,
          createdAt: data.createdAt
        });
      });

      // Sort locally by createdAt desc (newest first) safely handling missing timestamps
      records.sort((a, b) => {
        const getMs = (val: any) => {
          if (!val) return 0;
          if (typeof val.toDate === 'function') return val.toDate().getTime();
          if (val.seconds) return val.seconds * 1000;
          return new Date(val).getTime();
        };
        return getMs(b.createdAt) - getMs(a.createdAt);
      });

      setAppointments(records);
    } catch (err: any) {
      console.error("Clinical firestore pull failed: ", err);
      setFetchError("Failed to load live appointments from Firestore. Secure rule verified.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsSubmittingLogin(true);

    if (username.trim().toLowerCase() === 'doctor' && password === '1234') {
      setIsAuthenticated(true);
      sessionStorage.setItem('doctor_authenticated', 'true');
    } else {
      setLoginError('Invalid medical credentials. Use username "doctor" and password "1234".');
    }
    setIsSubmittingLogin(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('doctor_authenticated');
    setAppointments([]);
  };

  const formatWhatsAppLink = (record: DirectBookingRecord) => {
    const text = `*Hello ${record.name},*
This is a clinical follow up from Nishanth Hospital regarding your scheduled appointment on *${record.date}* for our specialty *${record.department}* department with *${record.doctor}*.

If you have any clinical updates or wish to pre-confirm, please reply to this message. Thanks!`;
    return `https://wa.me/91${record.contactNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`;
  };

  const formatTimestamp = (ts: any) => {
    if (!ts) return 'Pending approval';
    if (typeof ts.toDate === 'function') {
      return ts.toDate().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    if (ts.seconds) {
      return new Date(ts.seconds * 1000).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    return new Date(ts).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get unique lists for filtering dropdowns (Appointments list)
  const uniqueDepartments = ['All', ...Array.from(new Set(appointments.map(a => a.department)))];
  const uniqueDoctors = ['All', ...Array.from(new Set(appointments.map(a => a.doctor)))];

  // Filtering records logic for appointments tab (Filtered conditionally per tab selection)
  const filteredAppointments = appointments.filter(a => {
    // If activeTab is 'virtual-appointments', show only Virtual
    if (activeTab === 'virtual-appointments') {
      if (a.appointmentType !== 'Virtual') return false;
    } else {
      // If activeTab is 'appointments', filter by the type dropdown switcher (defaults to All)
      if (selectedTypeFilter === 'Physical' && a.appointmentType === 'Virtual') return false;
      if (selectedTypeFilter === 'Virtual' && a.appointmentType !== 'Virtual') return false;
    }

    const matchesSearch = 
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.contactNumber.includes(searchQuery) ||
      (a.guardianName && a.guardianName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      a.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.comments && a.comments.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (a.address && a.address.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDept = selectedDeptFilter === 'All' || a.department === selectedDeptFilter;
    const matchesDoctor = selectedDoctorFilter === 'All' || a.doctor === selectedDoctorFilter;

    return matchesSearch && matchesDept && matchesDoctor;
  });

  // Action methods for Employee Tab state
  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmpName.trim() || !newEmpRole.trim()) return;

    const newEmp: Employee = {
      id: 'emp_' + Date.now(),
      name: newEmpName.trim(),
      role: newEmpRole.trim(),
      department: newEmpDept,
      email: newEmpEmail.trim() || `${newEmpName.toLowerCase().replace(/\s+/g, '')}@nishanthhospital.com`,
      phone: newEmpPhone.trim() || '98765 01234',
      status: newEmpStatus,
      joinedDate: new Date().toISOString().split('T')[0]
    };

    setEmployees([...employees, newEmp]);
    
    // Auto add to attendance roster for today as well
    const newAtt: AttendanceRecord = {
      id: 'att_' + Date.now(),
      employeeName: newEmp.name,
      role: newEmp.role,
      checkInTime: newEmp.status === 'On-Duty' ? '09:00 AM' : '--:--',
      status: newEmp.status === 'On-Duty' ? 'Present' : 'On-Leave',
      hoursEstimate: newEmp.status === 'On-Duty' ? 5.0 : 0
    };
    setAttendance([...attendance, newAtt]);

    // Reset fields
    setNewEmpName('');
    setNewEmpRole('');
    setNewEmpEmail('');
    setNewEmpPhone('');
    setNewEmpStatus('On-Duty');
    setShowAddEmpModal(false);
  };

  const handleToggleEmployeeStatus = (empId: string) => {
    setEmployees(employees.map(emp => {
      if (emp.id === empId) {
        const nextStatus: Record<string, 'On-Duty' | 'Off-Duty' | 'On-Leave'> = {
          'On-Duty': 'Off-Duty',
          'Off-Duty': 'On-Leave',
          'On-Leave': 'On-Duty'
        };
        return { ...emp, status: nextStatus[emp.status] };
      }
      return emp;
    }));
  };

  const handleDeleteEmployee = (empId: string) => {
    setEmployees(employees.filter(emp => emp.id !== empId));
  };

  // Action methods for Social Media schedule tab state
  const handleScheduleSocialPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSocialContent.trim()) return;

    const newPost: SocialPost = {
      id: 'post_' + Date.now(),
      platform: newSocialPlatform,
      content: newSocialContent.trim(),
      scheduledFor: newSocialSched ? newSocialSched.replace('T', ' ') : 'Draft',
      status: newSocialSched ? 'Scheduled' : 'Draft',
      likes: 0,
      shares: 0
    };

    setSocialPosts([newPost, ...socialPosts]);
    setNewSocialContent('');
    setNewSocialSched('');
  };

  const handlePublishPostNow = (postId: string) => {
    setSocialPosts(socialPosts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          status: 'Published',
          scheduledFor: 'Published',
          likes: Math.floor(Math.random() * 20) + 1
        };
      }
      return post;
    }));
  };

  // Action methods for Attendance tracker tab state
  const handleUpdateAttendanceStatus = (attId: string, nextStatus: 'Present' | 'Absent' | 'On-Leave' | 'Late') => {
    setAttendance(attendance.map(record => {
      if (record.id === attId) {
        return { 
          ...record, 
          status: nextStatus,
          checkInTime: nextStatus === 'Present' ? '08:00 AM' : nextStatus === 'Late' ? '09:30 AM' : '--:--',
          hoursEstimate: (nextStatus === 'Present' || nextStatus === 'Late') ? 8.0 : 0
        };
      }
      return record;
    }));
  };

  // Action methods for Medicine inventory management
  const adjustMedicineStock = (medId: string, amount: number) => {
    setMedicines(medicines.map(med => {
      if (med.id === medId) {
        const newStock = Math.max(0, med.stock + amount);
        return { ...med, stock: newStock };
      }
      return med;
    }));
  };

  return (
    <div className="relative min-h-[90vh] py-14 px-4 sm:px-6 max-w-7xl mx-auto flex flex-col justify-start" id="doctor-portal-wrapper">
      
      {/* Visual Ambience Background Orbs */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-rose-500/[0.03] rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500/[0.03] rounded-full filter blur-3xl pointer-events-none" />

      {!isAuthenticated ? (
        /* Authenticated Clinic Gate Keep Card View */
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md mx-auto my-auto bg-slate-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative z-10"
          id="doctor-login-panel"
        >
          <div className="h-1.5 w-full bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-400" />
          
          <div className="p-6 sm:p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 mb-2">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-white tracking-wider">Clinician Portal</h2>
              <p className="text-slate-400 text-xs font-sans font-medium">
                Authorized Nishanth Hospital administrators and doctors access exclusive intake telemetry
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4" id="clinical-credentials-form">
              {loginError && (
                <div className="text-xs text-rose-300 bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl flex items-center gap-2">
                  <span className="font-bold">Error:</span> {loginError}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-[11px] font-sans font-extrabold text-slate-400 uppercase tracking-widest">
                  Staff Username
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs">@</span>
                  <input 
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. doctor"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-white/5 focus:border-rose-500 text-white text-xs sm:text-sm font-sans font-bold transition-all"
                    id="doctor-user-field"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-sans font-extrabold text-slate-400 uppercase tracking-widest">
                  Secure Password
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input 
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-white/5 focus:border-rose-500 text-white text-xs sm:text-sm font-sans font-bold transition-all"
                    id="doctor-pass-field"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={isSubmittingLogin}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:opacity-90 font-sans font-bold text-xs uppercase tracking-wider text-white shadow-xl cursor-pointer transition-all mt-4 flex items-center justify-center gap-2"
                id="doctor-submit-btn"
              >
                {isSubmittingLogin ? (
                  <div className="w-4.5 h-4.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <span>Verify Portal Access</span>
                )}
              </button>
            </form>
          </div>
        </motion.div>
      ) : (
        /* Doctor Clinical Telemetry Dashboard with SIDE MENU Layout */
        <div className="flex flex-col lg:flex-row gap-6 items-stretch relative z-10 w-full" id="clinical-dual-panel-container">
          
          {/* LEFT SIDEBAR PANEL: Sticky & Sleek layout (Folds to a horizontal bar on mobile screens!) */}
          <div className="w-full lg:w-64 shrink-0 bg-slate-900 border border-white/5 rounded-3xl p-5 flex flex-col justify-between" id="dashboard-left-sidebar">
            <div className="space-y-6">
              {/* Sidebar Header Brand with small credentials prompt */}
              <div className="border-b border-white/5 pb-4">
                <div className="flex items-center gap-2.5 text-rose-400 text-xs font-semibold uppercase tracking-widest font-sans mb-1.5">
                  <HeartHandshake className="w-4 h-4 fill-rose-500/10 animate-pulse text-rose-500" />
                  <span>Clinical Suite</span>
                </div>
                <h3 className="font-serif text-lg font-extrabold text-white leading-normal">
                  Nishanth Hospital
                </h3>
                <p className="text-[10px] text-slate-500 font-sans tracking-wide">
                  Level III Care Admin Console
                </p>
              </div>

              {/* SIDE NAVIGATION ITEMS BUTTONS RAIL */}
              <nav className="flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-visible no-scrollbar py-2 lg:py-0 border-b lg:border-none border-white/5" id="sidebar-navigator-rail">
                <button
                  onClick={() => {
                    setActiveTab2('appointments');
                    setSelectedTypeFilter('All');
                  }}
                  className={`px-4 py-2.5 rounded-xl text-left font-sans font-semibold text-xs tracking-wide flex items-center gap-2.5 transition-all shrink-0 cursor-pointer ${
                    activeTab === 'appointments' 
                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/2 w-full' 
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.02] w-auto lg:w-full'
                  }`}
                  id="tab-btn-appointments"
                >
                  <Calendar className="w-4 h-4" />
                  <span>All Appointments</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab2('virtual-appointments');
                    setSelectedTypeFilter('Virtual');
                  }}
                  className={`px-4 py-2.5 rounded-xl text-left font-sans font-semibold text-xs tracking-wide flex items-center gap-2.5 transition-all shrink-0 cursor-pointer ${
                    activeTab === 'virtual-appointments' 
                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/2 w-full' 
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.02] w-auto lg:w-full'
                  }`}
                  id="tab-btn-virtual-appointments"
                >
                  <Video className="w-4 h-4" />
                  <span>Virtual Consults</span>
                </button>

                <button
                  onClick={() => setActiveTab2('employee')}
                  className={`px-4 py-2.5 rounded-xl text-left font-sans font-semibold text-xs tracking-wide flex items-center gap-2.5 transition-all shrink-0 cursor-pointer ${
                    activeTab === 'employee' 
                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/2 w-full' 
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.02] w-auto lg:w-full'
                  }`}
                  id="tab-btn-employee"
                >
                  <Users className="w-4 h-4" />
                  <span>Employee</span>
                </button>

                <button
                  onClick={() => setActiveTab2('social-media')}
                  className={`px-4 py-2.5 rounded-xl text-left font-sans font-semibold text-xs tracking-wide flex items-center gap-2.5 transition-all shrink-0 cursor-pointer ${
                    activeTab === 'social-media' 
                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/2 w-full' 
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.02] w-auto lg:w-full'
                  }`}
                  id="tab-btn-social"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Social Media</span>
                </button>

                <button
                  onClick={() => setActiveTab2('attendance')}
                  className={`px-4 py-2.5 rounded-xl text-left font-sans font-semibold text-xs tracking-wide flex items-center gap-2.5 transition-all shrink-0 cursor-pointer ${
                    activeTab === 'attendance' 
                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/2 w-full' 
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.02] w-auto lg:w-full'
                  }`}
                  id="tab-btn-attendance"
                >
                  <CheckSquare className="w-4 h-4" />
                  <span>Attendance</span>
                </button>

                <button
                  onClick={() => setActiveTab2('medicine')}
                  className={`px-4 py-2.5 rounded-xl text-left font-sans font-semibold text-xs tracking-wide flex items-center gap-2.5 transition-all shrink-0 cursor-pointer ${
                    activeTab === 'medicine' 
                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/2 w-full' 
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.02] w-auto lg:w-full'
                  }`}
                  id="tab-btn-medicine"
                >
                  <Pill className="w-4 h-4" />
                  <span>Medicine</span>
                </button>
              </nav>
            </div>

            {/* Support Info & Secure log out block */}
            <div className="pt-6 border-t border-white/5 space-y-3 mt-4 lg:mt-0">
              <div className="p-3 bg-slate-950/60 rounded-xl border border-white/5 text-[10px] text-slate-500 font-mono space-y-1">
                <div className="text-slate-400 font-sans font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Biometric Bypass active</span>
                </div>
                <span>Session ID: H-SHIELD-X4</span>
              </div>

              <button
                onClick={handleLogout}
                className="w-full p-2.5 bg-rose-500/5 hover:bg-rose-500/15 text-rose-400 hover:text-rose-300 rounded-xl text-xs font-sans font-bold flex items-center justify-center gap-1.5 border border-rose-500/12 transition-all cursor-pointer"
                id="clinical-logout-btn"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout Session</span>
              </button>
            </div>
          </div>

          {/* RIGHT VIEWPORT CONTENT: Dynamically swappable dashboards */}
          <div className="flex-1 bg-slate-900 border border-white/5 rounded-3xl p-5 sm:p-6 min-h-[500px]" id="dashboard-viewport-content">
            
            {/********************** PANEL 1: APPOINTMENTS & VIRTUAL APPOINTMENTS (CONNECTED WITH FIREBASE) **********************/}
            {(activeTab === 'appointments' || activeTab === 'virtual-appointments') && (
              <motion.div 
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
                id="appointments-dash-tab"
              >
                {/* Header Context Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
                  <div>
                    <h2 className="font-serif text-xl sm:text-2xl font-bold text-white">
                      {activeTab === 'virtual-appointments' ? 'Virtual Telehealth Consultation Console' : 'Clinical Bookings & Consultation Registry'}
                    </h2>
                    <p className="text-slate-400 text-xs font-sans">
                      {activeTab === 'virtual-appointments' 
                        ? 'Manage virtual baby care consults, prenatal online telemetry and remote specialty checks.' 
                        : 'Review, manage, and process all physical and virtual patient reservations fetched from secure Firebase Firestore DB.'}
                    </p>
                  </div>

                  <button
                    onClick={fetchClinicalAppointments}
                    disabled={isLoading}
                    className="p-2 px-4 self-start bg-slate-950 border border-white/5 text-slate-300 hover:text-white rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5 text-xs font-bold font-sans disabled:opacity-50 cursor-pointer"
                    id="refresh-clinical-btn"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-rose-400' : ''}`} />
                    <span>Sync Live DB</span>
                  </button>
                </div>

                {/* Internal statistics indicators */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/5 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
                      <Users className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <span className="block text-[9px] text-slate-500 uppercase tracking-widest font-extrabold">
                        {activeTab === 'virtual-appointments' ? 'Virtual Intake' : 'Total Bookings'}
                      </span>
                      <span className="text-base font-bold font-mono text-white leading-tight">
                        {activeTab === 'virtual-appointments' 
                          ? appointments.filter(a => a.appointmentType === 'Virtual').length
                          : appointments.length}
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/5 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                      <Calendar className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <span className="block text-[9px] text-slate-500 uppercase tracking-widest font-extrabold">Consultants</span>
                      <span className="text-base font-bold font-mono text-white leading-tight">
                        {new Set(appointments.map(a => a.doctor)).size || 1}
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/5 flex items-center gap-2.5 col-span-2 md:col-span-1">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                      <TrendingUp className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <span className="block text-[9px] text-slate-500 uppercase tracking-widest font-extrabold">Unique Depts</span>
                      <span className="text-base font-bold font-mono text-white leading-tight">
                        {new Set(appointments.map(a => a.department)).size || 1}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Filters Row */}
                <div className="bg-slate-950/50 p-3 rounded-xl border border-white/5 flex flex-col md:flex-row gap-2.5" id="clinical-filters-controls">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search name, phone, comments..."
                      className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-white/5 focus:border-rose-500 text-white text-xs font-sans transition-all"
                      id="search-input-field"
                    />
                  </div>

                  <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                    {activeTab === 'appointments' && (
                      <select
                        value={selectedTypeFilter}
                        onChange={(e) => setSelectedTypeFilter(e.target.value as any)}
                        className="px-2.5 py-2 rounded-xl bg-slate-950 border border-white/5 text-[11px] font-bold text-rose-450 font-sans outline-none min-h-[38px] cursor-pointer"
                        id="filter-appointment-type"
                      >
                        <option value="All">All Types</option>
                        <option value="Physical">🏥 Physical Only</option>
                        <option value="Virtual">💻 Virtual Only</option>
                      </select>
                    )}

                    <select
                      value={selectedDeptFilter}
                      onChange={(e) => setSelectedDeptFilter(e.target.value)}
                      className="px-2.5 py-2 rounded-xl bg-slate-950 border border-white/5 text-[11px] font-bold text-slate-300 font-sans outline-none cursor-pointer"
                    >
                      <option value="All">All Departments</option>
                      {uniqueDepartments.slice(1).map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>

                    <select
                      value={selectedDoctorFilter}
                      onChange={(e) => setSelectedDoctorFilter(e.target.value)}
                      className="px-2.5 py-2 rounded-xl bg-slate-950 border border-white/5 text-[11px] font-bold text-slate-300 font-sans outline-none cursor-pointer"
                    >
                      <option value="All">All Doctors</option>
                      {uniqueDoctors.slice(1).map(doc => (
                        <option key={doc} value={doc}>{doc}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Pull status logs */}
                {fetchError && (
                  <div className="text-xs p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 font-bold">
                    {fetchError}
                  </div>
                )}

                {/* Main telemetry list view */}
                {isLoading ? (
                  <div className="py-14 text-center space-y-3">
                    <div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-slate-400 text-xs font-mono">Syncing Firestore database...</p>
                  </div>
                ) : filteredAppointments.length === 0 ? (
                  <div className="py-14 text-center border-2 border-dashed border-white/5 rounded-3xl space-y-1">
                    <ClipboardList className="w-8 h-8 text-slate-600 mx-auto" />
                    <h4 className="font-serif text-sm font-bold text-slate-300">No Booking Records found</h4>
                    <p className="text-slate-500 text-[11px] font-sans">Modify filters or sync live inputs.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Responsive lists for seamless scrolling */}
                    <div className="hidden md:block overflow-hidden rounded-xl border border-white/5">
                      <table className="w-full text-left font-sans border-collapse">
                        <thead className="bg-slate-950 border-b border-white/5 text-[9px] text-slate-400 uppercase tracking-widest font-extrabold">
                          <tr>
                            <th className="p-3.5">Time Log</th>
                            <th className="p-3.5">Patient Details</th>
                            <th className="p-3.5">Type</th>
                            <th className="p-3.5">Preferred Slot</th>
                            <th className="p-3.5">Department/Doc</th>
                            <th className="p-3.5">Contact No</th>
                            <th className="p-3.5 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-xs text-slate-300 bg-slate-950/20">
                          {filteredAppointments.map((rec) => (
                            <tr key={rec.id} className="hover:bg-white/[0.01] transition-colors">
                              <td className="p-3.5 font-mono text-[10px] text-slate-500">
                                {formatTimestamp(rec.createdAt)}
                              </td>
                              <td className="p-3.5">
                                <div className="font-bold text-white text-sm">{rec.name}</div>
                                {rec.guardianName && (
                                  <div className="text-[10px] text-slate-400">
                                    <span className="text-rose-500 font-extrabold mr-1">{rec.guardianPrefix}</span>
                                    {rec.guardianName}
                                  </div>
                                )}
                              </td>
                              <td className="p-3.5">
                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold font-sans ${
                                  rec.appointmentType === 'Virtual'
                                    ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                }`}>
                                  {rec.appointmentType === 'Virtual' ? '💻 Virtual' : '🏥 Physical'}
                                </span>
                              </td>
                              <td className="p-3.5">
                                <span className="inline-flex px-2 py-0.5 rounded bg-slate-950 border border-white/5 text-amber-300 font-mono text-[10px]">
                                  {rec.date}
                                </span>
                              </td>
                              <td className="p-3.5">
                                <div className="font-bold text-rose-300 text-[11px]">{rec.department}</div>
                                <div className="text-slate-500 text-[10px]">{rec.doctor}</div>
                              </td>
                              <td className="p-3.5">
                                <div className="font-semibold text-white font-mono">{rec.contactNumber}</div>
                                {rec.comments && <div className="text-slate-500 text-[10px] truncate max-w-xs">{rec.comments}</div>}
                              </td>
                              <td className="p-3.5 text-right">
                                <div className="inline-flex items-center justify-end gap-2 text-right">
                                  {rec.appointmentType === 'Virtual' ? (
                                    <button
                                      onClick={() => {
                                        const roomLink = `https://meet.jit.si/NishanthHospitalTelehealth-${rec.id.substring(0, 8)}`;
                                        window.open(roomLink, '_blank');
                                      }}
                                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-600/10 hover:bg-purple-600 hover:text-white border border-purple-500/20 text-purple-400 hover:scale-[1.02] active:scale-[0.98] transition-all font-bold text-[10.5px] cursor-pointer"
                                      title="Launch external browser HIPAA telemedicine meeting workspace"
                                    >
                                      <Video className="w-3" />
                                      <span>Telehealth Call</span>
                                    </button>
                                  ) : (
                                    <span className="text-[10px] text-slate-500 font-medium select-none bg-slate-900 border border-white/5 px-2.5 py-0.5 rounded-full">
                                      In-Hospital Appt
                                    </span>
                                  )}
                                  <a
                                    href={formatWhatsAppLink(rec)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600/10 hover:bg-emerald-600 hover:text-white border border-emerald-500/20 text-emerald-400 transition-all font-bold text-[10.5px]"
                                  >
                                    <MessageCircle className="w-3 h-3 text-emerald-400" />
                                    <span>WhatsApp</span>
                                  </a>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile responsive cards */}
                    <div className="md:hidden space-y-3">
                      {filteredAppointments.map((rec) => (
                        <div key={rec.id} className="p-4 rounded-xl bg-slate-950/60 border border-white/5 space-y-3">
                          <div className="flex justify-between items-start gap-1">
                            <div>
                              <div className="text-[9px] font-mono text-slate-500">{formatTimestamp(rec.createdAt)}</div>
                              <h4 className="font-bold text-white">{rec.name}</h4>
                              {rec.guardianName && (
                                <p className="text-[10px] text-slate-400">
                                  {rec.guardianPrefix}: {rec.guardianName}
                                </p>
                              )}
                            </div>
                            <span className="text-[9.5px] font-mono text-amber-300 px-1.5 py-0.5 rounded bg-slate-950 border border-white/5 shrink-0">
                              {rec.date}
                            </span>
                          </div>

                          <div className="text-[11px] space-y-1 bg-slate-900/60 p-2.5 rounded-lg border border-white/5">
                            <div className="flex justify-between items-center pb-1 mb-1 border-b border-white/5">
                              <span className="text-slate-500 font-medium">Type:</span> 
                              <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                                rec.appointmentType === 'Virtual'
                                  ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              }`}>
                                {rec.appointmentType === 'Virtual' ? '💻 Virtual' : '🏥 Physical'}
                              </span>
                            </div>
                            <div><span className="text-slate-500">Department:</span> <span className="text-rose-350 font-semibold">{rec.department}</span></div>
                            <div><span className="text-slate-500">Physician:</span> <span className="text-slate-200">{rec.doctor}</span></div>
                            {rec.comments && <div><span className="text-slate-500">Symptoms:</span> <span className="text-slate-400 italic">{rec.comments}</span></div>}
                          </div>

                          <div className="flex flex-col sm:flex-row gap-2 justify-between items-stretch bg-slate-950/60 p-2 rounded-lg">
                            <span className="font-mono text-xs text-slate-300 self-center mb-1.5 sm:mb-0">{rec.contactNumber}</span>
                            <div className="flex gap-2 w-full sm:w-auto">
                              {rec.appointmentType === 'Virtual' && (
                                <button
                                  onClick={() => {
                                    const roomLink = `https://meet.jit.si/NishanthHospitalTelehealth-${rec.id.substring(0, 8)}`;
                                    window.open(roomLink, '_blank');
                                  }}
                                  className="flex-1 sm:flex-none px-2.5 py-1 rounded-lg bg-purple-600 text-white font-bold text-[10px] flex items-center justify-center gap-1 cursor-pointer"
                                >
                                  <Video className="w-3 h-3" />
                                  <span>Video Call</span>
                                </button>
                              )}
                              <a
                                href={formatWhatsAppLink(rec)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 sm:flex-none px-2.5 py-1 text-center rounded-lg bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center gap-1"
                              >
                                <MessageCircle className="w-3 h-3" />
                                <span>Clarify Slot</span>
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}


            {/********************** PANEL 2: EMPLOYEE (EMPLOYEE ROSTER PANEL) **********************/}
            {activeTab === 'employee' && (
              <motion.div 
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
                id="employee-dash-tab"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
                  <div>
                    <h2 className="font-serif text-xl sm:text-2xl font-bold text-white">Employee Administration</h2>
                    <p className="text-slate-400 text-xs font-sans">
                      Establish clinical rosters, update clinician specialized roles, and assign nurses in real-time.
                    </p>
                  </div>

                  <button
                    onClick={() => setShowAddEmpModal(true)}
                    className="py-2 px-4 bg-gradient-to-r from-rose-500 to-amber-500 hover:opacity-90 rounded-xl text-white font-sans font-bold text-xs flex items-center justify-center gap-1.5 self-start shadow-md cursor-pointer"
                    id="add-emp-trigger-btn"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Deploy Specialist</span>
                  </button>
                </div>

                {/* Metric grid */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-slate-950/40 border border-white/5 text-center">
                    <span className="block text-[9px] text-slate-500 uppercase tracking-widest font-extrabold">Registered Staff</span>
                    <span className="text-lg font-bold font-mono text-white mt-1 block">{employees.length}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/40 border border-white/5 text-center">
                    <span className="block text-[9px] text-slate-500 uppercase tracking-widest font-extrabold">Currently On Duty</span>
                    <span className="text-lg font-bold font-mono text-emerald-400 mt-1 block">
                      {employees.filter(e => e.status === 'On-Duty').length}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/40 border border-white/5 text-center">
                    <span className="block text-[9px] text-slate-500 uppercase tracking-widest font-extrabold">Visiting/Leave</span>
                    <span className="text-lg font-bold font-mono text-amber-500 mt-1 block">
                      {employees.filter(e => e.status === 'On-Leave').length}
                    </span>
                  </div>
                </div>

                {/* Add Employee Form Drawer (Collapsible) */}
                <AnimatePresence>
                  {showAddEmpModal && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-slate-950 p-5 rounded-2xl border border-white/10 space-y-4 overflow-hidden"
                      id="add-emp-form-block"
                    >
                      <div className="flex justify-between items-center border-b border-white/5 pb-2">
                        <span className="text-xs font-bold text-rose-400 uppercase tracking-wider font-mono">Deploy New Staff Member</span>
                        <button 
                          onClick={() => setShowAddEmpModal(false)}
                          className="text-slate-500 hover:text-white text-xs cursor-pointer"
                        >
                          cancel [x]
                        </button>
                      </div>

                      <form onSubmit={handleAddEmployee} className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div className="space-y-1">
                          <label className="block text-[10px] uppercase font-bold text-slate-400">Clinician Name</label>
                          <input 
                            type="text"
                            required
                            placeholder="Dr. Rajesh Kumar"
                            value={newEmpName}
                            onChange={(e) => setNewEmpName(e.target.value)}
                            className="w-full bg-slate-900 border border-white/5 rounded-lg px-3 py-2 text-xs text-white"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[10px] uppercase font-bold text-slate-400">Designated Role</label>
                          <input 
                            type="text"
                            required
                            placeholder="Associate Pediatrician"
                            value={newEmpRole}
                            onChange={(e) => setNewEmpRole(e.target.value)}
                            className="w-full bg-slate-900 border border-white/5 rounded-lg px-3 py-2 text-xs text-white"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[10px] uppercase font-bold text-slate-400">Department</label>
                          <select
                            value={newEmpDept}
                            onChange={(e) => setNewEmpDept(e.target.value)}
                            className="w-full bg-slate-900 border border-white/5 rounded-lg px-3 py-2 text-xs text-slate-300"
                          >
                            <option value="Neonatology">Neonatology (ICU Specialty)</option>
                            <option value="Pediatrics">Pediatrics Outpatient</option>
                            <option value="Obstetrics">Obstetrics & Gynecology</option>
                            <option value="Reproductive Medicine">Reproductive Fertility Care</option>
                            <option value="Emergency Intaking">Emergency Medicine</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[10px] uppercase font-bold text-slate-400">Duty Status</label>
                          <select
                            value={newEmpStatus}
                            onChange={(e) => setNewEmpStatus(e.target.value as any)}
                            className="w-full bg-slate-900 border border-white/5 rounded-lg px-3 py-2 text-xs text-slate-300"
                          >
                            <option value="On-Duty">Active On-Duty</option>
                            <option value="Off-Duty">Off-Duty Standby</option>
                            <option value="On-Leave">On Approved Clinical Leave</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[10px] uppercase font-bold text-slate-400">Phone</label>
                          <input 
                            type="text"
                            placeholder="e.g. 98453 10001"
                            value={newEmpPhone}
                            onChange={(e) => setNewEmpPhone(e.target.value)}
                            className="w-full bg-slate-900 border border-white/5 rounded-lg px-3 py-2 text-xs text-white"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[10px] uppercase font-bold text-slate-400">Email Address</label>
                          <input 
                            type="email"
                            placeholder="e.g. rajesh@nishanthhospital.com"
                            value={newEmpEmail}
                            onChange={(e) => setNewEmpEmail(e.target.value)}
                            className="w-full bg-slate-900 border border-white/5 rounded-lg px-3 py-2 text-xs text-white"
                          />
                        </div>

                        <div className="col-span-1 sm:col-span-2 pt-2 flex justify-end">
                          <button 
                            type="submit"
                            className="px-5 py-2 rounded-lg bg-rose-500 hover:bg-rose-400 text-xs font-bold text-white transition-colors cursor-pointer"
                          >
                            Save Clinical Registry
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Interactive Roster Directory List */}
                <div className="space-y-3">
                  <h4 className="text-xs uppercase font-extrabold text-slate-500 tracking-widest">Medical Staff Directory</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3" id="roster-grid-list">
                    {employees.map((emp) => (
                      <div 
                        key={emp.id} 
                        className="p-4 rounded-xl bg-slate-950/60 border border-white/5 flex flex-col justify-between gap-3 hover:border-white/10 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] font-mono text-slate-500 italic block">Joined: {emp.joinedDate}</span>
                            <h4 className="font-bold text-white text-sm">{emp.name}</h4>
                            <p className="text-[11px] text-rose-300 font-sans tracking-wide">{emp.role}</p>
                          </div>

                          <button 
                            onClick={() => handleToggleEmployeeStatus(emp.id)}
                            className={`px-2.5 py-1 rounded-full text-[9px] font-mono font-bold tracking-wider uppercase cursor-pointer transition-all ${
                              emp.status === 'On-Duty' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                              emp.status === 'On-Leave' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                              'bg-slate-800 text-slate-400 border border-white/5'
                            }`}
                            title="Click to quickly switch duty states"
                          >
                            {emp.status}
                          </button>
                        </div>

                        <div className="text-[11px] space-y-1 border-t border-white/5 pt-2 text-slate-400 font-sans">
                          <div className="flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5 text-slate-500" /> Department: <span className="text-slate-350 font-semibold">{emp.department}</span></div>
                          <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-slate-500" /> Phone: <span className="font-mono text-xs">{emp.phone}</span></div>
                          <div className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-slate-500" /> Email Verification Security Key mapped.</div>
                        </div>

                        <div className="flex justify-end gap-1.5 border-t border-white/5 pt-2">
                          <button
                            onClick={() => handleDeleteEmployee(emp.id)}
                            className="p-1 px-2.5 bg-slate-900 hover:bg-rose-500/20 text-rose-400 font-mono text-[10px] rounded-lg transition-all cursor-pointer flex items-center gap-1 border border-white/5"
                          >
                            <Trash2 className="w-3 h-3 text-rose-400" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}


            {/********************** PANEL 3: SOCIAL MEDIA (HOSPITAL OUTREACH CAMPAIGNS) **********************/}
            {activeTab === 'social-media' && (
              <motion.div 
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
                id="social-dash-tab"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
                  <div>
                    <h2 className="font-serif text-xl sm:text-2xl font-bold text-white">Social Media Outreach</h2>
                    <p className="text-slate-400 text-xs font-sans">
                      Promote prenatal guidelines, celebrate Level III NICU recovery cases, and post baby care tips.
                    </p>
                  </div>
                </div>

                {/* Brand Reach Indicators Mock Analytics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-blue-600/10 p-3 rounded-xl border border-blue-500/20 text-center">
                    <Facebook className="w-5 h-5 mx-auto mb-1 text-blue-400" />
                    <span className="block text-[8px] uppercase tracking-widest text-slate-500 font-extrabold">Facebook</span>
                    <span className="text-sm font-bold font-mono text-white">24,500 Reach</span>
                  </div>

                  <div className="bg-pink-600/10 p-3 rounded-xl border border-pink-500/20 text-center">
                    <Instagram className="w-5 h-5 mx-auto mb-1 text-pink-400" />
                    <span className="block text-[8px] uppercase tracking-widest text-slate-500 font-extrabold">Instagram</span>
                    <span className="text-sm font-bold font-mono text-white">51.2K Impressions</span>
                  </div>

                  <div className="bg-emerald-600/10 p-3 rounded-xl border border-emerald-500/20 text-center">
                    <MessageCircle className="w-5 h-5 mx-auto mb-1 text-emerald-400" />
                    <span className="block text-[8px] uppercase tracking-widest text-slate-500 font-extrabold">WA Mother List</span>
                    <span className="text-sm font-bold font-mono text-white">2.8K Subscribed</span>
                  </div>

                  <div className="bg-red-650/10 p-3 rounded-xl border-red-500/20 text-center bg-red-500/5">
                    <Youtube className="w-5 h-5 mx-auto mb-1 text-red-400" />
                    <span className="block text-[8px] uppercase tracking-widest text-slate-500 font-extrabold">YouTube</span>
                    <span className="text-sm font-bold font-mono text-white">125K Views</span>
                  </div>
                </div>

                {/* Post Creator Form */}
                <div className="bg-slate-950 p-4 rounded-xl border border-white/5 space-y-4">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 fill-amber-500/20" />
                    <span>Schedule Healthcare Outreach Content Stream</span>
                  </span>

                  <form onSubmit={handleScheduleSocialPost} className="space-y-3">
                    <div className="space-y-1">
                      <label className="block text-[10px] text-slate-400 uppercase font-bold">Educational Tip Content</label>
                      <textarea
                        required
                        rows={2}
                        value={newSocialContent}
                        onChange={(e) => setNewSocialContent(e.target.value)}
                        placeholder="Write infant health guides, maternal nutritional posts, neonate care warnings..."
                        className="w-full bg-slate-900 border border-white/5 rounded-lg p-2.5 text-xs text-white placeholder-slate-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="block text-[10px] text-slate-400 uppercase font-bold">Target Broadcast Channel</label>
                        <select
                          value={newSocialPlatform}
                          onChange={(e) => setNewSocialPlatform(e.target.value as any)}
                          className="w-full bg-slate-900 border border-white/5 rounded-lg px-2.5 py-1.5 text-xs text-slate-300"
                        >
                          <option value="facebook">Facebook Hospital Fanpage</option>
                          <option value="instagram">Instagram reels @NishanthMaternity</option>
                          <option value="whatsapp">Maternal broadcast WhatsApp group lists</option>
                          <option value="youtube">YouTube Pediatric Tutorial Upload</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[10px] text-slate-400 uppercase font-bold">Scheduled Broadcast Slot (Optional)</label>
                        <input
                          type="datetime-local"
                          value={newSocialSched}
                          onChange={(e) => setNewSocialSched(e.target.value)}
                          className="w-full bg-slate-900 border border-white/5 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 font-mono"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-1">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-rose-500 hover:bg-rose-400 text-xs font-bold text-white rounded-lg transition-colors cursor-pointer"
                      >
                        Queue Campaign Stream
                      </button>
                    </div>
                  </form>
                </div>

                {/* Queue log list */}
                <div className="space-y-3">
                  <h4 className="text-xs uppercase font-extrabold text-slate-500 tracking-widest">Active Marketing Stream Queue</h4>
                  <div className="space-y-2.5" id="social-post-list">
                    {socialPosts.map((post) => (
                      <div key={post.id} className="p-4 rounded-xl bg-slate-950/60 border border-white/5 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {post.platform === 'facebook' && <Facebook className="w-4 h-4 text-blue-400" />}
                            {post.platform === 'instagram' && <Instagram className="w-4 h-4 text-pink-400" />}
                            {post.platform === 'whatsapp' && <MessageCircle className="w-4 h-4 text-emerald-400" />}
                            {post.platform === 'youtube' && <Youtube className="w-4 h-4 text-red-400" />}
                            <span className="font-mono text-[10px] tracking-wider uppercase text-slate-400">{post.platform} Channel</span>
                          </div>

                          <span className={`px-2 py-0.5 rounded-full font-mono text-[9px] font-bold ${
                            post.status === 'Published' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                            post.status === 'Scheduled' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                            'bg-slate-800 text-slate-400 border border-white/5'
                          }`}>
                            {post.status}
                          </span>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed font-sans">{post.content}</p>

                        <div className="flex justify-between items-center text-[10.5px] font-mono border-t border-white/5 pt-2">
                          <div className="text-slate-500">
                            {post.status === 'Published' ? (
                              <span className="flex items-center gap-2">
                                <span>👍 {post.likes} reactions</span>
                                <span>📢 {post.shares} shares</span>
                              </span>
                            ) : (
                              <span>Scheduled for: <span className="text-amber-300">{post.scheduledFor}</span></span>
                            )}
                          </div>

                          {post.status !== 'Published' && (
                            <button
                              onClick={() => handlePublishPostNow(post.id)}
                              className="px-2.5 py-1 rounded bg-slate-900 hover:bg-white/10 text-white font-sans font-bold text-[10px] transition-all cursor-pointer"
                            >
                              Publish Stream Now
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}


            {/********************** PANEL 4: ATTENDANCE (STAFF ATTENDANCE LOGS) **********************/}
            {activeTab === 'attendance' && (
              <motion.div 
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
                id="attendance-dash-tab"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
                  <div>
                    <h2 className="font-serif text-xl sm:text-2xl font-bold text-white">Clinical Shift Attendance</h2>
                    <p className="text-slate-400 text-xs font-sans">
                      Verify on-duty check-in timestamps, trace biometric entry records, and file logs for wage matching.
                    </p>
                  </div>
                </div>

                {/* Sub-header stat row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 text-center">
                  <div className="bg-slate-950/60 p-2.5 rounded-xl border border-white/5">
                    <span className="block text-[8px] text-slate-500 uppercase tracking-widest font-extrabold">Active Shifts</span>
                    <span className="text-base font-bold font-mono text-white block mt-0.5">
                      {attendance.filter(a => a.status === 'Present' || a.status === 'Late').length} / {attendance.length}
                    </span>
                  </div>

                  <div className="bg-slate-950/60 p-2.5 rounded-xl border border-white/5">
                    <span className="block text-[8px] text-slate-500 uppercase tracking-widest font-extrabold">On Leave</span>
                    <span className="text-base font-bold font-mono text-amber-500 block mt-0.5">
                      {attendance.filter(a => a.status === 'On-Leave').length}
                    </span>
                  </div>

                  <div className="bg-slate-950/60 p-2.5 rounded-xl border border-white/5">
                    <span className="block text-[8px] text-slate-500 uppercase tracking-widest font-extrabold">Late Entrances</span>
                    <span className="text-base font-bold font-mono text-red-400 block mt-0.5">
                      {attendance.filter(a => a.status === 'Late').length}
                    </span>
                  </div>

                  <div className="bg-slate-950/60 p-2.5 rounded-xl border border-white/5">
                    <span className="block text-[8px] text-slate-500 uppercase tracking-widest font-extrabold">Shift Coverage</span>
                    <span className="text-base font-bold font-mono text-emerald-400 block mt-0.5">
                      {Math.ceil((attendance.filter(a => a.status === 'Present').length / attendance.length) * 100)}%
                    </span>
                  </div>
                </div>

                {/* Main responsive grid view list */}
                <div className="space-y-3">
                  <h4 className="text-xs uppercase font-extrabold text-slate-500 tracking-widest">Active Shift duty stamp roster</h4>
                  
                  <div className="overflow-hidden border border-white/5 rounded-xl">
                    <table className="w-full text-left font-sans border-collapse">
                      <thead className="bg-slate-950 border-b border-white/5 text-[9px] text-slate-400 uppercase tracking-widest font-extrabold">
                        <tr>
                          <th className="p-3">Practitioner Staff</th>
                          <th className="p-3">Role</th>
                          <th className="p-3">Check-In Time</th>
                          <th className="p-3">Shift Hours</th>
                          <th className="p-3">Duty Toggle Status</th>
                          <th className="p-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-xs text-slate-300 bg-slate-950/10">
                        {attendance.map((rec) => (
                          <tr key={rec.id} className="hover:bg-white/[0.01]">
                            <td className="p-3 font-bold text-white">{rec.employeeName}</td>
                            <td className="p-3 font-medium text-rose-300 text-[11px]">{rec.role}</td>
                            <td className="p-3 font-mono text-[11.5px] text-slate-400">
                              {rec.checkInTime}
                            </td>
                            <td className="p-3 font-mono font-bold text-slate-200">
                              {rec.hoursEstimate > 0 ? `${rec.hoursEstimate} hrs` : 'Inactive'}
                            </td>
                            <td className="p-3">
                              <span className={`inline-flex px-2 py-0.5 text-[9.5px] rounded font-mono font-bold ${
                                rec.status === 'Present' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                rec.status === 'Late' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                                rec.status === 'On-Leave' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                'bg-slate-800 text-slate-400'
                              }`}>
                                {rec.status}
                              </span>
                            </td>
                            <td className="p-3 text-right space-x-1">
                              <button
                                onClick={() => handleUpdateAttendanceStatus(rec.id, 'Present')}
                                className="px-2 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500 hover:text-white transition-all text-[10px] font-bold text-emerald-400"
                              >
                                Present
                              </button>
                              <button
                                onClick={() => handleUpdateAttendanceStatus(rec.id, 'Late')}
                                className="px-2 py-1 rounded bg-amber-500/10 hover:bg-amber-500 hover:text-white transition-all text-[10px] font-bold text-amber-400"
                              >
                                Late
                              </button>
                              <button
                                onClick={() => handleUpdateAttendanceStatus(rec.id, 'Absent')}
                                className="px-2 py-1 rounded bg-slate-950 hover:bg-slate-800 transition-all text-[10px] font-bold text-slate-400"
                              >
                                Absent
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <p className="text-[10px] text-slate-500 font-serif leading-relaxed text-center italic">
                    Note: Attendance stamp locks biometric credentials into standard shift times automatically.
                  </p>
                </div>
              </motion.div>
            )}


            {/********************** PANEL 5: MEDICINE (INVENTORY MANAGEMENT) **********************/}
            {activeTab === 'medicine' && (
              <motion.div 
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
                id="medicine-dash-tab"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
                  <div>
                    <h2 className="font-serif text-xl sm:text-2xl font-bold text-white">Pharmacy Stock Inventory</h2>
                    <p className="text-slate-400 text-xs font-sans">
                      Track neonate surfactant vials, check-in critical pediatric intravenous lines, and monitor medicine safety thresholds.
                    </p>
                  </div>
                </div>

                {/* Sub-header controls block */}
                <div className="flex flex-col sm:flex-row gap-3 items-stretch justify-between">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      value={medicineSearch}
                      onChange={(e) => setMedicineSearch(e.target.value)}
                      placeholder="Search Surfactants, Vitamin K vials, multivitamin supplements..."
                      className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-white/5 focus:border-rose-500 text-xs text-white"
                    />
                  </div>

                  <div className="px-3 py-2 bg-slate-950/60 rounded-xl border border-white/5 text-[10.5px] font-bold text-rose-300 font-sans flex items-center gap-1.5 shrink-0">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    <span>Low Stock Alerts triggered: {medicines.filter(m => m.stock < m.threshold).length} products</span>
                  </div>
                </div>

                {/* Main dynamic inventory table */}
                <div className="space-y-3">
                  <div className="overflow-hidden border border-white/5 rounded-xl">
                    <table className="w-full text-left font-sans border-collapse">
                      <thead className="bg-slate-950 border-b border-white/5 text-[9px] text-slate-400 uppercase tracking-widest font-extrabold">
                        <tr>
                          <th className="p-3">Drug Compound Product</th>
                          <th className="p-3">Standard Class Category</th>
                          <th className="p-3">Units Pack</th>
                          <th className="p-3 text-center">In-Stock Qty</th>
                          <th className="p-3">Inventory Status Log</th>
                          <th className="p-3 text-right">Adjustment Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-xs text-slate-350 bg-slate-950/5">
                        {medicines
                          .filter(med => med.name.toLowerCase().includes(medicineSearch.toLowerCase()) || med.category.toLowerCase().includes(medicineSearch.toLowerCase()))
                          .map((med) => {
                            const isLow = med.stock < med.threshold;
                            return (
                              <tr key={med.id} className={`hover:bg-white/[0.01] transition-colors ${isLow ? 'bg-amber-500/[0.02]' : ''}`}>
                                <td className="p-3 font-bold text-white">
                                  <div className="flex items-center gap-2">
                                    <Pill className={`w-3.5 h-3.5 ${isLow ? 'text-amber-400' : 'text-rose-400'}`} />
                                    <span>{med.name}</span>
                                  </div>
                                </td>
                                <td className="p-3 font-medium text-[11px] text-rose-350">{med.category}</td>
                                <td className="p-3 text-[10.5px] font-medium text-slate-400">{med.unit}</td>
                                <td className="p-3 text-center font-mono font-bold text-slate-100">
                                  <span className={isLow ? 'text-amber-300 underline underline-offset-4 decoration-amber-500/40' : ''}>
                                    {med.stock}
                                  </span>
                                </td>
                                <td className="p-3">
                                  {isLow ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[9px] font-bold font-sans">
                                      <AlertTriangle className="w-2.5 h-2.5" />
                                      Low Stock (Refill!)
                                    </span>
                                  ) : (
                                    <span className="inline-flex px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-450 border border-emerald-500/10 text-[9px] font-bold font-sans text-emerald-400">
                                      Active Safety Level
                                    </span>
                                  )}
                                </td>
                                <td className="p-3 text-right">
                                  <div className="flex gap-1 justify-end">
                                    <button
                                      onClick={() => adjustMedicineStock(med.id, -5)}
                                      className="px-2 py-1 bg-slate-950 hover:bg-slate-800 text-rose-400 hover:text-rose-350 text-[10px] font-mono rounded-lg border border-white/5 transition-all outline-none"
                                      title="Stock dispatch -5 units"
                                    >
                                      -5
                                    </button>
                                    <button
                                      onClick={() => adjustMedicineStock(med.id, -1)}
                                      className="px-2 py-1 bg-slate-950 hover:bg-slate-800 text-rose-400 hover:text-rose-350 text-[10px] font-mono rounded-lg border border-white/5 transition-all outline-none"
                                      title="Stock dispatch -1 unit"
                                    >
                                      -1
                                    </button>
                                    <button
                                      onClick={() => adjustMedicineStock(med.id, 1)}
                                      className="px-2 py-1 bg-slate-950 hover:bg-slate-800 text-emerald-400 hover:text-emerald-350 text-[10px] font-mono rounded-lg border border-white/5 transition-all outline-none"
                                      title="Refill stock +1 unit"
                                    >
                                      +1
                                    </button>
                                    <button
                                      onClick={() => adjustMedicineStock(med.id, 10)}
                                      className="px-2 py-1 bg-slate-950 hover:bg-slate-800 text-emerald-400 hover:text-emerald-350 text-[10px] font-mono rounded-lg border border-white/5 transition-all outline-none"
                                      title="Batch refill +10 units"
                                    >
                                      +10
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>

                  <div className="p-3 bg-slate-950/40 rounded-xl border border-white/5 text-[10px] text-slate-500 leading-normal text-center italic">
                    Note: Pharmacy inventory values automatically trace to the clinical prescription ledger updates.
                  </div>
                </div>
              </motion.div>
            )}

          </div>

        </div>
      )}
    </div>
  );
}
