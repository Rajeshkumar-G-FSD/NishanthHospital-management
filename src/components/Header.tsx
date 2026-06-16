import { useState, useRef, useEffect } from 'react';
import {
  Heart, Phone, Sparkles, Activity, Baby, MapPin, ChevronDown,
  Menu as MenuIcon, X, ClipboardList, Mail, Facebook,
  Instagram, Youtube
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  onContactClick: () => void;
  currentView: 'home' | 'about' | 'why-choose' | 'magizh' | 'contact' | 'doctor' | 'doctors';
  onViewChange: (view: 'home' | 'about' | 'why-choose' | 'magizh' | 'contact' | 'doctor' | 'doctors') => void;
}

const MENU_ITEMS = [
  { id: 'home',       label: 'Home',          icon: Heart },
  { id: 'doctors',   label: 'Our Doctors',   icon: Heart },
  { id: 'about',     label: 'About Us',      icon: Sparkles },
  { id: 'why-choose',label: 'Why Choose Us', icon: Activity },
  { id: 'magizh',    label: 'மகிழ் Care',    icon: Baby },
  { id: 'contact',   label: 'Contact',       icon: MapPin },
  { id: 'doctor',    label: 'Doctor Portal', icon: ClipboardList },
] as const;

export default function Header({ onContactClick, currentView, onViewChange }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <motion.header
      id="main-nav-header"
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 select-none"
      style={{
        background: 'rgba(255,255,255,0.88)',
        backdropFilter: 'saturate(180%) blur(20px)',
        WebkitBackdropFilter: 'saturate(180%) blur(20px)',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
      }}
    >
      {/* ── TOP INFO BAR ──────────────────────────────────────── */}
      <div
        className="hidden md:flex w-full h-9 items-center justify-between px-8 lg:px-14 text-xs"
        style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', color: '#6E6E73' }}
      >
        <span className="font-medium" style={{ color: '#6E6E73' }}>
          Welcome to Nishanth Hospital — Erode's Premier Women &amp; Child Care Centre
        </span>

        <div className="flex items-center h-full gap-6">
          <a
            href="mailto:Nishanthhospitalerode@gmail.com"
            className="flex items-center gap-1.5 font-medium transition-colors"
            style={{ color: '#6E6E73' }}
            onMouseEnter={e => ((e.target as HTMLElement).closest('a')!).style.color = '#007AFF'}
            onMouseLeave={e => ((e.target as HTMLElement).closest('a')!).style.color = '#6E6E73'}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Nishanthhospitalerode@gmail.com</span>
          </a>

          <div className="flex items-center gap-3" style={{ color: '#6E6E73' }}>
            <a href="https://www.facebook.com/nishanthospital/" target="_blank" rel="noopener noreferrer"
              className="hover:text-[#1877F2] transition-colors" aria-label="Facebook">
              <Facebook className="w-3.5 h-3.5" />
            </a>
            <a href="https://www.instagram.com/dr.sruthi_herhealth" target="_blank" rel="noopener noreferrer"
              className="hover:text-[#E1306C] transition-colors" aria-label="Instagram">
              <Instagram className="w-3.5 h-3.5" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"
              className="hover:text-[#FF0000] transition-colors" aria-label="YouTube">
              <Youtube className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* ── MAIN NAV BAR ──────────────────────────────────────── */}
      <div className="w-full h-16 flex items-center justify-between px-6 lg:px-14 gap-4" id="main-nav-container">

        {/* Logo */}
        <div
          onClick={() => { onViewChange('home'); setIsMenuOpen(false); }}
          className="flex items-center cursor-pointer shrink-0 group"
          id="logo-container"
        >
          <img
            src="https://i.postimg.cc/d1Mjps1w/Nishanth-logo.avif"
            alt="Nishanth Hospital"
            className="h-10 w-auto object-contain rounded-lg transition-transform duration-300 group-hover:scale-[1.03]"
            referrerPolicy="no-referrer"
            id="brand-logo-image"
          />
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1" id="desktop-nav-links">
          {MENU_ITEMS.filter(i => i.id !== 'doctor').map((item) => {
            const isActive = item.id === currentView;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className="relative px-3.5 py-2 rounded-lg text-[13.5px] font-medium transition-all duration-200 cursor-pointer outline-none"
                style={{
                  color: isActive ? '#DC2626' : '#1D1D1F',
                  background: isActive ? 'rgba(220,38,38,0.06)' : 'transparent',
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    (e.currentTarget as HTMLButtonElement).style.color = '#DC2626';
                    (e.currentTarget as HTMLButtonElement).style.background = 'rgba(220,38,38,0.05)';
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    (e.currentTarget as HTMLButtonElement).style.color = '#1D1D1F';
                    (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                  }
                }}
                id={`nav-link-${item.id}`}
              >
                {item.label}
                {isActive && (
                  <span
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full"
                    style={{ background: '#DC2626' }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: Phone + CTA + Hamburger */}
        <div className="flex items-center gap-3">

          {/* Phone widget */}
          <button
            onClick={onContactClick}
            className="hidden md:flex items-center gap-2.5 group cursor-pointer"
            id="header-phone-widget"
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200"
              style={{ background: 'rgba(220,38,38,0.08)' }}
            >
              <Phone className="w-4 h-4" style={{ color: '#DC2626' }} />
            </div>
            <div className="hidden xl:flex flex-col text-left leading-tight">
              <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#AEAEB2' }}>Emergency</span>
              <span className="text-[13px] font-bold tracking-tight" style={{ color: '#1D1D1F' }}>+91 98429 60060</span>
            </div>
          </button>

          {/* Book Appointment CTA */}
          <button
            onClick={onContactClick}
            className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-semibold text-white transition-all duration-200 cursor-pointer"
            style={{ background: '#DC2626', boxShadow: '0 2px 10px rgba(220,38,38,0.25)' }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = '#B91C1C';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 16px rgba(220,38,38,0.35)';
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = '#DC2626';
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 2px 10px rgba(220,38,38,0.25)';
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
            }}
          >
            <span>Book Appointment</span>
          </button>

          {/* Doctor Portal link (desktop, subtle) */}
          <button
            onClick={() => onViewChange('doctor')}
            className="hidden xl:flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer"
            style={{ color: '#6E6E73', background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)' }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.color = '#007AFF';
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0,122,255,0.2)';
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,122,255,0.05)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.color = '#6E6E73';
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0,0,0,0.06)';
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,0,0,0.03)';
            }}
          >
            <ClipboardList className="w-3.5 h-3.5" />
            <span>Portal</span>
          </button>

          {/* Mobile hamburger */}
          <div className="flex items-center lg:hidden" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-xl transition-all cursor-pointer outline-none"
              style={{
                background: isMenuOpen ? 'rgba(220,38,38,0.08)' : 'rgba(0,0,0,0.04)',
                border: '1px solid rgba(0,0,0,0.08)',
              }}
              id="mobile-menu-trigger"
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <X className="w-4.5 h-4.5" style={{ color: '#DC2626' }} />
                  </motion.span>
                ) : (
                  <motion.span key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <MenuIcon className="w-4.5 h-4.5" style={{ color: '#1D1D1F' }} />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      {/* ── MOBILE DROPDOWN MENU ──────────────────────────────── */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="lg:hidden absolute top-full left-0 right-0 overflow-hidden shadow-2xl"
            style={{
              background: 'rgba(255,255,255,0.97)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              borderBottom: '1px solid rgba(0,0,0,0.08)',
            }}
            id="mobile-dropdown-panel"
          >
            <div className="px-5 py-4 space-y-1">
              {MENU_ITEMS.map((item) => {
                const isActive = item.id === currentView;
                return (
                  <button
                    key={item.id}
                    onClick={() => { onViewChange(item.id); setIsMenuOpen(false); }}
                    className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-between cursor-pointer outline-none"
                    style={{
                      background: isActive ? 'rgba(220,38,38,0.06)' : 'transparent',
                      color: isActive ? '#DC2626' : '#1D1D1F',
                    }}
                    id={`mobile-nav-link-${item.id}`}
                  >
                    <span>{item.label}</span>
                    {isActive && <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#DC2626' }} />}
                  </button>
                );
              })}
            </div>

            {/* Contact strip */}
            <div className="px-5 py-4 space-y-2.5" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
              <a href="tel:+919842960060" className="flex items-center gap-3 text-sm font-semibold" style={{ color: '#DC2626' }}>
                <Phone className="w-4 h-4" />
                <span>+91 98429 60060</span>
              </a>
              <a href="mailto:Nishanthhospitalerode@gmail.com" className="flex items-center gap-3 text-xs" style={{ color: '#6E6E73' }}>
                <Mail className="w-4 h-4" />
                <span>Nishanthhospitalerode@gmail.com</span>
              </a>
              <button
                onClick={() => { onContactClick(); setIsMenuOpen(false); }}
                className="w-full mt-2 py-3 rounded-xl text-sm font-semibold text-white cursor-pointer transition-all"
                style={{ background: '#DC2626' }}
              >
                Book Appointment
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
