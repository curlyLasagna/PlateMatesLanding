import { useState } from 'react';
import {
  Camera,
  Flame,
  Beef,
  Search,
  MapPin,
  Heart,
  CheckCircle,
  Navigation,
  User,
  MoreHorizontal,
  Zap
} from 'lucide-react';

interface Macros {
  cal: number;
  p: number;
  c: number;
  f: number;
}

interface Hack {
  id: number;
  user: string;
  location: string;
  title: string;
  description: string;
  macros: Macros;
  likes: number;
  verifications: number;
  image: string;
}

type Tab = 'feed' | 'scan' | 'stats';

const PlateMatesApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('feed');
  const [hacks, setHacks] = useState<Hack[]>([
    {
      id: 1,
      user: "GymRat_Alex",
      location: "Glen Dining Hall",
      title: "The Sriracha Shred Bowl",
      description: "2 scoops white rice, 2 servings grilled chicken from salad bar, heavy Sriracha, 1 scoop chickpeas.",
      macros: { cal: 580, p: 42, c: 65, f: 12 },
      likes: 24,
      verifications: 8,
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80"
    },
    {
      id: 2,
      user: "VeganVibes",
      location: "West Village Dining Hall",
      title: "Mediterranean Remix",
      description: "Deli station hummus + whole wheat pita + roasted peppers from the pizza station.",
      macros: { cal: 340, p: 12, c: 45, f: 14 },
      likes: 15,
      verifications: 3,
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80"
    },
    {
      id: 3,
      user: "SoccerSara",
      location: "Newell Dining Hall",
      title: "Post-Practice Pasta Hack",
      description: "Penne marinara mixed with a side of hard-boiled eggs from the breakfast bar (trust me!).",
      macros: { cal: 620, p: 28, c: 80, f: 18 },
      likes: 42,
      verifications: 12,
      image: "https://images.unsplash.com/photo-1473093226795-af9932fe5856?w=400&q=80"
    }
  ]);

  const [scanning, setScanning] = useState<boolean>(false);

  const handleVerify = (id: number) => {
    setHacks(prevHacks => prevHacks.map(hack =>
      hack.id === id ? { ...hack, verifications: hack.verifications + 1 } : hack
    ));
  };

  const handleLike = (id: number) => {
    setHacks(prevHacks => prevHacks.map(hack =>
      hack.id === id ? { ...hack, likes: hack.likes + 1 } : hack
    ));
  };

  const simulateScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setActiveTab('feed');
    }, 3000);
  };

  return (
    <div className="flex items-center justify-center p-4 font-sans bg-transparent">
      {/* Mobile Device Frame */}
      <div className="relative w-full max-w-[390px] h-[750px] bg-white rounded-[3rem] shadow-2xl overflow-hidden border-[8px] border-slate-800 flex flex-col">

        {/* Status Bar */}
        <div className="h-10 bg-white flex justify-between items-center px-8 pt-4">
          <span className="text-xs font-bold text-slate-800">9:41</span>
        </div>

        {/* Top Header */}
        <header className="px-6 py-4 flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-black text-emerald-600 tracking-tighter italic">PLATEMATE</h1>
            <div className="bg-emerald-100 text-emerald-700 p-2 rounded-full">
              <User size={20} />
            </div>
          </div>
          <div className="flex items-center gap-2 text-slate-500 bg-slate-100 p-2 rounded-xl text-sm">
            <MapPin size={16} />
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto px-4 pb-24">
          {activeTab === 'feed' && (
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-end mt-2">
                <h2 className="text-lg font-bold text-slate-800">Campus Secret Menu</h2>
                <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded">Latest Hacks</span>
              </div>

              {hacks.map((hack) => (
                <div key={hack.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
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
                  <div className="relative aspect-video">
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
                          onClick={() => handleLike(hack.id)}
                          className="flex items-center gap-1 text-slate-600 hover:text-rose-500 transition-colors"
                        >
                          <Heart size={18} className={hack.likes > 24 ? "fill-rose-500 text-rose-500" : ""} />
                          <span className="text-xs font-bold">{hack.likes}</span>
                        </button>
                        <button
                          onClick={() => handleVerify(hack.id)}
                          className="flex items-center gap-1 text-slate-600 hover:text-emerald-600 transition-colors"
                        >
                          <CheckCircle size={18} className={hack.verifications > 5 ? "text-emerald-500" : ""} />
                          <span className="text-xs font-bold">{hack.verifications} verify</span>
                        </button>
                      </div>
                      <button className="bg-slate-800 text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1">
                        <Zap size={14} /> Log Meal
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'scan' && (
            <div className="h-full flex flex-col items-center justify-center p-6 text-center">
              {!scanning ? (
                <>
                  <div className="w-full aspect-square border-4 border-dashed border-emerald-200 rounded-3xl flex flex-col items-center justify-center mb-8 bg-emerald-50 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center opacity-20">
                      <Camera size={100} />
                    </div>
                    <Camera size={48} className="text-emerald-500 mb-4" />
                    <p className="font-bold text-emerald-800">Scan Your Plate</p>
                    <p className="text-xs text-emerald-600 max-w-[200px] mt-2 italic">
                      "AI Vision will estimate macros based on your campus location."
                    </p>
                  </div>
                  <button
                    onClick={simulateScan}
                    className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold shadow-xl shadow-emerald-200"
                  >
                    Start AI Analysis
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-24 h-24 border-8 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-xl font-black text-slate-800 italic animate-pulse">ANALYZING PORTIONS...</p>
                  <p className="text-sm text-slate-500">Cross-referencing North Dining Hall inventory...</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="p-4">
              <h2 className="text-2xl font-black text-slate-800 mb-6 uppercase tracking-tighter italic">Weekly Summary</h2>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-emerald-50 p-4 rounded-3xl border border-emerald-100">
                  <p className="text-[10px] font-bold text-emerald-600 uppercase">Avg Protein</p>
                  <p className="text-3xl font-black text-emerald-800 italic">142g</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-3xl border border-blue-100">
                  <p className="text-[10px] font-bold text-blue-600 uppercase">Meals Shared</p>
                  <p className="text-3xl font-black text-blue-800 italic">12</p>
                </div>
              </div>
              <div className="bg-slate-900 text-white p-6 rounded-[2rem] shadow-xl">
                <p className="text-sm font-medium mb-4">🏆 Ranked #4 Healthy Eater in <b>Pi Kappa Alpha</b></p>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[85%]"></div>
                </div>
                <p className="text-[10px] text-slate-400 mt-2 text-right uppercase font-bold">85% to Next Rank</p>
              </div>
            </div>
          )}
        </main>

        {/* Bottom Navigation */}
        <nav className="absolute bottom-0 w-full bg-white/80 backdrop-blur-md border-t border-slate-100 px-8 py-4 flex justify-between items-center z-20">
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
            className={`flex flex-col items-center gap-1 ${activeTab === 'stats' ? 'text-emerald-600' : 'text-slate-400'}`}
          >
            <Navigation size={22} />
            <span className="text-[10px] font-bold">Progress</span>
          </button>
        </nav>

        {/* Home Indicator */}
        <div className="absolute bottom-1 w-full flex justify-center">
          <div className="w-32 h-1 bg-slate-200 rounded-full"></div>
        </div>

      </div>
    </div>
  );
};

export default PlateMatesApp;
