import React from 'react';
import { PageLayout } from '../../components/layouts';
import HeroSection from './sections/HeroSection';
import NationwideAQISection from './sections/NationwideAQISection';
import RegionalAtmosphericSection from './sections/RegionalAtmosphericSection';
import SatelliteSection from './sections/SatelliteSection';
import PollutionTransportSection from './sections/PollutionTransportSection';
import ForecastSection from './sections/ForecastSection';
import AlertCenter from '../../components/alerts/AlertCenter';
import DataSourcesStrip from './sections/DataSourcesStrip';
import TimeMachineSlider from '../../components/common/TimeMachineSlider';

/**
 * Home — Atmospheric Intelligence Platform
 *
 * Exactly 9 sections. No educational content. No filler.
 * Every section answers: "What decision can a user make from this?"
 *
 *  1. Hero             — We monitor Earth's atmosphere in real time
 *  2. Nationwide AQI   — Current state of major Indian cities
 *  3. Satellite Map    — Spatial intelligence layer
 *  4. Radar             — Atmospheric dominance tracking
 *  6. Forecast         — 24h / 7d predictive outlook
 *  7. Hotspot          — Operational severity table + escalation rates
 *  8. Data Sources     — Compact credibility strip
 *  9. Footer
 */
const Home: React.FC = () => (
  <PageLayout>
    <HeroSection />
    <NationwideAQISection />
    <RegionalAtmosphericSection />
    <SatelliteSection />
    <PollutionTransportSection />
    <ForecastSection />
    <AlertCenter />
    <DataSourcesStrip />
    <TimeMachineSlider />
  </PageLayout>
);

export default Home;
