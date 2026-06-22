import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const LINKS = [
  { label: 'Overview',  href: '#overview'  },
  { label: 'Regional',  href: '#regional'  },
  { label: 'Map',       href: '#map'       },
  { label: 'Forecast',  href: '#forecast'  },
  { label: 'Alerts',    href: '#hotspots' },
];

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 h-14"
      style={{
        background: scrolled ? 'rgba(4, 8, 22, 0.85)' : 'transparent',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        transition: 'all 0.4s ease',
      }}
    >
      {/* Logo */}
      <a href="#" className="flex items-center gap-2 group">
        <span className="text-lg text-[#E8F0FF]">◈</span>
        <span className="text-[13px] font-medium tracking-[0.08em] text-[#E8F0FF]">
          ATMOS
        </span>
      </a>

      {/* Nav links */}
      <nav className="hidden md:flex items-center gap-8">
        {LINKS.map(({ label, href }) => (
          <a
            key={label}
            href={href}
            className="text-[15px] font-medium transition-colors duration-200 text-[#8B9CC8] hover:text-[#E8F0FF]"
          >
            {label}
          </a>
        ))}
      </nav>

      {/* Live indicator */}
      <div className="flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-[#00E676]" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00E676]" />
        </span>
        <span className="text-[11px] font-medium tracking-[0.12em] text-[#8B9CC8]">LIVE</span>
      </div>
    </motion.header>
  );
};

export default Navbar;
