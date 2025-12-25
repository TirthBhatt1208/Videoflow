import React from 'react';
import { Play, Cloud, Bell, Check } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500 text-white">
                <Play className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight">VideoFlow</span>
            </div>
            <p className="text-gray-400 leading-relaxed max-w-xs">
              The fastest way to encode, store, and stream video. Built for developers, loved by creators.
            </p>
          </div>
          
          {/* Links */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">Product</h4>
              <ul className="flex flex-col gap-3">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">Resources</h4>
              <ul className="flex flex-col gap-3">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Guides</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Support</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          
          {/* Social */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">Connect</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-500 hover:text-white transition-all">
                <Cloud className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-500 hover:text-white transition-all">
                <Bell className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-500 hover:text-white transition-all">
                <Check className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-800 text-center md:text-left flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>© 2024 VideoFlow Inc. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;