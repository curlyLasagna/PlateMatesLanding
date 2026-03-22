import { Flame, Beef, MoreHorizontal, Heart, CheckCircle, Zap } from 'lucide-react';
import type { Hack } from './types';

interface HackCardProps {
  hack: Hack;
  onLike: (id: number) => void;
  onVerify: (id: number) => void;
  onLog: (hack: Hack) => void;
  onImageClick: (hack: Hack) => void;
}

const HackCard: React.FC<HackCardProps> = ({ hack, onLike, onVerify, onLog, onImageClick }) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
      {/* Post Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
            {hack.user[0]}
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">@{hack.user}</p>
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{hack.location}</p>
          </div>
        </div>
        <button className="text-slate-300"><MoreHorizontal size={20} /></button>
      </div>

      {/* Image with Macro Overlay */}
      <div 
        className="relative aspect-video cursor-pointer"
        onClick={() => onImageClick(hack)}
      >
        <img src={hack.image} alt={hack.title} className="w-full h-full object-cover" />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1">
          <div className="bg-white/90 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm border border-emerald-100">
            <Flame size={12} className="text-orange-500" />
            <span className="text-xs font-bold text-slate-800">{hack.macros.cal}</span>
          </div>
          <div className="bg-white/90 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm border border-emerald-100">
            <Beef size={12} className="text-emerald-600" />
            <span className="text-xs font-bold text-slate-800">{hack.macros.p}g</span>
          </div>
        </div>
        <div className="absolute bottom-3 right-3 bg-emerald-600 text-white px-3 py-1 rounded-full text-[10px] font-black italic shadow-lg">
          {hack.verifications >= 10 ? 'VERIFIED GAINS' : 'TRUST ME BRO 👍'}
        </div>
      </div>

      {/* Post Content */}
      <div className="p-4">
        <h3 className="font-bold text-slate-800 mb-1">{hack.title}</h3>
        <p className="text-sm text-slate-500 leading-tight mb-4">{hack.description}</p>

        {/* Actions */}
        <div className="flex items-center justify-between border-t border-slate-50 pt-4">
          <div className="flex gap-4">
            <button
              onClick={() => onLike(hack.id)}
              className="flex items-center gap-1 text-slate-600 hover:text-rose-500 transition-colors"
            >
              <Heart size={18} className={hack.likes > 24 ? "fill-rose-500 text-rose-500" : ""} />
              <span className="text-xs font-bold">{hack.likes}</span>
            </button>
            <button
              onClick={() => onVerify(hack.id)}
              className="flex items-center gap-1 text-slate-600 hover:text-emerald-600 transition-colors"
            >
              <CheckCircle size={18} className={hack.verifications > 5 ? "text-emerald-500" : ""} />
              <span className="text-xs font-bold">{hack.verifications} logged</span>
            </button>
          </div>
          <button 
            onClick={() => onLog(hack)}
            className="bg-slate-800 hover:bg-slate-700 active:scale-95 transition-all text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1"
          >
            <Zap size={14} /> Log Meal
          </button>
        </div>
      </div>
    </div>
  );
};

export default HackCard;
