import React from 'react';
import { Search, Camera, Navigation } from 'lucide-react';
import type { Tab } from './types';

interface BottomNavProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  isVisible: boolean;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab, isVisible }) => {
  return (
    <nav className={`absolute bottom-0 w-full bg-white/80 backdrop-blur-md border-t border-slate-100 px-8 py-4 flex justify-between items-center z-20 transition-transform duration-300 ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}>
      <button
        onClick={() => setActiveTab('feed')}
        className={`flex flex-col items-center gap-1 ${activeTab === 'feed' ? 'text-emerald-600' : 'text-slate-400'}`}
      >
        <Search size={22} />
        <span className="text-[10px] font-bold">Discover</span>
      </button>

      <button
        onClick={() => setActiveTab('scan')}
        className="w-14 h-14 bg-emerald-600 text-white rounded-2xl -mt-10 shadow-lg shadow-emerald-200 flex items-center justify-center transition-transform active:scale-90"
      >
        <Camera size={28} />
      </button>

      <button
        onClick={() => setActiveTab('stats')}
        className={`flex flex-col items-center gap-1 relative ${activeTab === 'stats' ? 'text-emerald-600' : 'text-slate-400'}`}
      >
        <span className="absolute -top-2 -left-2 text-[11px] font-black text-emerald-500">$</span>
        <Navigation size={22} />
        <span className="text-[10px] font-bold">Progress</span>
      </button>
    </nav>
  );
};

export default BottomNav;
