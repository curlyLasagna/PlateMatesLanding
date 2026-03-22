import React from 'react';
import { ArrowRight } from 'lucide-react';
import type { Macros } from './types';

interface PlateSummaryBarProps {
  totals: Macros;
  onPost: () => void;
  onViewSummary: () => void;
}

const PlateSummaryBar: React.FC<PlateSummaryBarProps> = ({ totals, onPost, onViewSummary }) => {
  return (
    <div className="h-[10%] bg-slate-900 flex items-center px-6 border-t border-slate-800 shadow-[0_-10px_20px_rgba(0,0,0,0.1)] z-30">
      <div className="flex-1 flex gap-4">
        <div className="flex flex-col">
          <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">Kcal</span>
          <span className="text-sm font-black text-white italic">{Math.round(totals.cal)}</span>
        </div>
        <div className="flex flex-col border-l border-slate-800 pl-2 sm:pl-4">
          <span className="text-[8px] text-emerald-500 font-bold uppercase tracking-widest">Protein</span>
          <span className="text-sm font-black text-white italic">{Math.round(totals.p)}g</span>
        </div>
        <div className="flex flex-col border-l border-slate-800 pl-2 sm:pl-4">
          <span className="text-[8px] text-blue-500 font-bold uppercase tracking-widest">Carbs</span>
          <span className="text-sm font-black text-white italic">{Math.round(totals.c)}g</span>
        </div>
      </div>
      
      <button 
        onClick={onViewSummary}
        className="bg-emerald-600 hover:bg-emerald-500 active:scale-95 transition-all text-white p-3 rounded-xl font-black shadow-lg flex items-center justify-center"
      >
        <ArrowRight size={20} />
      </button>
    </div>
  );
};

export default PlateSummaryBar;
