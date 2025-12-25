import React from 'react';
import { Play, CheckCircle } from 'lucide-react';
import HeroCard from './Herocard';

const HeroSection: React.FC = () => {
  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-purple-700">
      {/* Abstract Shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 opacity-20 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="flex flex-col gap-6 text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight">
              Process Your Videos at <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">Lightning Speed</span>
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
              Upload, compress, and optimize your videos with our AI-powered processing pipeline. Save time and bandwidth without sacrificing quality.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <button className="flex items-center justify-center px-8 py-3.5 text-base font-bold text-blue-600 bg-white rounded-xl hover:bg-gray-50 transition-all shadow-lg active:scale-95">
                Get Started Free
              </button>
              <button className="flex items-center justify-center gap-2 px-8 py-3.5 text-base font-bold text-white border border-white/30 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-all active:scale-95">
                <Play className="w-5 h-5" />
                Watch Demo
              </button>
            </div>
            <div className="pt-4 flex items-center justify-center lg:justify-start gap-2 text-sm text-blue-200">
              <CheckCircle className="w-4 h-4" /> No credit card required
              <span className="mx-2">•</span>
              <CheckCircle className="w-4 h-4" /> 14-day free trial
            </div>
          </div>
          
          {/* Hero Illustration */}
          <HeroCard />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;