import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMap } from 'react-map-gl/maplibre';

// We map sources via coordinates now instead of 0-1 percentages
const SOURCES = [
  { id: 's1', name: 'Punjab Agricultural Burning', type: 'Biomass Burning', level: 'High', color: '#FF1744', lng: 75.85, lat: 30.90 }, 
  { id: 's2', name: 'Eastern Industrial Belt', type: 'Industrial Emissions', level: 'High', color: '#FF1744', lng: 86.20, lat: 22.80 },
  { id: 's3', name: 'Thermal Power Corridor', type: 'Coal Emissions', level: 'Moderate', color: '#FFB74D', lng: 82.97, lat: 25.31 },
  { id: 's4', name: 'Dense Traffic Corridor', type: 'Vehicular Emissions', level: 'Low', color: '#FFEB3B', lng: 77.20, lat: 28.61 },
];

const ROUTES = [
  // Punjab to Delhi NCR
  { start: SOURCES[0], end: { lng: 77.20, lat: 28.61 }, cp1: { lng: 76.00, lat: 29.50 }, cp2: { lng: 76.50, lat: 29.00 } },
  // Eastern Industrial to Central
  { start: SOURCES[1], end: { lng: 80.94, lat: 26.84 }, cp1: { lng: 83.00, lat: 24.50 }, cp2: { lng: 82.00, lat: 25.50 } },
];

// Wind Cells (grid approximation across India bounding box)
const WIND_CELLS: { lng: number; lat: number; speed: number; angle: number }[] = [];
const cols = 20;
const rows = 20;
const minLng = 68;
const maxLng = 97;
const minLat = 8;
const maxLat = 37;

for (let i = 0; i <= cols; i++) {
  for (let j = 0; j <= rows; j++) {
    const lng = minLng + (i / cols) * (maxLng - minLng);
    const lat = minLat + (j / rows) * (maxLat - minLat);
    
    // General flow NW to SE
    let angle = Math.PI * 0.25 + (Math.random() * 0.5 - 0.25);
    let speed = 10 + Math.random() * 25;
    
    // Speed up near Punjab
    if (Math.abs(lng - 75.85) < 3 && Math.abs(lat - 30.90) < 3) speed += 10;
    
    WIND_CELLS.push({ lng, lat, speed, angle });
  }
}

