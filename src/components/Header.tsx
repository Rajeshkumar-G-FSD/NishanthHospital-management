import { useState, useRef, useEffect } from 'react';
import { 
  Heart, Phone, Sparkles, Activity, Baby, MapPin, ChevronDown, 
  Menu as MenuIcon, X, ClipboardList, Mail, Facebook, 
  Instagram, Linkedin, Youtube 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  onContactClick: () => void;
  currentView: 'home' | 'about' | 'why-choose' | 'magizh' | 'contact' | 'doctor' | 'doctors';
  onViewChange: (view: 'home' | 'about' | 'why-choose' | 'magizh' | 'contact' | 'doctor' | 'doctors') => void;
}

const MENU_ITEMS = [
  { 
    id: 'home', 
    label: 'Home', 
    desc: 'Sequence play walk & core doctors', 
    icon: Heart, 
    accent: 'text-rose-400 bg-rose-500/10' 
  },
  { 
    id: 'doctors', 
    label: 'Our Doctors', 
    desc: 'Meet our core team of specialists', 
    icon: Heart, 
    accent: 'text-indigo-400 bg-indigo-500/10' 
  },
  { 
    id: 'about', 
    label: 'About Us', 
    desc: '25 years of excellence & standards', 
    icon: Sparkles, 
    accent: 'text-amber-400 bg-amber-500/10' 
  },
  { 
    id: 'why-choose', 
    label: 'Why Choose Us', 
    desc: '30,000+ safe deliveries & stats care', 
    icon: Activity, 
    accent: 'text-emerald-400 bg-emerald-500/10' 
  },
  { 
    id: 'magizh', 
    label: 'மகிழ் Care', 
    desc: 'Hope for aspiring parent families', 
    icon: Baby, 
    accent: 'text-rose-400 bg-rose-500/10' 
  },
  { 
    id: 'contact', 
    label: 'Contact Us', 
    desc: 'EM EVN road, phone hotlines & branch', 
    icon: MapPin, 
    accent: 'text-pink-400 bg-pink-500/10' 
  },
  { 
    id: 'doctor', 
    label: 'Doctor Portal', 
    desc: 'Authorized clinical intake analytics', 
    icon: ClipboardList, 
    accent: 'text-sky-400 bg-sky-500/10' 
  }
] as const;

