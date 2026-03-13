
import React, { useEffect, useRef, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

const CustomCursor: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const hoveredRef = useRef(false);

  // Mouse coordinates
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Spring physics for the trailing ring
  // Tighter spring = less perceived delay (still smooth)
  const springConfig = { damping: 28, stiffness: 900, mass: 0.22 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Check if it's a touch device
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    const onMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const onMouseDown = () => setIsActive(true);
    const onMouseUp = () => setIsActive(false);

    // Track interactive elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isClickable = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('a') || 
        target.closest('button') ||
        target.closest('.group') ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA';

      const nextHovered = !!isClickable;
      if (hoveredRef.current !== nextHovered) {
        hoveredRef.current = nextHovered;
        setIsHovered(nextHovered);
      }
    };

    // Prefer pointer events (better on high-DPI + stylus); fall back to mouse events.
    window.addEventListener('pointermove', onMouseMove as unknown as EventListener, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mouseover', handleMouseOver);

    // Hide default cursor globally
    document.body.style.cursor = 'none';
    const allButtons = document.querySelectorAll('button, a');
    allButtons.forEach(b => (b as HTMLElement).style.cursor = 'none');

    return () => {
      window.removeEventListener('pointermove', onMouseMove as unknown as EventListener);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mouseover', handleMouseOver);
      document.body.style.cursor = 'auto';
    };
  }, [mouseX, mouseY, isVisible]);

  // Hide on mobile
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      {/* Outer Trailing Ring */}
      <motion.div
        className="absolute rounded-full border border-primary-500/50 mix-blend-screen"
        style={{
          left: smoothX,
          top: smoothY,
          x: "-50%",
          y: "-50%",
          willChange: 'transform, width, height',
        }}
        animate={{
          width: isHovered ? 76 : 36,
          height: isHovered ? 76 : 36,
          backgroundColor: isHovered ? 'rgba(0, 208, 132, 0.10)' : 'rgba(0, 0, 0, 0)',
          scale: isActive ? 0.86 : 1,
        }}
        transition={{
          width: { type: 'spring', stiffness: 520, damping: 34, mass: 0.35 },
          height: { type: 'spring', stiffness: 520, damping: 34, mass: 0.35 },
          backgroundColor: { duration: 0.18, ease: 'easeOut' },
          scale: { type: 'spring', stiffness: 700, damping: 28, mass: 0.3 },
        }}
      />

      {/* Targeting Reticle (only on hover) */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          left: smoothX,
          top: smoothY,
          x: "-50%",
          y: "-50%",
          width: 92,
          height: 92,
          willChange: 'transform, opacity',
        }}
        animate={{
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? 1 : 0.92,
        }}
        transition={{
          opacity: { duration: 0.12, ease: 'easeOut' },
          scale: { type: 'spring', stiffness: 650, damping: 30, mass: 0.3 },
        }}
      >
        {/* 4 corner ticks */}
        <div className="absolute left-1 top-1 w-4 h-[2px] bg-primary-500/80 rounded-full" />
        <div className="absolute left-1 top-1 w-[2px] h-4 bg-primary-500/80 rounded-full" />

        <div className="absolute right-1 top-1 w-4 h-[2px] bg-primary-500/80 rounded-full" />
        <div className="absolute right-1 top-1 w-[2px] h-4 bg-primary-500/80 rounded-full" />

        <div className="absolute left-1 bottom-1 w-4 h-[2px] bg-primary-500/80 rounded-full" />
        <div className="absolute left-1 bottom-1 w-[2px] h-4 bg-primary-500/80 rounded-full" />

        <div className="absolute right-1 bottom-1 w-4 h-[2px] bg-primary-500/80 rounded-full" />
        <div className="absolute right-1 bottom-1 w-[2px] h-4 bg-primary-500/80 rounded-full" />

        {/* subtle center dot to suggest “lock” */}
        <div className="absolute left-1/2 top-1/2 w-1 h-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-500/70 blur-[0.2px]" />
      </motion.div>
      
      {/* Inner Dot */}
      <motion.div
        className="absolute w-1.5 h-1.5 bg-primary-500 rounded-full"
        style={{
          left: mouseX,
          top: mouseY,
          x: "-50%",
          y: "-50%",
          willChange: 'transform, opacity',
        }}
        animate={{ opacity: isHovered ? 0 : 1 }}
        transition={{ duration: 0.12, ease: 'easeOut' }}
      />
      
      {/* Glow Effect around cursor */}
      <motion.div
        className="absolute w-32 h-32 bg-primary-500/20 rounded-full blur-2xl"
        style={{
          left: smoothX,
          top: smoothY,
          x: "-50%",
          y: "-50%",
          willChange: 'transform, opacity',
        }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      />
    </div>
  );
};

export default CustomCursor;
