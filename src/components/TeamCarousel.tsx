import React, { useState, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight, CalendarRange, Award, Star, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { gsap } from 'gsap';
import { SplitText as GSAPSplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

const cn = (...classes: (string | undefined | null | boolean)[]) => {
  return classes.filter(Boolean).join(' ');
};

interface AnimatedBioProps {
  text: string;
}

function AnimatedBio({ text }: AnimatedBioProps) {
  const containerRef = React.useRef<HTMLParagraphElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    const split = new GSAPSplitText(containerRef.current, {
      type: 'words,chars',
      charsClass: 'inline-block opacity-0'
    });

    gsap.fromTo(
      split.chars,
      { opacity: 0, y: 5 },
      { opacity: 1, y: 0, duration: 0.35, stagger: 0.006, ease: 'power3.out' }
    );

    return () => { split.revert(); };
  }, [text]);

  return (
    <p ref={containerRef} className="text-sm leading-relaxed" style={{ color: '#6E6E73' }}>
      {text}
    </p>
  );
}

function AnimatedTitle({ text, className, style }: { text: string; className?: string; style?: React.CSSProperties }) {
  const containerRef = React.useRef<HTMLHeadingElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;

    const split = new GSAPSplitText(containerRef.current, {
      type: 'words,chars',
      charsClass: 'inline-block opacity-0'
    });

    gsap.fromTo(
      split.chars,
      { opacity: 0, y: 16, rotateX: -12 },
      { opacity: 1, y: 0, rotateX: 0, duration: 0.55, stagger: 0.01, ease: 'power3.out' }
    );

    return () => { split.revert(); };
  }, [text]);

  return <h2 ref={containerRef} className={className} style={style}>{text}</h2>;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  bio?: string;
}

export interface TeamCarouselProps {
  members: TeamMember[];
  title?: string;
  titleSize?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  titleColor?: string;
  background?: string;
  cardWidth?: number;
  cardHeight?: number;
  cardRadius?: number;
  showArrows?: boolean;
  showDots?: boolean;
  keyboardNavigation?: boolean;
  touchNavigation?: boolean;
  animationDuration?: number;
  autoPlay?: number;
  pauseOnHover?: boolean;
  visibleCards?: number;
  sideCardScale?: number;
  sideCardOpacity?: number;
  grayscaleEffect?: boolean;
  className?: string;
  cardClassName?: string;
  titleClassName?: string;
  infoPosition?: 'bottom' | 'overlay' | 'none';
  infoTextColor?: string;
  infoBackground?: string;
  onMemberChange?: (member: TeamMember, index: number) => void;
  onCardClick?: (member: TeamMember, index: number) => void;
  onBookClick?: (doctorName: string) => void;
  initialIndex?: number;
}

