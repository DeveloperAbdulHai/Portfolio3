
import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

const CustomCursor: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Mouse coordinates
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Spring physics for the trailing ring
  const springConfig = { damping: 30, stiffness: 250, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
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
      
      setIsHovered(!!isClickable);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mouseover', handleMouseOver);

    // Hide default cursor globally
    document.body.style.cursor = 'none';
    const allButtons = document.querySelectorAll('button, a');
    allButtons.forEach(b => (b as HTMLElement).style.cursor = 'none');

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
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
          width: isHovered ? 80 : 40,
          height: isHovered ? 80 : 40,
          backgroundColor: isHovered ? 'rgba(0, 208, 132, 0.1)' : 'transparent',
          scale: isActive ? 0.8 : 1,
        }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      />
      
      {/* Inner Dot */}
      <motion.div
        className="absolute w-2 h-2 bg-primary-500 rounded-full"
        style={{
          left: mouseX,
          top: mouseY,
          x: "-50%",
          y: "-50%",
          opacity: isHovered ? 0 : 1,
        }}
      />
      
      {/* Glow Effect around cursor */}
      <motion.div
        className="absolute w-32 h-32 bg-primary-500/20 rounded-full blur-2xl"
        style={{
          left: smoothX,
          top: smoothY,
          x: "-50%",
          y: "-50%",
          opacity: isVisible ? 1 : 0,
        }}
      />
    </div>
  );
};

export default CustomCursor;
