import React from 'react';

const Footer: React.FC = () => (
  <footer className="relative bg-[#020510] border-t border-[rgba(255,255,255,0.06)] py-12">
    {/* Top gradient border */}
    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-primary opacity-20" />

    <div className="max-w-7xl mx-auto px-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Brand */}
        <div className="flex items-center gap-2">
          <span className="text-lg text-[#E8F0FF]">◈</span>
          <span className="text-[13px] font-medium tracking-[0.08em] text-[#E8F0FF]">ATMOS</span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6 text-[15px] font-medium text-[#8B9CC8]">
          <a href="#" className="hover:text-[#E8F0FF] transition-colors">Platform</a>
          <a href="#" className="hover:text-[#E8F0FF] transition-colors">Research</a>
          <a href="#" className="hover:text-[#E8F0FF] transition-colors">API</a>
          <a href="#" className="hover:text-[#E8F0FF] transition-colors">Privacy</a>
        </div>

        {/* Copyright & Statement */}
        <div className="flex flex-col items-center md:items-end gap-1">
          <span className="text-[13px] text-[#3D4F70]">© 2026</span>
          <span className="text-[15px] text-[#8B9CC8]">Built for Earth.</span>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
