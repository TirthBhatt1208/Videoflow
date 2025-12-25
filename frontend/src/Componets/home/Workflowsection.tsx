import React from 'react';
import { Upload, Settings, Sparkles, Download } from 'lucide-react';
import type { WorkflowStep } from '../Types/type.ts';

const WorkflowSection: React.FC = () => {
  const steps: WorkflowStep[] = [
    { icon: Upload, title: "Upload Video", description: "Drag & drop your raw video files to our secure cloud." },
    { icon: Settings, title: "Auto Processing", description: "Our AI analyzes and transcodes your content instantly." },
    { icon: Sparkles, title: "Optimization", description: "Smart compression reduces size without losing quality." },
    { icon: Download, title: "Download & Share", description: "Get your optimized files or stream directly via CDN." }
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-base font-bold text-blue-500 tracking-wide uppercase mb-2">Workflow</h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            How VideoFlow Works
          </p>
        </div>
        
        <div className="relative">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 border-t-2 border-dashed border-gray-200 -translate-y-1/2 z-0"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => {
              const Icon = step.icon;
              
              return (
                <div key={index} className="flex flex-col items-center text-center group">
                  <div className="w-16 h-16 rounded-full bg-white border-2 border-blue-500 text-blue-500 flex items-center justify-center shadow-lg mb-6 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300 relative">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkflowSection;