import React from 'react';
import { Navbar, Footer } from '../common';

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => (
  <div className="min-h-screen flex flex-col bg-[var(--ei-bg)]">
    <Navbar />
    <main className="flex-1">
      {children}
    </main>
    <Footer />
  </div>
);

export default PageLayout;
