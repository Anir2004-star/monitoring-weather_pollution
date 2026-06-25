import React from 'react';
import { motion } from 'framer-motion';
import { Database, Satellite, Cpu, Wind, BarChart3, Radio } from 'lucide-react';

const PIPELINE = [
  {
    icon: <Satellite size={24} className="text-[#00E5FF]" />,
    title: 'INSAT Satellites',
    desc: '3D, 3DR & 3DS collect raw optical data.',
  },
  {
    icon: <Radio size={24} className="text-[#34D399]" />,
    title: 'AOD Extraction',
    desc: 'Aerosol Optical Depth is calculated from imagery.',
  },
  {
    icon: <Wind size={24} className="text-[#FACC15]" />,
    title: 'MERRA-2 Weather',
    desc: 'Meteorological variables are integrated.',
  },
  {
    icon: <Database size={24} className="text-[#FFB703]" />,
    title: 'CPCB Ground Data',
    desc: 'Real-time ground station data calibration.',
  },
  {
    icon: <Cpu size={24} className="text-[#FF006E]" />,
    title: 'Random Forest AI',
    desc: 'Machine learning model processes the inputs.',
  },
  {
    icon: <BarChart3 size={24} className="text-[#00F5A0]" />,
    title: 'PM2.5 Prediction',
    desc: 'High-accuracy surface PM concentration output.',
  },
];

const MissionSection: React.FC = () => {
  return (
    <section id="architecture" className="relative py-32 px-6 bg-[#020617] overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00E5FF] opacity-[0.03] blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-[1280px] mx-auto relative z-10">
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[rgba(0,229,255,0.2)] bg-[rgba(0,229,255,0.05)] mb-6"
          >
            <Cpu size={14} className="text-[#00E5FF]" />
            <span className="text-[#00E5FF] text-xs font-mono uppercase tracking-widest font-bold">
              Core Architecture
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
            style={{ fontFamily: '"Inter", sans-serif' }}
          >
            The Intelligence Pipeline
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-[#8B9CC8] leading-relaxed"
          >
            We process millions of data points from space, the atmosphere, and the ground through advanced Random Forest machine learning models to generate surface-level PM concentration estimates.
          </motion.p>
        </div>

        {/* Pipeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
          {/* Connection Lines (Desktop only) */}
          <div className="hidden lg:block absolute top-[120px] left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-[rgba(0,229,255,0.1)] via-[rgba(0,229,255,0.3)] to-[rgba(0,229,255,0.1)] z-0" />
          <div className="hidden lg:block absolute top-[360px] left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-[rgba(0,229,255,0.1)] via-[rgba(0,229,255,0.3)] to-[rgba(0,229,255,0.1)] z-0" />

          {PIPELINE.map((step, idx) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              className="relative z-10 p-8 rounded-2xl bg-[rgba(6,11,23,0.72)] border border-[rgba(255,255,255,0.06)] backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.3)] hover:border-[rgba(0,229,255,0.3)] hover:shadow-[0_0_30px_rgba(0,229,255,0.15)] transition-all group cursor-default"
            >
              <div className="w-14 h-14 rounded-full bg-[rgba(0,229,255,0.05)] border border-[rgba(0,229,255,0.1)] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold text-[#E8F0FF] mb-3">{step.title}</h3>
              <p className="text-[#8B9CC8] text-sm leading-relaxed">{step.desc}</p>
              <div className="absolute top-4 right-6 text-5xl font-black text-[rgba(255,255,255,0.02)] group-hover:text-[rgba(255,255,255,0.05)] transition-colors pointer-events-none">
                0{idx + 1}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MissionSection;
