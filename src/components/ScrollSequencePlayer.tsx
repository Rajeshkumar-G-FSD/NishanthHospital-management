import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Heart, Phone, Sparkles } from 'lucide-react';

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
  const targetFrame = useRef(1);
  const animationRef = useRef<number | null>(null);

  const getFrameUrl = (index: number): string => {
    const paddedIndex = String(index).padStart(3, '0');
    return `/frames/ezgif-frame-${paddedIndex}.jpg`;
  };

  useEffect(() => {
    let loaded = 0;
    const imagesToLoad: HTMLImageElement[] = [];

    const firstImg = new Image();
    firstImg.src = getFrameUrl(1);
    firstImg.onload = () => {
      imageCache.current[1] = firstImg;
      loaded++;
      setLoadedCount(1);
      drawFrame(1);
    };

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      if (i === 1) continue;
      const img = new Image();
      img.src = getFrameUrl(i);
      img.onload = () => {
        imageCache.current[i] = img;
        loaded++;
        setLoadedCount(loaded);
        if (loaded === TOTAL_FRAMES) setIsPreloading(false);
      };
      img.onerror = () => {
        loaded++;
        setLoadedCount(loaded);
        if (loaded === TOTAL_FRAMES) setIsPreloading(false);
      };
      imagesToLoad.push(img);
    }

    return () => {
      imagesToLoad.forEach(img => { img.onload = null; img.onerror = null; });
    };
  }, []);

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    drawFrame(Math.round(currentFrame.current));
  };

  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [loadedCount]);

  const drawFrame = (frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    let img = imageCache.current[frameIndex];
    if (!img || !img.complete) {
      for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
        const fallbackLower = Math.max(1, frameIndex - offset);
        const fallbackHigher = Math.min(TOTAL_FRAMES, frameIndex + offset);
        if (imageCache.current[fallbackLower]?.complete) { img = imageCache.current[fallbackLower]; break; }
        if (imageCache.current[fallbackHigher]?.complete) { img = imageCache.current[fallbackHigher]; break; }
      }
    }
    if (!img || !img.complete) return;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = canvasWidth / canvasHeight;
    let drawWidth = canvasWidth;
    let drawHeight = canvasHeight;
    let offsetX = 0;
    let offsetY = 0;
    const isPortrait = canvasWidth < canvasHeight;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    if (isPortrait) {
      ctx.save();
      ctx.filter = 'blur(40px) brightness(0.3)';
      let bgDrawWidth = canvasWidth;
      let bgDrawHeight = canvasHeight;
      let bgOffsetX = 0;
      let bgOffsetY = 0;
      if (imgRatio > canvasRatio) { bgDrawWidth = canvasHeight * imgRatio; bgOffsetX = (canvasWidth - bgDrawWidth) / 2; }
      else { bgDrawHeight = canvasWidth / imgRatio; bgOffsetY = (canvasHeight - bgDrawHeight) / 2; }
      ctx.drawImage(img, bgOffsetX, bgOffsetY, bgDrawWidth, bgDrawHeight);
      ctx.restore();
      drawWidth = canvasWidth;
      drawHeight = canvasWidth / imgRatio;
      offsetX = 0;
      offsetY = (canvasHeight - drawHeight) / 2;
    } else {
      if (imgRatio > canvasRatio) { drawWidth = canvasHeight * imgRatio; offsetX = (canvasWidth - drawWidth) / 2; }
      else { drawHeight = canvasWidth / imgRatio; offsetY = (canvasHeight - drawHeight) / 2; }
    }

    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  };

  const handleScroll = () => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const scrollBoxHeight = rect.height - window.innerHeight;
    const scrolledOffset = -rect.top;
    const progress = Math.max(0, Math.min(1, scrolledOffset / scrollBoxHeight));
    targetFrame.current = 1 + Math.round(progress * (TOTAL_FRAMES - 1));
  };

  useEffect(() => {
    const animate = () => {
      const diff = targetFrame.current - currentFrame.current;
      if (Math.abs(diff) > 0.05) {
        currentFrame.current += diff * 0.15;
        drawFrame(Math.round(currentFrame.current));
      } else if (currentFrame.current !== targetFrame.current) {
        currentFrame.current = targetFrame.current;
        drawFrame(currentFrame.current);
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

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
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5"
              style={{
                background: 'rgba(220,38,38,0.07)',
                border: '1px solid rgba(220,38,38,0.18)',
              }}
            >
              <Sparkles className="w-3 h-3 shrink-0" style={{ color: '#DC2626' }} />
              <span
                className="text-[11px] font-semibold tracking-[0.14em] uppercase"
                style={{ color: '#DC2626' }}
              >
                Erode's Premier Women &amp; Child Care · Est. 1999
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="font-black leading-[1.0] tracking-tight mb-2"
              style={{
                fontSize: 'clamp(2.6rem, 6vw, 5.5rem)',
                color: '#1D1D1F',
              }}
            >
              Expert Care
            </motion.h1>

            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="font-black leading-[1.0] tracking-tight italic mb-5"
              style={{
                fontSize: 'clamp(2.6rem, 6vw, 5.5rem)',
                background: 'linear-gradient(135deg, #DC2626 0%, #F59E0B 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Meets Affordability
            </motion.h2>

            {/* Divider */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.4, duration: 0.6, ease: 'easeOut' }}
              className="h-[2px] w-14 rounded-full mb-5 origin-left"
              style={{ background: 'linear-gradient(to right, #DC2626, #F59E0B)' }}
            />

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.65 }}
              className="text-sm sm:text-base font-medium leading-relaxed mb-7 max-w-sm"
              style={{ color: '#3D3D3F' }}
            >
              25+ years of trusted excellence in maternity, fertility &amp; pediatric care in Erode, Tamil Nadu
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.6 }}
              className="flex flex-wrap gap-3 pointer-events-auto"
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
            </motion.div>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
