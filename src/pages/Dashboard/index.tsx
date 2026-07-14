import React, { useEffect } from 'react';
import { PageLayout } from '../../components/layouts';
import NationwideAQISection from '../Home/sections/NationwideAQISection';
import RegionalAtmosphericSection from '../Home/sections/RegionalAtmosphericSection';
import SatelliteSection from '../Home/sections/SatelliteSection';
import PollutionTransportSection from '../Home/sections/PollutionTransportSection';
import ForecastSection from '../Home/sections/ForecastSection';
import AlertCenter from '../../components/alerts/AlertCenter';
import DataSourcesStrip from '../Home/sections/DataSourcesStrip';

const Dashboard: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <PageLayout>
      <div className="pt-24 pb-8 bg-[var(--void)] px-6 md:px-10">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex flex-col gap-2 mb-8">
            <h1 className="text-3xl font-bold text-white tracking-tight" style={{ fontFamily: '"Inter", sans-serif' }}>
              Live Intelligence Dashboard
            </h1>
            <p className="text-[var(--text-secondary)]">Real-time atmospheric telemetry and air quality analytics.</p>
          </div>
        </div>
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

export default Dashboard;
