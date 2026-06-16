import React from 'react';
import { motion } from 'motion/react';
import { Calendar, Award, Sparkles, HeartHandshake, Baby, Syringe, Layers, Activity } from 'lucide-react';

interface WhyChooseViewProps {
  onOpenBooking: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
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

export default function WhyChooseView({ onOpenBooking }: WhyChooseViewProps) {
  const stats = [
    {
      id: 'stat-deliveries',
      value: '30,000+',
      label: 'Safe Deliveries',
      desc: 'Welcoming new lives safely with clinical excellence for over two decades.',
      icon: Baby,
      color: 'from-rose-500/20 to-rose-600/10',
      iconColor: 'text-rose-400',
      borderColor: 'group-hover:border-rose-500/30',
    },
    {
      id: 'stat-epidural',
      value: '1,500+',
      label: 'Epidural Deliveries',
      desc: 'Pioneering painless childbirth procedures with dedicated anesthesiology team support.',
      icon: Syringe,
      color: 'from-amber-500/20 to-amber-600/10',
      iconColor: 'text-amber-300',
      borderColor: 'group-hover:border-amber-400/30',
    },
    {
      id: 'stat-iui',
      value: '1,000+',
      label: 'Successful IUI Conceptions',
      desc: 'Enabling reproductive joy through advanced diagnostic and specialized fertility protocols.',
      icon: Sparkles,
      color: 'from-emerald-500/20 to-emerald-600/10',
      iconColor: 'text-emerald-400',
      borderColor: 'group-hover:border-emerald-400/30',
    },
    {
      id: 'stat-lap',
      value: '5,000+',
      label: 'Lap Gynec Surgeries',
      desc: 'Expert minimally invasive solutions guaranteeing faster postpartum recovery and absolute safety.',
      icon: Layers,
      color: 'from-sky-500/20 to-sky-600/10',
      iconColor: 'text-sky-400',
      borderColor: 'group-hover:border-sky-400/30',
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, y: -20 }}
      className="w-full min-h-[85vh] bg-slate-950 text-slate-100 pt-28 pb-16 px-4 md:px-8 max-w-7xl mx-auto flex flex-col justify-center relative"
      id="why-choose-us-section"
    >
      {/* Visual background atmospheric elements */}
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-rose-500/5 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute top-2/3 left-1/4 w-80 h-80 bg-emerald-500/5 rounded-full filter blur-3xl pointer-events-none" />

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        
        {/* Left Column: Core Medical Value Proposition statement & CTA */}
        <div className="lg:col-span-5 space-y-6 md:space-y-8 flex flex-col justify-center">
          <div className="space-y-4">
            {/* Tagline Badge */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-xs font-sans font-semibold tracking-wider uppercase"
              id="why-choose-tagline-badge"
            >
              <HeartHandshake className="w-3.5 h-3.5 text-emerald-400" />
              <span>Why Choose Us</span>
            </motion.div>

            {/* Title / Main Question */}
            <motion.h1 
              variants={itemVariants}
              className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight"
              id="why-choose-heading"
            >
              Excellence & <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-rose-400 bg-clip-text text-transparent font-medium italic">
                Trusted Experience
              </span> <br />
              At Your Service
            </motion.h1>
          </div>

          {/* Highlight Card with 24x7 statement */}
          <motion.div 
            variants={itemVariants}
            className="p-5 md:p-6 rounded-2xl bg-slate-900/60 border border-emerald-500/10 hover:border-emerald-500/20 transition-all duration-300 shadow-xl"
            id="highlight-availability-card"
          >
            <div className="flex gap-4 items-start">
              <span className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20 font-bold">
                24x7
              </span>
              <div>
                <h3 className="font-serif font-bold text-white text-base md:text-lg mb-1.5 label-24x7">
                  Available 24×7×365
                </h3>
                <p className="text-slate-300 text-sm md:text-base leading-relaxed font-sans font-medium">
                  Expert Obstetrician and Paediatrician care, every hour, every day, all year round.
                </p>
              </div>
            </div>
          </motion.div>

          {/* General hospital values with animation stagger effect */}
          <motion.div 
            variants={itemVariants}
            className="space-y-3 font-sans text-sm text-slate-400" 
            id="hospital-assurance-bullets"
          >
            <div className="flex items-center gap-2.5 hover:text-white transition-colors duration-250">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
              <span>Fully integrated level III Neonatal ICU facility</span>
            </div>
            <div className="flex items-center gap-2.5 hover:text-white transition-colors duration-250">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
              <span>In-house pediatric & maternity specialists pool</span>
            </div>
            <div className="flex items-center gap-2.5 hover:text-white transition-colors duration-250">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
              <span>Elite sterile surgical chambers & recovery suites</span>
            </div>
          </motion.div>

          {/* Interactive Actions */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 pt-2" 
            id="why-choose-actions"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onOpenBooking}
              className="px-8 py-4 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-sans font-bold text-sm shadow-xl shadow-emerald-500/15 text-center cursor-pointer transition-all duration-300 shrink-0"
              id="why-choose-cta-booking"
            >
              Consult an Expert
            </motion.button>
            <a
              href="tel:+919842960060"
              className="px-8 py-4 rounded-full bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-200 hover:text-white font-sans font-bold text-sm text-center transition-all duration-300 flex items-center justify-center gap-2 hover:border-emerald-500/20"
              id="why-choose-cta-call"
            >
              <span>Emergency Hotline: +91 98429 60060</span>
            </a>
          </motion.div>
        </div>

        {/* Right Column: Dynamic Bento Stats Grid with springy load effects */}
        <div className="lg:col-span-7" id="why-choose-stats-bento">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {stats.map((stat, idx) => {
              const IconComp = stat.icon;
              return (
                <motion.div
                  key={stat.id}
                  variants={itemVariants}
                  whileHover={{ y: -6, scale: 1.01 }}
                  className={`group relative p-6 md:p-8 rounded-2xl bg-gradient-to-br ${stat.color} border border-white/5 hover:border-emerald-500/20 hover:bg-slate-900/40 transition-all duration-300 shadow-lg cursor-default overflow-hidden`}
                  id={stat.id}
                >
                  <div className="absolute top-4 right-4 text-white/5 font-mono text-5xl font-black select-none pointer-events-none group-hover:text-white/10 transition-colors duration-500">
                    0{idx + 1}
                  </div>
                  
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl bg-slate-950 flex items-center justify-center mb-6 border border-white/10 ${stat.iconColor} group-hover:scale-105 transition-transform duration-300`}>
                    <IconComp className="w-6 h-6" />
                  </div>

                  {/* Value */}
                  <div className="space-y-2">
                    <h2 className="text-3xl sm:text-4xl font-serif font-black text-white tracking-tight">
                      {stat.value}
                    </h2>
                    <h3 className="text-base sm:text-lg font-sans font-bold text-slate-200">
                      {stat.label}
                    </h3>
                    <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mt-1 font-medium font-sans">
                      {stat.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Aesthetic bottom bar highlighting excellence */}
      <motion.div 
        variants={itemVariants}
        className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between text-xs sm:text-sm text-slate-400 gap-4 font-sans" 
        id="why-choose-bottom-strip"
      >
        <span className="flex items-center gap-2 hover:text-white transition-colors">
          <Award className="w-4 h-4 text-amber-400" />
          <span>Accredited Clinical Quality Practices</span>
        </span>
        <span className="flex items-center gap-2 hover:text-white transition-colors">
          <Calendar className="w-4 h-4 text-rose-400" />
          <span>Trusted across Erode & surrounding regions since 2001</span>
        </span>
        <span className="flex items-center gap-2 hover:text-white transition-colors">
          <Activity className="w-4 h-4 text-emerald-400" />
          <span>Equipped with advanced pediatric ventilation mechanisms</span>
        </span>
      </motion.div>

    </motion.div>
  );
}
