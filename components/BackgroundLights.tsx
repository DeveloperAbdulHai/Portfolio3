import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

const BackgroundLights: React.FC = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [isMobile, setIsMobile] = useState(false);

  const springConfig = { damping: 30, stiffness: 100 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.matchMedia('(pointer: coarse)').matches);
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
      {/* Mouse-follow: green tint */}
      {!isMobile && (
        <motion.div
          className="absolute w-[700px] h-[700px] rounded-full blur-[100px]"
          style={{
            left: smoothX,
            top: smoothY,
            transform: 'translate(-50%, -50%)',
            willChange: 'left, top',
            backgroundColor: 'rgba(0, 208, 132, 0.06)',
          }}
        />
      )}

      {/* Top-left: soft green */}
      <motion.div
        animate={{ x: [0, 80, 0], y: [0, -40, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-24 -left-24 w-[500px] h-[500px] blur-[120px] md:blur-[140px] rounded-full"
        style={{ willChange: 'transform', backgroundColor: 'rgba(0, 208, 132, 0.07)' }}
      />
      {/* Right: soft blue */}
      <motion.div
        animate={{ x: [0, -80, 0], y: [0, 60, 0], scale: [1.1, 1, 1.1] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute top-1/2 -right-24 w-[450px] h-[450px] blur-[100px] md:blur-[130px] rounded-full"
        style={{ willChange: 'transform', backgroundColor: 'rgba(91, 156, 240, 0.08)' }}
      />
      {/* Bottom-left: warm amber */}
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-[-5%] left-[15%] w-[350px] h-[350px] blur-[90px] rounded-full"
        style={{ willChange: 'transform', backgroundColor: 'rgba(232, 180, 74, 0.06)' }}
      />

      <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
};

export default BackgroundLights;
