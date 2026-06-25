import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Sphere, Float } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

// A simple rotating Earth component
const Earth = () => {
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);

  // Rotate earth and clouds slowly
  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    if (earthRef.current) {
      earthRef.current.rotation.y = elapsedTime / 15;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y = elapsedTime / 12;
    }
  });

  return (
    <group>
      {/* Earth Sphere */}
      <Sphere ref={earthRef} args={[2, 64, 64]}>
        <meshPhongMaterial 
          color="#001835" 
          emissive="#0a2a5c" 
          emissiveIntensity={0.5} 
          wireframe={true} 
          transparent 
          opacity={0.3} 
        />
      </Sphere>

      {/* Cloud layer (slightly larger sphere) */}
      <Sphere ref={cloudsRef} args={[2.05, 64, 64]}>
        <meshPhongMaterial 
          color="#00E5FF" 
          transparent 
          opacity={0.1} 
          wireframe 
        />
      </Sphere>

      {/* Atmospheric Glow */}
      <Sphere args={[2.2, 64, 64]}>
        <meshBasicMaterial 
          color="#00E5FF" 
          transparent 
          opacity={0.05} 
          side={THREE.BackSide} 
        />
      </Sphere>
    </group>
  );
};

// Main Section Component
const CinematicHeroSection: React.FC = () => {
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadRef = useRef<HTMLParagraphElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // GSAP Entrance Animations
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.fromTo(
      badgeRef.current,
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, delay: 0.5 }
    )
    .fromTo(
      headlineRef.current,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2 },
      "-=0.5"
    )
    .fromTo(
      subheadRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 1 },
      "-=0.8"
    );
  }, []);

  return (
    <section className="relative w-full h-screen bg-[#020617] overflow-hidden flex items-center justify-center">
      {/* 3D Canvas Background */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} intensity={1.5} color="#00E5FF" />
          <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
          <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
            <Earth />
          </Float>
          <OrbitControls 
            enableZoom={false} 
            enablePan={false} 
            autoRotate={false} 
            maxPolarAngle={Math.PI / 2 + 0.2} 
            minPolarAngle={Math.PI / 2 - 0.2}
          />
        </Canvas>
      </div>

      {/* UI Overlay */}
      <div className="relative z-10 container mx-auto px-6 lg:px-12 flex flex-col items-center text-center mt-20 pointer-events-none">
        {/* Animated Live Badge */}
        <div 
          ref={badgeRef}
          className="mb-8 flex items-center gap-3 px-4 py-2 rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(6,11,23,0.72)] backdrop-blur-[20px] shadow-[0_20px_60px_rgba(0,0,0,0.45)] pointer-events-auto"
        >
          <div className="w-2 h-2 rounded-full bg-[#34D399] animate-pulse"></div>
          <span className="text-[#34D399] text-xs font-mono uppercase tracking-widest font-bold">Live Telemetry Active</span>
        </div>

        {/* Headline */}
        <h1 
          ref={headlineRef}
          className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight max-w-5xl"
          style={{ fontFamily: '"Inter", sans-serif' }}
        >
          Earth's atmosphere, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#67E8F9]">revealed in real time.</span>
        </h1>

        {/* Subheading */}
        <p 
          ref={subheadRef}
          className="text-lg md:text-xl text-gray-400 max-w-2xl leading-relaxed"
          style={{ fontFamily: '"Inter", sans-serif' }}
        >
          AI-powered atmospheric intelligence using satellite observations, ground measurements, and predictive models.
        </p>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-xs text-gray-500 font-mono tracking-widest uppercase">Initiate Sequence</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-gray-500 to-transparent"></div>
        </div>
      </div>
    </section>
  );
};

export default CinematicHeroSection;
