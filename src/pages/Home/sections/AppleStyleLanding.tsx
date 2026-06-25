import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Sphere, Float } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Link } from 'react-router-dom';
import { Activity, Zap, Map, Cpu, Satellite, Wind, BarChart3 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// ─── 3D Earth Component ──────────────────────────────────────────────────────
const EarthModel = ({ earthGroupRef }: { earthGroupRef: React.RefObject<THREE.Group | null> }) => {
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);

  // Constant rotation
  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    if (earthRef.current) earthRef.current.rotation.y = elapsedTime / 15;
    if (cloudsRef.current) cloudsRef.current.rotation.y = elapsedTime / 12;
  });

  return (
    <group ref={earthGroupRef}>
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
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

          {/* Cloud layer */}
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
      </Float>
    </group>
  );
};

// ─── Main Landing Page Component ──────────────────────────────────────────────
const AppleStyleLanding: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const earthGroupRef = useRef<THREE.Group>(null);
  
  // DOM Refs for text animations
  const heroTextRef = useRef<HTMLDivElement>(null);
  const featureTextRef = useRef<HTMLDivElement>(null);
  const pipelineTextRef = useRef<HTMLDivElement>(null);
  const ctaTextRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!earthGroupRef.current) return;

    // Timeline for the 3D Earth
    const earthTl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1, // Smooth scrubbing
      }
    });

    // 1. Move to right for Features
    earthTl.to(earthGroupRef.current.position, {
      x: 2.5,
      z: 1,
      duration: 1,
      ease: 'power1.inOut'
    })
    // 2. Zoom in tight for Pipeline
    .to(earthGroupRef.current.position, {
      x: 0,
      y: -1.5,
      z: 3,
      duration: 1,
      ease: 'power1.inOut'
    })
    // 3. Move back and fade for CTA
    .to(earthGroupRef.current.position, {
      x: 0,
      y: 0,
      z: -2,
      duration: 1,
      ease: 'power1.inOut'
    });

    // Text Animations (Fade in/out as sections scroll)
    gsap.utils.toArray('.scroll-section').forEach((section: any) => {
      gsap.fromTo(section.querySelector('.content-block'), 
        { opacity: 0, y: 50 },
        { 
          opacity: 1, 
          y: 0,
          scrollTrigger: {
            trigger: section,
            start: 'top center',
            end: 'bottom center',
            toggleActions: 'play reverse play reverse',
          }
        }
      );
    });

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative bg-[#020617] text-white">
      
      {/* ─── FIXED 3D CANVAS ─── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} intensity={1.5} color="#00E5FF" />
          <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
          <EarthModel earthGroupRef={earthGroupRef} />
        </Canvas>
      </div>

      {/* ─── SCROLLABLE HTML SECTIONS ─── */}
      <div className="relative z-10">
        
        {/* Section 1: Hero */}
        <section className="scroll-section h-screen flex flex-col items-center justify-center text-center px-6 pointer-events-none">
          <div className="content-block" ref={heroTextRef}>
            <div className="mb-6 flex items-center gap-3 px-4 py-2 rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(6,11,23,0.72)] backdrop-blur-[20px] shadow-[0_20px_60px_rgba(0,0,0,0.45)] mx-auto w-max pointer-events-auto">
              <div className="w-2 h-2 rounded-full bg-[#34D399] animate-pulse"></div>
              <span className="text-[#34D399] text-xs font-mono uppercase tracking-widest font-bold">Live Telemetry Active</span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight max-w-5xl">
              Earth's atmosphere, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#67E8F9]">revealed in real time.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              AI-powered atmospheric intelligence using satellite observations, ground measurements, and predictive models.
            </p>
          </div>
        </section>

        {/* Section 2: Features (Text on Left, Earth on Right) */}
        <section className="scroll-section h-screen flex items-center px-6 md:px-20">
          <div className="content-block max-w-xl" ref={featureTextRef}>
            <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
              Unprecedented <br />
              <span className="text-[#00E5FF]">visibility.</span>
            </h2>
            
            <div className="space-y-8">
              {[
                { icon: <Activity className="text-[#00E5FF]" />, title: 'Real-Time Telemetry', desc: 'Live monitoring of atmospheric dominance across India.' },
                { icon: <Zap className="text-[#FFB703]" />, title: 'Predictive Forecasting', desc: 'Advanced AI models predict PM2.5 up to 7 days in advance.' },
                { icon: <Map className="text-[#34D399]" />, title: 'Spatial Intelligence', desc: 'High-resolution Mapbox GL visualizations with precision.' }
              ].map((f, i) => (
                <div key={i} className="flex gap-4">
                  <div className="mt-1">{f.icon}</div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">{f.title}</h3>
                    <p className="text-[#8B9CC8]">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 3: Pipeline (Text overlays zoomed Earth) */}
        <section className="scroll-section h-[150vh] flex flex-col items-center justify-start pt-32 px-6">
          <div className="content-block text-center max-w-4xl w-full" ref={pipelineTextRef}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(0,229,255,0.2)] bg-[rgba(0,229,255,0.05)] mb-6">
              <Cpu size={14} className="text-[#00E5FF]" />
              <span className="text-[#00E5FF] text-xs font-mono uppercase tracking-widest font-bold">Core Architecture</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-12">The Intelligence Pipeline</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              {[
                { icon: <Satellite className="text-[#00E5FF]"/>, title: 'INSAT Satellites', desc: '3D, 3DR & 3DS optical data.' },
                { icon: <Wind className="text-[#FACC15]"/>, title: 'MERRA-2 Weather', desc: 'Meteorological variables.' },
                { icon: <BarChart3 className="text-[#00F5A0]"/>, title: 'PM2.5 Prediction', desc: 'High-accuracy surface PM.' }
              ].map((step, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-[rgba(6,11,23,0.6)] border border-[rgba(255,255,255,0.06)] backdrop-blur-xl">
                  <div className="mb-4">{step.icon}</div>
                  <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                  <p className="text-sm text-[#8B9CC8]">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 4: CTA */}
        <section className="scroll-section h-screen flex flex-col items-center justify-center text-center px-6">
          <div className="content-block" ref={ctaTextRef}>
            <h2 className="text-5xl md:text-7xl font-bold mb-8">
              Enter the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#34D399] to-[#00E5FF]">Command Center</span>
            </h2>
            <Link 
              to="/dashboard"
              className="inline-flex items-center justify-center gap-3 px-10 py-5 rounded-full bg-gradient-to-r from-[#00E5FF] to-[#0A2A5C] text-white text-lg font-bold tracking-wider hover:shadow-[0_0_40px_rgba(0,229,255,0.6)] transition-all border border-[rgba(0,229,255,0.4)] hover:scale-105 pointer-events-auto"
            >
              Launch Dashboard Operations
              <span className="text-2xl">→</span>
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
};

export default AppleStyleLanding;
