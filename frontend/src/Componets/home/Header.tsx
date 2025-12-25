import React from 'react';
import { Play } from 'lucide-react';
import { useNavigate } from 'react-router';

const Header: React.FC = () => {
  const navigate = useNavigate()
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-[72px]">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500 text-white">
              <Play className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">
              VideoFlow
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#"
              className="text-sm font-medium text-gray-600 hover:text-blue-500 transition-colors"
            >
              Home
            </a>
            <a
              href="#features"
              className="text-sm font-medium text-gray-600 hover:text-blue-500 transition-colors"
            >
              Features
            </a>
            <a
              href="#"
              className="text-sm font-medium text-gray-600 hover:text-blue-500 transition-colors"
            >
              Pricing
            </a>
            <a
              href="#"
              className="text-sm font-medium text-gray-600 hover:text-blue-500 transition-colors"
            >
              Docs
            </a>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/login")}
              className="hidden sm:flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
            >
              LogIn
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-all shadow-md hover:shadow-lg"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;