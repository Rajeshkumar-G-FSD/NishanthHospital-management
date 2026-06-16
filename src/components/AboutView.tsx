import React from 'react';
import { motion } from 'motion/react';
import { Heart, ShieldCheck, Award, Clock, Star, ArrowRight } from 'lucide-react';

interface AboutViewProps {
  onOpenBooking: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.05 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 80, damping: 16 } }
};

const STATS = [
  {
    icon: Award,
    value: '25+',
    unit: 'Years',
    label: 'Trusted Excellence',
    color: '#DC2626',
    bg: 'rgba(220,38,38,0.06)',
    border: 'rgba(220,38,38,0.12)',
  },
  {
    icon: Clock,
    value: '24/7',
    unit: '',
    label: 'Emergency Support',
    color: '#F59E0B',
    bg: 'rgba(245,158,11,0.06)',
    border: 'rgba(245,158,11,0.12)',
  },
  {
    icon: ShieldCheck,
    value: '100%',
    unit: '',
    label: 'Safe Mother & Baby Care',
    color: '#16A34A',
    bg: 'rgba(22,163,74,0.06)',
    border: 'rgba(22,163,74,0.12)',
  },
];

const PILLARS = [
  {
    num: '01',
    title: 'State-of-the-Art Incubators',
    desc: 'Level III specialised pediatric medical care systems safeguarding infants during critical development stages.',
    color: '#DC2626',
  },
  {
    num: '02',
    title: 'Compassionate Maternity Suites',
    desc: 'Painless delivery, personalised labour support, and cozy recovery rooms designed for your comfort.',
    color: '#007AFF',
  },
  {
    num: '03',
    title: 'Advanced Fertility Therapies',
    desc: 'Comprehensive diagnostics, hormone balance, and expert care aiding hopeful parents build their families safely.',
    color: '#16A34A',
  },
];

