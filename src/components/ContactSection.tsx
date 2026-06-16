import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, Mail, Instagram, Facebook, Compass, ExternalLink, Clock, Sparkles } from 'lucide-react';

export default function ContactSection() {
  const phoneNumbers = [
    '+91 9842960060',
    '+91 9487566960',
    '0424-2257999',
    '0424-2253334'
  ];

  const emails = [
    'Nishanthhospitalerode@gmail.com',
    'Drabhishant@gmail.com'
  ];

  return (
    <section 
      id="contact-section" 
      className="w-full bg-slate-950 text-slate-100 py-20 px-4 md:px-8 max-w-7xl mx-auto border-t border-white/5 relative z-20"
    >
      {/* Visual ambient glow elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-rose-500/5 rounded-full filter blur-3xl pointer-events-none" />

      {/* Title block */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <div className="inline-flex items-center space-x-2 bg-rose-500/15 border border-rose-500/20 text-rose-300 px-3.5 py-1 rounded-full text-xs font-sans font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-rose-500 fill-rose-500/20" />
          <span>Connect With Nishanth Care</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
          Get in Touch
        </h2>
        <p className="text-slate-400 text-sm sm:text-base max-w-md mx-auto font-sans font-medium">
          Whether you have a query about specialized maternity, pediatric services, or fertility consults, we are always here to assist.
        </p>
      </div>

      {/* Main Grid: Card details on left, Interactive stylized map representation on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Grid: Address & Mail Cards */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
          
          {/* Main Hospital Address Block */}
          <div className="p-6 md:p-8 rounded-2xl bg-slate-900/40 border border-white/5 flex flex-col justify-between hover:border-white/10 transition-all duration-300 relative overflow-hidden group">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-extrabold text-white text-lg">Visit Us</h3>
              <p className="text-slate-300 text-sm md:text-sm leading-relaxed font-sans font-medium">
                279, EVN Rd, opp. Power House, <br />
                near Vasan Eye Care, Erode, <br />
                Tamil Nadu 638009
              </p>
            </div>
            
            {/* Main Location Indicator below the address */}
            <div className="mt-8 pt-4 border-t border-white/5 text-xs text-slate-400 font-sans flex items-center gap-2">
              <Compass className="w-4 h-4 text-rose-400" />
              <span className="font-semibold text-slate-300">Region: EVN Road, Erode</span>
            </div>
          </div>

          {/* Quick Call Emergency Phones Card */}
          <div className="p-6 md:p-8 rounded-2xl bg-slate-900/40 border border-white/5 flex flex-col justify-between hover:border-white/10 transition-all duration-300 relative overflow-hidden group">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                <Phone className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-extrabold text-white text-lg">Speak With Us</h3>
              <div className="space-y-2 mt-2">
                {phoneNumbers.map((phone, idx) => (
                  <a 
                    key={idx}
                    href={`tel:${phone.replace(/\s+/g, '')}`} 
                    className="block text-slate-300 hover:text-rose-400 transition-colors text-sm font-sans font-semibold tracking-wide"
                  >
                    {phone}
                  </a>
                ))}
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-white/5 text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Available 24x7x365 Emergency Nursing</span>
            </div>
          </div>

          {/* Mail Addresses Card */}
          <div className="p-6 md:p-8 rounded-2xl bg-slate-900/40 border border-white/5 hover:border-white/10 transition-all duration-300 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-extrabold text-white text-lg">Mail Us</h3>
              <div className="space-y-2.5">
                {emails.map((email, idx) => (
                  <a 
                    key={idx}
                    href={`mailto:${email}`} 
                    className="block text-slate-300 hover:text-rose-400 transition-colors text-sm font-sans font-medium break-all"
                  >
                    {email}
                  </a>
                ))}
              </div>
            </div>

            <div className="mt-8 text-xs text-slate-500 font-sans font-medium">
              We respond to inquiries within 24 hours
            </div>
          </div>

          {/* Social Presence Connected Networks */}
          <div className="p-6 md:p-8 rounded-2xl bg-slate-900/40 border border-white/5 hover:border-white/10 transition-all duration-300 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
                <Instagram className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-extrabold text-white text-lg">Social Connect</h3>
              <div className="space-y-3 pt-1">
                <a 
                  href="https://www.instagram.com/dr.sruthi_herhealth" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-2 text-slate-300 hover:text-rose-400 text-sm font-sans font-semibold transition-colors grow"
                >
                  <Instagram className="w-4 h-4 text-pink-500" />
                  <span>@dr.sruthi_herhealth</span>
                  <ExternalLink className="w-3 h-3 text-slate-500 ml-auto shrink-0" />
                </a>
                <a 
                  href="https://www.facebook.com/nishanthospital/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-2 text-slate-300 hover:text-blue-400 text-sm font-sans font-semibold transition-colors grow"
                >
                  <Facebook className="w-4 h-4 text-blue-500" />
                  <span>@nishanthospital</span>
                  <ExternalLink className="w-3 h-3 text-slate-500 ml-auto shrink-0" />
                </a>
              </div>
            </div>

            <div className="mt-8 text-xs text-slate-500 font-sans font-medium">
              Join our communities online for medical safety updates
            </div>
          </div>

        </div>

        {/* Right Grid: Beautiful visual map card portraying the local landmark branch */}
        <div className="lg:col-span-5 relative flex" id="location-map-representation">
          <div className="absolute -inset-1.5 bg-gradient-to-r from-rose-500/20 to-amber-500/10 rounded-[1.8rem] blur-md opacity-25" />
          
          <div className="w-full p-6 md:p-8 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-white/10 flex flex-col justify-between relative shadow-2xl overflow-hidden min-h-[320px]">
            {/* Visual background element representing satellite map lines */}
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="absolute top-10 right-10 w-44 h-44 border border-rose-500/15 rounded-full pointer-events-none" />
            <div className="absolute top-10 right-10 w-24 h-24 border border-rose-500/10 rounded-full pointer-events-none" />

            <div className="space-y-6 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-500/10 border border-rose-500/20 rounded-full text-xs text-rose-300 font-bold font-mono">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>Primary Landmark Location</span>
              </div>

              <div className="space-y-3">
                <h3 className="font-serif text-2xl font-black text-white tracking-tight">Thindal Branch, Erode</h3>
                <p className="text-slate-400 text-sm leading-relaxed font-sans font-medium">
                  Easily accessible branch located in Thindal, catering to state-of-the-art gynecology scanner facilities and pediatric welfare programs.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-white/5 space-y-2 text-xs text-slate-400 font-sans">
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-300">Location:</span>
                  <span>Thindal, Erode</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-300">Proximity:</span>
                  <span>Conveniently located near main highways</span>
                </div>
              </div>
            </div>

            {/* Quick interactive navigation directions button */}
            <div className="pt-6 relative z-10">
              <a
                href="https://maps.google.com/?q=Nishanth+Hospital+EVN+Road+Erode"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-xl bg-rose-500 hover:bg-rose-600 font-sans text-xs font-bold uppercase tracking-wider text-white text-center flex items-center justify-center gap-2 transition-all duration-300 shadow-xl shadow-rose-500/15"
              >
                <span>Open Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            
          </div>
        </div>

      </div>

    </section>
  );
}
