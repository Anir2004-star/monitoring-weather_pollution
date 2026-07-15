import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

const SECTIONS = [
  { label: 'Home', href: '/' },
  { label: 'Dashboard Overview', href: '/dashboard' },
  { label: 'Nationwide AQI', href: '/dashboard#overview' },
  { label: 'Regional Analysis', href: '/dashboard#regional' },
  { label: 'Satellite Map', href: '/dashboard#map' },
  { label: 'Pollution Transport', href: '/dashboard#pollution-transport' },
  { label: 'Forecast', href: '/dashboard#forecast' },
  { label: 'Alerts', href: '/dashboard#alerts' },
];

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
        background: scrolled ? 'rgba(11, 9, 7, 0.85)' : 'transparent',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        transition: 'all 0.4s ease',
      }}
    >
      <div className="flex items-center gap-12">
        {/* Hamburger Menu & Logo */}
        <div className="flex items-center gap-6" ref={menuRef}>
          <div className="relative">
            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 -ml-2 text-[#A59C8C] hover:text-[var(--ei-accent-primary)] transition-colors flex flex-col justify-center gap-[5px]"
              aria-label="Menu"
            >
              <span className={`block h-[2px] w-5 bg-current transition-transform duration-300 ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
              <span className={`block h-[2px] w-5 bg-current transition-opacity duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-[2px] w-5 bg-current transition-transform duration-300 ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full mt-4 left-0 w-[240px] bg-[var(--surface-01)] border border-[rgba(255,255,255,0.06)] rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.5)] overflow-hidden"
                >
                  <div className="flex flex-col py-2">
                    {SECTIONS.map((section, idx) => {
                      const isHash = section.href.includes('#');
                      return (
                        <Link
                          key={idx}
                          to={section.href}
                          onClick={(e) => {
                            setMenuOpen(false);
                            if (isHash && location.pathname === '/dashboard') {
                              e.preventDefault();
                              const id = section.href.split('#')[1];
                              document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
                            }
                          }}
                          className="px-5 py-3 text-[13px] font-medium tracking-wide text-[#A59C8C] hover:text-[var(--ei-ivory)] hover:bg-[rgba(255,255,255,0.03)] transition-all"
                        >
                          {section.label}
                        </Link>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link to="/" className="flex items-center gap-3 group">
            <span className="text-[14px] font-semibold tracking-[0.15em] text-[var(--ei-ivory)]">
              ATMOS
            </span>
          </Link>
        </div>
      </div>

      {/* Nav links removed as requested */}

      {/* Actions */}
      <div className="flex items-center gap-4">
        {location.pathname !== '/dashboard' && (
          <Link 
            to="/dashboard"
            className="hidden sm:flex items-center gap-2 px-5 py-2 rounded-full bg-[var(--ei-accent-primary)] text-[var(--ei-bg)] text-[13px] font-medium tracking-wide hover:bg-[var(--ei-ivory)] hover:shadow-[0_0_20px_rgba(184,134,47,0.4)] transition-all border border-transparent"
          >
            Launch Dashboard
          </Link>
        )}
      </div>
    </motion.header>
  );
};

export default Navbar;
