import React from 'react';
import HeroSection from './HeroSection';
import ConnectionStatus from './ConnectionStatus';
import PagesExplorer from './PagesExplorer';
import IntegrationFlow from './IntegrationFlow';
import DocSection from './DocSection';

export default function HomeOverview() {
  return (
    <div className="w-full">
      <HeroSection />
      
      <div className="max-w-6xl mx-auto px-4 -mt-8 mb-12 relative z-10">
        <ConnectionStatus />
      </div>

      <PagesExplorer />
      <IntegrationFlow />
      <DocSection />
    </div>
  );
}
