
import React, { useState } from 'react';
import { Lead } from '../types';
import { exportToCSV } from '../utils/csvExport';

interface LeadTableProps {
  leads: Lead[];
}

const LeadTable: React.FC<LeadTableProps> = ({ leads }) => {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  if (leads.length === 0) return null;

  const handleCopyPrompt = (prompt: string, idx: number) => {
    navigator.clipboard.writeText(prompt);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-700 bg-emerald-50 border-emerald-100';
    if (score >= 60) return 'text-amber-700 bg-amber-50 border-amber-100';
    return 'text-rose-700 bg-rose-50 border-rose-100';
  };

  const getWhatsAppLink = (phone: string) => {
    const cleaned = phone.replace(/[^\d]/g, ''); 
    return `https://wa.me/${cleaned}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-1">
        <div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <i className="fas fa-shield-check text-indigo-500"></i>
            Verified Opportunities ({leads.length})
          </h2>
          <p className="text-sm text-slate-500">Deep-scanned GMB profiles without websites.</p>
        </div>
        <button
          onClick={() => exportToCSV(leads)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-sm font-bold hover:bg-black transition-all shadow-xl shadow-slate-200"
        >
          <i className="fas fa-file-csv"></i>
          Export Leads
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {leads.map((lead, idx) => (
          <div key={idx} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col lg:flex-row hover:border-indigo-300 transition-colors group">
            {/* Business Info Section */}
            <div className="p-6 lg:w-1/3 border-b lg:border-b-0 lg:border-r border-slate-100 space-y-4">
              <div className="flex justify-between items-start gap-4">
                <h3 className="font-black text-slate-900 text-xl leading-tight group-hover:text-indigo-600 transition-colors">{lead.name}</h3>
                <div className={`px-3 py-1.5 rounded-xl border-2 font-black text-sm ${getScoreColor(lead.lead_score)}`}>
                  {lead.lead_score}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3 text-sm text-slate-600">
                  <i className="fas fa-map-marker-alt text-slate-400 mt-1 flex-shrink-0"></i>
                  <span>{lead.address}</span>
                </div>
                <div className="flex items-center gap-3 text-sm font-bold text-slate-800">
                  <i className="fas fa-phone-alt text-indigo-500 flex-shrink-0"></i>
                  <span>{lead.phone}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <a 
                  href={lead.maps_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-bold hover:bg-indigo-600 hover:text-white transition-all border border-indigo-100"
                >
                  <i className="fas fa-map-location"></i>
                  GMB Profile
                </a>
                <a 
                  href={getWhatsAppLink(lead.phone)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-50 text-green-700 rounded-xl text-xs font-bold hover:bg-green-600 hover:text-white transition-all border border-green-100"
                >
                  <i className="fab fa-whatsapp"></i>
                  WhatsApp
                </a>
              </div>
            </div>

            {/* Strategic Brief Section */}
            <div className="flex-1 p-6 bg-slate-50/50 space-y-4">
              <div className="space-y-2">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <i className="fas fa-chart-line"></i>
                  Growth Opportunity
                </h4>
                <p className="text-sm text-slate-700 font-medium italic leading-relaxed">
                  "{lead.reasoning}"
                </p>
              </div>

              <div className="space-y-2 relative group/prompt">
                <div className="flex justify-between items-center">
                  <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest flex items-center gap-2">
                    <i className="fas fa-code"></i>
                    AI Website Prompt
                  </h4>
                  <button 
                    onClick={() => handleCopyPrompt(lead.website_prompt, idx)}
                    className="text-[10px] font-bold text-slate-400 hover:text-indigo-600 flex items-center gap-1 transition-colors"
                  >
                    {copiedIdx === idx ? (
                      <><i className="fas fa-check text-green-500"></i> Copied!</>
                    ) : (
                      <><i className="fas fa-copy"></i> Copy Prompt</>
                    )}
                  </button>
                </div>
                <div className="p-4 bg-white border border-slate-200 rounded-2xl text-[13px] text-slate-600 leading-relaxed font-mono whitespace-pre-wrap max-h-48 overflow-y-auto custom-scrollbar">
                  {lead.website_prompt}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
    </div>
  );
};

export default LeadTable;
