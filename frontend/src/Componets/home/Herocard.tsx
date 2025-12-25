import React from 'react';
import { Play, Upload, CheckCircle, Zap, Monitor } from 'lucide-react';

const HeroCard: React.FC = () => {
  return (
    <div className="relative lg:h-[500px] w-full flex items-center justify-center animate-float">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
      
      <div className="relative w-full max-w-lg aspect-square lg:aspect-auto h-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6 flex flex-col gap-4">
        {/* Video Player Interface */}
        <div className="w-full h-48 rounded-lg bg-gray-900 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 opacity-60"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
              <Play className="w-8 h-8 text-white" />
            </div>
          </div>
          
          {/* Processing Overlay */}
          <div className="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></div>
            <div className="flex-1">
              <div className="text-xs text-white font-medium mb-1">Processing...</div>
              <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-3/4 rounded-full"></div>
              </div>
            </div>
            <span className="text-xs text-white font-mono">75%</span>
          </div>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mt-auto">
          <div className="bg-white/5 p-4 rounded-xl border border-white/10">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-green-400" />
              <span className="text-xs text-gray-300">Speed</span>
            </div>
            <div className="text-xl font-bold text-white">2.4s</div>
          </div>
          <div className="bg-white/5 p-4 rounded-xl border border-white/10">
            <div className="flex items-center gap-2 mb-1">
              <Monitor className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-gray-300">Quality</span>
            </div>
            <div className="text-xl font-bold text-white">4K HDR</div>
          </div>
        </div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute -right-8 top-12 p-3 bg-white rounded-lg shadow-xl animate-bounce" style={{ animationDuration: '3s' }}>
        <Upload className="w-6 h-6 text-blue-500" />
      </div>
      <div className="absolute -left-8 bottom-24 p-3 bg-white rounded-lg shadow-xl animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
        <CheckCircle className="w-6 h-6 text-green-500" />
      </div>
    </div>
  );
};

export default HeroCard;