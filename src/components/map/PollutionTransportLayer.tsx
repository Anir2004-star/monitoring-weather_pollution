import React, { useEffect, useRef } from 'react';
import { useMap } from 'react-map-gl/maplibre';
import type { TransportSource, TransportDestination, TransportRoute, SeasonMode } from '../../utils/transportData';

interface PollutionTransportLayerProps {
  sources: TransportSource[];
  destinations: TransportDestination[];
  routes: TransportRoute[];
  seasonMode: SeasonMode;
  hoveredSourceId: string | null;
}

const severityColors = {
  Low: '#00FFFF',      // Cyan
  Moderate: '#FFFF00', // Yellow
  High: '#FFA500',     // Orange
  Critical: '#FF0000', // Red
};

export const PollutionTransportLayer: React.FC<PollutionTransportLayerProps> = ({
  sources,
  destinations,
  routes,
  seasonMode,
  hoveredSourceId,
}) => {
  const { current: map } = useMap();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !map) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;

    const handleResize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width;
      canvas.height = height;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const activeRoutes = routes.filter(r => r.activeSeasons.includes(seasonMode));

    // Initialize 300 recycled particles
    const maxParticles = 300;
    const particles = Array.from({ length: maxParticles }, () => ({
      progress: Math.random(),
      speed: 0.0015 + Math.random() * 0.002,
      routeIndex: Math.floor(Math.random() * activeRoutes.length),
      noiseOffset: Math.random() * 1000,
    }));

    let animationFrameId: number;
    let time = 0;

    const draw = () => {
      time += 1;
      // Semi-transparent clear for motion blur trail effect
      ctx.fillStyle = 'rgba(2, 5, 16, 0.3)';
      ctx.fillRect(0, 0, width, height);

      if (!map) return;
      if (activeRoutes.length === 0) {
        animationFrameId = requestAnimationFrame(draw);
        return;
      }

      ctx.globalCompositeOperation = 'screen';

      // Draw Routes and Particles
      particles.forEach((p) => {
        const route = activeRoutes[p.routeIndex % activeRoutes.length];
        if (!route) return;
        
        const source = sources.find(s => s.id === route.sourceId);
        const dest = destinations.find(d => d.id === route.destinationId);
        if (!source || !dest) return;

        const startP = map.project([source.lng, source.lat]);
        const endP = map.project([dest.lng, dest.lat]);
        
        // Build bezier control points. Use provided or defaults.
        let cp1P: { x: number; y: number } = startP;
        let cp2P: { x: number; y: number } = endP;

        if (route.controlPoints && route.controlPoints.length > 0) {
          cp1P = map.project([route.controlPoints[0].lng, route.controlPoints[0].lat]);
          if (route.controlPoints.length > 1) {
            cp2P = map.project([route.controlPoints[1].lng, route.controlPoints[1].lat]);
          } else {
            cp2P = cp1P;
          }
        } else {
          const midX = (startP.x + endP.x) / 2;
          cp1P = { x: midX + 50, y: startP.y };
          cp2P = { x: midX - 50, y: endP.y };
        }

        p.progress += p.speed;
        if (p.progress >= 1) {
          p.progress = 0;
          // When particle restarts, pick a new route randomly
          p.routeIndex = Math.floor(Math.random() * activeRoutes.length);
        }

        // Cubic Bezier calculation
        const t = p.progress;
        const u = 1 - t;
        let px = u*u*u*startP.x + 3*u*u*t*cp1P.x + 3*u*t*t*cp2P.x + t*t*t*endP.x;
        let py = u*u*u*startP.y + 3*u*u*t*cp1P.y + 3*u*t*t*cp2P.y + t*t*t*endP.y;

        // Add organic atmospheric lateral noise
        const perpX = -(endP.y - startP.y);
        const perpY = (endP.x - startP.x);
        const len = Math.hypot(perpX, perpY) || 1;
        const nx = perpX / len;
        const ny = perpY / len;
        
        // Sine wave noise combining time, particle's offset, and progress
        const noiseAmplitude = Math.sin(t * Math.PI) * 15; // Max spread in middle of path
        const noise = Math.sin(time * 0.05 + p.noiseOffset) * noiseAmplitude;
        
        px += nx * noise;
        py += ny * noise;

        // Draw particle
        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = severityColors[route.severity] || '#4DEEEA';
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Draw Source Regions
      sources.forEach(source => {
        const isActive = activeRoutes.some(r => r.sourceId === source.id);
        if (!isActive) return;

        const p = map.project([source.lng, source.lat]);
        if (p.x < 0 || p.x > width || p.y < 0 || p.y > height) return;

        const isHovered = hoveredSourceId === source.id;
        const pulse = isHovered ? 1.5 : 1 + Math.sin(time * 0.1) * 0.2;
        const baseRadius = (source.contribution / 100) * 12 + 4;

        ctx.beginPath();
        ctx.arc(p.x, p.y, baseRadius * pulse, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 60, 60, 0.8)';
        ctx.shadowColor = 'red';
        ctx.shadowBlur = 20;
        ctx.fill();
        
        // Outer glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, baseRadius * 2 * pulse, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 60, 60, 0.2)';
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      // Draw Destinations with soft impact ripple
      destinations.forEach(dest => {
        const isReceiving = activeRoutes.some(r => r.destinationId === dest.id);
        if (!isReceiving) return;

        const p = map.project([dest.lng, dest.lat]);
        if (p.x < 0 || p.x > width || p.y < 0 || p.y > height) return;

        // Ripple expanding effect
        const ripplePhase = (time % 100) / 100; // 0 to 1
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 255, 255, 0.6)';
        ctx.shadowColor = 'cyan';
        ctx.shadowBlur = 15;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, 8 + ripplePhase * 20, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 255, 255, ${1 - ripplePhase})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

      ctx.globalCompositeOperation = 'source-over';
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [map, sources, destinations, routes, seasonMode, hoveredSourceId]);

  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden mix-blend-screen">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};

export default PollutionTransportLayer;
