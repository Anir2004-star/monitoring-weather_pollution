import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface AlertDetail {
  id: string;
  region: string;
  aqi: number;
  growth: string;
  detectedAt: string;
  type: string;
  severity: 'Critical' | 'High' | 'Moderate' | 'Low';
  driver: string;
  confidence: number;
  forecastImpact: string;
  duration: string;
  population: string;
  action: string;
}

interface AlertCommandDrawerProps {
  alert: AlertDetail | null;
  isOpen: boolean;
  onClose: () => void;
}

const severityColors = {
  Critical: '#ff3b30',
  High: '#ff7a45',
  Moderate: '#ffd84d',
  Low: '#00d084'
};

const AlertCommandDrawer: React.FC<AlertCommandDrawerProps> = ({ alert, isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && alert && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%', opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-[400px] max-w-[90vw] z-50 flex flex-col bg-[var(--deep)] border-l border-[rgba(255,255,255,0.08)] shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[rgba(255,255,255,0.05)]">
              <div>
                <div className="text-[11px] uppercase tracking-widest text-[#8B9CC8] font-mono mb-1">
                  Alert Command Details
                </div>
                <div className="text-[20px] font-bold text-[#E8F0FF] tracking-tight">
                  {alert.id}
                </div>
              </div>
              <button 
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-[rgba(255,255,255,0.05)] text-[#8B9CC8] hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              
              {/* Highlight Card */}
              <div 
                className="rounded-xl p-5 border"
                style={{ 
                  backgroundColor: `${severityColors[alert.severity]}11`,
                  borderColor: `${severityColors[alert.severity]}33`
                }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="text-[14px] font-semibold text-white">{alert.region}</div>
                    <div className="text-[12px]" style={{ color: severityColors[alert.severity] }}>
                      {alert.type}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[24px] font-bold mono-data" style={{ color: severityColors[alert.severity] }}>
                      {alert.aqi}
                    </div>
                    <div className="text-[10px] uppercase font-mono text-[#8B9CC8]">Live AQI</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: severityColors[alert.severity] }} />
                  <span className="text-[11px] font-mono uppercase tracking-wider" style={{ color: severityColors[alert.severity] }}>
                    Severity: {alert.severity}
                  </span>
                </div>
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-lg p-4">
                  <div className="text-[10px] text-[#3D4F70] uppercase font-mono mb-1">Confidence</div>
                  <div className="text-[18px] font-bold text-[#4DEEEA] mono-data">{alert.confidence}%</div>
                </div>
                <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] rounded-lg p-4">
                  <div className="text-[10px] text-[#3D4F70] uppercase font-mono mb-1">Duration</div>
                  <div className="text-[18px] font-bold text-[#E8F0FF] mono-data">{alert.duration}</div>
                </div>
              </div>

              {/* Analysis Rows */}
              <div className="flex flex-col gap-4 border-t border-[rgba(255,255,255,0.05)] pt-6">
                
                <div>
                  <div className="text-[10px] text-[#8B9CC8] uppercase font-mono mb-2">Primary Driver</div>
                  <div className="text-[14px] text-[#E8F0FF] font-medium leading-relaxed bg-[rgba(255,255,255,0.02)] p-3 rounded">
                    {alert.driver}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] text-[#8B9CC8] uppercase font-mono mb-2">Forecast Impact</div>
                  <div className="text-[14px] text-[#FF7a45] font-medium leading-relaxed bg-[rgba(255,122,69,0.05)] p-3 rounded">
                    {alert.forecastImpact}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] text-[#8B9CC8] uppercase font-mono mb-2">Affected Population</div>
                  <div className="text-[14px] text-[#E8F0FF] mono-data font-medium leading-relaxed bg-[rgba(255,255,255,0.02)] p-3 rounded">
                    {alert.population}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Action */}
            <div className="p-6 border-t border-[rgba(255,255,255,0.05)] bg-[var(--surface-01)]">
              <div className="text-[10px] text-[#8B9CC8] uppercase font-mono mb-3">Recommended Action</div>
              <button className="w-full py-3 px-4 rounded bg-[#E8F0FF] text-[#040816] font-bold text-[13px] tracking-wide uppercase hover:bg-white transition-colors">
                {alert.action}
              </button>
            </div>
            
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AlertCommandDrawer;
