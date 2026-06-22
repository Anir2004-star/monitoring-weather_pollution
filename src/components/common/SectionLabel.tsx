import React from 'react';

interface SectionLabelProps {
  text: string;
  live?: boolean;
  className?: string;
}

const SectionLabel: React.FC<SectionLabelProps> = ({ text, live = false, className = '' }) => (
  <div className={`inline-flex items-center gap-2 ${className}`}>
    {live && (
      <span className="relative flex h-1.5 w-1.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-[#00E676]" />
        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#00E676]" />
      </span>
    )}
    <span className="text-[11px] font-medium tracking-[0.12em] uppercase text-[#8B9CC8]">
      {text}
    </span>
  </div>
);

export default SectionLabel;
