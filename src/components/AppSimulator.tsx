import { useState, useMemo, useEffect } from 'react';
import { Camera, Navigation, Flame, Beef, Zap, Plus, Utensils, History, SlidersHorizontal, X } from 'lucide-react';
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
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterValues, setFilterValues] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0 });
  const [appliedFilters, setAppliedFilters] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0 });
  const [selectedHack, setSelectedHack] = useState<Hack | null>(null);

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
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80",
      items: [
        { name: "White Rice (2 scoops)", macros: { cal: 200, p: 4, c: 44, f: 0 } },
        { name: "Grilled Chicken (2 servings)", macros: { cal: 220, p: 32, c: 0, f: 6 } },
        { name: "Sriracha", macros: { cal: 10, p: 0, c: 2, f: 0 } },
        { name: "Chickpeas (1 scoop)", macros: { cal: 150, p: 6, c: 19, f: 6 } }
      ]
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
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80",
      items: [
        { name: "Hummus", macros: { cal: 140, p: 6, c: 12, f: 8 } },
        { name: "Whole Wheat Pita", macros: { cal: 150, p: 5, c: 28, f: 2 } },
        { name: "Roasted Peppers", macros: { cal: 50, p: 1, c: 5, f: 4 } }
      ]
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
      image: "https://images.unsplash.com/photo-1473093226795-af9932fe5856?w=400&q=80",
      items: [
        { name: "Penne Marinara", macros: { cal: 450, p: 14, c: 75, f: 10 } },
        { name: "Hard-boiled Eggs (2)", macros: { cal: 170, p: 14, c: 5, f: 8 } }
      ]
    },
    {
      id: 4,
      user: "BulkSeason_Mike",
      location: "Glen Dining Hall",
      title: "The Mass Monster",
      description: "Double burger patties, extra cheese, side of mashed potatoes, and a banana for dessert.",
      macros: { cal: 920, p: 52, c: 70, f: 48 },
      likes: 31,
      verifications: 9,
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
      items: [
        { name: "Burger Patties (2)", macros: { cal: 400, p: 36, c: 0, f: 28 } },
        { name: "Extra Cheese", macros: { cal: 120, p: 7, c: 1, f: 10 } },
        { name: "Mashed Potatoes", macros: { cal: 280, p: 5, c: 42, f: 8 } },
        { name: "Banana", macros: { cal: 120, p: 4, c: 27, f: 2 } }
      ]
    },
    {
      id: 5,
      user: "LeanQueen_Jess",
      location: "West Village Dining Hall",
      title: "Egg White Power Bowl",
      description: "Egg whites from omelette station + spinach + turkey bacon + salsa. Zero carb gains!",
      macros: { cal: 280, p: 38, c: 8, f: 10 },
      likes: 56,
      verifications: 15,
      image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&q=80",
      items: [
        { name: "Egg Whites", macros: { cal: 100, p: 22, c: 0, f: 0 } },
        { name: "Spinach", macros: { cal: 20, p: 2, c: 3, f: 0 } },
        { name: "Turkey Bacon", macros: { cal: 120, p: 12, c: 2, f: 8 } },
        { name: "Salsa", macros: { cal: 40, p: 2, c: 3, f: 2 } }
      ]
    },
    {
      id: 6,
      user: "CarboLoad_Chris",
      location: "Newell Dining Hall",
      title: "Pre-Game Fuel Stack",
      description: "Oatmeal base + banana slices + honey drizzle + peanut butter from the toast station.",
      macros: { cal: 650, p: 18, c: 95, f: 22 },
      likes: 38,
      verifications: 11,
      image: "https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=400&q=80",
      items: [
        { name: "Oatmeal", macros: { cal: 300, p: 10, c: 54, f: 6 } },
        { name: "Banana Slices", macros: { cal: 100, p: 1, c: 26, f: 0 } },
        { name: "Honey Drizzle", macros: { cal: 60, p: 0, c: 17, f: 0 } },
        { name: "Peanut Butter", macros: { cal: 190, p: 7, c: 8, f: 16 } }
      ]
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
    }, 1000);
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
      image: "https://images.unsplash.com/photo-1543353071-873f17a7a088?w=400&q=80",
      items: selectedEntrees.map(e => ({
        name: e.name,
        macros: {
          cal: e.nutrients.calories || 0,
          p: e.nutrients.protein || 0,
          c: e.nutrients.total_carbohydrates || 0,
          f: e.nutrients.total_fat || 0
        }
      }))
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

  const filteredHacks = useMemo(() => {
    const hasFilters = appliedFilters.calories > 0 || appliedFilters.protein > 0 || appliedFilters.carbs > 0 || appliedFilters.fat > 0;
    if (!hasFilters) return hacks;
    return hacks.filter(hack => 
      hack.macros.cal >= appliedFilters.calories &&
      hack.macros.p >= appliedFilters.protein &&
      hack.macros.c >= appliedFilters.carbs &&
      hack.macros.f >= appliedFilters.fat
    );
  }, [hacks, appliedFilters]);

  const hasActiveFilters = appliedFilters.calories > 0 || appliedFilters.protein > 0 || appliedFilters.carbs > 0 || appliedFilters.fat > 0;

  const handleApplyFilters = () => {
    setAppliedFilters({ ...filterValues });
    setShowFilterModal(false);
  };

  const handleResetFilters = () => {
    setFilterValues({ calories: 0, protein: 0, carbs: 0, fat: 0 });
    setAppliedFilters({ calories: 0, protein: 0, carbs: 0, fat: 0 });
  };

  return (
    <MobileDeviceFrame>
      <Header />

      {/* Main Content Area */}
      <main className={`flex-1 overflow-y-auto px-4 ${selectedEntrees.length > 0 ? 'pb-24' : 'pb-24'}`}>
        {activeTab === 'feed' && (
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center mt-2">
              <h2 className="text-lg font-bold text-slate-800">Campus Secret Menu</h2>
              <button
                onClick={() => {
                  setFilterValues({ ...appliedFilters });
                  setShowFilterModal(true);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${hasActiveFilters ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'}`}
              >
                <SlidersHorizontal size={14} />
                Filter
                {hasActiveFilters && <span className="bg-white text-emerald-600 rounded-full w-4 h-4 flex items-center justify-center text-[10px]">{Object.values(appliedFilters).filter(v => v > 0).length}</span>}
              </button>
            </div>

            {filteredHacks.length === 0 ? (
              <div className="p-8 border-2 border-dashed border-slate-100 rounded-3xl text-center">
                <p className="text-sm text-slate-400 italic">No hacks match your filters.</p>
                <button onClick={handleResetFilters} className="text-emerald-600 text-xs font-bold mt-2">Reset Filters</button>
              </div>
            ) : (
              filteredHacks.map((hack) => (
                <HackCard
                  key={hack.id}
                  hack={hack}
                  onLike={handleLike}
                  onVerify={handleVerify}
                  onLog={handleLogMeal}
                  onImageClick={setSelectedHack}
                />
              ))
            )}
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
                  <h2 className="text-lg font-black text-slate-800 italic uppercase">Items</h2>
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
      {isNavVisible && (
        <BottomNav
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isVisible={isNavVisible}
        />
      )}

      {/* Plate Summary Bar (Un-floating) */}
      {activeTab !== 'feed' && activeTab !== 'stats' && selectedEntrees.length > 0 && activeTab !== 'summary' && (
        <PlateSummaryBar
          totals={plateTotals}
          onPost={postPlate}
          onViewSummary={() => setActiveTab('summary')}
        />
      )}

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="absolute inset-0 bg-black/50 z-50 flex items-end animate-in fade-in duration-200">
          <div className="bg-white w-full rounded-t-3xl p-6 animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black text-slate-800 uppercase italic">Filter by Macros</h3>
              <button onClick={() => setShowFilterModal(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Calories Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-600 uppercase">Min Calories</span>
                  <span className="text-sm font-black text-slate-800">{filterValues.calories}+</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="50"
                  value={filterValues.calories}
                  onChange={(e) => setFilterValues({ ...filterValues, calories: Number(e.target.value) })}
                  className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-slate-600"
                />
              </div>

              {/* Protein Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-emerald-600 uppercase">Min Protein</span>
                  <span className="text-sm font-black text-slate-800">{filterValues.protein}g+</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="60"
                  value={filterValues.protein}
                  onChange={(e) => setFilterValues({ ...filterValues, protein: Number(e.target.value) })}
                  className="w-full h-2 bg-emerald-100 rounded-full appearance-none cursor-pointer accent-emerald-600"
                />
              </div>

              {/* Carbs Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-blue-600 uppercase">Min Carbs</span>
                  <span className="text-sm font-black text-slate-800">{filterValues.carbs}g+</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={filterValues.carbs}
                  onChange={(e) => setFilterValues({ ...filterValues, carbs: Number(e.target.value) })}
                  className="w-full h-2 bg-blue-100 rounded-full appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              {/* Fat Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-orange-600 uppercase">Min Fat</span>
                  <span className="text-sm font-black text-slate-800">{filterValues.fat}g+</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={filterValues.fat}
                  onChange={(e) => setFilterValues({ ...filterValues, fat: Number(e.target.value) })}
                  className="w-full h-2 bg-orange-100 rounded-full appearance-none cursor-pointer accent-orange-600"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={handleResetFilters}
                className="flex-1 py-3 rounded-2xl font-bold text-sm text-slate-500 bg-slate-100"
              >
                Reset
              </button>
              <button
                onClick={handleApplyFilters}
                className="flex-1 py-3 rounded-2xl font-bold text-sm text-white bg-emerald-600"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hack Detail Modal */}
      {selectedHack && (
        <div className="absolute inset-0 bg-black/50 z-50 flex items-end animate-in fade-in duration-200">
          <div className="bg-white w-full h-[100%] rounded-t-3xl overflow-hidden animate-in slide-in-from-bottom duration-300 flex flex-col">
            {/* Header with close button */}
            <div className="flex justify-between items-center p-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
                  {selectedHack.user[0]}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">@{selectedHack.user}</p>
                  <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{selectedHack.location}</p>
                </div>
              </div>
              <button onClick={() => setSelectedHack(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X size={20} />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto">
              {/* Image */}
              <div className="aspect-video w-full">
                <img src={selectedHack.image} alt={selectedHack.title} className="w-full h-full object-cover" />
              </div>

              <div className="p-4">
                {/* Title & Description */}
                <h3 className="text-xl font-black text-slate-800 italic mb-2">{selectedHack.title}</h3>
                <p className="text-sm text-slate-500 mb-4">{selectedHack.description}</p>

                {/* Total Macros Card */}
                <div className="bg-slate-900 rounded-2xl p-4 mb-4">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Total Nutrition</p>
                  <div className="grid grid-cols-4 gap-2">
                    <div className="text-center">
                      <p className="text-lg font-black text-white">{Math.round(selectedHack.macros.cal)}</p>
                      <p className="text-[10px] text-slate-400 uppercase">Cal</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-black text-emerald-400">{Math.round(selectedHack.macros.p)}g</p>
                      <p className="text-[10px] text-emerald-400 uppercase">Protein</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-black text-blue-400">{Math.round(selectedHack.macros.c)}g</p>
                      <p className="text-[10px] text-blue-400 uppercase">Carbs</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-black text-orange-400">{Math.round(selectedHack.macros.f)}g</p>
                      <p className="text-[10px] text-orange-400 uppercase">Fat</p>
                    </div>
                  </div>
                </div>

                {/* Items List */}
                <div className="mb-4">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Items ({selectedHack.items.length})</p>
                  <div className="space-y-2">
                    {selectedHack.items.map((item, index) => (
                      <div key={index} className="bg-slate-50 rounded-xl p-3 flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-800">{item.name}</span>
                        <div className="flex gap-3 text-[10px] font-bold">
                          <span className="text-slate-500">{Math.round(item.macros.cal)} cal</span>
                          <span className="text-emerald-600">{Math.round(item.macros.p)}P</span>
                          <span className="text-blue-600">{Math.round(item.macros.c)}C</span>
                          <span className="text-orange-600">{Math.round(item.macros.f)}F</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="flex gap-4 mb-4">
                  <div className="flex items-center gap-1 text-slate-500">
                    <span className="text-sm">❤️</span>
                    <span className="text-xs font-bold">{selectedHack.likes} likes</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-500">
                    <span className="text-sm">✓</span>
                    <span className="text-xs font-bold">{selectedHack.verifications} logged</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Action */}
            <div className="p-4 border-t border-slate-100">
              <button
                onClick={() => {
                  handleLogMeal(selectedHack);
                  setSelectedHack(null);
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2"
              >
                <Zap size={16} /> Log This Meal
              </button>
            </div>
          </div>
        </div>
      )}
    </MobileDeviceFrame>
  );
};

export default PlateMatesApp;
