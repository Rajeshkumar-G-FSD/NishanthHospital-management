import React from 'react';
import { motion } from 'motion/react';
import { Calendar, Award, Sparkles, HeartHandshake, Baby, Syringe, Layers, Activity, Check, ArrowRight } from 'lucide-react';
import ScrollReveal, { staggerContainer, revealUp, revealScale } from './ScrollReveal';

interface WhyChooseViewProps {
  onOpenBooking: () => void;
}

const STATS = [
  {
    id: 'stat-deliveries',
    value: '30,000+',
    label: 'Safe Deliveries',
    desc: 'Welcoming new lives safely with clinical excellence for over two decades.',
    icon: Baby,
    accentColor: '#DC2626',
    accentBg: 'rgba(220,38,38,0.06)',
    accentBorder: 'rgba(220,38,38,0.12)',
  },
  {
    id: 'stat-epidural',
    value: '1,500+',
    label: 'Epidural Deliveries',
    desc: 'Pioneering painless childbirth with dedicated anaesthesiology team support.',
    icon: Syringe,
    accentColor: '#F59E0B',
    accentBg: 'rgba(245,158,11,0.06)',
    accentBorder: 'rgba(245,158,11,0.12)',
  },
  {
    id: 'stat-iui',
    value: '1,000+',
    label: 'Successful IUI Conceptions',
    desc: 'Enabling reproductive joy through advanced fertility protocols.',
    icon: Sparkles,
    accentColor: '#16A34A',
    accentBg: 'rgba(22,163,74,0.06)',
    accentBorder: 'rgba(22,163,74,0.12)',
  },
  {
    id: 'stat-lap',
    value: '5,000+',
    label: 'Lap Gynec Surgeries',
    desc: 'Minimally invasive solutions ensuring faster recovery and absolute safety.',
    icon: Layers,
    accentColor: '#007AFF',
    accentBg: 'rgba(0,122,255,0.06)',
    accentBorder: 'rgba(0,122,255,0.12)',
  },
];

const ASSURANCES = [
  'Fully integrated Level III Neonatal ICU facility',
  'In-house paediatric & maternity specialists on call',
  'Elite sterile surgical chambers & recovery suites',
  'Advanced paediatric ventilation systems',
];

