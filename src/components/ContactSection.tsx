import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, Mail, Instagram, Facebook, Compass, ExternalLink, Clock, Sparkles } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.05 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 80, damping: 16 } }
};

const PHONES = ['+91 9842960060', '+91 9487566960', '0424-2257999', '0424-2253334'];
const EMAILS = ['Nishanthhospitalerode@gmail.com', 'Drabhishant@gmail.com'];

const CONTACT_CARDS = [
  {
    id: 'address',
    icon: MapPin,
    iconColor: '#DC2626',
    iconBg: 'rgba(220,38,38,0.08)',
    iconBorder: 'rgba(220,38,38,0.15)',
    title: 'Visit Us',
    footer: { icon: Compass, text: 'Region: EVN Road, Erode', color: '#DC2626' },
  },
  {
    id: 'phone',
    icon: Phone,
    iconColor: '#16A34A',
    iconBg: 'rgba(22,163,74,0.08)',
    iconBorder: 'rgba(22,163,74,0.15)',
    title: 'Speak With Us',
    footer: { icon: Clock, text: 'Available 24×7×365 Emergency Nursing', color: '#16A34A' },
  },
  {
    id: 'email',
    icon: Mail,
    iconColor: '#007AFF',
    iconBg: 'rgba(0,122,255,0.08)',
    iconBorder: 'rgba(0,122,255,0.15)',
    title: 'Mail Us',
    footer: null,
  },
  {
    id: 'social',
    icon: Instagram,
    iconColor: '#7C3AED',
    iconBg: 'rgba(124,58,237,0.08)',
    iconBorder: 'rgba(124,58,237,0.15)',
    title: 'Social Connect',
    footer: null,
  },
];

