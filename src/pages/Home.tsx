import React, { useState, useEffect } from 'react';
import { useApp } from '../store';
import { 
  Flame, 
  Star, 
  Gamepad2, 
  Volume2, 
  Heart,
  ShoppingBag,
  Wallet,
  RotateCw,
  ArrowUpCircle,
  ArrowDownCircle
} from 'lucide-react';
import { formatCurrency } from '../utils';

export function Home() {
  const { user, navigate, triggerSystemPopup, showToast, setIsLoading, gamesList } = useApp();
  const [activeCategory, setActiveCategory] = useState('Lottery');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const today = new Date().toDateString();
    const lastWelcome = localStorage.getItem('last_welcome_date');
    
    if (lastWelcome !== today) {
      triggerSystemPopup('WELCOME', 'Welcome to Jio Club! The most trusted platform for premium gaming. Enjoy fast withdrawals and 24/7 support. Good luck with your games!');
      localStorage.setItem('last_welcome_date', today);
    }
  }, [triggerSystemPopup]);

  const handleRefresh = () => {
    setRefreshing(true);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setRefreshing(false);
      showToast('Refresh successfully');
    }, 1000);
  };

  const categories = [
    { id: 'Hot', icon: <Flame size={24} />, label: 'Hot' },
    { id: 'Lottery', icon: <ShoppingBag size={24} />, label: 'Lottery' },
    { id: 'Slots', icon: <Gamepad2 size={24} />, label: 'Slots' },
    { id: 'Popular', icon: <Star size={24} />, label: 'Popular' },
  ];

  // Merge static games with dynamic ones from Admin
  const staticGames = [
    { 
      id: 'wingo', 
      name: 'WIN GO', 
      img: '🎰', 
      bg: 'bg-gradient-to-br from-[#FFD700] to-[#B8860B]', 
      iconColor: 'text-black text-6xl',
      url: 'wingo',
      tag: 'HOT',
      isRoute: true
    },
    { 
      id: 'aviator', 
      name: 'AVIATOR', 
      img: '✈️', 
      bg: 'bg-gradient-to-br from-[#2D1B22] to-[#1A1A24]', 
      iconColor: 'text-[#E11D48] text-6xl',
      tag: '10 SEC',
      bonus: '+500%'
    },
    { 
      id: 'vortex', 
      name: 'VORTEX', 
      img: '🌀', 
      bg: 'bg-gradient-to-br from-[#2A2D4E] to-[#1A1A24]', 
      iconColor: 'text-[#818CF8] text-6xl'
    },
    { 
      id: 'chicken', 
      name: 'CHICKEN ROAD 2', 
      img: '🍗', 
      bg: 'bg-gradient-to-br from-[#EF4444] to-[#991B1B]', 
      iconColor: 'text-white text-6xl shadow-inner'
    },
    { 
      id: 'mines', 
      name: 'MINES', 
      img: '💎', 
      bg: 'bg-gradient-to-br from-[#8B5CF6] to-[#4C1D95]', 
      iconColor: 'text-yellow-300 text-6xl'
    },
  ];

  const displayGames = [...staticGames];
  
  // Add dynamic games from Admin
  if (gamesList && gamesList.length > 0) {
    gamesList.forEach(g => {
      if (!displayGames.find(sg => sg.id === g.id)) {
        displayGames.push({
          ...g,
          bg: g.special ? 'bg-gradient-to-br from-blue-600 to-indigo-900' : 'bg-card-base',
          iconColor: 'text-white text-6xl'
        });
      }
    });
  }

  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1518623489648-a173ef7824f3?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1614294149010-950b698f72c0?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1642104704074-907c0698cbd9?q=80&w=800&auto=format&fit=crop"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="pb-24 bg-[#0d1117] min-h-screen text-white">
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#161b22] border-b border-white/5 shadow-md">
        <h1 className="text-2xl font-black italic tracking-tighter text-blue-500">JIO CLUB</h1>
      </div>

      {/* Main Banner - Carousel */}
      <div className="px-3 py-2">
        <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-900 shadow-xl border border-white/5">
          {slides.map((slide, idx) => (
            <img 
              key={idx}
              src={slide} 
              alt={`Slide ${idx + 1}`} 
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out ${
                idx === currentSlide ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
              }`}
            />
          ))}
          {/* Slide Indicators */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {slides.map((_, idx) => (
              <div 
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  idx === currentSlide ? 'w-6 bg-blue-500' : 'w-1.5 bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Announcement */}
      <div className="mx-3 my-2 bg-blue-500/5 border border-blue-500/10 rounded-full px-4 py-2.5 flex items-center gap-3 overflow-hidden">
        <Volume2 size={18} className="text-blue-500 shrink-0" />
        <div className="flex-1 overflow-hidden relative h-5">
           <p className="absolute text-sm font-bold text-gray-400 whitespace-nowrap animate-marquee">
             Welcome to JIO CLUB. The Most Trusted & Premium platform for your gaming experience. Daily bonuses and instant withdrawals!
           </p>
        </div>
      </div>

      {/* Wallet Section */}
      <div className="mx-3 mt-4 mb-2 p-3 bg-card-base border border-primary/20 rounded-2xl shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-yellow-500/10 p-2 rounded-xl shrink-0">
            <Wallet size={18} className="text-yellow-500" />
          </div>
          <div>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Balance</p>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black tracking-tight">{formatCurrency(user.totalBalance)}</span>
              <button 
                onClick={handleRefresh}
                className={`p-1 rounded-lg bg-white/5 hover:bg-white/10 transition-colors ${refreshing ? 'animate-spin' : ''}`}
              >
                <RotateCw size={12} className="text-gray-400" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => navigate('deposit')}
            className="flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-xl font-black text-[10px] uppercase tracking-wider active:scale-95 transition-all shadow-lg shadow-blue-900/40"
          >
            <ArrowDownCircle size={14} /> Deposit
          </button>
          <button 
            onClick={() => navigate('withdraw')}
            className="flex items-center justify-center gap-1.5 bg-sky-600 hover:bg-sky-500 text-white px-3 py-2 rounded-xl font-black text-[10px] uppercase tracking-wider active:scale-95 transition-all shadow-lg shadow-sky-900/40"
          >
            <ArrowUpCircle size={14} /> Withdraw
          </button>
        </div>
      </div>

      {/* Main Content Area (Sidebar + Grid) */}
      <div className="flex p-3 gap-3">
        {/* Sidebar categories */}
        <div className="w-20 space-y-3 shrink-0">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`w-full flex flex-col items-center justify-center p-3 rounded-2xl border transition-all h-[84px] shadow-sm ${
                activeCategory === cat.id 
                ? 'bg-primary/10 border-primary text-primary' 
                : 'bg-white/5 border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              <div className={`${activeCategory === cat.id ? 'text-primary' : 'text-gray-600'} mb-1.5`}>
                {cat.icon}
              </div>
              <span className="text-[10px] font-black uppercase tracking-tight leading-none">{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Game Grid */}
        <div className="flex-1 grid grid-cols-2 gap-3 pb-4">
          {displayGames.map((game) => (
            <div 
              key={game.id} 
              className={`relative aspect-[4/5.2] rounded-[32px] overflow-hidden shadow-xl active:scale-95 transition-transform group cursor-pointer ${game.bg} border border-white/5`}
              onClick={() => {
                if (game.url === 'wingo' || game.isRoute) {
                  navigate('wingo');
                } else if (game.url && game.url.startsWith('http')) {
                  window.open(game.url, '_blank');
                } else {
                  showToast(`${game.name} is coming soon!`);
                }
              }}
            >
              {/* Heart Icon */}
              <button className="absolute top-4 right-4 text-white/10 hover:text-red-500 z-10 transition-colors">
                <Heart size={18} />
              </button>

              {/* Tag */}
              {game.tag && (
                <div className={`absolute top-0 left-0 ${game.id === 'wingo' ? 'bg-black text-yellow-400' : 'bg-[#E11D48] text-white'} text-[9px] font-black px-2.5 py-1.5 rounded-br-2xl rounded-tl-xl shadow-lg uppercase tracking-tight z-10`}>
                  {game.tag}
                </div>
              )}

              {/* Content Center */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                <div className={`${game.iconColor} drop-shadow-[0_0_15px_rgba(0,0,0,0.5)] transform transition-transform duration-300 select-none group-active:scale-90 group-hover:scale-105`}>
                  {game.img && game.img.startsWith('http') ? (
                    <img src={game.img} alt={game.name} className="w-16 h-16 object-contain" />
                  ) : (
                    <span>{game.img}</span>
                  )}
                </div>
                
                <div className="mt-6 text-center">
                  <h3 className={`text-sm font-black italic tracking-tighter uppercase transition-colors ${game.id === 'wingo' ? 'text-black group-hover:text-white' : 'text-white group-hover:text-yellow-400'}`}>
                    {game.name}
                  </h3>
                  {game.bonus && (
                    <p className="text-[#FBBF24] text-[10px] font-black mt-1 tracking-widest">{game.bonus}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-150%); }
        }
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 3s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}

