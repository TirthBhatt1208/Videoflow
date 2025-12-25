import React from 'react';
import type { Stat } from '../Types/type.ts';

const StatsSection: React.FC = () => {
  const stats: Stat[] = [
    { value: "10M+", label: "Videos Processed" },
    { value: "99.9%", label: "Uptime" },
    { value: "50+", label: "Countries" },
    { value: "4.9", label: "User Rating", suffix: "/5" }
  ];

  return (
    <section className="py-20 bg-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-purple-700 opacity-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-1 mb-2">
                <p className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">{stat.value}</p>
                {stat.suffix && <span className="text-xl text-yellow-400 font-bold">{stat.suffix}</span>}
              </div>
              <p className="text-sm sm:text-base font-medium text-gray-400 uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;