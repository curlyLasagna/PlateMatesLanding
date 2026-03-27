import { User, MapPin } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="px-6 py-4 flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-black text-emerald-600 tracking-tighter italic">PLATEMATES</h1>
        <div className="bg-emerald-100 text-emerald-700 p-2 rounded-full">
          <User size={20} />
        </div>
      </div>
      <div className="flex items-center gap-2 text-slate-500 bg-slate-100 p-2 rounded-xl text-sm">
        <MapPin size={16} />
      </div>
    </header>
  );
};

export default Header;