export default function ContactSection() {
  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      id="contact-section"
      className="w-full py-20 px-5 md:px-8 relative"
      style={{ backgroundColor: '#F5F5F7', borderTop: '1px solid #E5E5EA' }}
    >
      <div className="max-w-7xl mx-auto">

        {/* ── HEADER ──────────────────────────────────────────── */}
        <motion.div variants={itemVariants} className="text-center max-w-2xl mx-auto mb-14 space-y-4">
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide"
            style={{ background: 'rgba(220,38,38,0.08)', color: '#DC2626', border: '1px solid rgba(220,38,38,0.15)' }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Connect With Nishanth Care
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight" style={{ color: '#1D1D1F' }}>
            Get in Touch
          </h2>
          <p className="text-base md:text-lg" style={{ color: '#6E6E73' }}>
            Whether you have a query about maternity, paediatric, or fertility services — we're always here to help.
          </p>
        </motion.div>

        {/* ── MAIN GRID ───────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

          {/* Left: 4 info cards */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">

            {/* Address card */}
            <motion.div
              variants={itemVariants}
              className="p-6 rounded-2xl flex flex-col justify-between transition-all duration-300"
              style={{ background: '#FFFFFF', border: '1px solid #E5E5EA', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 6px 24px rgba(0,0,0,0.08)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; }}
            >
              <div className="space-y-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.15)' }}>
                  <MapPin className="w-5 h-5" style={{ color: '#DC2626' }} />
                </div>
                <h3 className="text-lg font-bold" style={{ color: '#1D1D1F' }}>Visit Us</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#6E6E73' }}>
                  279, EVN Rd, opp. Power House,<br />
                  near Vasan Eye Care, Erode,<br />
                  Tamil Nadu 638009
                </p>
              </div>
              <div className="mt-6 pt-4 flex items-center gap-2 text-xs font-semibold" style={{ borderTop: '1px solid #F2F2F2', color: '#6E6E73' }}>
                <Compass className="w-3.5 h-3.5" style={{ color: '#DC2626' }} />
                Region: EVN Road, Erode
              </div>
            </motion.div>

            {/* Phone card */}
            <motion.div
              variants={itemVariants}
              className="p-6 rounded-2xl flex flex-col justify-between transition-all duration-300"
              style={{ background: '#FFFFFF', border: '1px solid #E5E5EA', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 6px 24px rgba(0,0,0,0.08)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; }}
            >
              <div className="space-y-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.15)' }}>
                  <Phone className="w-5 h-5" style={{ color: '#16A34A' }} />
                </div>
                <h3 className="text-lg font-bold" style={{ color: '#1D1D1F' }}>Speak With Us</h3>
                <div className="space-y-1.5">
                  {PHONES.map((phone) => (
                    <a
                      key={phone}
                      href={`tel:${phone.replace(/\s+/g, '')}`}
                      className="block text-sm font-semibold transition-colors"
                      style={{ color: '#6E6E73' }}
                      onMouseEnter={e => { (e.target as HTMLAnchorElement).style.color = '#DC2626'; }}
                      onMouseLeave={e => { (e.target as HTMLAnchorElement).style.color = '#6E6E73'; }}
                    >
                      {phone}
                    </a>
                  ))}
                </div>
              </div>
              <div className="mt-6 pt-4 flex items-center gap-2 text-xs font-semibold font-mono" style={{ borderTop: '1px solid #F2F2F2', color: '#16A34A' }}>
                <Clock className="w-3.5 h-3.5" />
                Available 24×7×365
              </div>
            </motion.div>

            {/* Email card */}
            <motion.div
              variants={itemVariants}
              className="p-6 rounded-2xl flex flex-col justify-between transition-all duration-300"
              style={{ background: '#FFFFFF', border: '1px solid #E5E5EA', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 6px 24px rgba(0,0,0,0.08)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; }}
            >
              <div className="space-y-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,122,255,0.08)', border: '1px solid rgba(0,122,255,0.15)' }}>
                  <Mail className="w-5 h-5" style={{ color: '#007AFF' }} />
                </div>
                <h3 className="text-lg font-bold" style={{ color: '#1D1D1F' }}>Mail Us</h3>
                <div className="space-y-2">
                  {EMAILS.map((email) => (
                    <a
                      key={email}
                      href={`mailto:${email}`}
                      className="block text-sm font-medium break-all transition-colors"
                      style={{ color: '#6E6E73' }}
                      onMouseEnter={e => { (e.target as HTMLAnchorElement).style.color = '#007AFF'; }}
                      onMouseLeave={e => { (e.target as HTMLAnchorElement).style.color = '#6E6E73'; }}
                    >
                      {email}
                    </a>
                  ))}
                </div>
              </div>
              <p className="mt-6 text-xs" style={{ color: '#AEAEB2' }}>We respond within 24 hours</p>
            </motion.div>

            {/* Social card */}
            <motion.div
              variants={itemVariants}
              className="p-6 rounded-2xl flex flex-col justify-between transition-all duration-300"
              style={{ background: '#FFFFFF', border: '1px solid #E5E5EA', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 6px 24px rgba(0,0,0,0.08)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; }}
            >
              <div className="space-y-4">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.15)' }}>
                  <Instagram className="w-5 h-5" style={{ color: '#7C3AED' }} />
                </div>
                <h3 className="text-lg font-bold" style={{ color: '#1D1D1F' }}>Social Connect</h3>
                <div className="space-y-3">
                  <a
                    href="https://www.instagram.com/browntreeofficial"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 text-sm font-semibold transition-colors group"
                    style={{ color: '#6E6E73' }}
                  >
                    <Instagram className="w-4 h-4 transition-colors" style={{ color: '#E1306C' }} />
                    <span className="group-hover:text-[#E1306C] transition-colors">@browntreeofficial</span>
                    <ExternalLink className="w-3 h-3 ml-auto shrink-0 opacity-40" />
                  </a>
                  <a
                    href="https://www.facebook.com/nishanthospital/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 text-sm font-semibold transition-colors group"
                    style={{ color: '#6E6E73' }}
                  >
                    <Facebook className="w-4 h-4" style={{ color: '#1877F2' }} />
                    <span className="group-hover:text-[#1877F2] transition-colors">@nishanthospital</span>
                    <ExternalLink className="w-3 h-3 ml-auto shrink-0 opacity-40" />
                  </a>
                </div>
              </div>
              <p className="mt-6 text-xs" style={{ color: '#AEAEB2' }}>Join us online for health updates &amp; tips</p>
            </motion.div>
          </div>

          {/* Right: Location card */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-5 flex"
            id="location-map-representation"
          >
            <div className="w-full relative">
              {/* Outer glow */}
              <div
                className="absolute -inset-1.5 rounded-3xl blur-xl opacity-20 pointer-events-none"
                style={{ background: 'linear-gradient(135deg, #DC2626, #F59E0B)' }}
              />

              <div
                className="relative w-full h-full min-h-[360px] rounded-2xl flex flex-col justify-between overflow-hidden p-8"
                style={{
                  background: 'linear-gradient(145deg, #1D1D1F 0%, #2C2C2E 100%)',
                  boxShadow: '0 4px 32px rgba(0,0,0,0.15)',
                }}
              >
                {/* Decorative grid pattern */}
                <div
                  className="absolute inset-0 opacity-[0.04] pointer-events-none"
                  style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }}
                />

                {/* Decorative ring */}
                <div className="absolute top-8 right-8 w-40 h-40 rounded-full pointer-events-none" style={{ border: '1px solid rgba(220,38,38,0.2)' }} />
                <div className="absolute top-8 right-8 w-24 h-24 rounded-full pointer-events-none" style={{ border: '1px solid rgba(220,38,38,0.1)' }} />

                <div className="relative z-10 space-y-5">
                  {/* Location badge */}
                  <span
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold font-mono"
                    style={{ background: 'rgba(220,38,38,0.15)', color: '#FCA5A5', border: '1px solid rgba(220,38,38,0.25)' }}
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    Primary Landmark Location
                  </span>

                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Thindal Branch, Erode</h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
                      Easily accessible branch in Thindal, offering state-of-the-art gynaecology scanning and paediatric welfare programs.
                    </p>
                  </div>

                  {/* Info table */}
                  <div className="rounded-xl p-4 space-y-2.5 text-xs" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div className="flex justify-between">
                      <span className="font-semibold" style={{ color: 'rgba(255,255,255,0.5)' }}>Location</span>
                      <span style={{ color: 'rgba(255,255,255,0.8)' }}>Thindal, Erode</span>
                    </div>
                    <div className="flex justify-between" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '8px' }}>
                      <span className="font-semibold" style={{ color: 'rgba(255,255,255,0.5)' }}>Access</span>
                      <span style={{ color: 'rgba(255,255,255,0.8)' }}>Near main highways</span>
                    </div>
                    <div className="flex justify-between" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '8px' }}>
                      <span className="font-semibold" style={{ color: 'rgba(255,255,255,0.5)' }}>Services</span>
                      <span style={{ color: 'rgba(255,255,255,0.8)' }}>OPD · Scanning · NICU</span>
                    </div>
                  </div>
                </div>

                {/* Maps button */}
                <div className="relative z-10 mt-8">
                  <a
                    href="https://maps.google.com/?q=Nishanth+Hospital+EVN+Road+Erode"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-4 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 transition-all duration-200"
                    style={{ background: '#DC2626', boxShadow: '0 2px 12px rgba(220,38,38,0.3)' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#B91C1C'; (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-1px)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = '#DC2626'; (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)'; }}
                  >
                    Open in Google Maps
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
