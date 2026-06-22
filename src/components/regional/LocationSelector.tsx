import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  getAllStates,
  getCitiesForState,
  getRegionsForCity,
  buildLocationLabel,
} from '../../utils/indiaLocations';

export interface LocationSelection {
  stateId: string;
  cityId?: string;
  regionId?: string;
  label: string;
}

interface LocationSelectorProps {
  value: LocationSelection;
  onChange: (selection: LocationSelection) => void;
}

const SelectorChevron = () => (
  <svg width="10" height="6" viewBox="0 0 10 6" fill="none" style={{ flexShrink: 0 }}>
    <path d="M1 1L5 5L9 1" stroke="#8B9CC8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const LocationSelector: React.FC<LocationSelectorProps> = ({ value, onChange }) => {
  const [showStateSearch, setShowStateSearch] = useState(false);
  const [stateSearch, setStateSearch] = useState('');

  const states = getAllStates();
  const cities = value.stateId ? getCitiesForState(value.stateId) : [];
  const regions = value.stateId && value.cityId ? getRegionsForCity(value.stateId, value.cityId) : [];
  const filteredStates = stateSearch
    ? states.filter((s) => s.name.toLowerCase().includes(stateSearch.toLowerCase()))
    : states;

  const handleStateChange = (stateId: string) => {
    const label = buildLocationLabel(stateId);
    onChange({ stateId, label });
    setShowStateSearch(false);
    setStateSearch('');
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cityId = e.target.value;
    const label = buildLocationLabel(value.stateId, cityId);
    onChange({ stateId: value.stateId, cityId, label });
  };

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const regionId = e.target.value;
    const label = buildLocationLabel(value.stateId, value.cityId, regionId);
    onChange({ stateId: value.stateId, cityId: value.cityId, regionId, label });
  };

  const selectClass =
    'appearance-none bg-transparent border border-[rgba(255,255,255,0.1)] text-[#E8F0FF] text-[13px] font-medium ' +
    'px-3 py-2 pr-8 rounded-xl outline-none focus:border-[#4DEEEA] transition-colors cursor-pointer ' +
    'hover:border-[rgba(255,255,255,0.25)]';

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* ── State selector (with search popover) ── */}
      <div className="relative">
        <button
          onClick={() => setShowStateSearch((v) => !v)}
          className="flex items-center gap-2 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] 
                     text-[#E8F0FF] text-[13px] font-medium px-3 py-2 rounded-xl hover:border-[rgba(255,255,255,0.25)] 
                     transition-colors cursor-pointer min-w-[140px] justify-between"
          id="state-selector-btn"
        >
          <span>{states.find((s) => s.id === value.stateId)?.name ?? 'Select State'}</span>
          <SelectorChevron />
        </button>
        <AnimatePresence>
          {showStateSearch && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="absolute top-full mt-2 left-0 z-50 rounded-xl overflow-hidden shadow-2xl"
              style={{
                background: 'rgba(7, 13, 30, 0.97)',
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(20px)',
                minWidth: 200,
              }}
            >
              <div className="p-2 border-b border-[rgba(255,255,255,0.08)]">
                <input
                  autoFocus
                  placeholder="Search state..."
                  value={stateSearch}
                  onChange={(e) => setStateSearch(e.target.value)}
                  className="w-full bg-transparent text-[13px] text-[#E8F0FF] placeholder-[#3D4F70] 
                             outline-none px-2 py-1"
                />
              </div>
              <div className="max-h-52 overflow-y-auto">
                {filteredStates.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleStateChange(s.id)}
                    className={`w-full text-left px-4 py-2 text-[13px] transition-colors hover:bg-[rgba(77,238,234,0.08)] ${
                      s.id === value.stateId ? 'text-[#4DEEEA] bg-[rgba(77,238,234,0.05)]' : 'text-[#8B9CC8]'
                    }`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Separator arrow ── */}
      {value.stateId && (
        <motion.span
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-[#3D4F70] text-[12px]"
        >
          →
        </motion.span>
      )}

      {/* ── City selector ── */}
      <AnimatePresence>
        {value.stateId && cities.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className="relative"
          >
            <select
              id="city-selector"
              value={value.cityId ?? ''}
              onChange={handleCityChange}
              className={selectClass}
            >
              <option value="" disabled style={{ background: '#070D1E' }}>Select City</option>
              {cities.map((c) => (
                <option key={c.id} value={c.id} style={{ background: '#070D1E' }}>
                  {c.name}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <SelectorChevron />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Separator arrow ── */}
      {value.cityId && (
        <motion.span
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-[#3D4F70] text-[12px]"
        >
          →
        </motion.span>
      )}

      {/* ── Region selector ── */}
      <AnimatePresence>
        {value.cityId && regions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className="relative"
          >
            <select
              id="region-selector"
              value={value.regionId ?? ''}
              onChange={handleRegionChange}
              className={selectClass}
            >
              <option value="" style={{ background: '#070D1E' }}>All Regions</option>
              {regions.map((r) => (
                <option key={r.id} value={r.id} style={{ background: '#070D1E' }}>
                  {r.name}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <SelectorChevron />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LocationSelector;
