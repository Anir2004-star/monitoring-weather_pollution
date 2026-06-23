import React, { useEffect } from 'react';
import { PageLayout } from '../../components/layouts';
import CinematicHeroSection from './sections/CinematicHeroSection';
import NationwideAQISection from './sections/NationwideAQISection';
import RegionalAtmosphericSection from './sections/RegionalAtmosphericSection';
import SatelliteSection from './sections/SatelliteSection';
import PollutionTransportSection from './sections/PollutionTransportSection';
import ForecastSection from './sections/ForecastSection';
import AlertCenter from '../../components/alerts/AlertCenter';
import DataSourcesStrip from './sections/DataSourcesStrip';

const Home: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <PageLayout>
      <div className="bg-[#020617] font-sans text-white overflow-hidden">
        <CinematicHeroSection />
      </div>
      <NationwideAQISection />
      <RegionalAtmosphericSection />
      <SatelliteSection />
      <PollutionTransportSection />
      <ForecastSection />
      <AlertCenter />
      <DataSourcesStrip />
    </PageLayout>
  );
};

export default Home;
