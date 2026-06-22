import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type AtmosphericCondition = 
  | 'clear-day'
  | 'cloudy'
  | 'rain'
  | 'thunderstorm'
  | 'clear-night'
  | 'cloudy-night'
  | 'fog'
  | 'heatwave';

interface AtmosphericSkyProps {
  weatherType: AtmosphericCondition;
  temperature?: number;
  humidity?: number;
  className?: string;
  children?: React.ReactNode;
}

const BG_COLORS: Record<AtmosphericCondition, string> = {
  'clear-day': '#0990d9',
  'cloudy': '#475359',
  'rain': '#475359',
  'thunderstorm': '#2A3036', // Slightly darker for thunderstorm
  'clear-night': '#030752',
  'cloudy-night': '#151928',
  'fog': '#8A9A9F',
  'heatwave': '#C05621'
};

const AtmosphericSky: React.FC<AtmosphericSkyProps> = ({ 
  weatherType, 
  className = '', 
  children 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [lightningOpacity, setLightningOpacity] = useState(0);

  // Background color mapping
  const bgColor = BG_COLORS[weatherType] || '#0990d9';

  // 1. Lightning Generator
  useEffect(() => {
    if (weatherType !== 'thunderstorm') {
      setLightningOpacity(0);
      return;
    }

    let timeout: ReturnType<typeof setTimeout>;
    const triggerLightning = () => {
      // Flash!
      setLightningOpacity(0.8 + Math.random() * 0.2);
      
      // Quick fade
      setTimeout(() => setLightningOpacity(0), 150);
      
      // Maybe double flash
      if (Math.random() > 0.6) {
        setTimeout(() => {
          setLightningOpacity(0.6 + Math.random() * 0.4);
          setTimeout(() => setLightningOpacity(0), 100);
        }, 200);
      }

      // Next strike in 5-12 seconds
      timeout = setTimeout(triggerLightning, 5000 + Math.random() * 7000);
    };

    timeout = setTimeout(triggerLightning, 2000);
    return () => clearTimeout(timeout);
  }, [weatherType]);

  // 2. Particle Engine (Rain, Stars) using Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: any[] = [];
    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;

    // Handle Resize
    const handleResize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width;
      canvas.height = height;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      if (weatherType === 'rain' || weatherType === 'thunderstorm') {
        const count = weatherType === 'thunderstorm' ? 200 : 100;
        for (let i = 0; i < count; i++) {
          particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            l: Math.random() * 1 + 10,     // length
            xs: -4 + Math.random() * 2,    // x speed
            ys: Math.random() * 10 + 10    // y speed
          });
        }
      } else if (weatherType === 'clear-night') {
        for (let i = 0; i < 150; i++) {
          particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            r: Math.random() * 1.5,        // radius
            opacity: Math.random(),        // initial opacity
            pulseSpeed: 0.01 + Math.random() * 0.02,
            pulseDir: Math.random() > 0.5 ? 1 : -1
          });
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      if (weatherType === 'rain' || weatherType === 'thunderstorm') {
        ctx.strokeStyle = 'rgba(255,255,255,0.4)';
        ctx.lineWidth = 1;
        ctx.lineCap = 'round';
        ctx.beginPath();
        
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.xs, p.y + p.ys);
          p.x += p.xs;
          p.y += p.ys;
          
          if (p.x > width || p.y > height) {
            p.x = Math.random() * width;
            p.y = -20;
          }
        }
        ctx.stroke();
      } else if (weatherType === 'clear-night') {
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.opacity += p.pulseSpeed * p.pulseDir;
          if (p.opacity > 1) {
            p.opacity = 1;
            p.pulseDir = -1;
          } else if (p.opacity < 0.1) {
            p.opacity = 0.1;
            p.pulseDir = 1;
          }
          
          ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [weatherType]);

  // CSS for clouds
  const cloudStyles = `
    @keyframes moveClouds1 {
      0% { background-position: 0px 0px; }
      100% { background-position: 1000px 0px; }
    }
    @keyframes moveClouds2 {
      0% { background-position: 0px 0px; }
      100% { background-position: -800px 0px; }
    }
    .clouds-layer-1 {
      background-image: url('data:image/svg+xml;utf8,<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg"><circle cx="200" cy="200" r="100" fill="white" opacity="0.1" filter="blur(30px)"/></svg>');
      animation: moveClouds1 40s linear infinite;
    }
    .clouds-layer-2 {
      background-image: url('data:image/svg+xml;utf8,<svg width="300" height="300" xmlns="http://www.w3.org/2000/svg"><circle cx="150" cy="150" r="80" fill="white" opacity="0.08" filter="blur(20px)"/></svg>');
      animation: moveClouds2 30s linear infinite;
    }
  `;

  return (
    <motion.div 
      className={`relative overflow-hidden rounded-2xl ${className}`}
      animate={{ backgroundColor: bgColor }}
      transition={{ duration: 1.5 }}
      style={{ isolation: 'isolate' }}
    >
      <style>{cloudStyles}</style>

      {/* Atmospheric Base Effects */}
      
      {/* 1. Clear Day Sun Glow */}
      <AnimatePresence>
        {weatherType === 'clear-day' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-[-20%] left-[-10%] w-[60%] h-[80%] rounded-full bg-[#FFE58F] blur-[120px] opacity-20 pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* 2. Heatwave distortion & glow */}
      <AnimatePresence>
        {weatherType === 'heatwave' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-t from-[#D94F04] to-transparent mix-blend-color-burn opacity-60 pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* 3. Fog / Haze */}
      <AnimatePresence>
        {weatherType === 'fog' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#E8F0FF] blur-[40px] opacity-40 pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* 4. Clouds (Hidden on clear-night unless we want dark clouds) */}
      {weatherType !== 'clear-night' && weatherType !== 'clear-day' && (
        <>
          <div className="absolute inset-0 clouds-layer-1 opacity-60 mix-blend-screen pointer-events-none" />
          <div className="absolute inset-0 clouds-layer-2 opacity-40 mix-blend-screen pointer-events-none" />
        </>
      )}

      {/* 5. Lightning overlay */}
      <div 
        className="absolute inset-0 bg-white pointer-events-none z-10"
        style={{ 
          opacity: lightningOpacity, 
          transition: 'opacity 0.05s ease-out',
          mixBlendMode: 'overlay'
        }}
      />

      {/* 6. Canvas for particles (Rain, Stars) */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      />

      {/* Actual Content Overlay */}
      <div className="relative z-20 h-full w-full">
        {children}
      </div>

    </motion.div>
  );
};

export default AtmosphericSky;