export default function AboutView({ onOpenBooking }: AboutViewProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, y: -16 }}
      className="w-full min-h-screen pb-20"
      style={{ backgroundColor: '#F5F5F7' }}
      id="about-us-view-section"
    >
      {/* ── FULL-WIDTH HERO IMAGE ────────────────────────────── */}
      <div className="relative w-full overflow-hidden" style={{ paddingTop: 'clamp(64px, 10.5vh, 100px)' }}>
        <div className="relative w-full" style={{ height: 'clamp(260px, 42vw, 560px)' }}>
          <img
            src="/frames/nishanth_hospital_frontview.jpeg"
            alt="Nishanth Hospital — Front View"
            className="w-full h-full object-cover object-center"
          />
          {/* Gradient overlay: bottom fade into page bg */}
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(245,245,247,0) 60%, rgba(245,245,247,1) 100%)' }}
          />
          {/* Bottom label bar */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-3 px-5 py-2.5 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 4px 20px rgba(0,0,0,0.10)' }}>
            <Heart className="w-4 h-4 flex-shrink-0" style={{ color: '#DC2626' }} />
            <span className="text-xs font-bold tracking-widest uppercase" style={{ color: '#1D1D1F' }}>
              Nishanth Hospital · Erode · Est. 1999
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 md:px-8 pt-10">

        {/* ── HERO GRID ───────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center mb-20">

          {/* Left: Text */}
          <div className="lg:col-span-7 space-y-8">

            {/* Badge */}
            <motion.div variants={itemVariants}>
              <span
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide"
                style={{ background: 'rgba(220,38,38,0.08)', color: '#DC2626', border: '1px solid rgba(220,38,38,0.15)' }}
              >
                <Heart className="w-3.5 h-3.5 fill-current" style={{ opacity: 0.6 }} />
                About Nishanth Hospital
              </span>
            </motion.div>

            {/* Headline */}
            <motion.div variants={itemVariants} className="space-y-2">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight" style={{ color: '#1D1D1F', lineHeight: 1.05 }}>
                Best Women &amp;<br />
                <span style={{
                  background: 'linear-gradient(135deg, #DC2626 0%, #F59E0B 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  Child Care
                </span>{' '}
                in Erode
              </h1>
            </motion.div>

            {/* Body */}
            <motion.p
              variants={itemVariants}
              className="text-base md:text-lg leading-relaxed"
              style={{ color: '#6E6E73' }}
            >
              Nishanth Hospital is an exclusive women and child care centre with{' '}
              <span className="font-bold" style={{ color: '#1D1D1F' }}>25 years</span> of trusted excellence.
              From fertility treatments and full-term maternity care to expert paediatric services, we offer
              comprehensive care under one roof. Backed by a dedicated in-house team and 24×7 obstetric
              emergency support, we ensure every woman and child receives advanced, personalised care with
              compassion at every stage of their journey.
            </motion.p>

            {/* Stats cards */}
            <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4">
              {STATS.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="p-4 rounded-2xl text-center transition-all duration-300"
                    style={{ background: stat.bg, border: `1px solid ${stat.border}` }}
                  >
                    <Icon className="w-5 h-5 mx-auto mb-2" style={{ color: stat.color }} />
                    <div className="text-xl font-bold tracking-tight" style={{ color: '#1D1D1F' }}>
                      {stat.value}
                      {stat.unit && <span className="text-sm font-semibold ml-0.5">{stat.unit}</span>}
                    </div>
                    <div className="text-[11px] font-medium mt-0.5 leading-tight" style={{ color: '#6E6E73' }}>{stat.label}</div>
                  </div>
                );
              })}
            </motion.div>

            {/* CTAs */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3 pt-1">
              <button
                onClick={onOpenBooking}
                className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm text-white cursor-pointer transition-all duration-200"
                style={{ background: '#DC2626', boxShadow: '0 2px 12px rgba(220,38,38,0.25)' }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = '#B91C1C';
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 20px rgba(220,38,38,0.35)';
                  (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = '#DC2626';
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 2px 12px rgba(220,38,38,0.25)';
                  (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                }}
              >
                <span>Schedule Appointment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href="tel:+919842960060"
                className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm cursor-pointer transition-all duration-200"
                style={{
                  background: '#FFFFFF',
                  border: '1.5px solid #D2D2D7',
                  color: '#1D1D1F',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = '#DC2626'; (e.currentTarget as HTMLAnchorElement).style.color = '#DC2626'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = '#D2D2D7'; (e.currentTarget as HTMLAnchorElement).style.color = '#1D1D1F'; }}
              >
                Emergency: +91 98429 60060
              </a>
            </motion.div>
          </div>

          {/* Right: Image */}
          <motion.div variants={itemVariants} className="lg:col-span-5" id="about-hero-image-wrapper">
            <div className="relative">
              {/* Glow */}
              <div
                className="absolute -inset-2 rounded-3xl blur-xl opacity-30 pointer-events-none"
                style={{ background: 'linear-gradient(135deg, #DC2626, #F59E0B)' }}
              />
              <div
                className="relative rounded-3xl overflow-hidden aspect-[4/5] sm:aspect-[4/3] lg:aspect-[4/5] shadow-2xl"
                style={{ background: '#FFFFFF', border: '1px solid #E5E5EA' }}
              >
                <img
                  src="/frames/nishanth_hospital_frontview.jpeg"
                  alt="Nishanth Hospital — Front View"
                  className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
                />
                {/* Bottom label */}
                <div
                  className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl flex items-center justify-between"
                  style={{
                    background: 'rgba(255,255,255,0.92)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(0,0,0,0.06)',
                  }}
                >
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-semibold font-mono" style={{ color: '#AEAEB2' }}>Specialised Facility</p>
                    <h4 className="text-sm font-bold" style={{ color: '#1D1D1F' }}>Maternal Ward &amp; Paediatric Suite</h4>
                  </div>
                  <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: 'rgba(245,158,11,0.1)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.2)' }}>
                    <Star className="w-3 h-3 fill-current" />
                    Top Care
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── PILLARS STRIP ──────────────────────────────────── */}
        <motion.div
          variants={itemVariants}
          className="pt-12 grid grid-cols-1 md:grid-cols-3 gap-5"
          style={{ borderTop: '1px solid #E5E5EA' }}
        >
          {PILLARS.map((p) => (
            <div
              key={p.num}
              className="group p-6 rounded-2xl cursor-default transition-all duration-300"
              style={{ background: '#FFFFFF', border: '1px solid #E5E5EA', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; }}
            >
              <span className="text-xs font-black font-mono" style={{ color: p.color }}>{p.num}</span>
              <h5 className="text-base font-bold mt-2 mb-2" style={{ color: '#1D1D1F' }}>{p.title}</h5>
              <p className="text-sm leading-relaxed" style={{ color: '#6E6E73' }}>{p.desc}</p>
            </div>
          ))}
        </motion.div>

      </div>
    </motion.div>
  );
}
