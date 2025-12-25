import React from 'react';
import {Header , HeroSection , FeatureSection , WorkflowSection , StatsSection , CTASection , Footer} from "../Componets"

const Home: React.FC = () => {
  return (
    <div className="bg-white text-gray-900 overflow-x-hidden">
      {/* Header */}
      <Header />
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Features Section */}
      <FeatureSection />
      
      {/* How It Works */}
      <WorkflowSection />
      
      {/* Stats Section */}
      <StatsSection />
      
      {/* CTA Section */}
      <CTASection />
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;