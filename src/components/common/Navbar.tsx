import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

const LINKS = [
  { label: 'Home',          href: '/' },
  { label: 'Platform',      href: '/#platform' },
  { label: 'Architecture',  href: '/#architecture' },
];

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

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
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 h-16"
      style={{
        background: scrolled ? 'rgba(4, 8, 22, 0.85)' : 'transparent',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        transition: 'all 0.4s ease',
      }}
    >
      {/* Logo */}
      <Link to="/" className="flex items-center gap-3 group">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00E5FF] to-[#0A2A5C] flex items-center justify-center border border-[rgba(255,255,255,0.1)] shadow-[0_0_15px_rgba(0,229,255,0.3)] group-hover:shadow-[0_0_25px_rgba(0,229,255,0.5)] transition-all">
          <span className="text-white text-xs font-bold tracking-wider">ISRO</span>
        </div>
        <span className="text-[14px] font-semibold tracking-[0.15em] text-[#E8F0FF]">
          ATMOS
        </span>
      </Link>

      {/* Nav links */}
      <nav className="hidden md:flex items-center gap-8 bg-[rgba(255,255,255,0.03)] px-6 py-2 rounded-full border border-[rgba(255,255,255,0.05)] backdrop-blur-md">
        {LINKS.map(({ label, href }) => {
          const isHash = href.includes('#');
          const toPath = isHash ? href : href;
          return (
            <Link
              key={label}
              to={toPath}
              className="text-[13px] font-medium tracking-wide transition-colors duration-200 text-[#8B9CC8] hover:text-[#00E5FF]"
            >
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Actions */}
      <div className="flex items-center gap-4">
        {location.pathname !== '/dashboard' && (
          <Link 
            to="/dashboard"
            className="hidden sm:flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-[#00E5FF] to-[#0A2A5C] text-white text-[13px] font-medium tracking-wide hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all border border-[rgba(0,229,255,0.3)]"
          >
            Launch Dashboard
          </Link>
        )}
        {location.pathname === '/dashboard' && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[rgba(0,230,118,0.1)] border border-[rgba(0,230,118,0.2)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-[#00E676]" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00E676]" />
            </span>
            <span className="text-[11px] font-bold tracking-[0.12em] text-[#00E676]">LIVE</span>
          </div>
        )}
      </div>
    </motion.header>
  );
};

export default Navbar;
