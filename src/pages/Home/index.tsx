import React, { useEffect } from 'react';
import { PageLayout } from '../../components/layouts';
import AppleStyleLanding from './sections/AppleStyleLanding';

const Home: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <PageLayout>
      <div className="bg-[#020617] font-sans text-white overflow-hidden">
        <AppleStyleLanding />
      </div>
    </PageLayout>
  );
};

export default Home;
