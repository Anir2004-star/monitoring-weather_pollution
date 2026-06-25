import React from 'react';
import { motion } from 'framer-motion';
import { Globe2, Activity, Map, Zap } from 'lucide-react';

const FEATURES = [
  {
    title: 'Real-Time Telemetry',
    desc: 'Live monitoring of atmospheric dominance, ground stations, and satellite telemetry continuously streaming across India.',
    icon: <Activity className="w-8 h-8 text-[#00E5FF]" />,
    color: '#00E5FF',
    glow: 'rgba(0, 229, 255, 0.15)',
  },
  {
    title: 'Predictive 7-Day Forecasting',
    desc: 'Utilizing advanced AI models to predict PM2.5 and AQI fluctuations up to 7 days in advance with high confidence levels.',
    icon: <Zap className="w-8 h-8 text-[#FFB703]" />,
    color: '#FFB703',
    glow: 'rgba(255, 183, 3, 0.15)',
  },
  {
    title: 'Spatial Intelligence Maps',
    desc: 'High-resolution Mapbox GL visualizations with custom heatmap overlays showing precise pollution concentration.',
    icon: <Map className="w-8 h-8 text-[#34D399]" />,
    color: '#34D399',
    glow: 'rgba(52, 211, 153, 0.15)',
  },
  {
    title: 'Interactive 3D Globe',
    desc: 'Cinematic WebGL globe rendering real-time atmospheric shells, orbiting satellites, and active regional hotspots.',
    icon: <Globe2 className="w-8 h-8 text-[#8A7CFF]" />,
    color: '#8A7CFF',
    glow: 'rgba(138, 124, 255, 0.15)',
  },
];

const FeaturesSection: React.FC = () => {
  return (
    <section id="platform" className="relative py-32 px-6 bg-[#040816] overflow-hidden">
      <div className="max-w-[1280px] mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-2xl">
            <motion.h2
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight"
              style={{ fontFamily: '"Inter", sans-serif' }}
            >
              Unprecedented visibility into our <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#67E8F9]">atmosphere.</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-[#8B9CC8] leading-relaxed"
            >
              The platform brings together state-of-the-art satellite networks, ground IoT sensors, and machine learning models to build the most comprehensive picture of air quality ever created.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex-shrink-0"
          >
            <div className="text-[64px] font-black text-[#00E5FF] opacity-20" style={{ fontFamily: 'ui-monospace, monospace' }}>
              4.2M
            </div>
            <div className="text-sm text-[#8B9CC8] font-mono uppercase tracking-widest text-right">Data Points / Hr</div>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {FEATURES.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15, duration: 0.7 }}
              className="group relative rounded-3xl p-10 overflow-hidden bg-[rgba(6,11,23,0.72)] border border-[rgba(255,255,255,0.06)] backdrop-blur-xl"
            >
              {/* Dynamic Glow Background */}
              <div 
                className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full blur-[100px] transition-all duration-700 opacity-50 group-hover:opacity-100 group-hover:scale-150"
                style={{ background: feature.glow }}
              />

              <div className="relative z-10">
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8 border transition-transform duration-500 group-hover:-translate-y-2"
                  style={{ 
                    background: `linear-gradient(135deg, rgba(255,255,255,0.05), ${feature.glow})`,
                    borderColor: feature.color 
                  }}
                >
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-[#8B9CC8] text-base leading-relaxed pr-8">
                  {feature.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default FeaturesSection;
