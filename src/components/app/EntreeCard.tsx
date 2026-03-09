import { Flame, Beef, Zap, Plus, X } from 'lucide-react';
import type { NutrientData } from './types';

interface EntreeCardProps {
  item: NutrientData;
  isSelected: boolean;
  onAdd: (item: NutrientData) => void;
  onRemove: (sku: string) => void;
}

const EntreeCard: React.FC<EntreeCardProps> = ({ item, isSelected, onAdd, onRemove }) => {
  return (
    <div className={`p-4 rounded-2xl border transition-all ${isSelected ? 'border-emerald-500 bg-emerald-50 shadow-sm' : 'border-slate-100 bg-white'}`}>
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-bold text-slate-800 text-sm flex-1">{item.name}</h4>
        {isSelected ? (
          <button 
            onClick={() => onRemove(item.sku)}
            className="p-1 bg-rose-100 text-rose-600 rounded-lg"
          >
            <X size={16} />
          </button>
        ) : (
          <button 
            onClick={() => onAdd(item)}
            className="p-1 bg-emerald-100 text-emerald-600 rounded-lg"
          >
            <Plus size={16} />
          </button>
        )}
      </div>
      
      <div className="flex gap-3">
        <div className="flex items-center gap-1">
          <Flame size={12} className="text-orange-500" />
          <span className="text-[10px] font-bold text-slate-500">{Math.round(item.nutrients.calories)} kcal</span>
        </div>
        <div className="flex items-center gap-1">
          <Beef size={12} className="text-emerald-600" />
          <span className="text-[10px] font-bold text-slate-500">{Math.round(item.nutrients.protein)}g P</span>
        </div>
        <div className="flex items-center gap-1">
          <Zap size={12} className="text-blue-500" />
          <span className="text-[10px] font-bold text-slate-500">{Math.round(item.nutrients.total_carbohydrates)}g C</span>
        </div>
      </div>
    </div>
  );
};

export default EntreeCard;
