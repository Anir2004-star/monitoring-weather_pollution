import React from 'react';

interface GridBackgroundProps {
  variant?: 'dots' | 'lines';
  className?: string;
  fade?: boolean; // adds radial vignette fade at edges
}

const GridBackground: React.FC<GridBackgroundProps> = ({
  variant = 'dots',
  className = '',
  fade = true,
}) => {
  return (
    <div
      className={`absolute inset-0 pointer-events-none ${variant === 'dots' ? 'grid-dots' : 'grid-lines'} ${className}`}
      style={fade ? {
        maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)',
      } : undefined}
    />
  );
};

export default GridBackground;
