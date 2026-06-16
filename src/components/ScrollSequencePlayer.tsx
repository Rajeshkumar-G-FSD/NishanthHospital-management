import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Heart, Sparkles } from 'lucide-react';
import SplitText from './SplitText';

interface ScrollSequencePlayerProps {
  onOpenBooking: () => void;
}

export default function ScrollSequencePlayer({ onOpenBooking }: ScrollSequencePlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [loadedCount, setLoadedCount] = useState(0);
  const [isPreloading, setIsPreloading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

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
    let progress = scrolledOffset / scrollBoxHeight;
    progress = Math.max(0, Math.min(1, progress));
    setScrollProgress(progress);
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
    <div ref={containerRef} className="relative w-full h-[150vh] md:h-[320vh] flex flex-col items-center pt-0 bg-black" id="scroll-sequence-scroller">

      {/* Sticky player */}
      <div className="sticky top-[100px] md:top-[144px] h-[calc(100vh-100px)] md:h-[calc(100vh-144px)] w-full overflow-hidden flex items-center justify-center bg-black">

        {/* Cinematic overlays */}
        <div className="absolute inset-0 bg-black/20 z-[1] pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-24 z-[2] pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.4), transparent)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-48 z-[2] pointer-events-none"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)' }} />

        {/* Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none brightness-95"
          id="scroll-render-canvas"
        />

        {/* Loading state */}
        {isPreloading && (
          <div className="absolute inset-0 z-50 bg-[#0A0A0A] flex flex-col items-center justify-center p-6 text-center" id="sequence-preloader">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-xs space-y-6 w-full"
            >
              {/* Spinner */}
              <div className="relative inline-flex items-center justify-center">
                <div className="w-16 h-16 rounded-full" style={{ border: '2px solid rgba(255,255,255,0.08)', borderTopColor: '#DC2626', animation: 'spin 0.9s linear infinite' }} />
                <Heart className="absolute w-6 h-6 fill-rose-500/20" style={{ color: '#DC2626' }} />
              </div>

              <div className="space-y-1.5">
                <h4 className="font-semibold text-white text-base tracking-tight">Loading Experience</h4>
                <p className="text-sm" style={{ color: '#6E6E73' }}>Preparing our immersive care showcase…</p>
              </div>

              {/* Progress bar */}
              <div className="w-full h-0.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <div
                  className="h-full rounded-full transition-all duration-100"
                  style={{ width: `${progressPercentage}%`, background: 'linear-gradient(to right, #DC2626, #F59E0B)' }}
                />
              </div>

              <div className="flex justify-between items-center text-[10px] font-mono font-semibold uppercase tracking-widest" style={{ color: '#6E6E73' }}>
                <span>Buffering</span>
                <span>{progressPercentage}%</span>
              </div>
            </motion.div>
          </div>
        )}

        {/* Hero text overlay */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 pointer-events-none">
          <div className="text-center max-w-4xl flex flex-col items-center space-y-6">

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide"
              style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.85)' }}
            >
              <Sparkles className="w-3 h-3" style={{ color: '#F59E0B' }} />
              <span>Nishanth Hospital · Erode, Tamil Nadu</span>
            </motion.div>

            {/* Headlines */}
            <div className="flex flex-col items-center gap-1 md:gap-2">
              <SplitText
                text="Expert Care Meets"
                className="font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight text-white drop-shadow-2xl select-none block"
                delay={30}
                duration={1.1}
                ease="power3.out"
                splitType="chars"
                tag="h1"
              />
              <SplitText
                text="Affordability"
                className="font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight select-none block italic pb-1"
                style={{
                  background: 'linear-gradient(135deg, #FF6B6B, #FFD93D, #6BCB77)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.4))',
                }}
                delay={40}
                duration={1.2}
                ease="power3.out"
                splitType="chars"
                tag="h2"
              />
            </div>

            {/* Divider */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.7 }}
              className="h-px w-20 rounded-full"
              style={{ background: 'linear-gradient(to right, #DC2626, #F59E0B, #16A34A)' }}
            />

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="text-base md:text-lg font-medium max-w-lg text-center"
              style={{ color: 'rgba(255,255,255,0.75)' }}
            >
              25+ years of trusted excellence in maternity, fertility &amp; pediatric care
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-3 mt-2 pointer-events-auto"
            >
              <button
                onClick={onOpenBooking}
                className="px-7 py-3.5 rounded-xl font-semibold text-sm text-white cursor-pointer transition-all duration-200"
                style={{ background: '#DC2626', boxShadow: '0 4px 20px rgba(220,38,38,0.4)' }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = '#B91C1C';
                  (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = '#DC2626';
                  (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                }}
              >
                Book Appointment
              </button>
              <a
                href="tel:+919842960060"
                className="px-7 py-3.5 rounded-xl font-semibold text-sm cursor-pointer transition-all duration-200 text-center"
                style={{
                  background: 'rgba(255,255,255,0.12)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: 'rgba(255,255,255,0.9)',
                  backdropFilter: 'blur(8px)',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.18)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.12)'; }}
              >
                +91 98429 60060
              </a>
            </motion.div>
          </div>
        </div>

        {/* Scroll progress indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2">
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-1"
          >
            <div className="w-px h-8 rounded-full" style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.4), rgba(255,255,255,0))' }} />
          </motion.div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
