import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Header from './components/Header';
import BookingModal from './components/BookingModal';
import ScrollSequencePlayer from './components/ScrollSequencePlayer';
import TeamCarousel, { TeamMember } from './components/TeamCarousel';
import AboutView from './components/AboutView';
import WhyChooseView from './components/WhyChooseView';
import MagizhView from './components/MagizhView';
import ContactSection from './components/ContactSection';
import DoctorPortal from './components/DoctorPortal';

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
    bio: 'An alumnus of the prestigious Madras Medical College and a Double Gold Medalist (UG & PG), Dr. Abhishant holds a fellowship in andrology. He specializes in laser urology and microscopic male infertility procedures, offering advanced care for men’s reproductive and urological health.',
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
    <div className="relative min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-rose-500/25 selection:text-rose-200" id="maternity-app-root">
      
      {/* Main Header Component with navigation actions, current view, and view setter */}
      <Header 
        onContactClick={handleOpenModal} 
        currentView={currentView}
        onViewChange={(view) => {
          setCurrentView(view);
          if (view === 'contact') {
            setTimeout(() => {
              const el = document.getElementById('contact-section');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }, 100);
          } else {
            // Scroll up so we enter from the top for both views
            window.scrollTo({ top: 0, behavior: 'instant' as any });
          }
        }}
      />

      {/* Dynamic View rendering depending on header click tabs */}
      <main className="w-full grow relative z-10 animate-fade-in" id="main-content-area">
        <AnimatePresence mode="wait">
          {currentView === 'home' || currentView === 'contact' ? (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="w-full flex flex-col"
            >
              {/* Home view containing the immersive sequence walk and core consultants */}
              <ScrollSequencePlayer onOpenBooking={handleOpenModal} />
              
              <TeamCarousel 
                members={TEAM_MEMBERS} 
                title="Meet Our Core Team of Consultants" 
                titleSize="md"
                titleColor="rgb(244, 63, 94)"
                autoPlay={5000}
                grayscaleEffect={false}
                className="relative z-20"
                onBookClick={(doctorName) => handleOpenModal(doctorName)}
              />

              <ContactSection />
            </motion.div>
          ) : currentView === 'doctors' ? (
            <motion.div
              key="doctors"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="w-full pt-28 pb-16 bg-slate-950 flex flex-col justify-center relative min-h-[85vh]"
            >
              {/* Visual background atmospheric elements to match the other pages */}
              <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-rose-500/5 rounded-full filter blur-3xl pointer-events-none" />
              <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full filter blur-3xl pointer-events-none" />
              
              <TeamCarousel 
                members={TEAM_MEMBERS} 
                title="Meet Our Core Team of Consultants" 
                titleSize="md"
                titleColor="rgb(244, 63, 94)"
                autoPlay={5000}
                grayscaleEffect={false}
                className="border-none py-0 bg-transparent relative z-10"
                onBookClick={(doctorName) => handleOpenModal(doctorName)}
              />
            </motion.div>
          ) : currentView === 'about' ? (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="w-full"
            >
              {/* Robust state AboutUs page presenting 25 years of excellence and specialized hospital insights */}
              <AboutView onOpenBooking={handleOpenModal} />
            </motion.div>
          ) : currentView === 'why-choose' ? (
            <motion.div
              key="why-choose"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="w-full"
            >
              {/* High-impact clinical stats and trust factor insights showing 30,000+ safe deliveries */}
              <WhyChooseView onOpenBooking={handleOpenModal} />
            </motion.div>
          ) : currentView === 'magizh' ? (
            <motion.div
              key="magizh"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="w-full"
            >
              {/* Upcoming specialty fertility care block providing hope for aspiring parents */}
              <MagizhView onOpenBooking={handleOpenModal} />
            </motion.div>
          ) : (
            <motion.div
              key="doctor-portal"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="w-full"
            >
              {/* Real-time clinician dashboard to view live Firestore appointments list */}
              <DoctorPortal />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Elegant, humble, literal footer */}
      <footer className="w-full py-4 text-center border-t border-white/5 bg-slate-950 text-[11px] font-sans font-medium text-slate-500 z-25 relative" id="app-footer">
        © 2026 Nishant Hospital. All rights reserved. Developed by{' '}
        <a 
          href="https://www.datazync.com" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="inline-block text-rose-400 hover:text-amber-400 font-semibold transition-all duration-300 hover:scale-105 hover:underline decoration-rose-400 hover:decoration-amber-400 underline-offset-4"
        >
          www.datazync.com
        </a>
      </footer>

      {/* Interactivity modal popup for appointment scheduling and intake */}
      <BookingModal isOpen={isModalOpen} onClose={handleCloseModal} preselectedDoctor={selectedDoctor} />
      
    </div>
  );
}
