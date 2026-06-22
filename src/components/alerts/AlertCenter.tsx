import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionLabel } from '../../components/common';
import { staggerContainer, fadeUp, DEFAULT_VIEWPORT } from '../../motion/variants';
import AlertCommandDrawer from './AlertCommandDrawer';
import type { AlertDetail } from './AlertCommandDrawer';

// Mock Alert Data
const MOCK_ALERTS: AlertDetail[] = [
  {
    id: 'ALERT-023',
    region: 'Delhi NCR',
    aqi: 287,
    growth: '+14%',
    detectedAt: '14 min ago',
    type: 'Pollution Spike',
    severity: 'Critical',
    driver: 'Industrial Emissions from localized northern sectors mixing with stagnant morning air.',
    confidence: 94,
    forecastImpact: 'AQI expected to increase by 18% within the next 4 hours.',
    duration: '8 Hours',
    population: '4.3 Million',
    action: 'Increase monitoring frequency and alert local health authorities.'
  },
  {
    id: 'ALERT-024',
    region: 'Kanpur',
    aqi: 243,
    growth: '+9%',
    detectedAt: '28 min ago',
    type: 'Industrial Emission',
    severity: 'High',
    driver: 'Unregulated nighttime factory emissions detected via Sentinel-5P SO2 layer.',
    confidence: 88,
    forecastImpact: 'AQI expected to hold steady but SO2 levels are peaking.',
    duration: '12 Hours',
    population: '1.2 Million',
    action: 'Deploy ground inspection teams to Sector 4.'
  },
  {
    id: 'ALERT-025',
    region: 'Jaipur',
    aqi: 198,
    growth: '+6%',
    detectedAt: '41 min ago',
    type: 'Dust Storm',
    severity: 'Moderate',
    driver: 'Wind-blown dust carrying PM10 from western arid zones.',
    confidence: 75,
    forecastImpact: 'Visibility dropping to 2km. PM10 spiking.',
    duration: '24 Hours',
    population: '2.8 Million',
    action: 'Issue visibility warnings for regional highways.'
  },
  {
    id: 'ALERT-026',
    region: 'Mumbai',
    aqi: 85,
    growth: '-2%',
    detectedAt: '1 hr ago',
    type: 'Traffic Congestion',
    severity: 'Low',
    driver: 'Morning rush hour NO2 accumulation.',
    confidence: 90,
    forecastImpact: 'Will dissipate naturally with afternoon sea breeze.',
    duration: '3 Hours',
    population: '8.5 Million',
    action: 'Continue standard monitoring.'
  }
];

const severityColors = {
  Critical: '#ff3b30',
  High: '#ff7a45',
  Moderate: '#ffd84d',
  Low: '#00d084'
};

