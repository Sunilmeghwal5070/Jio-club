import React, { useState, useEffect } from 'react';
import { useApp } from '../store';
import { Flame, Star, Trophy, Gamepad2, Coins, Dices, Sailboat, Bell, ArrowRight, Wallet, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { formatCurrency } from '../utils';

const notifications = [
  "Please note that live chat is no longer available. Kindly do not save our link.",
  "Withdrawal processing times are faster now. Minimum ₹100 limit.",
  "Deposit bonus available on your first transaction this week!",
  "VIP status gets you weekly cashback rewards. Check details."
];

function NotificationMarquee() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % notifications.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="overflow-hidden flex-1 relative h-5">
      {notifications.map((text, i) => (
        <p
          key={i}
          className={`absolute text-sm text-yellow-50/90 whitespace-nowrap transition-all duration-500 ease-in-out left-0
            ${i === index ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}
        >
          {text}
        </p>
      ))}
    </div>
  );
}

export function Home() {
  const { user, setUser, navigate, setIsLoading, showToast, unreadNotifications } = useApp();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setRefreshing(false);
      showToast('Refresh successfully');
    }, 1000);
  };

  return (
    <div className="pb-24">
      {/* Header Area */}
      <div className="px-4 py-3 flex items-center justify-between sticky top-0 z-40 bg-[#151515] shadow-lg border-b border-white/5 transition-colors">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-black border-2 border-[#D4AF37] bg-gradient-to-r from-[#E8E8E8] to-[#D4AF37]">
            JC
          </div>
          <span className="text-xl font-bold tracking-tight text-gradient">JIO CLUB</span>
        </div>
        <div className="flex items-center gap-3">
          <button 
             onClick={() => navigate('notification')}
             className="relative p-2 bg-white/5 rounded-full hover:bg-white/10"
          >
             {unreadNotifications > 0 && <span className="absolute top-1.5 right-2 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse border-2 border-[#151515]"></span>}
             <Bell size={20} className="text-gray-300" />
          </button>
        </div>
      </div>

      {/* Marquee Banner */}
      <div className="px-4 py-2">
        <div className="bg-gradient-gold p-[1px] rounded-xl">
          <div className="bg-[#1a1a1a] rounded-xl p-2.5 flex items-center gap-3 shadow-inner">
            <Bell size={18} className="text-primary shrink-0" />
            <NotificationMarquee />
            <button onClick={() => navigate('notification')} className="bg-primary hover:bg-primary-dark text-black text-xs font-semibold px-3 py-1 rounded-full shrink-0 shadow-sm">
              Detail
            </button>
          </div>
        </div>
      </div>

      {/* Wallet Actions Banner */}
      <div className="px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wallet size={16} className="text-primary" />
          <span className="text-sm text-gray-300">Wallet balance</span>
        </div>
      </div>
      <div className="px-4 flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="text-2xl font-bold">{formatCurrency(user.totalBalance)}</div>
          <button onClick={handleRefresh} className={`p-1 ${refreshing ? 'text-primary animate-spin-once' : 'text-gray-400 hover:text-white'}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 11-9-9c2.52 0 4.93 1 6.74 2.74L21 8"></path><path d="M21 3v5h-5"></path></svg>
          </button>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => navigate('withdraw')}
            className="flex items-center gap-1 bg-[#32D74B] text-white px-4 py-1.5 rounded-lg text-sm font-semibold"
          >
            <ArrowUpCircle size={16} /> Withdraw
          </button>
          <button 
            onClick={() => navigate('deposit')}
            className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-semibold"
          >
            <ArrowDownCircle size={16} /> Deposit
          </button>
        </div>
      </div>

      {/* Platform Recommendations */}
      <div className="px-4 mb-2">
        <div className="flex items-center gap-2 text-primary font-medium mb-3">
          <div className="w-1 h-4 bg-primary rounded-full"></div>
          Platform recommendation
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          {/* Card 1 */}
          <div onClick={() => navigate('wingo')} className="bg-red-500 rounded-xl overflow-hidden relative h-36 flex flex-col justify-between cursor-pointer active:scale-95 transition-transform">
            <div className="p-2 z-10 relative">
              <div className="bg-white/90 text-red-600 text-[10px] font-black px-1.5 py-0.5 rounded-full inline-block">5</div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center opacity-80 pointer-events-none text-6xl">💰</div>
            <div className="z-10 glass-panel p-1.5 text-center border-0 border-t border-white/10">
              <div className="text-xs font-black text-white">WINGO</div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-rose-700 rounded-xl overflow-hidden relative h-36 flex flex-col justify-center">
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-white/50">
               <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.2-1.1.6L2.5 9l5.4 3.1L4.7 15.3 2 15l-1 1 3.5 3.5c.3.3.7.3 1 0L9 16l4.2 4.2c.4.4.8.4 1.1 0l3.5-3.5z"/></svg>
             </div>
             <div className="absolute inset-x-0 bottom-0 glass-panel p-1.5 text-center z-10 border-0 border-t border-white/10">
              <div className="text-xs font-black text-white">AVIATOR</div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-orange-600 rounded-xl overflow-hidden relative h-36 flex flex-col justify-end">
            <div className="absolute top-2 left-1/2 -translate-x-1/2 text-4xl">🐔</div>
            <div className="z-10 glass-panel p-1.5 text-center border-0 border-t border-white/10">
              <div className="text-[10px] font-black text-white leading-tight">CHICKEN<br/>ROAD 2</div>
            </div>
          </div>
          
          {/* Card 4 */}
          <div className="bg-green-400 rounded-xl overflow-hidden relative h-36 flex flex-col justify-end mt-2">
            <div className="absolute top-2 text-2xl font-black text-white/30 rotate-12 w-full text-center">CRICKET</div>
          </div>
          {/* Card 5 */}
          <div className="bg-yellow-800 rounded-xl overflow-hidden relative h-36 flex flex-col justify-end mt-2">
             <div className="absolute top-3 inset-0 flex justify-center text-4xl">🪖</div>
             <div className="absolute bottom-2 right-2 bg-yellow-600 text-[8px] px-1 rounded">1MIN</div>
             <div className="z-10 text-center font-black text-white text-xl bottom-2 relative">PUBG</div>
          </div>
          {/* Card 6 */}
          <div className="bg-indigo-900 rounded-xl overflow-hidden relative h-36 flex flex-col justify-end mt-2">
             <div className="absolute outline-dashed rounded-full w-24 h-24 top-2 -right-4 border-indigo-400/50 block"></div>
             <div className="absolute outline-dashed rounded-full w-16 h-16 top-6 right-0 border-pink-400/50 block"></div>
          </div>

        </div>
      </div>
    </div>
  );
}
