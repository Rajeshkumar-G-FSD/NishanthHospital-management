import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Heart, Baby, ShieldAlert, HeartPulse, ShieldCheck, Microscope, UserCheck, Star, ArrowRight } from 'lucide-react';
import ScrollReveal, { staggerContainer, revealUp, revealScale } from './ScrollReveal';

interface MagizhViewProps {
  onOpenBooking: () => void;
}

const SPECIALTIES = [
  {
    id: 'spec-maternity',
    title: 'Maternity Care',
    desc: 'Nurturing mother and baby through personalised labour suites and comprehensive childbirth methodologies.',
    icon: Heart,
    color: '#DC2626',
    bg: 'rgba(220,38,38,0.07)',
    border: 'rgba(220,38,38,0.14)',
  },
  {
    id: 'spec-fetal',
    title: 'Fetal Medicine & Scanning',
    desc: 'Expert level scans, high-resolution prenatal screening, and specialist fetal medicine guidance.',
    icon: ShieldCheck,
    color: '#007AFF',
    bg: 'rgba(0,122,255,0.07)',
    border: 'rgba(0,122,255,0.14)',
  },
  {
    id: 'spec-pediatric',
    title: 'Pediatric Care',
    desc: 'In-house Level IV NICU, routine immunisation schedules, and developmental milestone tracking.',
    icon: Baby,
    color: '#F59E0B',
    bg: 'rgba(245,158,11,0.07)',
    border: 'rgba(245,158,11,0.14)',
  },
  {
    id: 'spec-gynecology',
    title: "Gynecology & Women's Health",
    desc: 'Comprehensive outpatient consultations, diagnostic scans, and reproductive health wellness cycles.',
    icon: HeartPulse,
    color: '#16A34A',
    bg: 'rgba(22,163,74,0.07)',
    border: 'rgba(22,163,74,0.14)',
  },
  {
    id: 'spec-adolescent',
    title: 'Adolescent Health & Cervical Screening',
    desc: "Compassionate young women's wellness counselling alongside comprehensive HPV immunisation programs.",
    icon: ShieldAlert,
    color: '#7C3AED',
    bg: 'rgba(124,58,237,0.07)',
    border: 'rgba(124,58,237,0.14)',
  },
  {
    id: 'spec-female-infertility',
    title: 'Female Infertility Clinic',
    desc: 'Targeted endocrinology profiling, ovulation monitoring programs, and modern therapeutic options.',
    icon: Microscope,
    color: '#DB2777',
    bg: 'rgba(219,39,119,0.07)',
    border: 'rgba(219,39,119,0.14)',
  },
  {
    id: 'spec-andrology',
    title: 'Male Andrology Clinic',
    desc: 'Advanced computer-aided diagnostic analysis, lifestyle guidance, and personalised medical pathways.',
    icon: UserCheck,
    color: '#0891B2',
    bg: 'rgba(8,145,178,0.07)',
    border: 'rgba(8,145,178,0.14)',
  },
];

