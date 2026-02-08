
import React, { useState } from 'react';
import { SearchParams } from '../types';

interface SearchFormProps {
  onSearch: (params: SearchParams) => void;
  isLoading: boolean;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch, isLoading }) => {
  const [params, setParams] = useState<SearchParams>({
    keyword: '',
    location: '',
    maxResults: 20
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!params.keyword || !params.location) return;
    onSearch(params);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Business Type</label>
          <div className="relative">
            <i className="fas fa-briefcase absolute left-3 top-3.5 text-slate-400"></i>
            <input
              type="text"
              placeholder="e.g. HVAC, Lawyer, Dentist"
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              value={params.keyword}
              onChange={e => setParams(p => ({ ...p, keyword: e.target.value }))}
              required
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Location</label>
          <div className="relative">
            <i className="fas fa-map-marker-alt absolute left-3 top-3.5 text-slate-400"></i>
            <input
              type="text"
              placeholder="e.g. Austin, Texas"
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              value={params.location}
              onChange={e => setParams(p => ({ ...p, location: e.target.value }))}
              required
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Max Results</label>
          <div className="relative">
            <i className="fas fa-list-ol absolute left-3 top-3.5 text-slate-400"></i>
            <select
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none appearance-none transition-all"
              value={params.maxResults}
              onChange={e => setParams(p => ({ ...p, maxResults: parseInt(e.target.value) }))}
            >
              <option value={10}>10 Leads</option>
              <option value={20}>20 Leads</option>
              <option value={50}>50 Leads</option>
              <option value={100}>100 Leads</option>
              <option value={200}>200 Leads</option>
              <option value={500}>500 Leads</option>
            </select>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold py-3.5 rounded-lg shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <i className="fas fa-circle-notch animate-spin"></i>
            Analyzing Maps Data...
          </>
        ) : (
          <>
            <i className="fas fa-rocket"></i>
            Find High-Potential Leads
          </>
        )}
      </button>
    </form>
  );
};

export default SearchForm;
