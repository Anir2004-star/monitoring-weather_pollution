import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

import EarthModel from './EarthCanvas';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const EarthInterface: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const earthGroupRef = useRef<THREE.Group>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);

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

    // 1. Move Earth on scroll (Placeholder for future sections)
    earthTl.to(earthGroupRef.current.position, {
      x: 2.5,
      z: 1,
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
    <div ref={containerRef} className="relative bg-[var(--ei-bg)] text-[var(--ei-ivory)] min-h-[200vh]">
      
      {/* ─── FIXED 3D CANVAS ─── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 7], fov: 45 }}>
          {/* Subtle warm ambient light */}
          <ambientLight intensity={0.15} color="#F5F1E7" />
          
          {/* Main directional light representing the sun */}
          <directionalLight position={[5, 3, 5]} intensity={2} color="#F5F1E7" />
          
          {/* Secondary light to fill shadows slightly with copper tone */}
          <pointLight position={[-5, -2, -5]} intensity={0.5} color="#8C5A2B" />

          {/* Very subtle warm stars */}
          <Stars radius={100} depth={50} count={2000} factor={3} saturation={1} fade speed={0.5} color="#F5F1E7" />
          
          <EarthModel earthGroupRef={earthGroupRef} />
        </Canvas>
      </div>

      {/* ─── SCROLLABLE HTML SECTIONS ─── */}
      <div className="relative z-10">
        
        {/* Section 1: Hero */}
        <section className="scroll-section h-screen flex flex-col items-center justify-center text-center px-6 pointer-events-none">
          <div className="content-block" ref={heroTextRef}>
            <div className="mb-6 flex items-center gap-3 px-5 py-2 rounded-full border border-[var(--ei-border)] bg-[var(--ei-surface)]/40 backdrop-blur-[12px] shadow-[0_20px_60px_rgba(0,0,0,0.5)] mx-auto w-max pointer-events-auto">
              <div className="w-2 h-2 rounded-full bg-[var(--ei-accent-primary)] animate-pulse"></div>
              <span className="text-[var(--ei-accent-primary)] text-xs font-telemetry uppercase tracking-widest font-bold">
                Live Telemetry Active
              </span>
            </div>
            
            <h1 className="font-editorial text-5xl md:text-7xl lg:text-8xl font-medium mb-6 leading-tight max-w-5xl tracking-tight text-[var(--ei-ivory)]">
              Observe Earth's <br />
              <span className="text-[var(--ei-accent-primary)] italic">Living Atmosphere.</span>
            </h1>
            
            <p className="font-body text-lg md:text-xl text-[var(--ei-ash)] max-w-2xl mx-auto leading-relaxed mb-10">
              Transform satellite observations into actionable environmental intelligence using advanced atmospheric models.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pointer-events-auto">
              <button className="px-8 py-4 rounded-full bg-[var(--ei-accent-primary)] text-[var(--ei-bg)] font-body font-medium hover:bg-[var(--ei-ivory)] hover:text-[var(--ei-bg)] transition-colors duration-300 shadow-[0_0_30px_rgba(184,134,47,0.3)]">
                Explore Platform
              </button>
              <button className="px-8 py-4 rounded-full border border-[var(--ei-border)] bg-transparent text-[var(--ei-ivory)] font-body font-medium hover:bg-[var(--ei-surface)] transition-colors duration-300">
                Discover Our Mission
              </button>
            </div>
          </div>

          {/* Floating Telemetry Tags (Absolute positioned around screen, placeholder) */}
          <div className="absolute top-[20%] left-[10%] hidden lg:flex items-center gap-2 px-3 py-1.5 rounded bg-[var(--ei-surface)]/60 border border-[var(--ei-border)] backdrop-blur-md pointer-events-none">
             <span className="w-1.5 h-1.5 rounded-full bg-[var(--ei-success)] animate-pulse" />
             <span className="text-[10px] text-[var(--ei-ash)] font-telemetry uppercase tracking-wider">INSAT-3DR Active</span>
          </div>
          
          <div className="absolute bottom-[25%] right-[12%] hidden lg:flex items-center gap-2 px-3 py-1.5 rounded bg-[var(--ei-surface)]/60 border border-[var(--ei-border)] backdrop-blur-md pointer-events-none">
             <span className="text-[10px] text-[var(--ei-accent-primary)] font-telemetry uppercase tracking-wider">94% Confidence</span>
          </div>
        </section>

      </div>
    </div>
  );
};

export default EarthInterface;
