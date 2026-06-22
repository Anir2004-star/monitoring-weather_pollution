/**
 * RegionalAtmosphericSection
 *
 * Full Regional Atmospheric Intelligence experience:
 *  - Dynamic weather-aware animated background (WeatherCanvas)
 *  - 3-level hierarchical India location selector (State → City → Region)
 *  - 8 atmospheric metric cards (AQI, Temp, Humidity, Wind, Pressure, Visibility, Sunrise, Sunset)
 *  - Multi-range forecast (Hourly | Tomorrow | 7-Day)
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LocationSelector,
  AtmosphericMetricCard,
  SunriseSunsetArc,
} from '../../../components/regional';
import AtmosphericSky from '../../../components/atmosphere/AtmosphericSky';
import WeatherTimeline from '../../../components/forecast/WeatherTimeline';
import type { LocationSelection } from '../../../components/regional';
import {
  getRegionalWeather,
  getRegionalAQI,
  getHourlyForecast,
  getTomorrowForecast,
  getSevenDayForecast,
  getAQILevel,
  WEATHER_THEMES,
} from '../../../utils/weatherMock';
import { getNodeCoords } from '../../../utils/indiaLocations';

const INITIAL_LOCATION: LocationSelection = {
  stateId: 'delhi',
  cityId:  'delhi-new-delhi',
  label:   'New Delhi, Delhi',
};

const RegionalAtmosphericSection: React.FC = () => {
  const [location, setLocation] = useState<LocationSelection>(INITIAL_LOCATION);

  // Derive the location ID for mock data seeding
  const locationId = location.regionId ?? location.cityId ?? location.stateId;

  // Coords must be first — all weather generators depend on it for SunCalc day/night
  const coords = useMemo(
    () => getNodeCoords(location.stateId, location.cityId, location.regionId),
    [location],
  );

  // All derived data — stable per locationId + real coordinates
  const weather  = useMemo(() => getRegionalWeather(locationId, coords.lat, coords.lng), [locationId, coords]);
  const aqiData  = useMemo(() => getRegionalAQI(locationId),    [locationId]);
  const hourly   = useMemo(() => getHourlyForecast(locationId, coords.lat, coords.lng),  [locationId, coords]);
  const tomorrow = useMemo(() => getTomorrowForecast(locationId, coords.lat, coords.lng), [locationId, coords]);
  const sevenDay = useMemo(() => getSevenDayForecast(locationId, coords.lat, coords.lng), [locationId, coords]);

  const theme    = WEATHER_THEMES[weather.condition];
  const aqiLevel = getAQILevel(aqiData.aqi);

  return (
    <section id="regional" className="relative py-16 px-6 bg-[#040816] border-t border-[rgba(255,255,255,0.03)]">
      <div className="max-w-[1280px] mx-auto">

        {/* ── Section Header ─────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6">
          <div>
            <h2 className="text-[14px] font-semibold tracking-[0.12em] uppercase text-[#8B9CC8] mb-1">
              Regional Atmospheric Intelligence
            </h2>
            <p className="text-[13px] text-[#3D4F70]">
              Weather-aware air quality for your region
            </p>
          </div>

          {/* Location Selector */}
          <LocationSelector value={location} onChange={setLocation} />
        </div>

        <div className="h-[1px] w-full bg-[rgba(255,255,255,0.06)] mb-10" />

        {/* ── Main Grid: Weather Panel (left) + Metrics (right) ────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-10">

          {/* ── Left: Animated Weather Hero ────────────────────────────── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={locationId + weather.condition}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-3"
            >
              <AtmosphericSky
                weatherType={weather.condition}
                temperature={weather.temperature}
                humidity={weather.humidity}
                className="w-full h-[340px] lg:h-full min-h-[320px]"
              >
                {/* Content overlay on top of weather animation */}
                <div className="absolute inset-0 flex flex-col justify-between p-6 z-10">

                  {/* Top bar: condition + location */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl">{theme.icon}</span>
                        <span
                          className="text-[13px] font-semibold tracking-[0.08em] uppercase px-3 py-1 rounded-full"
                          style={{
                            background: 'rgba(0,0,0,0.35)',
                            backdropFilter: 'blur(8px)',
                            color: '#E8F0FF',
                          }}
                        >
                          {theme.label}
                        </span>
                      </div>
                      <p className="text-[13px] text-[rgba(255,255,255,0.65)] max-w-[280px] mt-2">
                        {weather.description}
                      </p>
                    </div>

                    {/* AQI chip */}
                    <div
                      className="flex flex-col items-center rounded-2xl px-4 py-3"
                      style={{
                        background: 'rgba(0,0,0,0.40)',
                        backdropFilter: 'blur(12px)',
                        border: `1px solid ${aqiLevel.color}40`,
                      }}
                    >
                      <span className="text-[10px] tracking-[0.1em] uppercase font-semibold"
                        style={{ color: aqiLevel.color }}>AQI</span>
                      <span className="text-[32px] font-bold mono-data leading-none"
                        style={{ color: aqiLevel.color }}>{aqiData.aqi}</span>
                      <span className="text-[10px] font-medium mt-1"
                        style={{ color: aqiLevel.color }}>{aqiLevel.label}</span>
                    </div>
                  </div>

                  {/* Bottom: Location + Temp + Solar Arc */}
                  <div>
                    {/* Location name */}
                    <div className="mb-3">
                      <div className="text-[11px] tracking-[0.1em] uppercase text-[rgba(255,255,255,0.5)] mb-0.5">
                        📍 {location.label}
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-[48px] font-bold leading-none text-white mono-data"
                          style={{ textShadow: '0 2px 16px rgba(0,0,0,0.4)' }}>
                          {weather.temperature}°
                        </span>
                        <span className="text-[16px] text-[rgba(255,255,255,0.6)]">C</span>
                        <span className="text-[14px] text-[rgba(255,255,255,0.5)] ml-1">
                          Feels {weather.feelsLike}°
                        </span>
                      </div>
                    </div>

                    {/* Solar arc */}
                    <div
                      className="rounded-xl p-3 inline-block"
                      style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(10px)' }}
                    >
                      <SunriseSunsetArc
                        lat={coords.lat}
                        lng={coords.lng}
                        sunriseLabel={weather.sunrise}
                        sunsetLabel={weather.sunset}
                      />
                    </div>
                  </div>
                </div>
              </AtmosphericSky>
            </motion.div>
          </AnimatePresence>

          {/* ── Right: Metric Cards Grid ────────────────────────────────── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={locationId}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45 }}
              className="lg:col-span-2 grid grid-cols-2 gap-3 content-start"
            >
              <AtmosphericMetricCard
                icon="🌡️"
                label="Temperature"
                value={weather.temperature}
                unit="°C"
                subValue={`Feels like ${weather.feelsLike}°C`}
              />
              <AtmosphericMetricCard
                icon="💧"
                label="Humidity"
                value={weather.humidity}
                unit="%"
                color="#4DEEEA"
              />
              <AtmosphericMetricCard
                icon="💨"
                label="Wind Speed"
                value={weather.windSpeed}
                unit="km/h"
                subValue={`Direction: ${weather.windDirection}`}
                color="#8A7CFF"
              />
              <AtmosphericMetricCard
                icon="🔵"
                label="Pressure"
                value={weather.pressure}
                unit="hPa"
              />
              <AtmosphericMetricCard
                icon="👁️"
                label="Visibility"
                value={weather.visibility}
                unit="km"
                color={weather.visibility < 5 ? '#FF7043' : '#00E676'}
                subValue={weather.visibility < 3 ? 'Poor — reduce outdoor activity' : undefined}
              />
              <AtmosphericMetricCard
                icon="☀️"
                label="UV Index"
                value={weather.uvIndex}
                color={weather.uvIndex >= 8 ? '#FF7043' : weather.uvIndex >= 5 ? '#FFD54F' : '#00E676'}
                subValue={weather.uvIndex >= 8 ? 'Very High' : weather.uvIndex >= 5 ? 'Moderate' : 'Low'}
              />
              <AtmosphericMetricCard
                icon="🌅"
                label="Sunrise"
                value={weather.sunrise}
                color="#FFD54F"
              />
              <AtmosphericMetricCard
                icon="🌇"
                label="Sunset"
                value={weather.sunset}
                color="#FF9800"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Pollutant Breakdown Strip ──────────────────────────────────── */}
        <div className="surface-01 rounded-2xl p-4 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[11px] font-semibold tracking-[0.1em] uppercase text-[#8B9CC8]">
              Pollutant Breakdown
            </span>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full"
              style={{ background: `${aqiLevel.color}18`, color: aqiLevel.color }}>
              Dominant: {aqiData.dominant}
            </span>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {[
              { key: 'PM2.5', value: aqiData.pm25,  unit: 'µg/m³' },
              { key: 'PM10',  value: aqiData.pm10,  unit: 'µg/m³' },
              { key: 'NO₂',  value: aqiData.no2,   unit: 'ppb'   },
              { key: 'O₃',   value: aqiData.o3,    unit: 'ppb'   },
              { key: 'SO₂',  value: aqiData.so2,   unit: 'ppb'   },
              { key: 'CO',   value: aqiData.co,    unit: 'ppm'   },
            ].map(({ key, value, unit }) => (
              <div key={key} className="flex flex-col gap-1">
                <span className="text-[10px] tracking-[0.08em] uppercase text-[#3D4F70]">{key}</span>
                <span className="text-[16px] font-bold mono-data text-[#E8F0FF]">{value}</span>
                <span className="text-[10px] text-[#3D4F70]">{unit}</span>
                <div className="h-1 rounded-full bg-[rgba(255,255,255,0.06)] mt-1">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${Math.min(100, (value / 150) * 100)}%`,
                      background: aqiLevel.color,
                      opacity: 0.7,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Forecast Panel ─────────────────────────────────────────────── */}
        <WeatherTimeline 
          locationLabel={location.label}
          hourly={hourly}
          tomorrow={tomorrow}
          sevenDay={sevenDay}
        />

      </div>
    </section>
  );
};

export default RegionalAtmosphericSection;