const WindFlowLayer: React.FC = () => {
  const { current: map } = useMap();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredSource, setHoveredSource] = useState<typeof SOURCES[0] | null>(null);

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

    const routeParticles = ROUTES.map(() => {
      return Array.from({ length: 10 }, () => ({
        progress: Math.random(),
        speed: 0.002 + Math.random() * 0.003
      }));
    });

    let animationFrameId: number;
    let time = 0;

    const draw = () => {
      time += 1;
      ctx.clearRect(0, 0, width, height);

      if (!map) return;

      // 1. Draw Wind Vectors (Cells)
      ctx.globalCompositeOperation = 'source-over';
      ctx.font = '12px ui-monospace, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      WIND_CELLS.forEach(cell => {
        const p = map.project([cell.lng, cell.lat]);
        // Only draw if on screen
        if (p.x < 0 || p.x > width || p.y < 0 || p.y > height) return;

        // Dynamic wiggle
        const wiggle = Math.sin(time * 0.05 + p.x) * 0.2;
        const finalAngle = cell.angle + wiggle;
        
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(finalAngle);
        
        let color = '#3D4F70'; // < 10
        if (cell.speed > 10) color = '#8B9CC8';
        if (cell.speed > 20) color = '#4DEEEA';
        if (cell.speed > 30) color = '#00FFFF';

        ctx.fillStyle = color;
        ctx.fillText('→', 0, 0);
        ctx.restore();
      });

      // 2. Draw Transport Routes (Glowing Lines & Particles)
      ROUTES.forEach((route, i) => {
        const startP = map.project([route.start.lng, route.start.lat]);
        const endP = map.project([route.end.lng, route.end.lat]);
        const cp1P = map.project([route.cp1.lng, route.cp1.lat]);
        const cp2P = map.project([route.cp2.lng, route.cp2.lat]);

        // Draw Base Path
        ctx.beginPath();
        ctx.moveTo(startP.x, startP.y);
        ctx.bezierCurveTo(cp1P.x, cp1P.y, cp2P.x, cp2P.y, endP.x, endP.y);
        ctx.strokeStyle = 'rgba(77, 238, 234, 0.1)';
        ctx.lineWidth = 4;
        ctx.stroke();

        ctx.strokeStyle = 'rgba(77, 238, 234, 0.3)';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        ctx.lineDashOffset = -time * 0.5;
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw Particles along path
        ctx.fillStyle = '#4DEEEA';
        ctx.shadowColor = '#4DEEEA';
        ctx.shadowBlur = 8;
        
        routeParticles[i].forEach(p => {
          p.progress += p.speed;
          if (p.progress > 1) p.progress = 0;

          // Cubic Bezier calculation
          const t = p.progress;
          const u = 1 - t;
          const px = u*u*u*startP.x + 3*u*u*t*cp1P.x + 3*u*t*t*cp2P.x + t*t*t*endP.x;
          const py = u*u*u*startP.y + 3*u*u*t*cp1P.y + 3*u*t*t*cp2P.y + t*t*t*endP.y;

          ctx.beginPath();
          ctx.arc(px, py, 2.5, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.shadowBlur = 0; // reset
      });

      // 3. Draw Source Nodes
      SOURCES.forEach(source => {
        const p = map.project([source.lng, source.lat]);
        if (p.x < 0 || p.x > width || p.y < 0 || p.y > height) return;

        const isHovered = hoveredSource?.id === source.id;
        const pulse = isHovered ? 1.5 : 1 + Math.sin(time * 0.1) * 0.2;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 6 * pulse, 0, Math.PI * 2);
        ctx.fillStyle = source.color;
        ctx.shadowColor = source.color;
        ctx.shadowBlur = 15;
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 12 * pulse, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${source.color === '#FF1744' ? '255,23,68' : source.color === '#FFB74D' ? '255,183,77' : '255,235,59'}, 0.4)`;
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    // Setup map event listeners since canvas is pointer-events-none, 
    // we need to listen to mapbox events for hover.
    // Actually, we can attach mousemove to canvas if it had pointer-events, 
    // but then it blocks mapbox pan/zoom. So we listen to map!
    const onMapMove = (e: any) => {
      let found: typeof SOURCES[0] | null = null;
      for (const source of SOURCES) {
        const p = map.project([source.lng, source.lat]);
        const dist = Math.hypot(e.point.x - p.x, e.point.y - p.y);
        if (dist < 20) {
          found = source;
          break;
        }
      }
      setHoveredSource(found);
    };

    map.on('mousemove', onMapMove);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      map.off('mousemove', onMapMove);
    };
  }, [map, hoveredSource]);

  // Compute position for hovered source tooltip
  let tooltipPos = { x: 0, y: 0 };
  if (hoveredSource && map) {
    tooltipPos = map.project([hoveredSource.lng, hoveredSource.lat]);
  }

  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full block" />
      
      {/* ── Hover Popup for Source Nodes ── */}
      <AnimatePresence>
        {hoveredSource && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute z-20 pointer-events-none"
            style={{
              left: tooltipPos.x,
              top: tooltipPos.y - 20,
              transform: 'translate(-50%, -100%)'
            }}
          >
            <div className="bg-[rgba(4,8,22,0.95)] backdrop-blur-xl border border-[#FF1744] rounded-xl p-4 shadow-[0_0_30px_rgba(255,23,68,0.2)] min-w-[220px]">
              <div className="flex items-center gap-2 mb-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: hoveredSource.color }} />
                  <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: hoveredSource.color }} />
                </span>
                <span className="text-[10px] tracking-wider uppercase text-[#8B9CC8]">Emission Source</span>
              </div>
              <div className="text-[14px] font-bold text-[#E8F0FF] mb-3 pb-2 border-b border-[rgba(255,255,255,0.06)]">
                {hoveredSource.name}
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-[#8B9CC8]">Type</span>
                  <span className="text-[#E8F0FF] font-medium">{hoveredSource.type}</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-[#8B9CC8]">Contribution</span>
                  <span style={{ color: hoveredSource.color, fontWeight: 'bold' }}>{hoveredSource.level}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WindFlowLayer;
