import React from 'react';
import { Zap, Monitor, Bell } from 'lucide-react';
import type { Feature, ColorMap } from '../Types/type.ts';

const FeaturesSection: React.FC = () => {
  const features: Feature[] = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Process videos in minutes with our optimized pipeline. Our distributed cloud architecture ensures minimal latency.",
      color: "yellow"
    },
    {
      icon: Monitor,
      title: "Multi-Format Output",
      description: "Generate 480p, 720p, 1080p versions automatically. Support for HLS, MP4, and WebM containers out of the box.",
      color: "blue"
    },
    {
      icon: Bell,
      title: "Live Progress",
      description: "Watch your videos process in real-time with webhooks and websocket events for seamless integration.",
      color: "green"
    }
  ];

  const colorMap: ColorMap = {
    yellow: { bg: "bg-yellow-50", text: "text-yellow-500", iconBg: "text-yellow-500" },
    blue: { bg: "bg-blue-50", text: "text-blue-500", iconBg: "text-blue-500" },
    green: { bg: "bg-green-50", text: "text-green-500", iconBg: "text-green-500" }
  };

  return (
    <section className="py-24 bg-gray-50" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-base font-bold text-blue-500 tracking-wide uppercase mb-2">Features</h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
            Why Choose VideoFlow?
          </p>
          <p className="text-lg text-gray-600">
            Experience the future of video processing with our cutting-edge features designed for scale and performance.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const colors = colorMap[feature.color];
            
            return (
              <div key={index} className="group relative p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${colors.iconBg}`}>
                  <Icon className="w-28 h-28" />
                </div>
                <div className={`w-14 h-14 flex items-center justify-center rounded-xl ${colors.bg} ${colors.text} mb-6 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;