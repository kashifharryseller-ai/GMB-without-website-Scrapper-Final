
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 text-white p-2 rounded-lg">
            <i className="fas fa-search-location text-xl"></i>
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            GMB Lead Finder AI
          </h1>
        </div>
        <div className="hidden md:flex items-center gap-4 text-sm text-slate-500">
          <span className="flex items-center gap-1">
            <i className="fas fa-check-circle text-green-500"></i> AI Verification
          </span>
          <span className="flex items-center gap-1">
            <i className="fas fa-check-circle text-green-500"></i> Maps Grounding
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
