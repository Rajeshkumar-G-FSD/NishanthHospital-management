import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Heart, Baby, ShieldAlert, HeartPulse, ShieldCheck, Microscope, UserCheck, Star } from 'lucide-react';

interface MagizhViewProps {
  onOpenBooking: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: 'spring', stiffness: 95, damping: 14 }
  }
};

export default function MagizhView({ onOpenBooking }: MagizhViewProps) {
  // Services & specialties maps directly to the user's uploaded logo guidelines
  const specialties = [
    {
      id: 'spec-maternity',
      title: 'Maternity Care',
      desc: 'Nurturing mother and baby through personalized labor suites and comprehensive childbirth methodologies.',
      icon: Heart,
      iconBg: 'bg-rose-500/10 text-rose-400 border-rose-500/20'
    },
    {
      id: 'spec-fetal',
      title: 'Fetal Medicine & Scanning',
      desc: 'Expert level scans, high resolution prenatal screening, and fetal medicine guidance.',
      icon: ShieldCheck,
      iconBg: 'bg-blue-500/10 text-blue-400 border-blue-500/20'
    },
    {
      id: 'spec-pediatric',
      title: 'Pediatric Care',
      desc: 'In-house level IV NICU, routine immunization schedules, and developmental milestones tracker.',
      icon: Baby,
      iconBg: 'bg-amber-500/10 text-amber-300 border-amber-500/20'
    },
    {
      id: 'spec-gynecology',
      title: "Gynecology & Women's Health",
      desc: "Comprehensive outpatient consultations, standard diagnostic scans, and reproductive health wellness cycles.",
      icon: HeartPulse,
      iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    },
    {
      id: 'spec-adolescent',
      title: 'Adolescent Health & Cervical Cancer Screening',
      desc: 'Compassionate young women wellness counselling alongside comprehensive HPV immunization programs.',
      icon: ShieldAlert,
      iconBg: 'bg-purple-500/10 text-purple-400 border-purple-500/20'
    },
    {
      id: 'spec-female-infertility',
      title: 'Female Infertility Clinic',
      desc: 'Targeted endocrinology profiling, ovulation monitoring programs, and modern therapeutic options.',
      icon: Microscope,
      iconBg: 'bg-pink-500/10 text-pink-400 border-pink-500/20'
    },
    {
      id: 'spec-andrology',
      title: 'Male Andrology Clinic',
      desc: 'Advanced computer-aided diagnostic analysis, lifestyle guidance, and personalized medical pathways.',
      icon: UserCheck,
      iconBg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
    }
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, y: -20 }}
      className="w-full min-h-[85vh] bg-slate-950 text-slate-100 pt-28 pb-16 px-4 md:px-8 max-w-7xl mx-auto flex flex-col justify-center relative"
      id="magizh-view-section"
    >
      {/* Visual background atmospheric elements */}
      <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-rose-500/5 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-amber-500/5 rounded-full filter blur-3xl pointer-events-none" />

      {/* Hero Teaser Section */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-6">
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center space-x-2 bg-rose-500/10 border border-rose-500/20 text-rose-300 px-3 py-1 rounded-full text-xs font-sans font-semibold tracking-wider uppercase"
        >
          <Sparkles className="w-3.5 h-3.5 text-rose-500 fill-rose-500/30" />
          <span>New Initiative By Nishanth Hospital</span>
        </motion.div>

        {/* Big Tamil Title */}
        <motion.h1 
          variants={itemVariants}
          className="font-serif text-5xl sm:text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-rose-100 to-amber-200 tracking-tight leading-none" 
          id="magizh-brand-title"
        >
          மகிழ்
        </motion.h1>
        
        {/* Core Subtitle & Teaser (User requested Tamil message) */}
        <motion.p 
          variants={itemVariants}
          className="text-xl sm:text-2xl font-medium text-slate-200 leading-relaxed font-sans px-4"
        >
          “மகிழ் — <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-amber-300 font-bold">குழந்தை ஆசை கொண்ட குடும்பங்களுக்கு</span> மகிழ்ச்சியை தந்திட விரைவில்”
        </motion.p>

        <motion.p 
          variants={itemVariants}
          className="text-slate-400 text-sm sm:text-base font-sans font-medium max-w-xl mx-auto"
        >
          An upcoming state-of-the-art fertility & hope pavilion by <span className="text-white font-bold font-serif text-sm">Nishanth Hospital</span>, designed to turn long-awaited dreams of parenthood into absolute reality.
        </motion.p>

        {/* Call to action button */}
        <motion.div variants={itemVariants} className="pt-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onOpenBooking}
            className="px-8 py-3.5 rounded-full bg-gradient-to-r from-rose-500 via-pink-600 to-amber-500 text-white font-sans font-bold text-sm shadow-xl shadow-rose-500/15 cursor-pointer transition-all duration-300"
          >
            Inquire About Magizh Care
          </motion.button>
        </motion.div>
      </div>

      {/* Unified Facility Offerings (with Clean SVG Styled Logos matching user screenshot layout) */}
      <div className="space-y-8" id="magizh-offerings-grid-block">
        <motion.div variants={itemVariants} className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-serif font-black text-white">Our Comprehensive Clinical Expertise</h2>
          <p className="text-xs sm:text-sm text-slate-500 font-sans font-semibold uppercase tracking-wider">Presenting all expert consultation wings in Erode under one roof</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4" id="logos-specialties-layout">
          {specialties.map((spec, idx) => {
            const IconComponent = spec.icon;
            return (
              <motion.div
                key={spec.id}
                variants={itemVariants}
                whileHover={{ y: -6, scale: 1.01 }}
                className="group relative p-6 rounded-2xl bg-slate-900/40 border border-white/5 hover:border-white/10 hover:bg-slate-900/70 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-default"
                id={spec.id}
              >
                <div>
                  {/* Decorative badge counting list */}
                  <div className="absolute top-4 right-4 text-xs font-mono font-bold text-slate-700">
                    S0{idx + 1}
                  </div>

                  {/* Header containing SVG-lookalike Lucide icon */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 border border-white/10 shrink-0 ${spec.iconBg} group-hover:scale-105 transition-transform duration-300`}>
                    <IconComponent className="w-6 h-6" />
                  </div>

                  {/* Title & Description matching patient guide flow */}
                  <h3 className="text-lg font-sans font-bold text-white group-hover:text-rose-400 transition-colors duration-300 mb-2">
                    {spec.title}
                  </h3>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-sans font-medium">
                    {spec.desc}
                  </p>
                </div>

                {/* Micro visual border slide on hover */}
                <div className="w-full h-0.5 bg-gradient-to-r from-rose-500 to-amber-400 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left mt-5" />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Professional Trust Footer Badge Specific to Nishanth hospital */}
      <motion.div 
        variants={itemVariants}
        className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs sm:text-sm text-slate-400 gap-4 font-sans" 
        id="magizh-bottom-strip"
      >
        <span className="flex items-center gap-2">
          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span>Backed by 25 Years of Nishanth Obstetric Emergency Care</span>
        </span>
        <span className="text-slate-500 font-medium">
          Maternity, Gynecological, and Pediatric Consultations · Erode
        </span>
      </motion.div>

    </motion.div>
  );
}
