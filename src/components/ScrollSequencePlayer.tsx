import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { Heart, Phone, Sparkles } from 'lucide-react';
import SplitText from './SplitText';

interface ScrollSequencePlayerProps {
  onOpenBooking: () => void;
}

export default function ScrollSequencePlayer({ onOpenBooking }: ScrollSequencePlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [loadedCount, setLoadedCount] = useState(0);
  const [isPreloading, setIsPreloading] = useState(true);

  const TOTAL_FRAMES = 151;
  const imageCache = useRef<HTMLImageElement[]>([]);
  const currentFrame = useRef(1);
  const rafPending = useRef<number | null>(null);

  // Hero GSAP refs
  const badgeRef = useRef<HTMLDivElement>(null);
  const h2Ref = useRef<HTMLHeadingElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const getFrameUrl = (index: number): string => {
    const paddedIndex = String(index).padStart(3, '0');
    return `/frames/ezgif-frame-${paddedIndex}.jpg`;
  };

  useEffect(() => {
    let loaded = 0;
    const imagesToLoad: HTMLImageElement[] = [];

    // Safety timeout — dismiss preloader after 5 s no matter what
    const safetyTimer = setTimeout(() => setIsPreloading(false), 5000);

    const firstImg = new Image();
    firstImg.src = getFrameUrl(1);
    firstImg.onload = () => {
      imageCache.current[1] = firstImg;
      loaded++;
      setLoadedCount(1);
      drawFrame(1);
      // Show content as soon as frame 1 is ready — rest load in background
      setIsPreloading(false);
      clearTimeout(safetyTimer);
    };
    firstImg.onerror = () => {
      loaded++;
      setLoadedCount(loaded);
      setIsPreloading(false);
      clearTimeout(safetyTimer);
    };

    for (let i = 2; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = getFrameUrl(i);
      img.onload = () => {
        imageCache.current[i] = img;
        loaded++;
        setLoadedCount(loaded);
      };
      img.onerror = () => {
        loaded++;
        setLoadedCount(loaded);
      };
      imagesToLoad.push(img);
    }

    return () => {
      clearTimeout(safetyTimer);
      imagesToLoad.forEach(img => { img.onload = null; img.onerror = null; });
    };
  }, []);

  // Draw a specific frame onto the canvas, falling back to nearest loaded frame.
  const drawFrame = (frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let img = imageCache.current[frameIndex];
    if (!img || !img.complete) {
      for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
        const lo = Math.max(1, frameIndex - offset);
        const hi = Math.min(TOTAL_FRAMES, frameIndex + offset);
        if (imageCache.current[lo]?.complete) { img = imageCache.current[lo]; break; }
        if (imageCache.current[hi]?.complete) { img = imageCache.current[hi]; break; }
      }
    }
    if (!img || !img.complete) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = cw / ch;
    let dw = cw, dh = ch, ox = 0, oy = 0;
    const isPortrait = cw < ch;

    ctx.clearRect(0, 0, cw, ch);

    if (isPortrait) {
      ctx.save();
      ctx.filter = 'blur(40px) brightness(0.3)';
      let bw = cw, bh = ch, bx = 0, by = 0;
      if (imgRatio > canvasRatio) { bw = ch * imgRatio; bx = (cw - bw) / 2; }
      else { bh = cw / imgRatio; by = (ch - bh) / 2; }
      ctx.drawImage(img, bx, by, bw, bh);
      ctx.restore();
      dw = cw; dh = cw / imgRatio; ox = 0; oy = (ch - dh) / 2;
    } else {
      if (imgRatio > canvasRatio) { dw = ch * imgRatio; ox = (cw - dw) / 2; }
      else { dh = cw / imgRatio; oy = (ch - dh) / 2; }
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, ox, oy, dw, dh);
  };

  // Resize canvas to match physical pixels (called once on mount + on window resize).
  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    drawFrame(currentFrame.current);
  };

  // Size canvas once on mount; resize on window resize only (NOT on loadedCount).
  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  // Direct scroll → frame mapping, RAF-batched so we draw at most once per vsync.
  const handleScroll = () => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const scrollable = rect.height - window.innerHeight;
    if (scrollable <= 0) return;
    const progress = Math.max(0, Math.min(1, -rect.top / scrollable));
    const frame = 1 + Math.round(progress * (TOTAL_FRAMES - 1));
    if (frame === currentFrame.current) return;
    currentFrame.current = frame;
    if (rafPending.current != null) return; // already queued
    rafPending.current = requestAnimationFrame(() => {
      drawFrame(currentFrame.current);
      rafPending.current = null;
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafPending.current != null) cancelAnimationFrame(rafPending.current);
    };
  }, []);

  // Animate badge, h2 gradient, divider, and CTAs via a GSAP timeline.
  // H1 and subtitle are handled by the SplitText component directly.
  useGSAP(() => {
    if (isPreloading) return;
    // Immediately snap initial states so nothing flashes before animation
    gsap.set(badgeRef.current, { opacity: 0, y: -15 });
    gsap.set(h2Ref.current, { clipPath: 'inset(0 100% 0 0)' });
    gsap.set(dividerRef.current, { scaleX: 0, transformOrigin: 'left center' });
    gsap.set(ctaRef.current, { opacity: 0, y: 16 });

    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .to(badgeRef.current, { opacity: 1, y: 0, duration: 0.55 })
      .to(h2Ref.current,   { clipPath: 'inset(0 0% 0 0)', duration: 0.85, ease: 'power2.inOut' }, 0.65)
      .to(dividerRef.current, { scaleX: 1, duration: 0.5 }, 1.05)
      .to(ctaRef.current,  { opacity: 1, y: 0, duration: 0.6 }, 1.25);
  }, { dependencies: [isPreloading] });

  const progressPercentage = Math.round((loadedCount / TOTAL_FRAMES) * 100);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[200vh] md:h-[380vh] bg-white"
      id="scroll-sequence-scroller"
    >
      {/* Sticky full-viewport player */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">

        {/* === CANVAS — full brightness, no dimming === */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
          id="scroll-render-canvas"
        />

        {/* Minimal left-side gradient for text legibility only */}
        <div
          className="absolute inset-y-0 left-0 w-[55%] pointer-events-none z-[1]"
          style={{
            background: 'linear-gradient(to right, rgba(255,255,255,0.72) 0%, rgba(255,255,255,0.42) 55%, transparent 100%)',
          }}
        />
        {/* Subtle top fade behind header */}
        <div
          className="absolute top-0 left-0 right-0 h-28 pointer-events-none z-[1]"
          style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.55) 0%, transparent 100%)' }}
        />

        {/* === LOADING STATE === */}
        {isPreloading && (
          <div
            className="absolute inset-0 z-50 flex flex-col items-center justify-center p-6 text-center bg-white"
            id="sequence-preloader"
          >
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-xs space-y-7 w-full"
            >
              <div className="flex justify-center">
                <img
                  src="https://i.postimg.cc/d1Mjps1w/Nishanth-logo.avif"
                  alt="Nishanth Hospital"
                  className="h-12 w-auto object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="relative inline-flex items-center justify-center mx-auto">
                <div
                  className="w-16 h-16 rounded-full"
                  style={{
                    border: '2px solid rgba(220,38,38,0.12)',
                    borderTopColor: '#DC2626',
                    animation: 'spin 0.85s linear infinite',
                  }}
                />
                <Heart className="absolute w-5 h-5" style={{ color: '#DC2626' }} />
              </div>

              <div className="space-y-1.5">
                <p className="text-sm font-semibold" style={{ color: '#1D1D1F' }}>Preparing experience…</p>
                <p className="text-xs" style={{ color: '#AEAEB2' }}>{progressPercentage}% loaded</p>
              </div>

              <div className="w-full h-[3px] rounded-full overflow-hidden" style={{ background: '#F0F0F5' }}>
                <div
                  className="h-full rounded-full transition-all duration-100"
                  style={{
                    width: `${progressPercentage}%`,
                    background: 'linear-gradient(to right, #DC2626, #F59E0B)',
                  }}
                />
              </div>
            </motion.div>
          </div>
        )}

        {/* === HERO CONTENT — anchored just below the header === */}
        {/* Header height: 64px mobile / 100px desktop (36px top-bar + 64px nav) */}
        <div
          className="absolute left-0 right-0 z-10 pointer-events-none"
          style={{ top: 'clamp(64px, 10.5vh, 100px)' }}
        >
          <div className="px-6 sm:px-10 md:px-14 lg:px-20 pt-8 md:pt-10 max-w-2xl">

            {/* Badge */}
            <div
              ref={badgeRef}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5"
              style={{
                background: 'rgba(220,38,38,0.07)',
                border: '1px solid rgba(220,38,38,0.18)',
                opacity: 0,
              }}
            >
              <Sparkles className="w-3 h-3 shrink-0" style={{ color: '#DC2626' }} />
              <span
                className="text-[11px] font-semibold tracking-[0.14em] uppercase"
                style={{ color: '#DC2626' }}
              >
                Erode's Premier Women &amp; Child Care · Est. 1999
              </span>
            </div>

            {/* Headline — SplitText animates each char up with stagger */}
            <SplitText
              text="Expert Care"
              tag="h1"
              className="font-black leading-[1.0] tracking-tight mb-2 block"
              splitType="chars"
              from={{ opacity: 0, y: 55 }}
              to={{ opacity: 1, y: 0, delay: 0.2 }}
              delay={45}
              duration={0.75}
              ease="power3.out"
              threshold={0}
              rootMargin="0px"
              textAlign="left"
              style={{ fontSize: 'clamp(2.6rem, 6vw, 5.5rem)', color: '#1D1D1F' }}
            />

            {/* Gradient h2 — clip-path wipe reveal via GSAP timeline */}
            <h2
              ref={h2Ref}
              className="font-black leading-[1.0] tracking-tight italic mb-5"
              style={{
                fontSize: 'clamp(2.6rem, 6vw, 5.5rem)',
                background: 'linear-gradient(135deg, #DC2626 0%, #F59E0B 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                clipPath: 'inset(0 100% 0 0)',
              }}
            >
              Meets Affordability
            </h2>

            {/* Divider */}
            <div
              ref={dividerRef}
              className="h-[2px] w-14 rounded-full mb-5"
              style={{ background: 'linear-gradient(to right, #DC2626, #F59E0B)', transform: 'scaleX(0)', transformOrigin: 'left center' }}
            />

            {/* Subtitle — SplitText animates each word */}
            <SplitText
              text="25+ years of trusted excellence in maternity, fertility & pediatric care in Erode, Tamil Nadu"
              tag="p"
              className="text-sm sm:text-base font-medium leading-relaxed mb-7 max-w-sm block"
              splitType="words"
              from={{ opacity: 0, y: 18 }}
              to={{ opacity: 1, y: 0, delay: 0.85 }}
              delay={38}
              duration={0.6}
              ease="power2.out"
              threshold={0}
              rootMargin="0px"
              textAlign="left"
              style={{ color: '#3D3D3F' }}
            />

            {/* CTA buttons */}
            <div
              ref={ctaRef}
              className="flex flex-wrap gap-3 pointer-events-auto"
              style={{ opacity: 0 }}
            >
              <button
                onClick={onOpenBooking}
                className="group relative overflow-hidden flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white cursor-pointer transition-all duration-200"
                style={{
                  background: 'linear-gradient(135deg, #DC2626, #B91C1C)',
                  boxShadow: '0 4px 20px rgba(220,38,38,0.40)',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.transform = 'translateY(-2px)';
                  el.style.boxShadow = '0 8px 28px rgba(220,38,38,0.50)';
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.transform = 'translateY(0)';
                  el.style.boxShadow = '0 4px 20px rgba(220,38,38,0.40)';
                }}
              >
                <Heart className="w-3.5 h-3.5 shrink-0 fill-red-300" />
                <span>Book Appointment</span>
                <div
                  className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)' }}
                />
              </button>

              <a
                href="tel:+919842960060"
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm cursor-pointer transition-all duration-200 no-underline"
                style={{
                  background: 'rgba(255,255,255,0.75)',
                  border: '1.5px solid rgba(0,0,0,0.10)',
                  color: '#1D1D1F',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.background = 'rgba(255,255,255,0.95)';
                  el.style.transform = 'translateY(-2px)';
                  el.style.boxShadow = '0 6px 20px rgba(0,0,0,0.12)';
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.background = 'rgba(255,255,255,0.75)';
                  el.style.transform = 'translateY(0)';
                  el.style.boxShadow = '0 2px 12px rgba(0,0,0,0.08)';
                }}
              >
                <Phone className="w-3.5 h-3.5 shrink-0" style={{ color: '#DC2626' }} />
                <span>Emergency 24/7</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