export default function WhyChooseView({ onOpenBooking }: WhyChooseViewProps) {
  return (
    <div
      className="w-full min-h-screen pt-32 pb-20 px-5 md:px-8"
      style={{ backgroundColor: '#F5F5F7' }}
      id="why-choose-us-section"
    >
      <div className="max-w-7xl mx-auto">

        {/* ── SECTION HEADER ──────────────────────────────────── */}
        <motion.div
          className="text-center max-w-2xl mx-auto mb-14 space-y-4"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          <motion.div variants={revealUp}>
            <span
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide"
              style={{ background: 'rgba(22,163,74,0.08)', color: '#16A34A', border: '1px solid rgba(22,163,74,0.15)' }}
            >
              <HeartHandshake className="w-3.5 h-3.5" />
              Why Choose Nishanth Hospital
            </span>
          </motion.div>
          <motion.h1 variants={revealUp} className="text-4xl sm:text-5xl font-bold tracking-tight" style={{ color: '#1D1D1F' }}>
            Excellence &amp;{' '}
            <span style={{
              background: 'linear-gradient(135deg, #16A34A 0%, #007AFF 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Trusted Experience
            </span>
          </motion.h1>
          <motion.p variants={revealUp} className="text-base md:text-lg" style={{ color: '#6E6E73' }}>
            Three decades of obstetric excellence, paediatric mastery, and compassionate care — all under one roof in Erode.
          </motion.p>
        </motion.div>

        {/* ── STATS BENTO GRID ─ each card reveals on scroll ───── */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-12"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {STATS.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.id}
                variants={revealScale}
                whileHover={{ y: -4, scale: 1.01 }}
                id={stat.id}
                className="group relative p-8 rounded-2xl cursor-default transition-all duration-300"
                style={{
                  background: '#FFFFFF',
                  border: `1px solid #E5E5EA`,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 32px rgba(0,0,0,0.08)`; (e.currentTarget as HTMLDivElement).style.borderColor = stat.accentBorder; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'; (e.currentTarget as HTMLDivElement).style.borderColor = '#E5E5EA'; }}
              >
                <div
                  className="absolute top-4 right-5 font-black text-6xl font-mono pointer-events-none select-none transition-all duration-500"
                  style={{ color: 'rgba(0,0,0,0.03)' }}
                >
                  {String(idx + 1).padStart(2, '0')}
                </div>

                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-105"
                  style={{ background: stat.accentBg, border: `1px solid ${stat.accentBorder}` }}
                >
                  <Icon className="w-5 h-5" style={{ color: stat.accentColor }} />
                </div>

                <div className="text-4xl sm:text-5xl font-bold tracking-tight mb-1" style={{ color: '#1D1D1F' }}>
                  {stat.value}
                </div>
                <div className="text-base font-semibold mb-2" style={{ color: '#1D1D1F' }}>{stat.label}</div>
                <p className="text-sm leading-relaxed" style={{ color: '#6E6E73' }}>{stat.desc}</p>

                <div
                  className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-2xl scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                  style={{ background: `linear-gradient(to right, ${stat.accentColor}, transparent)` }}
                />
              </motion.div>
            );
          })}
        </motion.div>

        {/* ── BOTTOM SECTION: Availability + Assurances + CTA ── */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          {/* 24×7 availability card */}
          <motion.div
            variants={revealScale}
            className="p-8 rounded-2xl flex flex-col justify-between"
            style={{ background: 'linear-gradient(135deg, rgba(22,163,74,0.07) 0%, rgba(22,163,74,0.03) 100%)', border: '1px solid rgba(22,163,74,0.15)' }}
          >
            <div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 font-black text-sm" style={{ background: 'rgba(22,163,74,0.1)', color: '#16A34A', border: '1px solid rgba(22,163,74,0.2)' }}>
                24×7
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: '#1D1D1F' }}>Available 24×7×365</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#6E6E73' }}>
                Expert Obstetrician and Paediatrician care, every hour, every day, all year round — with no compromises.
              </p>
            </div>
            <div className="mt-6 pt-4" style={{ borderTop: '1px solid rgba(22,163,74,0.12)' }}>
              <span className="text-xs font-semibold" style={{ color: '#16A34A' }}>● Live Emergency Support</span>
            </div>
          </motion.div>

          {/* Assurances list */}
          <motion.div
            variants={revealScale}
            className="p-8 rounded-2xl"
            style={{ background: '#FFFFFF', border: '1px solid #E5E5EA', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
          >
            <h3 className="text-lg font-bold mb-5" style={{ color: '#1D1D1F' }}>Our Commitment</h3>
            <ul className="space-y-3.5">
              {ASSURANCES.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm" style={{ color: '#6E6E73' }}>
                  <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: 'rgba(22,163,74,0.1)' }}>
                    <Check className="w-3 h-3" style={{ color: '#16A34A' }} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* CTA card */}
          <motion.div
            variants={revealScale}
            className="p-8 rounded-2xl flex flex-col justify-between"
            style={{ background: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)', boxShadow: '0 4px 24px rgba(220,38,38,0.2)' }}
          >
            <div>
              <h3 className="text-2xl font-bold text-white mb-3">Ready to experience world-class care?</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>
                Book your consultation with our specialists today and take the first step toward better health.
              </p>
            </div>
            <div className="mt-8 space-y-3">
              <button
                onClick={onOpenBooking}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm cursor-pointer transition-all duration-200"
                style={{ background: '#FFFFFF', color: '#DC2626' }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.9)'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#FFFFFF'; (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'; }}
              >
                <span>Book Consultation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href="tel:+919842960060"
                className="w-full flex items-center justify-center py-3.5 rounded-xl font-semibold text-sm cursor-pointer transition-all duration-200"
                style={{ background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.9)', border: '1px solid rgba(255,255,255,0.2)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.18)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.12)'; }}
              >
                Emergency: +91 98429 60060
              </a>
            </div>
          </motion.div>
        </motion.div>

        {/* ── BOTTOM TRUST STRIP ──────────────────────────────── */}
        <ScrollReveal delay={0.1}>
          <div
            className="mt-10 pt-8 flex flex-col md:flex-row items-center justify-between gap-5 text-sm"
            style={{ borderTop: '1px solid #E5E5EA', color: '#6E6E73' }}
            id="why-choose-bottom-strip"
          >
            <span className="flex items-center gap-2.5">
              <Award className="w-4 h-4" style={{ color: '#F59E0B' }} />
              Accredited Clinical Quality Practices
            </span>
            <span className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4" style={{ color: '#DC2626' }} />
              Trusted across Erode &amp; surrounding regions since 2001
            </span>
            <span className="flex items-center gap-2.5">
              <Activity className="w-4 h-4" style={{ color: '#16A34A' }} />
              Advanced paediatric ventilation mechanisms
            </span>
          </div>
        </ScrollReveal>

      </div>
    </div>
  );
}
