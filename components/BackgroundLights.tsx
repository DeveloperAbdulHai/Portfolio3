
import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

const BackgroundLights: React.FC = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isMobile, setIsMobile] = useState(false);

  // Smooth out mouse movement
  const springConfig = { damping: 25, stiffness: 150 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(pointer: coarse)').matches);
    };
    checkMobile();
    
    if (!isMobile) {
      const handleMouseMove = (e: MouseEvent) => {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
      };

      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [mouseX, mouseY, isMobile]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Interactive Mouse Spotlight - Disabled on mobile for performance */}
      {!isMobile && (
        <motion.div
          className="absolute w-[800px] h-[800px] rounded-full bg-primary-500/5 blur-[120px]"
          style={{
            left: smoothX,
            top: smoothY,
            transform: 'translate(-50%, -50%)',
            willChange: 'left, top',
          }}
        />
      )}

      {/* Static/Floating Orbs */}
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute -top-20 -left-20 w-[600px] h-[600px] bg-primary-500/10 blur-[100px] md:blur-[150px] rounded-full"
        style={{ willChange: 'transform' }}
      />

      <motion.div
        animate={{
          x: [0, -100, 0],
          y: [0, 100, 0],
          scale: [1.2, 1, 1.2],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        className="absolute top-1/2 -right-20 w-[500px] h-[500px] bg-blue-500/5 blur-[100px] md:blur-[150px] rounded-full"
        style={{ willChange: 'transform' }}
      />

      <motion.div
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute bottom-[-10%] left-[20%] w-[400px] h-[400px] bg-primary-500/5 blur-[80px] md:blur-[100px] rounded-full"
        style={{ willChange: 'transform' }}
      />
      
      {/* Subtle Scanline/Grain Texture overlay */}
      <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
    </div>
  );
};

export default BackgroundLights;
