import React from 'react';

const Footer: React.FC = () => (
  <footer className="relative bg-[var(--ei-bg)] border-t border-[var(--ei-border)] py-12">
    {/* Top gradient border */}
    <div className="absolute top-0 left-0 w-full h-[1px] bg-[var(--ei-accent-primary)] opacity-20" />

    <div className="max-w-7xl mx-auto px-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Brand */}
        <div className="flex items-center gap-2">
          <span className="text-lg text-[var(--ei-ivory)]">◈</span>
          <span className="text-[13px] font-medium tracking-[0.08em] text-[var(--ei-ivory)]">ATMOS</span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6 text-[15px] font-medium text-[var(--ei-ash)]">
          <a href="#" className="hover:text-[var(--ei-accent-primary)] transition-colors">Platform</a>
          <a href="#" className="hover:text-[var(--ei-accent-primary)] transition-colors">Research</a>
          <a href="#" className="hover:text-[var(--ei-accent-primary)] transition-colors">API</a>
          <a href="#" className="hover:text-[var(--ei-accent-primary)] transition-colors">Privacy</a>
        </div>

        {/* Copyright & Statement */}
        <div className="flex flex-col items-center md:items-end gap-1">
          <span className="text-[13px] text-[var(--ei-ash)] opacity-50">© 2026</span>
          <span className="text-[15px] text-[var(--ei-ash)]">Built for Earth.</span>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
