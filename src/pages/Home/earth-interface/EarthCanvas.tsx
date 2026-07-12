import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Stars } from '@react-three/drei';
import * as THREE from 'three';

interface EarthCanvasProps {
  earthGroupRef: React.RefObject<THREE.Group | null>;
}

const EarthModel: React.FC<EarthCanvasProps> = ({ earthGroupRef }) => {
  const earthRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const cloudRef = useRef<THREE.Mesh>(null);
  const ringsRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (earthRef.current) earthRef.current.rotation.y = t * 0.05;
    if (atmosphereRef.current) atmosphereRef.current.rotation.y = t * 0.05;
    if (cloudRef.current) {
      cloudRef.current.rotation.y = t * 0.07;
      cloudRef.current.rotation.z = t * 0.01;
    }
    if (ringsRef.current) {
      ringsRef.current.rotation.x = Math.sin(t * 0.1) * 0.1;
      ringsRef.current.rotation.y = t * 0.02;
    }
  });

  // Custom shader for atmospheric glow (Fresnel effect)
  const atmosphereShader = {
    vertexShader: `
      varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec3 vNormal;
      void main() {
        float intensity = pow(0.6 - dot(vNormal, vec3(0, 0, 1.0)), 2.5);
        gl_FragColor = vec4(0.72, 0.52, 0.18, 1.0) * intensity; // Burnished Gold tint
      }
    `
  };

  return (
    <group ref={earthGroupRef}>
      {/* 1. Core Solid Earth */}
      <Sphere ref={earthRef} args={[2, 64, 64]}>
        <meshStandardMaterial 
          color="#1D1914" 
          roughness={0.9} 
          metalness={0.1}
        />
      </Sphere>

      {/* 2. Abstract Geological/Cloud Texture (Wireframe or Pointillism) */}
      <Sphere ref={cloudRef} args={[2.02, 64, 64]}>
        <meshStandardMaterial 
          color="#A59C8C" 
          wireframe={true} 
          transparent={true} 
          opacity={0.05} 
        />
      </Sphere>

      {/* 3. Atmospheric Edge Glow */}
      <Sphere ref={atmosphereRef} args={[2.2, 64, 64]}>
        <shaderMaterial 
          vertexShader={atmosphereShader.vertexShader}
          fragmentShader={atmosphereShader.fragmentShader}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          transparent={true}
          opacity={0.6}
        />
      </Sphere>

      {/* 4. Satellite Orbit Rings */}
      <group ref={ringsRef}>
        {[1, 2, 3].map((ring, idx) => (
          <mesh key={idx} rotation-x={Math.PI / 2 + (idx * 0.2)} rotation-y={idx * 0.5}>
            <torusGeometry args={[2.4 + (idx * 0.3), 0.002, 16, 100]} />
            <meshBasicMaterial color="#B8862F" transparent opacity={0.15} />
          </mesh>
        ))}
      </group>
    </group>
  );
};

export default EarthModel;