export const TeamCarousel: React.FC<TeamCarouselProps> = ({
  members,
  title = "OUR TEAM",
  titleSize = "2xl",
  titleColor,
  background,
  cardWidth = 280,
  cardHeight = 380,
  cardRadius = 20,
  showArrows = true,
  showDots = true,
  keyboardNavigation = true,
  touchNavigation = true,
  animationDuration = 800,
  autoPlay = 0,
  pauseOnHover = true,
  visibleCards = 2,
  sideCardScale = 0.9,
  sideCardOpacity = 0.7,
  grayscaleEffect = true,
  className,
  cardClassName,
  titleClassName,
  infoPosition = "bottom",
  infoTextColor,
  infoBackground,
  onMemberChange,
  onCardClick,
  onBookClick,
  initialIndex = 0,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [direction, setDirection] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const totalMembers = members.length;

  const paginate = useCallback(
    (newDirection: number) => {
      if (totalMembers === 0) return;
      setDirection(newDirection);
      const nextIndex = (currentIndex + newDirection + totalMembers) % totalMembers;
      setCurrentIndex(nextIndex);
      onMemberChange?.(members[nextIndex], nextIndex);
    },
    [currentIndex, totalMembers, members, onMemberChange]
  );

  const wrapIndex = (index: number) => (index + totalMembers) % totalMembers;

  const calculatePosition = (index: number) => {
    const diff = wrapIndex(index - currentIndex);
    if (diff === 0) return 'center';
    if (diff <= visibleCards) return `right-${diff}`;
    if (diff >= totalMembers - visibleCards) return `left-${totalMembers - diff}`;
    return 'hidden';
  };

  const getVariantStyles = (position: string): any => {
    const transition = {
      duration: animationDuration / 1000,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    };

    switch (position) {
      case 'center':
        return { zIndex: 10, opacity: 1, scale: 1.08, x: 0, filter: 'grayscale(0%)', pointerEvents: 'auto' as const, transition };
      case 'right-1':
        return { zIndex: 5, opacity: sideCardOpacity, scale: sideCardScale, x: cardWidth * 0.7, filter: grayscaleEffect ? 'grayscale(80%)' : 'grayscale(0%)', pointerEvents: 'auto' as const, transition };
      case 'right-2':
        return { zIndex: 1, opacity: sideCardOpacity * 0.6, scale: sideCardScale * 0.9, x: cardWidth * 1.4, filter: grayscaleEffect ? 'grayscale(100%)' : 'grayscale(0%)', pointerEvents: 'auto' as const, transition };
      case 'left-1':
        return { zIndex: 5, opacity: sideCardOpacity, scale: sideCardScale, x: -cardWidth * 0.7, filter: grayscaleEffect ? 'grayscale(80%)' : 'grayscale(0%)', pointerEvents: 'auto' as const, transition };
      case 'left-2':
        return { zIndex: 1, opacity: sideCardOpacity * 0.6, scale: sideCardScale * 0.9, x: -cardWidth * 1.4, filter: grayscaleEffect ? 'grayscale(100%)' : 'grayscale(0%)', pointerEvents: 'auto' as const, transition };
      default:
        return { zIndex: 0, opacity: 0, scale: 0.8, x: direction > 0 ? cardWidth * (visibleCards + 1) : -cardWidth * (visibleCards + 1), pointerEvents: 'none' as const, filter: 'grayscale(100%)', transition };
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoPlay > 0) interval = setInterval(() => paginate(1), autoPlay);

    const el = document.getElementById('team-carousel-container');
    const handleEnter = () => { if (pauseOnHover && autoPlay > 0) clearInterval(interval); };
    const handleLeave = () => { if (pauseOnHover && autoPlay > 0) interval = setInterval(() => paginate(1), autoPlay); };

    if (el && pauseOnHover && autoPlay > 0) {
      el.addEventListener('mouseenter', handleEnter);
      el.addEventListener('mouseleave', handleLeave);
    }

    return () => {
      clearInterval(interval);
      if (el && pauseOnHover && autoPlay > 0) {
        el.removeEventListener('mouseenter', handleEnter);
        el.removeEventListener('mouseleave', handleLeave);
      }
    };
  }, [autoPlay, paginate, pauseOnHover]);

  useEffect(() => {
    if (!keyboardNavigation) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') paginate(-1);
      else if (e.key === 'ArrowRight') paginate(1);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [keyboardNavigation, paginate]);

  const handleTouchStart = (e: React.TouchEvent) => { if (touchNavigation) setTouchStart(e.targetTouches[0].clientX); };
  const handleTouchMove = (e: React.TouchEvent) => { if (touchNavigation) setTouchEnd(e.targetTouches[0].clientX); };
  const handleTouchEnd = () => {
    if (!touchNavigation) return;
    const diff = touchStart - touchEnd;
    if (Math.abs(diff) > 50) paginate(diff > 0 ? 1 : -1);
  };

  return (
    <div
      id="team-carousel-container"
      className={cn(`w-full py-20 flex flex-col items-center justify-center overflow-hidden relative`, className)}
      style={{
        background: background || '#F5F5F7',
        borderTop: '1px solid #E5E5EA',
        ...(background ? {} : {
          backgroundImage: 'url(/frames/nishanth_hospital_frontview.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
        }),
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* White wash so the building photo shows softly behind the cards */}
      {!background && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'rgba(245,245,247,0.86)', backdropFilter: 'blur(2px)', WebkitBackdropFilter: 'blur(2px)' }}
        />
      )}

      {/* Title */}
      {title && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full text-center px-6 mb-10 relative z-10"
        >
          <AnimatedTitle
            text={title}
            className={cn(
              "font-bold tracking-tight inline-block",
              "text-3xl sm:text-4xl md:text-5xl",
              titleClassName
            )}
            style={{ color: titleColor || '#1D1D1F' } as React.CSSProperties}
          />
          <div
            className="mx-auto mt-3 h-0.5 w-16 rounded-full"
            style={{ background: 'linear-gradient(to right, #DC2626, #F59E0B)' }}
          />
        </motion.div>
      )}

      {/* Carousel track */}
      <div
        className="w-full max-w-6xl relative mt-4"
        style={{ height: cardHeight + 100, perspective: '1000px' }}
      >
        {/* Arrows */}
        {showArrows && (
          <>
            <motion.button
              onClick={() => paginate(-1)}
              whileTap={{ scale: 0.92 }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-25 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200"
              style={{ background: '#FFFFFF', border: '1px solid #E5E5EA', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', color: '#6E6E73' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#DC2626'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(220,38,38,0.2)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#6E6E73'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#E5E5EA'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'; }}
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
            <motion.button
              onClick={() => paginate(1)}
              whileTap={{ scale: 0.92 }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-25 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200"
              style={{ background: '#FFFFFF', border: '1px solid #E5E5EA', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', color: '#6E6E73' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#DC2626'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(220,38,38,0.2)'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#6E6E73'; (e.currentTarget as HTMLButtonElement).style.borderColor = '#E5E5EA'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'; }}
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </>
        )}

        {/* Cards */}
        <div className="w-full h-full flex justify-center items-center relative" style={{ transformStyle: 'preserve-3d' }}>
          <AnimatePresence initial={false} custom={direction}>
            {members.map((member, index) => {
              const position = calculatePosition(index);
              const isCurrent = index === currentIndex;
              if (position === 'hidden' && !isCurrent) return null;

              return (
                <motion.div
                  key={member.id}
                  className={cn("absolute overflow-hidden cursor-pointer shadow-xl", cardClassName)}
                  style={{
                    width: cardWidth,
                    height: cardHeight,
                    borderRadius: cardRadius,
                    top: '50%',
                    left: '50%',
                    marginLeft: -cardWidth / 2,
                    marginTop: -cardHeight / 2,
                    background: '#FFFFFF',
                    border: isCurrent ? '2px solid rgba(220,38,38,0.2)' : '1px solid #E5E5EA',
                    boxShadow: isCurrent ? '0 8px 40px rgba(0,0,0,0.12)' : '0 2px 12px rgba(0,0,0,0.06)',
                  }}
                  initial={getVariantStyles('hidden')}
                  animate={getVariantStyles(position)}
                  exit={getVariantStyles('hidden')}
                  onClick={() => {
                    if (!isCurrent) {
                      const newDirection = index > currentIndex ? 1 : -1;
                      setDirection(newDirection);
                      setCurrentIndex(index);
                      onMemberChange?.(members[index], index);
                    }
                    onCardClick?.(member, index);
                  }}
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover select-none"
                    referrerPolicy="no-referrer"
                  />

                  {infoPosition === 'overlay' && (
                    <div
                      className="absolute bottom-0 left-0 right-0 p-4 text-center"
                      style={{ background: infoBackground || 'linear-gradient(transparent, rgba(0,0,0,0.85))', color: infoTextColor || '#FFFFFF' }}
                    >
                      <h3 className="text-lg font-bold text-white">{member.name}</h3>
                      <p className="text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>{member.role}</p>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Doctor info panel */}
      {infoPosition === 'bottom' && members[currentIndex] && (
        <motion.div
          key={members[currentIndex].id + '-info'}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ type: 'spring', stiffness: 90, damping: 20 }}
          className="w-full max-w-2xl px-5 mt-10 z-20"
          id="active-doctor-profile-panel"
        >
          <div
            className="rounded-3xl p-6 sm:p-8 relative overflow-hidden"
            style={{ background: '#FFFFFF', border: '1px solid #E5E5EA', boxShadow: '0 4px 24px rgba(0,0,0,0.07)' }}
          >
            {/* Subtle top accent */}
            <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-3xl" style={{ background: 'linear-gradient(to right, #DC2626, #F59E0B, #16A34A)' }} />

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-5">
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider"
                style={{ background: 'rgba(220,38,38,0.07)', color: '#DC2626', border: '1px solid rgba(220,38,38,0.15)' }}
              >
                <Shield className="w-3 h-3" />
                Senior Specialist
              </span>

              {members[currentIndex].bio?.toLowerCase().includes('gold medalist') && (
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider"
                  style={{ background: 'rgba(245,158,11,0.08)', color: '#D97706', border: '1px solid rgba(245,158,11,0.18)' }}
                >
                  <Award className="w-3 h-3" />
                  Gold Medalist
                </span>
              )}

              {members[currentIndex].bio?.toLowerCase().includes('madras medical college') && (
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider"
                  style={{ background: 'rgba(99,102,241,0.07)', color: '#6366F1', border: '1px solid rgba(99,102,241,0.15)' }}
                >
                  <Star className="w-3 h-3" />
                  MMC Alumnus
                </span>
              )}
            </div>

            {/* Name & role */}
            <div className="space-y-1.5 text-center sm:text-left mb-5">
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: '#1D1D1F' }}>
                {members[currentIndex].name}
              </h3>
              <p className="text-sm sm:text-base font-semibold uppercase tracking-wide" style={{
                background: 'linear-gradient(135deg, #DC2626, #F59E0B)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                {members[currentIndex].role}
              </p>
            </div>

            {/* Bio */}
            <div className="pt-4 min-h-[64px] text-center sm:text-left" style={{ borderTop: '1px solid #F2F2F2' }}>
              {members[currentIndex].bio && <AnimatedBio text={members[currentIndex].bio!} />}
            </div>

            {/* Book button */}
            {onBookClick && (
              <div className="mt-6 pt-5 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderTop: '1px solid #F2F2F2' }}>
                <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: '#AEAEB2' }}>
                  24×7 Emergency Obstetric Care
                </span>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onBookClick(members[currentIndex].name)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-white cursor-pointer transition-all"
                  style={{ background: '#DC2626', boxShadow: '0 2px 10px rgba(220,38,38,0.2)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#B91C1C'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 16px rgba(220,38,38,0.3)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#DC2626'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 2px 10px rgba(220,38,38,0.2)'; }}
                  id={`consult-panel-book-${members[currentIndex].id}`}
                >
                  <CalendarRange className="w-3.5 h-3.5" />
                  Book with {members[currentIndex].name.split(' ')[1] || 'Doctor'}
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Dots */}
      {showDots && (
        <div className="flex justify-center gap-2.5 mt-8">
          {members.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => {
                if (index !== currentIndex) {
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                  onMemberChange?.(members[index], index);
                }
              }}
              whileTap={{ scale: 0.9 }}
              className="rounded-full cursor-pointer transition-all duration-300"
              style={{
                width: index === currentIndex ? '24px' : '8px',
                height: '8px',
                background: index === currentIndex ? '#DC2626' : '#D2D2D7',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamCarousel;