export default function Header({ onContactClick, currentView, onViewChange }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
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
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 flex flex-col w-full bg-white select-none border-b border-slate-250/70 shadow-sm"
    >
      {/* LEVEL 1: TOP METADATA BAR (Hidden on mobile for responsive density) */}
      <div className="hidden md:flex w-full h-10 border-b border-slate-100 items-center justify-between px-6 md:px-12 bg-white text-slate-500 text-xs font-sans">
        <div className="flex items-center space-x-2 font-medium" id="topbar-welcome-message">
          <span>Welcome to Nishanth Hospital</span>
        </div>

        <div className="flex items-center h-full space-x-6">
          {/* Email segment */}
          <div className="flex items-center space-x-2 border-r border-slate-200 pr-5 h-5" id="topbar-email-wrapper">
            <Mail className="w-4.5 h-4.5 text-sky-500 shrink-0 fill-sky-50/10" />
            <a 
              href="mailto:Nishanthhospitalerode@gmail.com" 
              className="hover:text-sky-600 font-medium transition-colors"
            >
              Nishanthhospitalerode@gmail.com
            </a>
          </div>

          {/* Location segment */}
          <div className="flex items-center space-x-2" id="topbar-location-wrapper">
            <MapPin className="w-4.5 h-4.5 text-sky-500 shrink-0" />
            <span className="font-medium">Erode, Tamil Nadu, India.</span>
          </div>

          {/* Social Media Link Icons with light theme background segment */}
          <div className="bg-[#f0f2fe] h-10 px-5 flex items-center space-x-4 border-l border-slate-100 hover:bg-[#e8ebfd] transition-colors" id="topbar-socials-block">
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-slate-500 hover:text-[#1877F2] transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a 
              href="https://x.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-slate-500 hover:text-black transition-colors flex items-center justify-center"
              aria-label="X Desktop"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
              </svg>
            </a>
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-slate-500 hover:text-[#E1306C] transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-slate-500 hover:text-[#0A66C2] transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a 
              href="https://youtube.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-slate-500 hover:text-[#FF0000] transition-colors"
              aria-label="YouTube"
            >
              <Youtube className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* LEVEL 2: MAIN NAVIGATION BAR */}
      <div className="w-full h-18 md:h-20 flex items-center justify-between px-6 md:px-12 relative" id="main-nav-container">
        
        {/* Brand Logo - Clicking resets to Home */}
        <div 
          onClick={() => {
            onViewChange('home');
            setIsMenuOpen(false);
          }}
          className="flex items-center space-x-3 group cursor-pointer shrink-0" 
          id="logo-container"
        >
          <img 
            src="https://i.postimg.cc/d1Mjps1w/Nishanth-logo.avif" 
            alt="Brand Logo" 
            className="h-10 md:h-12 w-auto object-contain rounded-lg transition-transform duration-300 group-hover:scale-105"
            referrerPolicy="no-referrer"
            id="brand-logo-image"
          />
        </div>

        {/* Desktop Navbar menu links styled exactly like the screenshot */}
        <div className="hidden lg:flex items-center space-x-8" id="desktop-menu-navigation">
          {MENU_ITEMS.map((item) => {
            const isSelected = item.id === currentView;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`font-sans text-[15px] font-bold tracking-tight py-2 transition-all flex items-center gap-1 cursor-pointer select-none outline-none ${
                  isSelected 
                    ? 'text-rose-600 underline decoration-2 underline-offset-8' 
                    : 'text-slate-800 hover:text-rose-500'
                }`}
                id={`nav-link-${item.id}`}
              >
                <span>{item.label}</span>
                {(item.id === 'about' || item.id === 'doctor' || item.id === 'why-choose') && (
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-colors group-hover:text-rose-400`} />
                )}
              </button>
            );
          })}
        </div>

        {/* Right side contact number widget styled perfectly from the screenshot */}
        <div className="flex items-center space-x-4">
          
          <div 
            onClick={onContactClick}
            className="flex items-center space-x-3 group cursor-pointer"
            id="header-reach-us-widget"
          >
            {/* Round cyan/blue calling icon button */}
            <div className="w-11 h-11 rounded-full bg-[#0a80ca] hover:bg-[#086da3] text-white flex items-center justify-center shadow-lg shadow-sky-500/10 transition-all duration-300 transform group-hover:scale-105 shrink-0" id="reach-us-icon-wrapper">
              <Phone className="w-4.5 h-4.5 fill-white/10" />
            </div>
            
            <div className="flex flex-col text-left leading-tight">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                Reach Us
              </span>
              <span className="text-[14px] md:text-[16px] font-black text-slate-900 font-sans tracking-tight group-hover:text-[#0a80ca] transition-colors mt-0.5 leading-none">
                +91 98429 60060
              </span>
            </div>
          </div>

          {/* Interactive Responsive Hamburger Trigger */}
          <div className="flex items-center lg:hidden" id="mobile-navigation-actions" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 ml-1 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100 transition-all cursor-pointer outline-none"
              id="mobile-menu-trigger"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-rose-500" />
              ) : (
                <MenuIcon className="w-5 h-5 text-slate-700" />
              )}
            </button>
          </div>
        </div>

      </div>

      {/* MOBILE EXPANDABLE DRAWER/MENU */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-200 shadow-2xl overflow-hidden z-40 flex flex-col px-6 py-4 space-y-3"
            id="mobile-dropdown-panel"
          >
            {MENU_ITEMS.map((item) => {
              const isSelected = item.id === currentView;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onViewChange(item.id);
                    setIsMenuOpen(false);
                  }}
                  className={`w-full text-left py-2.5 px-4 rounded-xl font-sans font-bold text-sm tracking-wide transition-all flex items-center justify-between cursor-pointer outline-none ${
                    isSelected 
                      ? 'bg-rose-50 text-rose-600' 
                      : 'text-slate-700 hover:bg-slate-50 hover:text-rose-500'
                  }`}
                  id={`mobile-nav-link-${item.id}`}
                >
                  <span>{item.label}</span>
                  {isSelected ? (
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  ) : (
                    (item.id === 'about' || item.id === 'doctor' || item.id === 'why-choose') && (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    )
                  )}
                </button>
              );
            })}
            
            {/* Quick contact and mail badges inside mobile drawer */}
            <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-500 font-sans" id="mobile-drawer-footer">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-sky-500" />
                <a href="mailto:Nishanthhospitalerode@gmail.com" className="hover:text-rose-500 transition-colors">
                  Nishanthhospitalerode@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-sky-500" />
                <a href="tel:+919842960060" className="hover:text-rose-500 transition-colors font-medium">
                  +91 98429 60060
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
