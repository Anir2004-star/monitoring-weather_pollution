import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, useTexture, Html } from '@react-three/drei';
import * as THREE from 'three';

interface EarthCanvasProps {
  earthGroupRef: React.RefObject<THREE.Group | null>;
}

// Custom shader for atmospheric glow and scan wave
const atmosphereShader = {
  uniforms: {
    uTime: { value: 0 },
    uColor: { value: new THREE.Color('#B8862F') } // Burnished Gold
  },
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vPosition;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform vec3 uColor;
    varying vec3 vNormal;
    varying vec3 vPosition;
    
    void main() {
      // Basic Fresnel glow (use max(0.0, ...) to prevent negative power values crashing WebGL)
      float intensity = pow(max(0.0, 0.6 - dot(vNormal, vec3(0, 0, 1.0))), 2.5);
      vec3 glow = uColor * intensity;
      
      // Atmospheric Scan Wave (runs every 15 seconds)
      float cycle = mod(uTime, 15.0);
      float wave = 0.0;
      
      if (cycle < 4.0) { // Scan takes 4 seconds
        // Map Y position to 0-1 range roughly, and animate a wave down it
        float scanPos = 2.5 - (cycle * 1.5); 
        float distanceToScan = abs(vPosition.y - scanPos);
        wave = smoothstep(0.4, 0.0, distanceToScan) * 0.8;
      }
      
      gl_FragColor = vec4(glow + (uColor * wave), intensity + wave);
    }
  `
};

const EarthModel: React.FC<EarthCanvasProps> = ({ earthGroupRef }) => {
  const earthRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const cloudRef = useRef<THREE.Mesh>(null);
  const ringsRef = useRef<THREE.Group>(null);
  const satelliteGroupRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.DirectionalLight>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const shaderMaterialRef = useRef<THREE.ShaderMaterial>(null);
  
  // Satellite pulse refs
  const pulse1Ref = useRef<THREE.Line>(null);
  const pulse2Ref = useRef<THREE.Line>(null);
  const pulse3Ref = useRef<THREE.Line>(null);

  // Load high-res NASA textures
  const [colorMap, normalMap, specularMap, cloudsMap] = useTexture([
    'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg',
    'https://unpkg.com/three-globe/example/img/earth-topology.png',
    'https://unpkg.com/three-globe/example/img/earth-water.png',
    'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png'
  ]);

  // Generate atmospheric dust/aerosol particles
  const particleCount = 2000;
  const particlesGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const radius = 2.5 + Math.random() * 2.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame(({ clock, pointer, camera }) => {
    const t = clock.getElapsedTime();
    
    // 1. Camera Parallax (Subtle mouse movement)
    // Target position based on mouse pointer (-1 to 1)
    const targetX = pointer.x * 0.4;
    const targetY = pointer.y * 0.4;
    camera.position.x += (targetX - camera.position.x) * 0.02;
    camera.position.y += (targetY - camera.position.y) * 0.02;
    // We let ScrollTrigger control the z-position and rotation via earthGroupRef, but camera always looks at center
    camera.lookAt(0, 0, 0);

    // 2. Earth and Clouds rotation
    if (earthRef.current) earthRef.current.rotation.y = t * 0.015;
    if (atmosphereRef.current) atmosphereRef.current.rotation.y = t * 0.015;
    if (cloudRef.current) {
      cloudRef.current.rotation.y = t * 0.018; 
      cloudRef.current.rotation.z = t * 0.002;
    }
    
    // 3. Rings & Particles
    if (ringsRef.current) {
      ringsRef.current.rotation.x = Math.sin(t * 0.05) * 0.1;
      ringsRef.current.rotation.y = t * 0.01;
    }
    if (particlesRef.current) {
      particlesRef.current.rotation.y = t * 0.01;
      particlesRef.current.rotation.x = t * 0.005;
    }

    // 4. Light orbiting slowly (simulating morning to night)
    if (lightRef.current) {
      lightRef.current.position.x = Math.cos(t * 0.05) * 6;
      lightRef.current.position.z = Math.sin(t * 0.05) * 6;
    }

    // 5. Update Shader Uniform (Atmospheric Scan)
    if (shaderMaterialRef.current) {
      shaderMaterialRef.current.uniforms.uTime.value = t;
    }

    // 6. Satellite Signals (Pulses)
    // Every few seconds, signal pulses opacity changes
    const pulseCycle1 = (t + 0) % 6;
    if (pulse1Ref.current) {
      (pulse1Ref.current.material as THREE.LineBasicMaterial).opacity = pulseCycle1 < 0.5 ? (1.0 - (pulseCycle1 * 2)) : 0;
    }
    
    const pulseCycle2 = (t + 2) % 7;
    if (pulse2Ref.current) {
      (pulse2Ref.current.material as THREE.LineBasicMaterial).opacity = pulseCycle2 < 0.5 ? (1.0 - (pulseCycle2 * 2)) : 0;
    }

    const pulseCycle3 = (t + 4) % 8;
    if (pulse3Ref.current) {
      (pulse3Ref.current.material as THREE.LineBasicMaterial).opacity = pulseCycle3 < 0.5 ? (1.0 - (pulseCycle3 * 2)) : 0;
    }
  });

  return (
    <group ref={earthGroupRef}>
      {/* Sunlight */}
      <ambientLight intensity={0.05} />
      <directionalLight 
        ref={lightRef}
        color="#F5F1E7" 
        intensity={2.8} 
        position={[6, 3, 6]} 
        castShadow 
      />

      {/* 1. Core Solid Earth */}
      <Sphere ref={earthRef} args={[2, 64, 64]} castShadow receiveShadow>
        <meshStandardMaterial 
          map={colorMap}
          normalMap={normalMap}
          roughnessMap={specularMap}
          roughness={0.7}
          metalness={0.1}
        />
      </Sphere>

      {/* 2. Cloud Layer */}
      <Sphere ref={cloudRef} args={[2.02, 64, 64]} castShadow>
        <meshStandardMaterial 
          map={cloudsMap}
          transparent={true} 
          opacity={0.4} 
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Sphere>

      {/* 3. Atmospheric Edge Glow + Scan Shader */}
      <Sphere ref={atmosphereRef} args={[2.2, 64, 64]}>
        <shaderMaterial 
          ref={shaderMaterialRef}
          uniforms={atmosphereShader.uniforms}
          vertexShader={atmosphereShader.vertexShader}
          fragmentShader={atmosphereShader.fragmentShader}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          transparent={true}
          depthWrite={false}
        />
      </Sphere>

      {/* 4. Atmospheric Particles (Dust/Aerosols) */}
      <points ref={particlesRef} geometry={particlesGeometry}>
        <pointsMaterial size={0.015} color="#B8862F" transparent opacity={0.3} sizeAttenuation={true} />
      </points>

      {/* 5. Satellite Orbit Rings */}
      <group ref={ringsRef}>
        {[1, 2, 3].map((_, idx) => (
          <mesh key={`ring-${idx}`} rotation-x={Math.PI / 2 + (idx * 0.15)} rotation-y={idx * 0.8}>
            <torusGeometry args={[2.5 + (idx * 0.35), 0.001, 32, 128]} />
            <meshBasicMaterial color="#B8862F" transparent opacity={0.2} />
          </mesh>
        ))}
      </group>

      {/* 6. Satellites and Scientific Capsules */}
      <group ref={satelliteGroupRef}>
        
        {/* Satellite 1: INSAT-3DR */}
        <group position={[2.85, 0, 0]} rotation={[0, 0, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.06, 0.06, 0.06]} />
            <meshStandardMaterial color="#A59C8C" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0.1, 0, 0]} castShadow>
            <boxGeometry args={[0.12, 0.02, 0.08]} />
            <meshStandardMaterial color="#0B0907" metalness={1} roughness={0.1} />
          </mesh>
          <mesh position={[-0.1, 0, 0]} castShadow>
            <boxGeometry args={[0.12, 0.02, 0.08]} />
            <meshStandardMaterial color="#0B0907" metalness={1} roughness={0.1} />
          </mesh>
          
          {/* Signal Pulse */}
          <line ref={pulse1Ref as any}>
            <bufferGeometry attach="geometry">
              <float32BufferAttribute attach="attributes-position" args={[new Float32Array([0,0,0, -2.85,0,0]), 3]} />
            </bufferGeometry>
            <lineBasicMaterial attach="material" color="#B8862F" transparent opacity={0} />
          </line>
          
          <Html center distanceFactor={15} position={[0.2, 0.3, 0]} className="pointer-events-auto">
            <div className="group flex flex-col items-start justify-center p-3 rounded-md bg-[#15120F] border border-[rgba(255,255,255,0.06)] shadow-2xl min-w-max transition-transform duration-500 hover:-translate-y-2 hover:rotate-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--ei-success)] animate-pulse shadow-[0_0_8px_var(--ei-success)]" />
                <span className="text-[9px] text-[var(--ei-ash)] font-telemetry uppercase tracking-widest">INSAT-3DR</span>
              </div>
              <span className="text-[12px] text-[var(--ei-ivory)] font-body font-medium">Satellite Active</span>
            </div>
          </Html>
        </group>

        {/* Satellite 2: Ground Stations */}
        <group position={[-2.2, 1.8, 1]} rotation={[Math.PI/4, 0, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.04, 0.04, 0.12]} />
            <meshStandardMaterial color="#8C5A2B" metalness={0.8} roughness={0.3} />
          </mesh>

          {/* Signal Pulse */}
          <line ref={pulse2Ref as any}>
            <bufferGeometry attach="geometry">
              <float32BufferAttribute attach="attributes-position" args={[new Float32Array([0,0,0, 2.2,-1.8,-1]), 3]} />
            </bufferGeometry>
            <lineBasicMaterial attach="material" color="#B8862F" transparent opacity={0} />
          </line>
          
          <Html center distanceFactor={15} position={[-0.2, -0.3, 0]} className="pointer-events-auto">
            <div className="group flex flex-col items-end justify-center p-3 rounded-md bg-[#15120F] border border-[rgba(255,255,255,0.06)] shadow-2xl min-w-max transition-transform duration-500 hover:translate-y-2 hover:-rotate-1">
              <span className="text-[15px] text-[var(--ei-accent-primary)] font-editorial mb-0.5">847</span>
              <span className="text-[9px] text-[var(--ei-ash)] font-telemetry uppercase tracking-widest">Ground Stations</span>
            </div>
          </Html>
        </group>

        {/* Satellite 3: Prediction Confidence */}
        <group position={[1, -2.4, -1.5]} rotation={[0.5, 0, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshStandardMaterial color="#B75A3A" metalness={0.6} roughness={0.4} />
          </mesh>

          {/* Signal Pulse */}
          <line ref={pulse3Ref as any}>
            <bufferGeometry attach="geometry">
              <float32BufferAttribute attach="attributes-position" args={[new Float32Array([0,0,0, -1,2.4,1.5]), 3]} />
            </bufferGeometry>
            <lineBasicMaterial attach="material" color="#B8862F" transparent opacity={0} />
          </line>
          
          <Html center distanceFactor={15} position={[0.3, -0.1, 0]} className="pointer-events-auto">
            <div className="group flex flex-col items-start justify-center p-3 rounded-md bg-[#15120F] border border-[rgba(255,255,255,0.06)] shadow-2xl min-w-max transition-transform duration-500 hover:translate-x-2">
              <span className="text-[15px] text-[var(--ei-ivory)] font-body font-bold mb-0.5">94.2%</span>
              <span className="text-[9px] text-[var(--ei-ash)] font-telemetry uppercase tracking-widest">Prediction Confidence</span>
            </div>
          </Html>
        </group>

      </group>
    </group>
  );
};

export default EarthModel;
