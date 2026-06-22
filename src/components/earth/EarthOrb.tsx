import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const EarthOrb: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    mountRef.current.innerHTML = ''; // Prevent duplicate canvases in React StrictMode

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 3;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    // Use a fixed size for the orb based on typical sizes, responsive handled via CSS scaling if needed
    const size = 320; 
    renderer.setSize(size, size);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // Sphere geometry
    const geometry = new THREE.SphereGeometry(1, 64, 64);

    // Shader material for the gradient atmospheric glow
    const vertexShader = `
      varying vec2 vUv;
      varying vec3 vNormal;
      void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform float time;
      varying vec2 vUv;
      varying vec3 vNormal;

      void main() {
        // Colors from our signature gradient: #8A7CFF, #4DEEEA, #7CFF6B
        vec3 color1 = vec3(0.54, 0.49, 1.0);   // Violet
        vec3 color2 = vec3(0.3, 0.93, 0.92);  // Teal
        vec3 color3 = vec3(0.49, 1.0, 0.42);   // Green

        // Create a moving gradient based on time and UV coordinates
        float mix1 = sin(vUv.x * 3.1415 + time) * 0.5 + 0.5;
        float mix2 = cos(vUv.y * 3.1415 - time * 0.8) * 0.5 + 0.5;

        vec3 baseColor = mix(color1, color2, mix1);
        baseColor = mix(baseColor, color3, mix2);

        // Add a fresnel glow effect (brighter at the edges)
        float intensity = pow(0.6 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
        
        // Combine base color with fresnel, keeping the center slightly dark
        vec3 finalColor = baseColor * intensity * 2.5;
        
        gl_FragColor = vec4(finalColor, intensity + 0.1);
      }
    `;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        time: { value: 0.0 }
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.FrontSide,
    });

    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Add an outer atmosphere glow
    const atmosphereGeometry = new THREE.SphereGeometry(1.15, 64, 64);
    const atmosphereMaterial = new THREE.ShaderMaterial({
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
          float intensity = pow(0.55 - dot(vNormal, vec3(0, 0, 1.0)), 3.0);
          gl_FragColor = vec4(0.3, 0.93, 0.92, intensity * 0.5); // Teal glow
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
    });
    
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    scene.add(atmosphere);

    // Animation loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      const elapsedTime = clock.getElapsedTime();
      
      // Rotate sphere
      sphere.rotation.y = elapsedTime * 0.1;
      sphere.rotation.x = elapsedTime * 0.05;
      
      // Update shader time uniform
      material.uniforms.time.value = elapsedTime * 0.5;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      atmosphereGeometry.dispose();
      atmosphereMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className="relative flex items-center justify-center w-[240px] md:w-[320px] h-[240px] md:h-[320px]"
      style={{
        // Add a subtle CSS drop shadow to anchor it
        filter: 'drop-shadow(0 0 40px rgba(77,238,234,0.15))'
      }}
    />
  );
};

export default EarthOrb;
