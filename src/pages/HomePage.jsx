import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { ValueProps } from '../components/home/ValueProps';
import { PopularCities } from '../components/home/PopularCities';
import { RecommendedHomes } from '../components/home/RecommendedHomes';
import { HostCalloutBanner } from '../components/home/HostCalloutBanner';
import { Testimonials } from '../components/home/Testimonials';

export const HomePage = ({ 
  properties, 
  onSearch, 
  onSelectCity, 
  onSelectProperty, 
  onNavigateExplore, 
  onBecomeHost 
}) => {
  return (
    <div className="home-page">
      <HeroSection onSearch={onSearch} />
      <ValueProps />
      <PopularCities onSelectCity={onSelectCity} />
      <RecommendedHomes 
        properties={properties} 
        onSelectProperty={onSelectProperty} 
        onViewAll={onNavigateExplore} 
      />
      <HostCalloutBanner onBecomeHost={onBecomeHost} />
      <Testimonials />
    </div>
  );
};
