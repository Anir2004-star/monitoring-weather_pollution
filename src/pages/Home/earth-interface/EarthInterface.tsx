import React, { useRef, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import EarthCanvas from './EarthCanvas';
import GridBackground from '../../../components/common/GridBackground';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const EarthInterface: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const earthGroupRef = useRef<THREE.Group>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const navigate = useNavigate();
  
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const ctaBtn1Ref = useRef<HTMLButtonElement>(null);
  const ctaBtn2Ref = useRef<HTMLButtonElement>(null);

  // Intro Timeline + Scroll Storytelling
  useGSAP(() => {
    if (!containerRef.current) return;
    
    // --- 1. CINEMATIC INTRO TIMELINE ---
    const tlIntro = gsap.timeline({ defaults: { ease: 'power2.out' } });

    // Initial States
    gsap.set('.canvas-container', { opacity: 0 });
    gsap.set('.telemetry-capsule', { opacity: 0, scale: 0.9, y: 20 });
    gsap.set([headlineRef.current, subheadRef.current], { opacity: 0, y: 40 });
    gsap.set([ctaBtn1Ref.current, ctaBtn2Ref.current], { opacity: 0, y: 20 });

    tlIntro
      // Black screen -> Stars and Earth fade in together
      .to('.canvas-container', { opacity: 1, duration: 4, ease: 'power1.inOut' })
      // Floating telemetry appears
      .to('.telemetry-capsule', { opacity: 1, scale: 1, y: 0, duration: 1.5, stagger: 0.4 }, '-=2')
      // Headline animates
      .to(headlineRef.current, { opacity: 1, y: 0, duration: 1.5 }, '-=1.5')
      .to(subheadRef.current, { opacity: 1, y: 0, duration: 1.2 }, '-=1')
      // Buttons animate
      .to(ctaBtn1Ref.current, { opacity: 1, y: 0, duration: 1 }, '-=0.8')
      .to(ctaBtn2Ref.current, { opacity: 1, y: 0, duration: 1 }, '-=0.8');

    // --- 2. SCROLL STORYTELLING ---
    
    // Section 1: Hero to Mission
    gsap.to(earthGroupRef.current?.rotation || {}, {
      y: Math.PI / 4,
      z: 0.2,
      scrollTrigger: {
        trigger: '#section-mission',
        start: 'top bottom',
        end: 'center center',
        scrub: 1,
      }
    });

    gsap.to(earthGroupRef.current?.position || {}, {
      x: 1, // Move earth right
      scrollTrigger: {
        trigger: '#section-mission',
        start: 'top bottom',
        end: 'center center',
        scrub: 1,
      }
    });

    // Section 2: Mission to Processing
    gsap.to(earthGroupRef.current?.rotation || {}, {
      y: Math.PI / 2,
      scrollTrigger: {
        trigger: '#section-processing',
        start: 'top bottom',
        end: 'center center',
        scrub: 1,
      }
    });

    gsap.to(earthGroupRef.current?.position || {}, {
      x: -1, // Move earth left
      scrollTrigger: {
        trigger: '#section-processing',
        start: 'top bottom',
        end: 'center center',
        scrub: 1,
      }
    });

    // Section 3: Processing to CTA
    gsap.to(earthGroupRef.current?.position || {}, {
      x: 0, 
      y: 1.5, // Move earth up and away
      z: -3, 
      scrollTrigger: {
        trigger: '#section-cta',
        start: 'top bottom',
        end: 'center center',
        scrub: 1,
      }
    });

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative w-full bg-[#0B0907] text-[var(--ei-ivory)] overflow-hidden">
      
      {/* 3D Canvas Background (Fixed) */}
      <div className="canvas-container fixed inset-0 z-0 bg-[#0B0907] pointer-events-none">
        <Canvas 
          camera={{ position: [0, 0, 6], fov: 45 }}
          onCreated={({ camera }) => {
            cameraRef.current = camera as THREE.PerspectiveCamera;
          }}
          dpr={[1, 2]}
          className="pointer-events-auto"
        >
          <group>
            <Stars radius={100} depth={50} count={3000} factor={3} saturation={0} fade speed={1} />
          </group>
          <group>
            <Suspense fallback={null}>
              <EarthCanvas earthGroupRef={earthGroupRef} />
            </Suspense>
          </group>
        </Canvas>
      </div>

      {/* Grid Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <GridBackground variant="lines" className="opacity-20" fade={true} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(184,134,47,0.06)_0%,transparent_65%)]" />
      </div>

      {/* Scrollable Storytelling Sections */}
      <div className="relative z-10">
        
        {/* 1. HERO SECTION */}
        <section id="section-hero" className="relative w-full h-screen flex items-center justify-center pointer-events-none">
          <div className="text-center px-6 pointer-events-auto mt-20">
            <h1 ref={headlineRef} className="font-editorial text-5xl md:text-7xl lg:text-8xl font-medium mb-6 leading-tight max-w-5xl tracking-tight text-[var(--ei-ivory)] drop-shadow-2xl">
              Observe Earth's <br />
              <span className="block text-[var(--ei-accent-primary)]">Living Atmosphere.</span>
            </h1>
            
            <p ref={subheadRef} className="font-body text-lg md:text-xl text-[var(--ei-ash)] max-w-2xl mx-auto leading-relaxed mb-10 drop-shadow-md">
              An environmental intelligence platform combining satellite observations, ground telemetry, and atmospheric reanalysis.
            </p>

            <div ref={buttonRef} className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button onClick={() => navigate('/dashboard')} ref={ctaBtn1Ref} className="px-8 py-3 rounded-sm bg-[var(--ei-accent-primary)] text-[#0B0907] font-medium tracking-wide hover:bg-[var(--ei-ivory)] hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(184,134,47,0.3)] transition-all duration-300">
                Launch Intelligence
              </button>
              <button ref={ctaBtn2Ref} className="px-8 py-3 rounded-sm border border-[var(--ei-border)] bg-[rgba(255,255,255,0.02)] backdrop-blur text-[var(--ei-ash)] font-medium tracking-wide hover:text-[var(--ei-ivory)] hover:bg-[rgba(255,255,255,0.05)] transition-all duration-300">
                Explore The Mission
              </button>
            </div>
          </div>
        </section>

        {/* 2. MISSION SECTION */}
        <section id="section-mission" className="relative w-full min-h-screen flex items-center pt-24 pb-32 pointer-events-none">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 pointer-events-auto">
            <div>
              <div className="inline-block px-3 py-1 mb-6 rounded-sm border border-[var(--ei-accent-primary)] text-[var(--ei-accent-primary)] font-telemetry text-[11px] uppercase tracking-widest bg-[#15120F]/80 backdrop-blur-sm">
                Scientific Observation
              </div>
              <h2 className="font-editorial text-4xl md:text-5xl lg:text-6xl text-[var(--ei-ivory)] leading-tight mb-8">
                Every breath of the planet, monitored in real-time.
              </h2>
              <p className="font-body text-[var(--ei-ash)] text-lg leading-relaxed bg-[#0B0907]/40 p-4 rounded-sm backdrop-blur-sm border border-[rgba(255,255,255,0.03)]">
                By fusing INSAT-3DR satellite observations with CPCB ground monitoring stations, ATMOS creates a unified, hyper-resolution map of Earth's air quality and weather systems. We don't just show data; we observe the planet's atmospheric health.
              </p>
            </div>
            {/* Empty right column for Earth */}
          </div>
        </section>

        {/* 3. AI PROCESSING SECTION */}
        <section id="section-processing" className="relative w-full min-h-screen flex items-center pt-24 pb-32 pointer-events-none">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 pointer-events-auto">
            {/* Empty left column for Earth */}
            <div></div>
            <div>
              <div className="inline-block px-3 py-1 mb-6 rounded-sm border border-[var(--ei-accent-secondary)] text-[var(--ei-accent-secondary)] font-telemetry text-[11px] uppercase tracking-widest bg-[#15120F]/80 backdrop-blur-sm">
                AI Processing Pipeline
              </div>
              <h2 className="font-editorial text-4xl md:text-5xl lg:text-6xl text-[var(--ei-ivory)] leading-tight mb-8">
                Machine learning that understands the atmosphere.
              </h2>
              <p className="font-body text-[var(--ei-ash)] text-lg leading-relaxed mb-10 bg-[#0B0907]/40 p-4 rounded-sm backdrop-blur-sm border border-[rgba(255,255,255,0.03)]">
                Our models process millions of atmospheric data points per second. Using advanced deep learning, we interpolate missing ground data and predict severe pollution events hours before they happen.
              </p>
              
              <div className="space-y-6 bg-[#15120F]/80 backdrop-blur-sm p-6 rounded-sm border border-[rgba(255,255,255,0.03)]">
                {[
                  { title: 'Satellite Fusion', value: 'INSAT-3DR + MERRA-2' },
                  { title: 'Prediction Window', value: '72 Hours Advance' },
                  { title: 'Processing Latency', value: '< 2.5 Seconds' }
                ].map((stat, i) => (
                  <div key={i} className="flex items-center justify-between border-b border-[var(--ei-border)] pb-4 last:border-0 last:pb-0">
                    <span className="font-body text-[var(--ei-ash)]">{stat.title}</span>
                    <span className="font-telemetry text-[var(--ei-ivory)]">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 4. CTA SECTION */}
        <section id="section-cta" className="relative w-full min-h-[80vh] flex items-center justify-center text-center pt-24 pb-32 pointer-events-none">
          <div className="max-w-3xl mx-auto px-6 pointer-events-auto">
            <h2 className="font-editorial text-5xl md:text-6xl lg:text-7xl text-[var(--ei-ivory)] leading-tight mb-10">
              Enter the Atmospheric Intelligence Center.
            </h2>
            <button onClick={() => navigate('/dashboard')} className="px-10 py-4 rounded-sm bg-[var(--ei-accent-primary)] text-[#0B0907] text-lg font-medium tracking-wide hover:bg-[var(--ei-ivory)] hover:-translate-y-1 hover:shadow-[0_10px_40px_rgba(184,134,47,0.4)] transition-all duration-300">
              Launch Dashboard
            </button>
          </div>
        </section>

      </div>
    </div>
  );
};

export default EarthInterface;
