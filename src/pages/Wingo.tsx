import React, { useState, useEffect, useRef } from 'react';
import { useApp, getVipDetails } from '../store';
import { Header } from '../components/Header';
import { Clock, BookOpen, Volume2, RefreshCw } from 'lucide-react';
import { rtdb } from '../firebase';
import { ref, set, update } from 'firebase/database';

import { formatCurrency } from '../utils';

// Optimized sub-components for Wingo performance
const HistoryTable = React.memo(({ historyData, historyPage, setHistoryPage }: { 
  historyData: any[], 
  historyPage: number, 
  setHistoryPage: React.Dispatch<React.SetStateAction<number>> 
}) => {
  const pageSize = 10;
  const currentData = React.useMemo(() => 
    historyData.slice((historyPage - 1) * pageSize, historyPage * pageSize),
    [historyData, historyPage]
  );

  return (
    <div className="bg-gradient-card rounded-[24px] overflow-hidden shadow-2xl mb-4">
      <div className="grid grid-cols-5 bg-white/10 backdrop-blur-md text-white text-[11px] uppercase tracking-wider font-bold py-3 px-2 text-center border-b border-white/10">
        <div className="col-span-2 text-left pl-3">Period</div>
        <div>Number</div>
        <div>Size</div>
        <div>Color</div>
      </div>
      <div className="flex flex-col">
        {currentData.map((row, i) => (
          <div key={row.period} className={`grid grid-cols-5 py-3 px-2 text-center items-center text-sm ${i !== 9 ? 'border-b border-white/5' : ''}`}>
            <div className="col-span-2 text-left pl-3 font-mono text-gray-300 tracking-tight text-xs">{row.period}</div>
            <div className={`font-black text-xl drop-shadow-md ${row.num % 2 === 0 ? 'text-[#FF453A]' : 'text-emerald-500'}`}>{row.num}</div>
            <div className="text-gray-200 font-medium text-xs">{row.size}</div>
            <div className="flex justify-center">
              {row.color.includes('split') ? (
                <div className="flex gap-0.5">
                  <span className={`w-3 h-3 rounded-full shadow-sm ${row.color.includes('red') ? 'bg-[#FF453A]' : 'bg-emerald-500'}`}></span>
                  <span className="w-3 h-3 rounded-full bg-purple-500 shadow-sm"></span>
                </div>
              ) : (
                <span className={`w-3 h-3 rounded-full shadow-sm ${row.color === 'red' ? 'bg-[#FF453A]' : 'bg-emerald-500'}`}></span>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex items-center justify-center gap-4 py-3 bg-black/20 border-t border-white/5">
         <button 
            onClick={() => setHistoryPage(p => Math.max(1, p - 1))}
            disabled={historyPage === 1}
            className="w-8 h-8 rounded bg-white/5 flex items-center justify-center disabled:opacity-30"
         >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
         </button>
         <span className="text-sm font-medium text-gray-400">{historyPage}/{Math.ceil(historyData.length / pageSize)}</span>
         <button 
            onClick={() => setHistoryPage(p => Math.min(Math.ceil(historyData.length / pageSize), p + 1))}
            disabled={historyPage >= Math.ceil(historyData.length / pageSize)}
            className="w-8 h-8 rounded bg-blue-500 text-white flex items-center justify-center disabled:opacity-50"
         >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
         </button>
      </div>
    </div>
  );
});

// Timer component to prevent re-rendering the whole Wingo component every second
const CountdownDisplay = React.memo(({ duration, now }: { duration: number, now: number }) => {
  const getRemainingTime = (timestamp: number, durationSeconds: number) => {
    const startOfDay = new Date(timestamp).setHours(0,0,0,0);
    const msPassed = timestamp - startOfDay;
    const durationMs = durationSeconds * 1000;
    const currentPeriodStartMs = Math.floor(msPassed / durationMs) * durationMs;
    const currentPeriodEndMs = currentPeriodStartMs + durationMs;
    return Math.max(0, Math.ceil((startOfDay + currentPeriodEndMs - timestamp) / 1000));
  };

  const timeLeft = getRemainingTime(now, duration);

  return (
    <div className="flex items-center gap-1 mb-2 justify-end">
      <div className="w-8 h-9 bg-card-base border border-white/10 rounded-lg flex items-center justify-center text-2xl font-bold font-mono text-emerald-500">0</div>
      <div className="w-8 h-9 bg-card-base border border-white/10 rounded-lg flex items-center justify-center text-2xl font-bold font-mono text-emerald-500">{Math.floor(timeLeft / 60)}</div>
      <div className="font-bold pb-1 text-emerald-500">:</div>
      <div className={`w-8 h-9 bg-card-base border border-white/10 rounded-lg flex items-center justify-center text-2xl font-bold font-mono ${timeLeft <= 5 ? 'text-red-500' : 'text-emerald-500'}`}>
        {Math.floor((timeLeft % 60) / 10)}
      </div>
      <div className={`w-8 h-9 bg-card-base border border-white/10 rounded-lg flex items-center justify-center text-2xl font-bold font-mono ${timeLeft <= 5 ? 'text-red-500' : 'text-emerald-500'}`}>
        {timeLeft % 10}
      </div>
    </div>
  );
});

// Large timer overlay for last 5 seconds
const TimerOverlay = React.memo(({ timeLeft }: { timeLeft: number }) => {
  if (timeLeft > 5) return null;
  return (
    <div className="absolute inset-0 z-20 bg-black/60 backdrop-blur-sm rounded-2xl flex items-center justify-center gap-4 animate-fade-in">
        <div className="w-24 h-36 bg-card-base border-2 border-white/20 rounded-xl flex items-center justify-center text-[100px] font-bold text-[#F9D423] shadow-2xl">
          {Math.floor((timeLeft % 60) / 10)}
        </div>
        <div className="w-24 h-36 bg-card-base border-2 border-white/20 rounded-xl flex items-center justify-center text-[100px] font-bold text-[#F9D423] shadow-2xl">
          {timeLeft % 10}
        </div>
    </div>
  );
});

export function Wingo() {
  const { user, setUser, showToast, navigate, myBets, setMyBets } = useApp();
  const [activeTab, setActiveTab] = useState('1min');
  const [historyTab, setHistoryTab] = useState('history');
  const [multiplier, setMultiplier] = useState(1);
  const [now, setNow] = useState(Date.now());
  const [historyPage, setHistoryPage] = useState(1);
  const [betPopupData, setBetPopupData] = useState<{type: string | number, colorType: string} | null>(null);
  const [betAmountIndex, setBetAmountIndex] = useState(0);
  const [betQuantity, setBetQuantity] = useState(1);
  const betAmounts = [1, 10, 100, 1000];
  const [winPopup, setWinPopup] = useState<any>(null);
  const shownWinIds = useRef<Set<string>>(new Set());
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      showToast('Refresh successfully');
    }, 1000);
  };

  const tabs = [
    { id: '30sec', label: 'WinGo', sub: '30sec' },
    { id: '1min', label: 'WinGo', sub: '1 Min' },
    { id: '3min', label: 'WinGo', sub: '3 Min' },
    { id: '5min', label: 'WinGo', sub: '5 Min' },
  ];

  const balls = [
    { num: 0, color: 'split-red-purple' },
    { num: 1, color: 'green' },
    { num: 2, color: 'red' },
    { num: 3, color: 'green' },
    { num: 4, color: 'red' },
    { num: 5, color: 'split-green-purple' },
    { num: 6, color: 'red' },
    { num: 7, color: 'green' },
    { num: 8, color: 'red' },
    { num: 9, color: 'green' },
  ];

  const tabDurations: Record<string, number> = {
    '30sec': 30,
    '1min': 60,
    '3min': 180,
    '5min': 300
  };

  const currentDuration = tabDurations[activeTab] || 60;
  
  const getPeriodId = (timestamp: number, durationSeconds: number, offset = 0) => {
    const date = new Date(timestamp);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    
    const startOfDay = new Date(date).setHours(0,0,0,0);
    const msPassed = timestamp - startOfDay;
    const periodsPassed = Math.floor(msPassed / (durationSeconds * 1000));
    const tabCode = durationSeconds === 30 ? 100 : (durationSeconds === 60 ? 101 : (durationSeconds === 180 ? 103 : 105));
    
    return `${yyyy}${mm}${dd}${tabCode}${String(10000 + periodsPassed + offset)}`;
  };

  const getRemainingTime = (timestamp: number, durationSeconds: number) => {
    const startOfDay = new Date(timestamp).setHours(0,0,0,0);
    const msPassed = timestamp - startOfDay;
    const durationMs = durationSeconds * 1000;
    const currentPeriodStartMs = Math.floor(msPassed / durationMs) * durationMs;
    const currentPeriodEndMs = currentPeriodStartMs + durationMs;
    return Math.max(0, Math.ceil((startOfDay + currentPeriodEndMs - timestamp) / 1000));
  };

  const currentPeriod = getPeriodId(now, currentDuration);
  const timeLeft = getRemainingTime(now, currentDuration);

  const getResultForPeriod = React.useCallback((periodStr: string) => {
    let hash = 0;
    for (let i = 0; i < periodStr.length; i++) {
        hash = Math.imul(31, hash) + periodStr.charCodeAt(i) | 0;
    }
    const num = Math.abs(hash) % 10;
    const size = num >= 5 ? 'Big' : 'Small';
    let color = 'red';
    if (num === 0) color = 'split-red-purple';
    else if (num === 5) color = 'split-green-purple';
    else if (num % 2 !== 0) color = 'green';
    
    return { num, size, color };
  }, []);

  const historyData = React.useMemo(() => {
    return Array.from({ length: 100 }).map((_, i) => {
      const pStr = getPeriodId(Date.now(), currentDuration, -(i + 1));
      const result = getResultForPeriod(pStr);
      return { period: pStr, ...result };
    });
  }, [currentPeriod, currentDuration, getResultForPeriod]); // Only recompute when period changes

  const recentResults = React.useMemo(() => historyData.slice(0, 5).map(h => h.num), [historyData]);

  // Reset page when activeTab (timer) changes
  useEffect(() => {
    setHistoryPage(1);
  }, [activeTab]);

  // Check for resolved bets when current period changes to show the popup
  useEffect(() => {
    // If there are newly resolved winning bets for the previous period that haven't been shown
    const newlyResolvedWinners = myBets.filter(bet => 
      bet.status === 'Succeed' && 
      bet.period === String(Number(currentPeriod)-1) &&
      !shownWinIds.current.has(bet.id)
    );
    
    if (newlyResolvedWinners.length > 0) {
       // Mark all newly resolved winners as shown to prevent multiple popups for the same period
       newlyResolvedWinners.forEach(bet => shownWinIds.current.add(bet.id));
       setWinPopup(newlyResolvedWinners[0]);
    }
  }, [myBets, currentPeriod]);

  // Auto-close win popup after 3 seconds
  useEffect(() => {
    if (winPopup) {
      const timer = setTimeout(() => {
        setWinPopup(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [winPopup]);

  const [showBetSuccess, setShowBetSuccess] = useState(false);
  const [lastBetInfo, setLastBetInfo] = useState<{type: string | number, amount: number} | null>(null);

  const handleBet = (type: string | number, amount: number, customMultiplier?: number) => {
    if (timeLeft <= 5) {
      showToast('Betting is locked for the last 5 seconds');
      return;
    }

    const finalMultiplier = customMultiplier || multiplier;
    const totalBet = amount * finalMultiplier;
    const isNumberBet = typeof type === 'number';
    const potentialPayout = isNumberBet ? totalBet * 9 : totalBet * 1.8;
    if (user.totalBalance < totalBet) {
      showToast('Insufficient balance for this bet!');
      return;
    }
    
    // 1 rupee bet = 1 EXP
    const newExp = user.exp + totalBet;
    const vipInfo = getVipDetails(newExp);

    setUser(u => {
      const newBalance = u.totalBalance - totalBet;
      // Sync to RTDB immediately so user sees deduction on all devices/refresh
      if (u.phone) {
        update(ref(rtdb, `users/${u.phone}`), { 
          balance: newBalance,
          exp: newExp,
          vipLevel: vipInfo.level
        });
      }
      return {
        ...u,
        totalBalance: newBalance,
        exp: newExp,
        vipLevel: vipInfo.level
      };
    });

    const freshNow = Date.now();
    const freshPeriod = getPeriodId(freshNow, currentDuration);

    setMyBets(prev => {
      const newBet = {
        id: Date.now().toString(),
        period: freshPeriod,
        type,
        value: type, // Admin uses 'value'
        amount: totalBet,
        baseAmount: amount,
        multiplier: finalMultiplier,
        status: 'Pending',
        phone: user.phone,
        timestamp: new Date().toLocaleString('en-US', { hour12: false }).replace(',', '')
      };
      
      // Push to Admin Live Bets node
      set(ref(rtdb, `wingo_live_user_bets/${newBet.id}`), newBet);
      
      // Push to User's private history node so it shows in "My History" immediately and survives sync
      if (user.phone) {
        set(ref(rtdb, `users/${user.phone}/history/games/${newBet.id}`), newBet);
      }
      
      return [newBet, ...prev];
    });

    setLastBetInfo({ type, amount: totalBet });
    setShowBetSuccess(true);
    // Auto close after 2 seconds
    setTimeout(() => setShowBetSuccess(false), 2000);
  };

  return (
    <div className="min-h-screen bg-bg-base relative pb-6">
      <Header title="" transparent />

      {/* Top Banner (Wallet Balance) */}
      <div className="bg-gradient-card pt-14 pb-4 px-4 rounded-b-3xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/10 to-purple-900/10 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col items-center">
          <div className="text-3xl font-bold mb-1 drop-shadow-md">{formatCurrency(user.totalBalance)}</div>
          <div className="flex items-center gap-2 text-sm text-gray-300 mb-4 drop-shadow-sm">
            <span>Wallet balance</span>
            <RefreshCw 
              size={16} 
              className={`text-white/60 cursor-pointer ${refreshing ? 'animate-spin-once' : ''}`} 
              onClick={handleRefresh}
            />
          </div>
          <div className="flex gap-4 w-full px-4">
            <button onClick={() => navigate('withdraw')} className="flex-1 py-2.5 rounded-[20px] bg-sky-500/90 backdrop-blur-md saturate-150 font-bold text-white shadow-lg shadow-sky-500/20 border border-sky-500/30">Withdraw</button>
            <button onClick={() => navigate('deposit')} className="flex-1 py-2.5 rounded-[20px] bg-blue-500/90 backdrop-blur-md saturate-150 font-bold text-white shadow-lg shadow-blue-500/20 border border-blue-400/30">Deposit</button>
          </div>
        </div>
      </div>

      <div className="px-3 mt-4">
        {/* Notice */}
        <div className="bg-card-base border border-[#D4AF37]/30 rounded-2xl py-2 px-3 flex items-center gap-3 mb-4">
          <Volume2 className="text-[#D4AF37] shrink-0" size={18} />
          <div className="flex-1 overflow-hidden">
            <div className="text-xs text-white whitespace-nowrap animate-marquee">
              All players registered on this platform must bind their bank data...
            </div>
          </div>
          <button className="text-xs bg-[#D4AF37] text-black px-3 py-1 rounded-full font-bold shadow-md shrink-0">Detail</button>
        </div>

        {/* Top Tabs */}
        <div className="bg-card-base rounded-2xl p-2 flex items-center justify-between shadow-lg mb-4 h-[80px]">
          {tabs.map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 h-full rounded-xl flex flex-col items-center justify-center transition-all ${activeTab === tab.id ? 'bg-gradient-gold text-black shadow-md scale-105' : 'text-gray-400 grayscale'}`}
            >
              <Clock size={24} className="mb-1" />
              <div className="text-[10px] sm:text-xs font-bold leading-tight text-center">{tab.label}<br/>{tab.sub}</div>
            </button>
          ))}
        </div>

        {/* Current Round Info */}
        <div className="bg-card-base rounded-2xl p-4 shadow-lg mb-4 relative overflow-hidden border border-white/5">
          <div className="flex justify-between items-start">
            <div>
              <button className="flex items-center gap-1.5 border border-white/20 rounded-full px-3 py-1 text-xs mb-2">
                <BookOpen size={14} /> How to play
              </button>
              <div className="text-sm font-semibold mb-2">WinGo {tabs.find(t=>t.id===activeTab)?.sub}</div>
              <div className="flex gap-1.5 mt-2">
                 {recentResults.map((n, i) => (
                    <div key={i} className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow border-2 border-white/10" 
                      style={{ 
                        background: n%2===0 ? 'linear-gradient(180deg, #F87171, #DC2626)' : 'linear-gradient(180deg, #4ADE80, #16A34A)'
                      }}
                    >
                      {n}
                    </div>
                 ))}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-300 font-semibold mb-1">Time remaining</div>
              <CountdownDisplay duration={currentDuration} now={now} />
              <div className="text-xs font-bold text-gray-300 font-mono">{currentPeriod}</div>
            </div>
          </div>
          {/* Tear line effect */}
          <div className="absolute top-[40%] right-[40%] w-0.5 h-16 border-l-2 border-dashed border-white/10 mix-blend-overlay"></div>
        </div>

        {/* Placing Bets Area */}
        <div className="bg-card-base rounded-2xl p-4 shadow-lg mb-4 border border-white/5 relative">
          
          <TimerOverlay timeLeft={timeLeft} />

          <div className="grid grid-cols-3 gap-2 mb-4">
            <button onClick={() => setBetPopupData({ type: 'Green', colorType: 'green' })} className="py-2.5 rounded-[16px] bg-emerald-600/90 backdrop-blur-xl saturate-200 font-bold text-white shadow-lg border border-emerald-500/30 active:scale-95 transition-transform text-sm">Green</button>
            <button onClick={() => setBetPopupData({ type: 'Violet', colorType: 'purple' })} className="py-2.5 rounded-[16px] bg-[#9333EA]/90 backdrop-blur-xl saturate-200 font-bold text-white shadow-lg border border-[#9333EA]/30 active:scale-95 transition-transform text-sm">Violet</button>
            <button onClick={() => setBetPopupData({ type: 'Red', colorType: 'red' })} className="py-2.5 rounded-[16px] bg-[#DC2626]/90 backdrop-blur-xl saturate-200 font-bold text-white shadow-lg border border-[#DC2626]/30 active:scale-95 transition-transform text-sm">Red</button>
          </div>

          <div className="bg-black/40 border border-white/10 shadow-[inset_0_4px_12px_rgba(0,0,0,0.5)] rounded-2xl p-4 mb-4 grid grid-cols-5 gap-y-4 justify-items-center">
             {balls.map((ball) => (
                <button key={ball.num} onClick={() => setBetPopupData({ type: ball.num, colorType: ball.color })} className="relative active:scale-90 transition-transform hover:brightness-110">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-[inset_0_-4px_8px_rgba(0,0,0,0.4),0_4px_12px_rgba(0,0,0,0.6)] border border-white/20`}
                    style={{
                      background: 
                        ball.color === 'red' ? 'radial-gradient(circle at 35% 35%, #FCA5A5, #DC2626, #7F1D1D)' :
                        ball.color === 'green' ? 'radial-gradient(circle at 35% 35%, #6EE7B7, #10B981, #064E3B)' :
                        ball.color === 'split-red-purple' ? 'linear-gradient(135deg, #DC2626 50%, #9333EA 50%)' :
                        'linear-gradient(135deg, #10B981 50%, #9333EA 50%)' // split-green-purple
                    }}
                  >
                    <span className="text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)] z-10">{ball.num}</span>
                    {/* Glossy overlay */}
                    <div className="absolute top-1 left-2.5 w-4 h-2.5 bg-white/40 rounded-full rotate-[-35deg] blur-[0.5px]"></div>
                  </div>
                </button>
             ))}
          </div>

          <div className="flex items-center gap-1.5 mb-4 overflow-x-auto scrollbar-hide py-1">
            <button onClick={() => setBetPopupData({ type: 'Random', colorType: 'random' })} className="px-3 py-1.5 rounded bg-card-base border border-red-500 text-red-500 text-xs font-bold whitespace-nowrap">Random</button>
            {[1, 5, 10, 20, 50, 100].map(x => (
              <button 
                key={x} 
                onClick={() => setMultiplier(x)}
                className={`px-3 py-1.5 rounded text-xs font-bold whitespace-nowrap ${multiplier === x ? 'bg-blue-500 text-white' : 'bg-card-base border border-white/10 text-gray-300'}`}
              >
                X{x}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <button onClick={() => setBetPopupData({ type: 'Big', colorType: 'orange' })} className="flex-1 py-3.5 rounded-[20px] bg-gradient-to-b from-[#FCD34D]/90 to-[#D97706]/90 backdrop-blur-xl saturate-200 font-bold text-black shadow-lg shadow-amber-900/20 active:scale-95 transition-transform text-lg border border-amber-300/40">Big</button>
            <button onClick={() => setBetPopupData({ type: 'Small', colorType: 'green' })} className="flex-1 py-3.5 rounded-[20px] bg-gradient-to-b from-[#34D399]/90 to-[#059669]/90 backdrop-blur-xl saturate-200 font-bold text-white shadow-lg shadow-emerald-900/20 active:scale-95 transition-transform text-lg border border-emerald-400/40">Small</button>
          </div>
        </div>

        {/* History Tabs */}
        <div className="flex gap-2 mb-3">
          <button 
            onClick={() => setHistoryTab('history')}
            className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-colors ${historyTab === 'history' ? 'bg-gradient-gold text-black shadow-md' : 'bg-card-base text-gray-400 border border-white/5'}`}
          >
            Game history
          </button>
          <button 
            onClick={() => setHistoryTab('myhistory')}
            className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-colors ${historyTab === 'myhistory' ? 'bg-gradient-gold text-black shadow-md' : 'bg-card-base text-gray-400 border border-white/5'}`}
          >
            My history
          </button>
        </div>

        {/* History Table */}
        {historyTab === 'history' && (
          <HistoryTable 
            historyData={historyData} 
            historyPage={historyPage} 
            setHistoryPage={setHistoryPage} 
          />
        )}

        {historyTab === 'myhistory' && (
          <div className="flex flex-col gap-2 mb-4">
            {myBets.map((bet, i) => (
              <div key={i} className="bg-card-base rounded-lg p-3 border border-white/5 flex flex-col gap-1 relative shadow">
                <div className="flex items-center gap-2">
                   <div className={`text-[10px] font-bold px-2 py-0.5 rounded shadow ${bet.type === 'Big' ? 'bg-[#D97706]' : bet.type === 'Small' ? 'bg-[#059669]' : typeof bet.type === 'number' ? 'bg-purple-500' : 'bg-emerald-500'} text-white uppercase`}>{bet.type}</div>
                   <div className="text-gray-300 font-mono text-xs tracking-tight">{bet.period}</div>
                </div>
                <div className="text-[10px] text-gray-500 font-mono">{bet.timestamp}</div>
                <div className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded shadow-sm border bg-black/20 ${bet.status === 'Succeed' ? 'border-blue-500 text-blue-500' : bet.status === 'Failed' ? 'border-[#FF453A] text-[#FF453A]' : 'border-yellow-500 text-yellow-500'}`}>
                  {bet.status}
                </div>
                <div className="flex justify-between items-center mt-1">
                  <div className="text-xs text-gray-400 font-medium">₹{bet.amount.toFixed(2)}</div>
                  {bet.status !== 'Pending' && (
                    <div className={`font-bold text-sm ${bet.payout > 0 ? 'text-blue-500' : 'text-[#FF453A]'}`}>
                       {bet.payout > 0 ? `+₹${bet.payout.toFixed(2)}` : `-₹${Math.abs(bet.payout).toFixed(2)}`}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {myBets.length === 0 && <div className="text-center py-8 text-gray-400 text-sm font-medium">No records found</div>}
          </div>
        )}

      </div>
      
      {/* Betting Popup Sheet */}
      {betPopupData && (
        <div className="fixed inset-0 z-[60] flex flex-col justify-end bg-black/60 backdrop-blur-sm animate-fade-in" onClick={(e) => {
          if (e.target === e.currentTarget) setBetPopupData(null);
        }}>
          <div className="bg-[#2b2b2b] w-full rounded-t-3xl shadow-2xl animate-slide-up relative overflow-hidden flex flex-col">
            {/* Colored Header area */}
            <div className={`pt-6 pb-12 px-4 text-center font-bold text-lg text-white relative 
              ${betPopupData.colorType === 'red' ? 'bg-[#DC2626]' : 
                betPopupData.colorType === 'green' ? 'bg-emerald-600' : 
                betPopupData.colorType === 'purple' ? 'bg-[#9333EA]' : 
                betPopupData.colorType === 'orange' ? 'bg-[#F97316]' : 
                betPopupData.colorType === 'blue' ? 'bg-emerald-600' : 
                betPopupData.colorType === 'random' ? 'bg-indigo-500' : 
                'bg-gradient-to-r from-emerald-500 to-purple-500'
              }`}
              style={{
                 /* Slanted bottom effect */
                 clipPath: 'polygon(0 0, 100% 0, 100% 80%, 0 100%)'
              }}
            >
               <h2 className="text-xl">WinGo {tabs.find(t=>t.id===activeTab)?.sub}</h2>
               <div className="bg-white text-black mt-3 mx-auto max-w-[200px] py-1.5 rounded text-sm shadow-md font-extrabold uppercase tracking-wide">
                 Select {betPopupData.type}
               </div>
            </div>

            <div className="px-4 -mt-2 relative z-10 flex-1">
              <div className="flex items-center justify-between mb-4">
                 <span className="text-gray-300 font-medium">Balance</span>
                 <div className="flex gap-2">
                   {betAmounts.map((amt, i) => (
                     <button 
                       key={amt} 
                       onClick={() => setBetAmountIndex(i)}
                       className={`w-16 py-1.5 rounded font-bold transition-colors ${betAmountIndex === i ? (betPopupData.colorType === 'red' ? 'bg-[#DC2626] text-white' : betPopupData.colorType === 'green' ? 'bg-emerald-600 text-white' : betPopupData.colorType === 'purple' ? 'bg-[#9333EA] text-white' : 'bg-[#e29c36] text-white') : 'bg-[#3c3c3c] text-gray-300'}`}
                     >
                       {amt}
                     </button>
                   ))}
                 </div>
              </div>
              
              <div className="flex items-center justify-between mb-6">
                 <span className="text-gray-300 font-medium">Quantity</span>
                 <div className="flex items-center gap-3">
                   <button onClick={() => setBetQuantity(q => Math.max(1, q - 1))} className={`w-8 h-8 flex items-center justify-center rounded font-bold text-xl ${betPopupData.colorType === 'red' ? 'bg-[#DC2626]' : betPopupData.colorType === 'green' ? 'bg-emerald-600' : betPopupData.colorType === 'purple' ? 'bg-[#9333EA]' : 'bg-[#e29c36]'} text-white`}>-</button>
                   <input type="number" value={betQuantity} onChange={e => setBetQuantity(Math.max(1, parseInt(e.target.value)||1))} className="w-16 h-8 bg-black/40 text-center text-white font-bold outline-none border border-white/10 rounded" />
                   <button onClick={() => setBetQuantity(q => q + 1)} className={`w-8 h-8 flex items-center justify-center rounded font-bold text-xl ${betPopupData.colorType === 'red' ? 'bg-[#DC2626]' : betPopupData.colorType === 'green' ? 'bg-emerald-600' : betPopupData.colorType === 'purple' ? 'bg-[#9333EA]' : 'bg-[#e29c36]'} text-white`}>+</button>
                 </div>
              </div>

              <div className="flex items-center justify-end gap-2 mb-6">
                 {[1, 5, 10, 20, 50, 100].map(x => (
                   <button 
                     key={x} 
                     onClick={() => setBetQuantity(x)}
                     className={`w-10 py-1.5 rounded text-[11px] font-bold transition-colors ${betQuantity === x ? (betPopupData.colorType === 'red' ? 'bg-[#DC2626] text-white' : betPopupData.colorType === 'green' ? 'bg-emerald-600 text-white' : betPopupData.colorType === 'purple' ? 'bg-[#9333EA] text-white' : 'bg-[#e29c36] text-white') : 'bg-[#3c3c3c] text-gray-300'}`}
                   >
                     X{x}
                   </button>
                 ))}
              </div>
              
              <div className="flex items-center gap-3 mb-6">
                 <input type="checkbox" id="agree" defaultChecked className="w-5 h-5 rounded border-white/20 bg-[#3c3c3c] accent-[#e29c36]" />
                 <label htmlFor="agree" className="text-sm text-gray-300">I agree <span className="text-[#DC2626]">《Pre-sale rules》</span></label>
              </div>
            </div>

            <div className="flex mt-auto">
               <button onClick={() => setBetPopupData(null)} className="w-1/3 py-3.5 bg-[#3c3c3c] text-gray-300 font-bold text-lg active:bg-[#4a4a4a]">Cancel</button>
               <button 
                 onClick={() => {
                   handleBet(betPopupData.type, betAmounts[betAmountIndex], betQuantity);
                   setBetPopupData(null);
                 }} 
                 className={`w-2/3 py-3.5 text-white font-bold text-lg transition-transform active:scale-95
                  ${betPopupData.colorType === 'red' ? 'bg-[#DC2626]' : 
                  betPopupData.colorType === 'green' ? 'bg-[#10B981]' : 
                  betPopupData.colorType === 'purple' ? 'bg-[#9333EA]' : 
                  betPopupData.colorType === 'orange' ? 'bg-[#F97316]' : 
                  betPopupData.colorType === 'blue' ? 'bg-[#10B981]' : 'bg-[#6366f1]'}
                 `}
               >
                 Total amount ₹{(betAmounts[betAmountIndex] * betQuantity).toFixed(2)}
               </button>
            </div>
          </div>
        </div>
      )}

      {winPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-gradient-to-b from-[#00A8F3] to-[#0A64E9] w-full max-w-sm rounded-[32px] pt-12 pb-6 px-6 relative shadow-2xl border border-blue-400/30 overflow-hidden transform animate-scale-up">
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-24 bg-white/10 blur-2xl rounded-full pointer-events-none"></div>
            
            <button onClick={() => setWinPopup(null)} className="absolute bottom-6 left-1/2 -translate-x-1/2 w-10 h-10 border-2 border-white/50 rounded-full flex items-center justify-center text-white/80 hover:bg-white/10 hover:text-white transition-colors">
              <span className="text-xl leading-none">&times;</span>
            </button>
            <div className="absolute top-0 inset-x-0 h-20 bg-[url('https://upload.wikimedia.org/wikipedia/commons/4/4e/Wings_ribbon_gold.png')] bg-contain bg-center bg-no-repeat opacity-20 pointer-events-none"></div>

            <div className="text-center mt-4">
               <h2 className="text-3xl font-black text-white tracking-widest uppercase filter drop-shadow-md mb-6">Congratulations</h2>
               
               <div className="flex items-center justify-center gap-2 mb-6">
                 <span className="text-sm font-semibold text-white/80">Lottery results</span>
                 <div className="flex gap-1.5 ml-1">
                   <div className={`px-2.5 py-0.5 rounded text-xs font-bold shadow-md text-white ${winPopup.result.color.includes('green') ? 'bg-emerald-500' : 'bg-[#FF453A]'}`}>
                     {winPopup.result.color.includes('green') ? 'Green' : winPopup.result.color === 'red' ? 'Red' : 'Mixed'}
                   </div>
                   <div className="w-6 h-6 rounded flex items-center justify-center font-black text-xs bg-white text-emerald-600 shadow-md">
                     {winPopup.result.num}
                   </div>
                   <div className={`px-2.5 py-0.5 rounded text-xs font-bold shadow-md text-white ${winPopup.result.size === 'Big' ? 'bg-[#D97706]' : 'bg-emerald-600'}`}>
                     {winPopup.result.size}
                   </div>
                 </div>
               </div>

               <div className="bg-white rounded-xl py-4 flex flex-col items-center justify-center shadow-inner relative overflow-hidden mb-12">
                 <div className="text-sm font-bold text-blue-600 mb-1">Bonus</div>
                 <div className="text-3xl font-black text-blue-600 tracking-tight">₹{winPopup.payout.toFixed(2)}</div>
                 <div className="text-gray-400 text-[10px] mt-2 font-mono">Period:{tabDurations[activeTab] === 60 ? 'Win 1 minute' : `Win ${activeTab}`} {winPopup.period}</div>
               </div>
            </div>
            
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex items-center gap-2">
               <input type="checkbox" id="autoclose" checked readOnly className="w-4 h-4 rounded border-white/50 bg-white/10 focus:ring-0 checked:bg-white checked:border-white transition-all appearance-none flex items-center justify-center relative after:content-['✓'] after:text-emerald-500 after:absolute after:hidden checked:after:block after:font-bold after:text-xs" />
               <label htmlFor="autoclose" className="text-white text-xs font-medium opacity-80 cursor-pointer select-none">3 seconds auto close</label>
            </div>
          </div>
        </div>
      )}

      {showBetSuccess && lastBetInfo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none p-6">
          <div className="bg-[#22272e]/90 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col items-center animate-scale-up-fast">
            <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(16,185,129,0.4)]">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-1">Bet Successful</h3>
            <p className="text-gray-400 text-sm">₹{lastBetInfo.amount.toFixed(2)} on {lastBetInfo.type}</p>
          </div>
        </div>
      )}
    </div>
  );
}
