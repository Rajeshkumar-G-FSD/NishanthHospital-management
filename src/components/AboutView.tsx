import React from 'react';
import { motion } from 'motion/react';
import { Heart, ShieldCheck, Award, Clock, Star } from 'lucide-react';

interface AboutViewProps {
  onOpenBooking: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: 'spring', stiffness: 90, damping: 14 }
  }
};

export default function AboutView({ onOpenBooking }: AboutViewProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, y: -20 }}
      className="w-full min-h-[85vh] bg-slate-950 text-slate-100 pt-28 pb-16 px-4 md:px-8 max-w-7xl mx-auto flex flex-col justify-center relative"
      id="about-us-view-section"
    >
      {/* Visual background atmospheric elements */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-rose-500/5 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full filter blur-3xl pointer-events-none" />

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        
        {/* Left Column: Text Content and Accents */}
        <div className="lg:col-span-7 space-y-6 md:space-y-8 flex flex-col justify-center">
          
          <div className="space-y-4">
            {/* Animated Pill badge */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center space-x-2 bg-rose-500/10 border border-rose-500/20 text-rose-300 px-3 py-1 rounded-full text-xs font-sans font-semibold tracking-wider uppercase"
              id="about-tagline-badge"
            >
              <Heart className="w-3 h-3 text-rose-500 fill-rose-500/30" />
              <span>About Us</span>
            </motion.div>

            {/* Main title block */}
            <motion.h1 
              variants={itemVariants}
              className="font-serif text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight"
              id="about-main-headline"
            >
              Best Women and <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-rose-400 via-amber-300 to-rose-400 bg-clip-text text-transparent font-medium italic">
                Child Care Hospital
              </span> <br />
              in Erode
            </motion.h1>
          </div>

          {/* Core Body Text (User provided copy with beautiful typographic readability) */}
          <motion.p 
            variants={itemVariants}
            className="text-slate-300 text-base md:text-lg leading-relaxed font-sans font-medium"
            id="about-body-paragraph"
          >
            Nishanth Hospital is an exclusive women and child care centre with <span className="text-amber-400 font-bold font-serif text-lg">25 years</span> of trusted excellence. 
            From fertility treatments and full-term maternity care to expert pediatric services, we offer comprehensive care under one roof. Backed by a dedicated in-house team and 24x7 obstetric emergency support, we ensure every woman and child receives advanced, personalized care with compassion at every stage of their journey.
          </motion.p>

          {/* Staggered Interactive Stat Badges */}
          <motion.div 
            variants={itemVariants} 
            className="grid grid-cols-2 sm:grid-cols-3 gap-4" 
            id="about-stats-grid"
          >
            <div className="bg-white/5 border border-white/5 p-4 rounded-xl text-center backdrop-blur-sm hover:border-rose-500/20 transition-all duration-300">
              <Award className="w-6 h-6 text-rose-400 mx-auto mb-2" />
              <h3 className="text-xl font-bold font-serif text-white">25+ Years</h3>
              <p className="text-xs text-slate-400 font-sans mt-0.5">Trusted Clinical Excellence</p>
            </div>
            
            <div className="bg-white/5 border border-white/5 p-4 rounded-xl text-center backdrop-blur-sm hover:border-amber-400/20 transition-all duration-300">
              <Clock className="w-6 h-6 text-amber-300 mx-auto mb-2" />
              <h3 className="text-xl font-bold font-serif text-white">24/7 Support</h3>
              <p className="text-xs text-slate-400 font-sans mt-0.5">Obstetric Emergencies</p>
            </div>

            <div className="bg-white/5 border border-white/5 p-4 rounded-xl text-center backdrop-blur-sm col-span-2 sm:col-span-1 hover:border-emerald-500/20 transition-all duration-300">
              <ShieldCheck className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
              <h3 className="text-xl font-bold font-serif text-white">100% Secure</h3>
              <p className="text-xs text-slate-400 font-sans mt-0.5 font-medium">Safe Mother & Baby Care</p>
            </div>
          </motion.div>

          {/* Interactive Call to Action buttons */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 pt-2" 
            id="about-action-buttons"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onOpenBooking}
              className="px-8 py-4 rounded-full bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-sans font-bold text-sm shadow-xl shadow-rose-500/15 text-center cursor-pointer transition-all duration-300 shrink-0"
              id="about-cta-booking"
            >
              Schedule Appointment
            </motion.button>
            <a
              href="tel:+919842960060"
              className="px-8 py-4 rounded-full bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-200 hover:text-white font-sans font-bold text-sm text-center transition-all duration-300 flex items-center justify-center gap-2 hover:border-rose-500/30"
              id="about-cta-phone"
            >
              <span>Emergency helpline: +91 98429 60060</span>
            </a>
          </motion.div>

        </div>

        {/* Right Column: Breathtaking high-quality presentation image with geometric backdrop styling */}
        <motion.div 
          variants={itemVariants}
          className="lg:col-span-5 relative" 
          id="about-hero-image-wrapper"
        >
          {/* Glowing decorative frame */}
          <div className="absolute -inset-1.5 bg-gradient-to-r from-rose-500 to-amber-300 rounded-[2rem] blur-md opacity-25" />
          
          <div className="relative bg-slate-900 border border-white/10 rounded-[1.8rem] overflow-hidden aspect-[4/5] sm:aspect-[4/3] lg:aspect-[4/5] shadow-2xl">
            {/* Extremely fitting, highly professional maternity team and baby graphic */}
            <img
              src="https://images.unsplash.com/photo-1584515933487-759f3d46b7e5?q=80&w=800&auto=format&fit=crop"
              alt="Maternity Care Hospital Representation in Erode"
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              referrerPolicy="no-referrer"
              id="about-hospital-render-img"
            />
            
            {/* Visual labels on top of the graphics highlighting services */}
            <div className="absolute bottom-4 left-4 right-4 bg-slate-950/80 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold font-mono">Specialized Facility</p>
                <h4 className="text-white font-serif text-sm font-bold">Maternal Ward & Pediatric Suite</h4>
              </div>
              <span className="flex items-center space-x-1 text-amber-400 font-mono text-xs font-bold bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>Top Care</span>
              </span>
            </div>
          </div>
          
        </motion.div>

      </div>

      {/* Trust factors bottom strip */}
      <motion.div 
        variants={itemVariants}
        className="mt-16 md:mt-24 pt-8 border-t border-white/5 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-slate-400 font-sans" 
        id="trust-factors-strip"
      >
        <div className="flex gap-3 items-start p-4 rounded-xl hover:bg-white/5 transition-all duration-300">
          <span className="w-8 h-8 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0 font-bold font-serif text-xs">P1</span>
          <div>
            <h5 className="font-bold text-white text-sm mb-1">State-of-the-Art Incubators</h5>
            <p className="text-xs leading-relaxed text-slate-400">Level III specialized pediatric medical care systems safeguarding infants during development stages.</p>
          </div>
        </div>
        <div className="flex gap-3 items-start p-4 rounded-xl hover:bg-white/5 transition-all duration-300">
          <span className="w-8 h-8 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0 font-bold font-serif text-xs">P2</span>
          <div>
            <h5 className="font-bold text-white text-sm mb-1">Compassionate Maternity Suites</h5>
            <p className="text-xs leading-relaxed text-slate-400">Painless delivery, personal labor support, and cozy recovery rooms simulating ultimate home relaxation.</p>
          </div>
        </div>
        <div className="flex gap-3 items-start p-4 rounded-xl hover:bg-white/5 transition-all duration-300">
          <span className="w-8 h-8 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0 font-bold font-serif text-xs">P3</span>
          <div>
            <h5 className="font-bold text-white text-sm mb-1">Advanced Fertility Therapies</h5>
            <p className="text-xs leading-relaxed text-slate-400">Comprehensive diagnostics, hormone balance, and expert care aiding hopeful parents build their families safely.</p>
          </div>
        </div>
      </motion.div>

    </motion.div>
  );
}
