import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Facebook, Instagram, Linkedin, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import Header from './components/Header';
import BookingModal from './components/BookingModal';
import ScrollSequencePlayer from './components/ScrollSequencePlayer';
import TeamCarousel, { TeamMember } from './components/TeamCarousel';
import AboutView from './components/AboutView';
import WhyChooseView from './components/WhyChooseView';
import MagizhView from './components/MagizhView';
import ContactSection from './components/ContactSection';
import DoctorPortal from './components/DoctorPortal';
import ScrollReveal from './components/ScrollReveal';

const TEAM_MEMBERS: TeamMember[] = [
  {
    id: '1',
    name: 'Dr. Sumathi Padmanaban',
    role: 'Gold Medalist in Obstetrics & Gynaecology',
    image: 'https://i.postimg.cc/CMZXtN4z/Dr-Sumathi.avif',
    bio: 'Dr. Sumathi Padmanaban, a Gold Medalist in Obstetrics & Gynaecology, leads a dedicated team with over 30 years of experience in Erode. Specializing in normal and painless deliveries, her team is available 24x7 for emergency obstetric care at Nishanth Hospital.',
  },
  {
    id: '2',
    name: 'Dr. Padmanaban',
    role: 'Consultant Anesthesiologist & Managing Director',
    image: 'https://i.postimg.cc/XXSwD3kt/Dr-Padmanaban.avif',
    bio: 'A distinguished anesthesiologist with over 30 years of experience, Dr. Padmanaban completed his post graduate training at the renowned Manipal Medical College. He has a special interest in obstetric anesthesia, particularly epidural anesthesia for painless labor, ensuring safe and comfortable child birth experiences.',
  },
  {
    id: '3',
    name: 'Dr. Abhishant Padmanaban',
    role: 'Consultant Urologist & Andrologist',
    image: 'https://i.postimg.cc/G9wkSrxf/Dr-Abhishant.avif',
    bio: 'An alumnus of the prestigious Madras Medical College and a Double Gold Medalist (UG & PG), Dr. Abhishant holds a fellowship in andrology. He specializes in laser urology and microscopic male infertility procedures, offering advanced care for men\'s reproductive and urological health.',
  },
  {
    id: '4',
    name: 'Dr. Sruthi Abhishant',
    role: 'Fertility Specialist',
    image: 'https://i.postimg.cc/SQX35rGQ/Dr-Srthi.avif',
    bio: 'Dr. Sruthi Abhishant, MBBS, MS, DNB (OBG), FRM, is an academic topper and dedicated Fertility Specialist trained at the prestigious Madras Medical College. Known for her clinical expertise, she leads fertility services at Nishanth Hospital, Erode, guiding women through every stage of their reproductive journey.',
  },
  {
    id: '5',
    name: 'Dr. Anbarasan',
    role: 'Consultant Paediatrician & Neonatologist',
    image: 'https://i.postimg.cc/QVGpnsJR/Dr-Anbarasan.avif',
    bio: 'An alumnus of the prestigious Madras Medical College, Dr. Anbarasan brings expert, evidence-based care to newborns and children, with a focus on supporting both the child and family through every stage of development.',
  },
  {
    id: '6',
    name: 'Dr. Sowbharnika C.P',
    role: 'Consultant Obstetrician',
    image: 'https://i.postimg.cc/Qx3pWxPq/Dr-sowbarnika.avif',
    bio: 'An academic topper and graduate of Coimbatore Medical College, Dr. Sowbharnika is a compassionate obstetrician, dedicated to safe pregnancies and personalized birthing experiences, with a strong focus on antenatal care and maternal wellness.',
  },
  {
    id: '7',
    name: 'Dr. Kokilavani',
    role: 'Consultant Obstetrician & Gynecologist',
    image: 'https://i.postimg.cc/wTphsTPc/Dr-gokila.avif',
    bio: 'With 10 years of expertise in high-risk obstetrics, Dr. Kokilavani is a dedicated specialist committed to ensuring safe pregnancies and personalized care. An alumnus of Thoothukudi and Thanjavur Medical Colleges, she brings extensive experience in managing complex maternal health cases with a focus on maternal and fetal well-being.',
  },
  {
    id: '8',
    name: 'Dr. Guha Preetha',
    role: 'Consultant Fetal Medicine Specialist',
    image: 'https://i.postimg.cc/yYHFSY5P/Dr-Guha-Preetha.avif',
    bio: 'Trained at CIMAR and having worked in one of the leading centers of excellence in fetal medicine, Dr. Guha Preetha is an expert in targeted fetal scans, prenatal screening, and genetic evaluations, ensuring early and accurate insights for optimal pregnancy care.',
  }
];

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<string | undefined>(undefined);
  const [currentView, setCurrentView] = useState<'home' | 'about' | 'why-choose' | 'magizh' | 'contact' | 'doctor' | 'doctors'>('home');

  const handleOpenModal = (doctor?: any) => {
    setSelectedDoctor(typeof doctor === 'string' ? doctor : undefined);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setSelectedDoctor(undefined);
    setIsModalOpen(false);
  };

  return (
    <div
      className="relative min-h-screen flex flex-col"
      style={{ backgroundColor: '#F5F5F7', color: '#1D1D1F' }}
      id="maternity-app-root"
    >
      <Header
        onContactClick={handleOpenModal}
        currentView={currentView}
        onViewChange={(view) => {
          setCurrentView(view);
          if (view === 'contact') {
            setTimeout(() => {
              const el = document.getElementById('contact-section');
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
          } else {
            window.scrollTo({ top: 0, behavior: 'instant' as any });
          }
        }}
      />

      <main className="w-full grow relative z-10 animate-fade-in" id="main-content-area">
        <AnimatePresence mode="wait">
          {currentView === 'home' || currentView === 'contact' ? (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="w-full flex flex-col"
            >
              <ScrollSequencePlayer onOpenBooking={handleOpenModal} />

              <ScrollReveal y={48}>
                <TeamCarousel
                  members={TEAM_MEMBERS}
                  title="Meet Our Specialists"
                  titleSize="md"
                  autoPlay={5000}
                  grayscaleEffect={false}
                  className="relative z-20"
                  onBookClick={(doctorName) => handleOpenModal(doctorName)}
                />
              </ScrollReveal>

              <ContactSection />
            </motion.div>
          ) : currentView === 'doctors' ? (
            <motion.div
              key="doctors"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="w-full pt-32 pb-16 flex flex-col justify-center relative min-h-[85vh]"
              style={{ backgroundColor: '#F5F5F7' }}
            >
              <TeamCarousel
                members={TEAM_MEMBERS}
                title="Meet Our Specialists"
                titleSize="md"
                autoPlay={5000}
                grayscaleEffect={false}
                className="border-none py-0 bg-transparent relative z-10"
                onBookClick={(doctorName) => handleOpenModal(doctorName)}
              />
            </motion.div>
          ) : currentView === 'about' ? (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="w-full"
            >
              <AboutView onOpenBooking={handleOpenModal} />
            </motion.div>
          ) : currentView === 'why-choose' ? (
            <motion.div
              key="why-choose"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="w-full"
            >
              <WhyChooseView onOpenBooking={handleOpenModal} />
            </motion.div>
          ) : currentView === 'magizh' ? (
            <motion.div
              key="magizh"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="w-full"
            >
              <MagizhView onOpenBooking={handleOpenModal} />
            </motion.div>
          ) : (
            <motion.div
              key="doctor-portal"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="w-full"
            >
              <DoctorPortal />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Premium Apple-style footer */}
      <footer className="w-full border-t" style={{ backgroundColor: '#F5F5F7', borderTopColor: '#D2D2D7' }} id="app-footer">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand column */}
          <div className="md:col-span-2 space-y-4">
            <img
              src="https://i.postimg.cc/d1Mjps1w/Nishanth-logo.avif"
              alt="Nishanth Hospital"
              className="h-10 w-auto object-contain"
              referrerPolicy="no-referrer"
            />
            <p className="text-sm leading-relaxed" style={{ color: '#6E6E73' }}>
              Nishanth Hospital is Erode's trusted centre for women and child care, delivering 25+ years of compassionate, expert-led medical services.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a href="https://www.facebook.com/nishanthospital/" target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
                style={{ background: '#E5E5EA', color: '#6E6E73' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#1877F2'; (e.currentTarget as HTMLElement).style.color = '#fff'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#E5E5EA'; (e.currentTarget as HTMLElement).style.color = '#6E6E73'; }}>
                <Facebook className="w-3.5 h-3.5" />
              </a>
              <a href="https://www.instagram.com/dr.sruthi_herhealth" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
                style={{ background: '#E5E5EA', color: '#6E6E73' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#E1306C'; (e.currentTarget as HTMLElement).style.color = '#fff'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#E5E5EA'; (e.currentTarget as HTMLElement).style.color = '#6E6E73'; }}>
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube"
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
                style={{ background: '#E5E5EA', color: '#6E6E73' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#FF0000'; (e.currentTarget as HTMLElement).style.color = '#fff'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#E5E5EA'; (e.currentTarget as HTMLElement).style.color = '#6E6E73'; }}>
                <Youtube className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-3">
            <h5 className="text-sm font-semibold" style={{ color: '#1D1D1F' }}>Services</h5>
            <ul className="space-y-2 text-sm" style={{ color: '#6E6E73' }}>
              {['Maternity Care', 'Fertility Clinic', 'Fetal Medicine', 'Pediatrics', 'Gynecology', 'Urology'].map(s => (
                <li key={s}><span className="hover:text-rose-600 cursor-pointer transition-colors">{s}</span></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h5 className="text-sm font-semibold" style={{ color: '#1D1D1F' }}>Contact</h5>
            <ul className="space-y-2.5 text-sm" style={{ color: '#6E6E73' }}>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-rose-500" />
                <span>279, EVN Rd, Erode, Tamil Nadu 638009</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0 text-rose-500" />
                <a href="tel:+919842960060" className="hover:text-rose-600 transition-colors font-medium">+91 98429 60060</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0 text-rose-500" />
                <a href="mailto:Nishanthhospitalerode@gmail.com" className="hover:text-rose-600 transition-colors break-all">
                  Nishanthhospitalerode@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t px-6 md:px-12 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs" style={{ borderTopColor: '#D2D2D7', color: '#AEAEB2' }}>
          <span>© 2026 Nishanth Hospital, Erode. All rights reserved.</span>
          <span>
            Developed by{' '}
            <a
              href="https://www.datazync.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold transition-colors"
              style={{ color: '#007AFF' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#0066CC'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#007AFF'}
            >
              DataZync
            </a>
          </span>
        </div>
      </footer>

      <BookingModal isOpen={isModalOpen} onClose={handleCloseModal} preselectedDoctor={selectedDoctor} />
    </div>
  );
}
