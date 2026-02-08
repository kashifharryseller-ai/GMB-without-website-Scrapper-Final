
import React, { useState } from 'react';
import Header from './components/Header';
import SearchForm from './components/SearchForm';
import LeadTable from './components/LeadTable';
import { Lead, SearchParams } from './types';
import { findLeads } from './services/geminiService';

const App: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (params: SearchParams) => {
    setLoading(true);
    setError(null);
    setSearched(true);
    setLoadingStage('Connecting to Google Maps API...');
    
    try {
      // Small delays to show progress stages to the user
      setTimeout(() => setLoadingStage('Deep-Verifying GMB Profiles...'), 2000);
      setTimeout(() => setLoadingStage('Generating AI Website Strategies...'), 4500);

      const results = await findLeads(params);
      setLeads(results);
      if (results.length === 0) {
        setError("No GMB-only leads found in this area. Every business found already has a website.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during deep scan.");
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingStage('');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 py-12 space-y-12">
        {/* Intro Section */}
        <section className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-xs font-black uppercase tracking-widest mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            Live GMB Scraper
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
            Find Clients Who <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Need You</span>.
          </h2>
          <p className="text-slate-500 text-lg md:text-xl font-medium max-w-2xl mx-auto">
            GMB Lead Finder AI deep-scans Google Maps to find businesses that have a physical presence but <strong>zero digital footprint</strong>.
          </p>
        </section>

        {/* Search Area */}
        <div className="max-w-4xl mx-auto w-full">
          <SearchForm onSearch={handleSearch} isLoading={loading} />
        </div>

        {/* Error State */}
        {error && (
          <div className="max-w-2xl mx-auto bg-rose-50 border-2 border-rose-100 text-rose-700 px-6 py-5 rounded-3xl flex items-center gap-4 animate-in fade-in slide-in-from-top-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
              <i className="fas fa-exclamation-triangle text-xl text-rose-500"></i>
            </div>
            <div>
              <p className="font-black text-lg">Search Limitation</p>
              <p className="text-sm opacity-80 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Initial Empty State */}
        {!searched && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
            <div className="group p-8 bg-white rounded-3xl border border-slate-200 space-y-4 hover:border-indigo-500 transition-all hover:shadow-2xl hover:shadow-indigo-100">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <i className="fas fa-satellite-dish"></i>
              </div>
              <h3 className="font-black text-lg">GMB Grounding</h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">Real-time access to Google Maps data to verify physical locations and active phone numbers.</p>
            </div>
            <div className="group p-8 bg-white rounded-3xl border border-slate-200 space-y-4 hover:border-violet-500 transition-all hover:shadow-2xl hover:shadow-violet-100">
              <div className="w-12 h-12 bg-violet-50 text-violet-600 rounded-2xl flex items-center justify-center text-xl group-hover:bg-violet-600 group-hover:text-white transition-colors">
                <i className="fas fa-fingerprint"></i>
              </div>
              <h3 className="font-black text-lg">Deep Verification</h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">Gemini 3 Pro cross-references every listing to ensure they are strictly GMB-only with no website.</p>
            </div>
            <div className="group p-8 bg-white rounded-3xl border border-slate-200 space-y-4 hover:border-emerald-500 transition-all hover:shadow-2xl hover:shadow-emerald-100">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <i className="fas fa-wand-magic-sparkles"></i>
              </div>
              <h3 className="font-black text-lg">AI Pitch Strategy</h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">Custom no-code website prompts generated specifically for each business to help you close the deal.</p>
            </div>
          </div>
        )}

        {/* Loading Spinner for results */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 space-y-8">
            <div className="relative">
              <div className="w-24 h-24 border-8 border-slate-100 rounded-full"></div>
              <div className="w-24 h-24 border-8 border-indigo-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <i className="fas fa-robot text-2xl text-indigo-600 animate-pulse"></i>
              </div>
            </div>
            <div className="text-center space-y-2">
              <p className="text-slate-900 text-xl font-black">{loadingStage}</p>
              <p className="text-slate-400 font-medium animate-pulse text-sm">Gemini 3 Pro is thinking... This may take up to 30 seconds for deep scans.</p>
            </div>
          </div>
        )}

        {/* Results Table */}
        {!loading && leads.length > 0 && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <LeadTable leads={leads} />
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6 text-slate-400 text-sm font-medium">
          <div className="flex items-center gap-2">
            <div className="bg-slate-100 p-1.5 rounded-lg">
              <i className="fas fa-microchip"></i>
            </div>
            <span>Powered by Gemini 3.0 & Google Maps Platform</span>
          </div>
          <p>© 2024 GMB Lead Finder AI • Agency-Grade Business Intelligence</p>
          <div className="flex gap-6">
            <span className="hover:text-indigo-600 cursor-pointer">Privacy</span>
            <span className="hover:text-indigo-600 cursor-pointer">Terms</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