const AlertCenter: React.FC = () => {
  const [selectedAlert, setSelectedAlert] = useState<AlertDetail | null>(null);

  const activeCount = MOCK_ALERTS.length;
  const criticalCount = MOCK_ALERTS.filter(a => a.severity === 'Critical').length;

  return (
    <section id="alerts" className="relative py-14 px-6 bg-[#020510] border-t border-[rgba(255,255,255,0.03)]">
      <div className="max-w-[1280px] mx-auto">
        
        {/* ── Top Command Bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={DEFAULT_VIEWPORT}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4"
        >
          <div className="flex items-center gap-4">
            <SectionLabel text="Command Center" live className="flex-shrink-0" />
            <h2 className="text-[18px] font-bold text-[#E8F0FF] tracking-tight">
              Alert Monitoring System
            </h2>
          </div>

          <div className="flex gap-4 flex-wrap">
            <div className="bg-[#070D1E] border border-[rgba(255,255,255,0.05)] rounded-lg px-4 py-2 flex items-center gap-3">
              <span className="text-[10px] text-[#3D4F70] uppercase font-mono tracking-widest">Active</span>
              <span className="text-[14px] font-bold text-[#4DEEEA] mono-data">{activeCount}</span>
            </div>
            <div className="bg-[rgba(255,59,48,0.05)] border border-[rgba(255,59,48,0.1)] rounded-lg px-4 py-2 flex items-center gap-3">
              <span className="text-[10px] text-[#ff3b30] uppercase font-mono tracking-widest">Critical</span>
              <span className="text-[14px] font-bold text-[#ff3b30] mono-data">{criticalCount}</span>
            </div>
            <div className="bg-[#070D1E] border border-[rgba(255,255,255,0.05)] rounded-lg px-4 py-2 flex items-center gap-3">
              <span className="text-[10px] text-[#3D4F70] uppercase font-mono tracking-widest">Confidence</span>
              <span className="text-[14px] font-bold text-[#E8F0FF] mono-data">92%</span>
            </div>
          </div>
        </motion.div>

        {/* ── Table Header ── */}
        <div 
          className="grid mb-3 px-4"
          style={{
            gridTemplateColumns: '40px 100px 2fr 1fr 1fr 1fr',
            fontFamily: 'ui-monospace, monospace',
            fontSize: 10,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#3D4F70',
          }}
        >
          <div />
          <div>Alert ID</div>
          <div>Region & Type</div>
          <div className="text-right">AQI</div>
          <div className="text-right">Growth</div>
          <div className="text-right">Detected</div>
        </div>

        {/* ── Alert List ── */}
        <AnimatePresence>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-2"
          >
            {MOCK_ALERTS.map((alert, i) => (
              <motion.div
                key={alert.id}
                variants={fadeUp}
                custom={i}
                onClick={() => setSelectedAlert(alert)}
                whileHover={{ scale: 1.005, backgroundColor: 'rgba(255,255,255,0.04)' }}
                className="grid items-center px-4 py-4 rounded-xl cursor-pointer border border-[rgba(255,255,255,0.03)] bg-[rgba(255,255,255,0.01)] transition-colors group"
                style={{
                  gridTemplateColumns: '40px 100px 2fr 1fr 1fr 1fr',
                }}
              >
                {/* Severity Dot */}
                <div className="flex justify-center">
                  <div 
                    className={`w-2.5 h-2.5 rounded-full ${alert.severity === 'Critical' ? 'animate-pulse' : ''}`}
                    style={{ 
                      backgroundColor: severityColors[alert.severity],
                      boxShadow: `0 0 10px ${severityColors[alert.severity]}`
                    }} 
                  />
                </div>

                {/* ID */}
                <div className="text-[12px] font-mono font-bold text-[#E8F0FF] group-hover:text-[#4DEEEA] transition-colors">
                  {alert.id}
                </div>

                {/* Region & Type */}
                <div>
                  <div className="text-[14px] font-semibold text-white mb-0.5">{alert.region}</div>
                  <div className="text-[11px] text-[#8B9CC8] font-mono uppercase tracking-wide">
                    {alert.type}
                  </div>
                </div>

                {/* AQI */}
                <div className="text-right">
                  <div className="text-[18px] font-bold mono-data leading-none" style={{ color: severityColors[alert.severity] }}>
                    {alert.aqi}
                  </div>
                  <div className="text-[10px] text-[#3D4F70] font-mono mt-1 uppercase">Live</div>
                </div>

                {/* Growth */}
                <div className="text-right">
                  <div className={`text-[14px] font-bold mono-data ${alert.growth.startsWith('+') ? 'text-[#ff7a45]' : 'text-[#00d084]'}`}>
                    {alert.growth}
                  </div>
                </div>

                {/* Detected */}
                <div className="text-right text-[12px] font-mono text-[#8B9CC8]">
                  {alert.detectedAt}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

      </div>

      <AlertCommandDrawer 
        alert={selectedAlert} 
        isOpen={!!selectedAlert} 
        onClose={() => setSelectedAlert(null)} 
      />

    </section>
  );
};

export default AlertCenter;
