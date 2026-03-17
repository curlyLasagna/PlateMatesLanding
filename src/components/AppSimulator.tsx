import { useState, useMemo, useEffect } from 'react';
import { Camera, Search, Navigation, Flame, Beef, Zap, Plus, Utensils, History } from 'lucide-react';
import type { Hack, Tab, NutrientData, LoggedMeal } from './app/types';
import Header from './app/Header';
import HackCard from './app/HackCard';
import EntreeCard from './app/EntreeCard';
import PlateSummaryBar from './app/PlateSummaryBar';
import BottomNav from './app/BottomNav';
import MobileDeviceFrame from './MobileDeviceFrame';
import nutrientDataRaw from '../../nutrient_aggregation.json';

const PlateMatesApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('feed');
  const [loggedMeals, setLoggedMeals] = useState<LoggedMeal[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('plateMates_logs');
    if (saved) {
      try {
        setLoggedMeals(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load logs", e);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('plateMates_logs', JSON.stringify(loggedMeals));
  }, [loggedMeals]);

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
  const [showDiscovery, setShowDiscovery] = useState<boolean>(false);
  const [selectedEntrees, setSelectedEntrees] = useState<NutrientData[]>([]);

  const availableEntrees = nutrientDataRaw as NutrientData[];

  const dailyTotals = useMemo(() => {
    // Basic implementation: sum all logs from today
    const today = new Date().setHours(0, 0, 0, 0);
    return loggedMeals
      .filter(m => m.timestamp >= today)
      .reduce((acc, log) => ({
        cal: acc.cal + log.macros.cal,
        p: acc.p + log.macros.p,
        c: acc.c + log.macros.c,
        f: acc.f + log.macros.f
      }), { cal: 0, p: 0, c: 0, f: 0 });
  }, [loggedMeals]);

  const plateTotals = useMemo(() => {
    return selectedEntrees.reduce((acc, item) => ({
      cal: acc.cal + (item.nutrients.calories || 0),
      p: acc.p + (item.nutrients.protein || 0),
      c: acc.c + (item.nutrients.total_carbohydrates || 0),
      f: acc.f + (item.nutrients.total_fat || 0)
    }), { cal: 0, p: 0, c: 0, f: 0 });
  }, [selectedEntrees]);

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

  const handleLogMeal = (hack: Hack) => {
    const newLog: LoggedMeal = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      title: hack.title,
      macros: { ...hack.macros }
    };
    setLoggedMeals(prev => [newLog, ...prev]);
    // Small toast simulation
    alert(`Logged: ${hack.title}`);
  };

  const startScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setShowDiscovery(true);
    }, 2000);
  };

  const postPlate = () => {
    if (selectedEntrees.length === 0) return;

    const newHack: Hack = {
      id: Date.now(),
      user: "Me",
      location: "Glen Dining Hall",
      title: "My Custom Plate",
      description: selectedEntrees.map(e => e.name).join(", "),
      macros: {
        cal: Math.round(plateTotals.cal),
        p: Math.round(plateTotals.p),
        c: Math.round(plateTotals.c),
        f: Math.round(plateTotals.f)
      },
      likes: 0,
      verifications: 0,
      image: "https://images.unsplash.com/photo-1543353071-873f17a7a088?w=400&q=80"
    };

    setHacks([newHack, ...hacks]);
    setSelectedEntrees([]);
    setShowDiscovery(false);
    setActiveTab('feed');
  };

  const toggleEntree = (item: NutrientData) => {
    const isSelected = selectedEntrees.some(e => e.sku === item.sku);
    if (isSelected) {
      setSelectedEntrees(selectedEntrees.filter(e => e.sku !== item.sku));
    } else {
      setSelectedEntrees([...selectedEntrees, item]);
    }
  };

  const removeEntree = (sku: string) => {
    const newSelected = selectedEntrees.filter(e => e.sku !== sku);
    setSelectedEntrees(newSelected);
    if (newSelected.length === 0) {
      setActiveTab('scan');
    }
  };

  const isNavVisible = activeTab !== 'summary' && selectedEntrees.length === 0;

  return (
    <MobileDeviceFrame>
      <Header />

      {/* Main Content Area */}
      <main className={`flex-1 overflow-y-auto px-4 ${selectedEntrees.length > 0 ? 'pb-24' : 'pb-24'}`}>
        {activeTab === 'feed' && (
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-end mt-2">
              <h2 className="text-lg font-bold text-slate-800">Campus Secret Menu</h2>
              <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded">Latest Hacks</span>
            </div>

            {hacks.map((hack) => (
              <HackCard
                key={hack.id}
                hack={hack}
                onLike={handleLike}
                onVerify={handleVerify}
                onLog={handleLogMeal}
              />
            ))}
          </div>
        )}

        {activeTab === 'scan' && (
          <div className="h-full flex flex-col p-2">
            {!scanning && !showDiscovery && (
              <div className="h-full flex flex-col items-center justify-center text-center p-4">
                <div className="w-full aspect-square border-4 border-dashed border-emerald-200 rounded-3xl flex flex-col items-center justify-center mb-8 bg-emerald-50 relative overflow-hidden">
                  <Camera size={48} className="text-emerald-500 mb-4" />
                  <p className="text-xs text-emerald-600 max-w-[200px] mt-2 italic">
                    "Take a picture of your plate."
                  </p>
                </div>
                <button
                  onClick={startScan}
                  className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold shadow-xl shadow-emerald-200"
                >
                  Share a plate
                </button>
              </div>
            )}

            {scanning && (
              <div className="h-full flex flex-col items-center justify-center gap-4 text-center">
                <div className="w-24 h-24 border-8 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xl font-black text-slate-800 italic animate-pulse">PULLING TODAY'S MENU...</p>
                <p className="text-sm text-slate-500">Connecting to Glen Dining Hall database...</p>
              </div>
            )}

            {showDiscovery && (
              <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-center mb-2 px-1">
                  <h2 className="text-lg font-black text-slate-800 italic uppercase">Identified Items</h2>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">GLEN HALL</span>
                </div>

                <div className="flex flex-col gap-3">
                  {availableEntrees.map((item) => (
                    <EntreeCard
                      key={item.sku}
                      item={item}
                      isSelected={selectedEntrees.some(e => e.sku === item.sku)}
                      onAdd={toggleEntree}
                      onRemove={() => toggleEntree(item)}
                    />
                  ))}
                </div>

                {/* Summary Bar is now extracted */}
              </div>
            )}
          </div>
        )}

        {activeTab === 'summary' && (
          <div className="p-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center gap-2 mb-6">
              <button onClick={() => setActiveTab('scan')} className="text-slate-400 p-1 hover:text-slate-600 transition-colors">
                <Navigation className="-rotate-90" size={20} />
              </button>
              <h2 className="text-2xl font-black text-slate-800 uppercase italic">Review Plate</h2>
            </div>

            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white mb-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Utensils size={120} />
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Total Plate Nutrition</p>
              <h3 className="text-5xl font-black italic mb-6">{Math.round(plateTotals.cal)} <span className="text-xl text-emerald-500 not-italic">KCAL</span></h3>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-[10px] font-bold text-emerald-500 uppercase">Protein</p>
                  <p className="text-2xl font-black italic">{Math.round(plateTotals.p)}g</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-blue-400 uppercase">Carbs</p>
                  <p className="text-2xl font-black italic">{Math.round(plateTotals.c)}g</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-orange-400 uppercase">Fat</p>
                  <p className="text-2xl font-black italic">{Math.round(plateTotals.f)}g</p>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 px-2">Selected Items ({selectedEntrees.length})</h3>
              <div className="flex flex-col gap-3">
                {selectedEntrees.map(item => (
                  <div key={item.sku} className="bg-white border border-slate-100 p-4 rounded-3xl flex justify-between items-center shadow-sm">
                    <div className="flex-1">
                      <p className="font-bold text-slate-800 text-sm">{item.name}</p>
                      <p className="text-[10px] text-slate-400 font-medium uppercase">{item.nutrients.calories} kcal · {item.nutrients.protein}g P</p>
                    </div>
                    <button
                      onClick={() => removeEntree(item.sku)}
                      className="text-slate-300 hover:text-rose-500 p-2 transition-colors"
                    >
                      <Plus className="rotate-45" size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={postPlate}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-5 rounded-[2rem] font-black italic uppercase tracking-wider shadow-xl shadow-emerald-100 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Zap size={20} /> Post to Feed
              </button>
              <button
                onClick={() => setActiveTab('scan')}
                className="w-full bg-slate-50 text-slate-400 py-4 rounded-[2rem] font-bold text-sm uppercase tracking-widest transition-all"
              >
                Add More Items
              </button>
            </div>
          </div>
        )}


        {activeTab === 'stats' && (
          <div className="p-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter italic">Today's Macros</h2>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Live Update</span>
              </div>
            </div>

            {/* Real-time Stats Cards */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-slate-900 p-4 rounded-3xl text-white shadow-xl flex flex-col justify-between h-32">
                <div className="flex justify-between items-start">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Total Calories</p>
                  <Flame size={16} className="text-orange-400" />
                </div>
                <div>
                  <p className="text-3xl font-black italic">{Math.round(dailyTotals.cal)}</p>
                  <p className="text-[10px] font-bold text-emerald-500 uppercase mt-1">Goal: 2,500</p>
                </div>
              </div>
              <div className="bg-emerald-50 p-4 rounded-3xl border border-emerald-100 flex flex-col justify-between h-32">
                <div className="flex justify-between items-start">
                  <p className="text-[10px] font-bold text-emerald-600 uppercase">Protein</p>
                  <Beef size={16} className="text-emerald-600" />
                </div>
                <div>
                  <p className="text-3xl font-black text-emerald-800 italic">{Math.round(dailyTotals.p)}g</p>
                  <p className="text-[10px] font-bold text-emerald-600/60 uppercase mt-1">Goal: 160g</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-blue-50 p-4 rounded-3xl border border-blue-100">
                <p className="text-[10px] font-bold text-blue-600 uppercase">Carbs</p>
                <p className="text-2xl font-black text-blue-800 italic">{Math.round(dailyTotals.c)}g</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-3xl border border-orange-100">
                <p className="text-[10px] font-bold text-orange-600 uppercase">Fats</p>
                <p className="text-2xl font-black text-orange-800 italic">{Math.round(dailyTotals.f)}g</p>
              </div>
            </div>

            {/* History Log */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <History size={18} className="text-slate-400" />
                <h3 className="text-sm font-bold text-slate-800 uppercase">Recent Logs</h3>
              </div>
              <div className="flex flex-col gap-3">
                {loggedMeals.length === 0 ? (
                  <div className="p-8 border-2 border-dashed border-slate-100 rounded-3xl text-center">
                    <p className="text-xs text-slate-400 italic">No meals logged yet today.</p>
                  </div>
                ) : (
                  loggedMeals.slice(0, 5).map(log => (
                    <div key={log.id} className="bg-white border border-slate-100 p-3 rounded-2xl flex justify-between items-center shadow-sm">
                      <div>
                        <p className="text-xs font-bold text-slate-800">{log.title}</p>
                        <p className="text-[10px] text-slate-400">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-black text-emerald-600">+{log.macros.cal} kcal</p>
                        <p className="text-[10px] font-bold text-slate-400">{log.macros.p}P · {log.macros.c}C · {log.macros.f}F</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Social Rank Card */}
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

      {/* Navigation Layer */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isVisible={isNavVisible}
      />

      {/* Plate Summary Bar (Un-floating) */}
      {activeTab !== 'feed' && activeTab !== 'stats' && selectedEntrees.length > 0 && activeTab !== 'summary' && (
        <PlateSummaryBar
          totals={plateTotals}
          onPost={postPlate}
          onViewSummary={() => setActiveTab('summary')}
        />
      )}
    </MobileDeviceFrame>
  );
};

export default PlateMatesApp;