export default function MagizhView({ onOpenBooking }: MagizhViewProps) {
  return (
    <div
      className="w-full min-h-screen pt-32 pb-20 px-5 md:px-8"
      style={{ backgroundColor: '#F5F5F7' }}
      id="magizh-view-section"
    >
      <div className="max-w-7xl mx-auto">

        {/* ── HERO SECTION ────────────────────────────────────── */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16 space-y-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {/* Badge */}
          <motion.div variants={revealUp}>
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide"
              style={{ background: 'rgba(220,38,38,0.08)', color: '#DC2626', border: '1px solid rgba(220,38,38,0.15)' }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              New Initiative by Nishanth Hospital
            </span>
          </motion.div>

          {/* Tamil title */}
          <motion.h1
            variants={revealUp}
            className="font-bold tracking-tight"
            style={{
              fontSize: 'clamp(56px, 10vw, 96px)',
              lineHeight: 1,
              background: 'linear-gradient(135deg, #1D1D1F 0%, #DC2626 50%, #F59E0B 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
            id="magizh-brand-title"
          >
            மகிழ்
          </motion.h1>

          {/* Tamil subtitle */}
          <motion.p
            variants={revealUp}
            className="text-lg sm:text-xl font-medium leading-relaxed"
            style={{ color: '#1D1D1F' }}
          >
            "மகிழ் —{' '}
            <span style={{
              background: 'linear-gradient(135deg, #DC2626, #F59E0B)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontWeight: 700,
            }}>
              குழந்தை ஆசை கொண்ட குடும்பங்களுக்கு
            </span>
            {' '}மகிழ்ச்சியை தந்திட விரைவில்"
          </motion.p>

          {/* English description */}
          <motion.p
            variants={revealUp}
            className="text-base leading-relaxed"
            style={{ color: '#6E6E73' }}
          >
            An upcoming state-of-the-art fertility &amp; hope pavilion by{' '}
            <span className="font-semibold" style={{ color: '#1D1D1F' }}>Nishanth Hospital</span>,
            designed to turn long-awaited dreams of parenthood into absolute reality.
          </motion.p>

          {/* CTA */}
          <motion.div variants={revealUp} className="pt-2">
            <button
              onClick={onOpenBooking}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm text-white cursor-pointer transition-all duration-200"
              style={{ background: '#DC2626', boxShadow: '0 2px 14px rgba(220,38,38,0.28)' }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.background = '#B91C1C';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 20px rgba(220,38,38,0.38)';
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.background = '#DC2626';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 2px 14px rgba(220,38,38,0.28)';
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
              }}
            >
              Inquire About Magizh Care
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </motion.div>

        {/* ── DIVIDER ─────────────────────────────────────────── */}
        <ScrollReveal>
          <div
            className="mb-12 text-center space-y-2"
            style={{ borderTop: '1px solid #E5E5EA', paddingTop: '48px' }}
          >
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: '#1D1D1F' }}>
              Our Comprehensive Clinical Expertise
            </h2>
            <p className="text-sm font-semibold uppercase tracking-widest" style={{ color: '#AEAEB2' }}>
              All expert consultation wings under one roof in Erode
            </p>
          </div>
        </ScrollReveal>

        {/* ── SPECIALTIES GRID — stagger each card on scroll ──── */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          id="logos-specialties-layout"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {SPECIALTIES.map((spec, idx) => {
            const Icon = spec.icon;
            return (
              <motion.div
                key={spec.id}
                variants={revealScale}
                whileHover={{ y: -4, scale: 1.01 }}
                id={spec.id}
                className="group relative p-6 rounded-2xl cursor-default transition-all duration-300 flex flex-col"
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E5E5EA',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 32px rgba(0,0,0,0.08)';
                  (e.currentTarget as HTMLDivElement).style.borderColor = spec.border;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)';
                  (e.currentTarget as HTMLDivElement).style.borderColor = '#E5E5EA';
                }}
              >
                {/* Index badge */}
                <div className="absolute top-4 right-4 text-[10px] font-black font-mono" style={{ color: '#D2D2D7' }}>
                  {String(idx + 1).padStart(2, '0')}
                </div>

                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-105"
                  style={{ background: spec.bg, border: `1px solid ${spec.border}` }}
                >
                  <Icon className="w-5 h-5" style={{ color: spec.color }} />
                </div>

                {/* Text */}
                <h3 className="text-base font-bold mb-2 transition-colors duration-300" style={{ color: '#1D1D1F' }}>
                  {spec.title}
                </h3>
                <p className="text-sm leading-relaxed flex-1" style={{ color: '#6E6E73' }}>{spec.desc}</p>

                {/* Bottom accent */}
                <div
                  className="w-full h-0.5 rounded-full mt-5 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                  style={{ background: `linear-gradient(to right, ${spec.color}, transparent)` }}
                />
              </motion.div>
            );
          })}
        </motion.div>

        {/* ── TRUST FOOTER ────────────────────────────────────── */}
        <ScrollReveal delay={0.1}>
          <div
            className="mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm"
            style={{ borderTop: '1px solid #E5E5EA', color: '#6E6E73' }}
            id="magizh-bottom-strip"
          >
            <span className="flex items-center gap-2.5">
              <Star className="w-4 h-4 fill-current" style={{ color: '#F59E0B' }} />
              Backed by 25 years of Nishanth Obstetric Emergency Care
            </span>
            <span className="font-medium" style={{ color: '#AEAEB2' }}>
              Maternity · Gynaecology · Paediatrics · Erode
            </span>
          </div>
        </ScrollReveal>

      </div>
    </div>
  );
}
