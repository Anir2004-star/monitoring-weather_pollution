import React, { useEffect } from 'react';
import { PageLayout } from '../../components/layouts';
import EarthInterface from './earth-interface/EarthInterface';

const Home: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <PageLayout>
      <div className="bg-[var(--ei-bg)] font-sans text-white overflow-hidden">
        <EarthInterface />
      </div>
    </PageLayout>
  );
};

export default Home;
