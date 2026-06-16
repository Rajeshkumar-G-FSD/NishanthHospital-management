import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Heart, Sparkles, Activity } from 'lucide-react';
import SplitText from './SplitText';

interface ScrollSequencePlayerProps {
  onOpenBooking: () => void;
}

export default function ScrollSequencePlayer({ onOpenBooking }: ScrollSequencePlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Loading & preloading state
  const [loadedCount, setLoadedCount] = useState(0);
  const [isPreloading, setIsPreloading] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  const TOTAL_FRAMES = 151;
  const imageCache = useRef<HTMLImageElement[]>([]);
  const currentFrame = useRef(1);
  const targetFrame = useRef(1);
  const animationRef = useRef<number | null>(null);

  // Generate frame source URL
  const getFrameUrl = (index: number): string => {
    const paddedIndex = String(index).padStart(3, '0');
    return `/frames/ezgif-frame-${paddedIndex}.jpg`;
  };

  // Preload all 151 images
  useEffect(() => {
    let loaded = 0;
    const imagesToLoad: HTMLImageElement[] = [];

    // Prioritize frame 1 to draw it instantly
    const firstImg = new Image();
    firstImg.src = getFrameUrl(1);
    firstImg.onload = () => {
      imageCache.current[1] = firstImg;
      loaded++;
      setLoadedCount(1);
      drawFrame(1); // Draw initial frame immediately
    };

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      if (i === 1) continue; // Already loaded

      const img = new Image();
      img.src = getFrameUrl(i);
      img.onload = () => {
        imageCache.current[i] = img;
        loaded++;
        setLoadedCount(loaded);
        if (loaded === TOTAL_FRAMES) {
          setIsPreloading(false);
        }
      };
      
      // If an error occurs, fallback gracefully so progress keeps tracking
      img.onerror = () => {
        loaded++;
        setLoadedCount(loaded);
        if (loaded === TOTAL_FRAMES) {
          setIsPreloading(false);
        }
      };
      imagesToLoad.push(img);
    }

    return () => {
      // Clean up preloading if component unmounts
      imagesToLoad.forEach(img => {
        img.onload = null;
        img.onerror = null;
      });
    };
  }, []);

  // Canvas Responsive Resizing (supports Retina screens)
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
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [loadedCount]); // Trigger on frame load so sizing updates

  // Core drawing algorithm with object-fit: cover mapping
  const drawFrame = (frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Force high-quality premium image smoothing for clean, crisp scales
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Secure fallback: find the closest preloaded frame if this index isn't ready
    let img = imageCache.current[frameIndex];
    if (!img || !img.complete) {
      for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
        const fallbackLower = Math.max(1, frameIndex - offset);
        const fallbackHigher = Math.min(TOTAL_FRAMES, frameIndex + offset);
        if (imageCache.current[fallbackLower]?.complete) {
          img = imageCache.current[fallbackLower];
          break;
        }
        if (imageCache.current[fallbackHigher]?.complete) {
          img = imageCache.current[fallbackHigher];
          break;
        }
      }
    }

    if (!img || !img.complete) return;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const imgWidth = img.naturalWidth;
    const imgHeight = img.naturalHeight;

    const imgRatio = imgWidth / imgHeight;
    const canvasRatio = canvasWidth / canvasHeight;

    let drawWidth = canvasWidth;
    let drawHeight = canvasHeight;
    let offsetX = 0;
    let offsetY = 0;

    const isPortrait = canvasWidth < canvasHeight;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    if (isPortrait) {
      // 1. Draw heavy-blurred stretched background matching the frame color scheme to fill any gaps beautifully (ambient glow)
      ctx.save();
      ctx.filter = 'blur(40px) brightness(0.35)';
      
      let bgDrawWidth = canvasWidth;
      let bgDrawHeight = canvasHeight;
      let bgOffsetX = 0;
      let bgOffsetY = 0;
      
      if (imgRatio > canvasRatio) {
        bgDrawWidth = canvasHeight * imgRatio;
        bgOffsetX = (canvasWidth - bgDrawWidth) / 2;
      } else {
        bgDrawHeight = canvasWidth / imgRatio;
        bgOffsetY = (canvasHeight - bgDrawHeight) / 2;
      }
      
      ctx.drawImage(img, bgOffsetX, bgOffsetY, bgDrawWidth, bgDrawHeight);
      ctx.restore();

      // 2. Draw pristine, fit-to-width foreground image preserving both mother & baby fully center stage
      drawWidth = canvasWidth;
      drawHeight = canvasWidth / imgRatio;
      offsetX = 0;
      offsetY = (canvasHeight - drawHeight) / 2;
    } else {
      // Standard landscape cover scaling
      if (imgRatio > canvasRatio) {
        drawWidth = canvasHeight * imgRatio;
        offsetX = (canvasWidth - drawWidth) / 2;
      } else {
        drawHeight = canvasWidth / imgRatio;
        offsetY = (canvasHeight - drawHeight) / 2;
      }
    }

    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  };

  // Scroll position listener mapping window scroll bound -> frame index
  const handleScroll = () => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    // total scroll depth of section
    const scrollBoxHeight = rect.height - window.innerHeight;
    const scrolledOffset = -rect.top;
    
    let progress = scrolledOffset / scrollBoxHeight;
    progress = Math.max(0, Math.min(1, progress));
    
    setScrollProgress(progress);
    targetFrame.current = 1 + Math.round(progress * (TOTAL_FRAMES - 1));
  };

  // lerped momentum loop for smooth transition transitions on direct/quick scrolls
  useEffect(() => {
    const animate = () => {
      const diff = targetFrame.current - currentFrame.current;
      if (Math.abs(diff) > 0.05) {
        currentFrame.current += diff * 0.15; // Smooth multiplier speed (lerp coeff)
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
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const progressPercentage = Math.round((loadedCount / TOTAL_FRAMES) * 100);

  return (
    <div ref={containerRef} className="relative w-full h-[150vh] md:h-[320vh] bg-slate-950 flex flex-col items-center pt-0" id="scroll-sequence-scroller">
      
      {/* Sticky screen container to host the visual player - positioned precisely below the fixed header */}
      <div className="sticky top-[72px] md:top-[120px] h-[calc(100vh-72px)] md:h-[calc(100vh-120px)] w-full overflow-hidden flex items-center justify-center bg-slate-950">
        
        {/* Cinematic dark overlays to balance content readability */}
        <div className="absolute inset-0 bg-radial-gradient(circle at center, rgba(15,23,42,0.1) 0%, rgba(15,23,42,0.5) 100%) z-10 pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-32 bg-linear-to-b from-slate-950/80 to-transparent z-15 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-linear-to-t from-slate-950/90 via-slate-950/30 to-transparent z-15 pointer-events-none" />
        
        {/* The Animated Canvas Base */}
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full object-cover text-white filter brightness-95 opacity-85 transition-opacity duration-300 pointer-events-none"
          id="scroll-render-canvas"
        />

        {/* Loading overlay panel for smooth asset boot */}
        {isPreloading && (
          <div className="absolute inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center p-6 text-center" id="sequence-preloader">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-xs space-y-5"
            >
              <div className="relative inline-flex items-center justify-center">
                <div className="w-16 h-16 rounded-full border-4 border-slate-800 border-t-rose-500 animate-spin" />
                <Heart className="absolute w-6 h-6 text-rose-500 fill-rose-500/20 animate-pulse" />
              </div>

              <div className="space-y-1">
                <h4 className="font-serif text-white text-lg font-bold">Immersive Care Sequence</h4>
                <p className="text-slate-500 text-xs font-sans">Assembling our interactive delivery cinematic experience...</p>
              </div>

              {/* Progress Bar container */}
              <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-linear-to-r from-rose-500 to-amber-500 transition-all duration-100 rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>

              <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 font-semibold uppercase tracking-widest">
                <span>Buffering Assets</span>
                <span>{progressPercentage}%</span>
              </div>
            </motion.div>
          </div>
        )}

        {/* CENTERED HERO TEXT WITH ELEGANT GRADIENS & MODERN TYPOGRAPHY */}
        <div className="absolute inset-0 z-20 flex items-center justify-center px-6 pointer-events-none">
          <div className="text-center max-w-3xl flex flex-col items-center space-y-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 text-rose-200 px-3 py-1 rounded-full text-xs font-sans font-semibold tracking-wider uppercase mb-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-300" />
              <span>Nishant Hospital Maternity Care</span>
            </motion.div>

            <div
              id="hero-centered-title"
              className="w-full text-center flex flex-col items-center justify-center gap-1 md:gap-3"
            >
              <SplitText
                text="Expert Care Meets"
                className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight drop-shadow-xl text-white select-none block"
                delay={30}
                duration={1.2}
                ease="power3.out"
                splitType="chars"
                tag="h1"
              />
              <SplitText
                text="Affordability"
                className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black italic tracking-tight drop-shadow-xl bg-gradient-to-r from-rose-400 via-amber-300 to-emerald-400 bg-clip-text text-transparent select-none block pb-2"
                delay={40}
                duration={1.3}
                ease="power3.out"
                splitType="chars"
                tag="h2"
              />
            </div>

            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "80px", opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="h-[2px] bg-gradient-to-r from-rose-400 via-amber-300 to-emerald-400 rounded-full"
            />
            
          
          </div>
        </div>

      </div>
    </div>
  );
}
