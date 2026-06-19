import React, { useState, useEffect } from 'react';
import { useApp } from '../store';
import { Header } from '../components/Header';
import { Wallet as WalletIcon, ArrowDownCircle, ArrowUpCircle, History, RefreshCw } from 'lucide-react';
import { formatCurrency } from '../utils';

export function Wallet() {
  const { user, setUser, navigate, showToast } = useApp();
  const [isSyncing, setIsSyncing] = useState(false);

  // Auto-sync third party balance to main wallet
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (user.thirdPartyBalance > 0 && !isSyncing) {
      // Simulate automatic sync after 2 seconds viewing the page
      timer = setTimeout(() => {
        handleSync();
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [user.thirdPartyBalance]);

  const handleSync = () => {
    if (user.thirdPartyBalance <= 0) return;
    setIsSyncing(true);
    
    // Simulate API call for sync
    setTimeout(() => {
      setUser({
        ...user,
        totalBalance: user.totalBalance + user.thirdPartyBalance,
        thirdPartyBalance: 0
      });
      setIsSyncing(false);
      showToast('Main wallet transfer successful');
    }, 800);
  };

  const totalAllBalance = user.totalBalance + (user.thirdPartyBalance || 0);
  const mainRatio = totalAllBalance > 0 ? (user.totalBalance / totalAllBalance) * 100 : 100;
  const thirdRatio = totalAllBalance > 0 ? (user.thirdPartyBalance / totalAllBalance) * 100 : 0;

  return (
    <div className="min-h-screen bg-bg-base pb-24">
      <Header title="Wallet" />

      {/* Overview Block */}
      <div className="flex flex-col items-center pt-6 pb-8">
        <WalletIcon size={32} className="text-gray-300 mb-2" />
        <h2 className="text-3xl font-bold">{formatCurrency(totalAllBalance)}</h2>
        <span className="text-sm text-gray-400 mt-1">Total balance</span>
        
        <div className="flex justify-center w-full mt-6 gap-12">
          <div className="text-center">
            <div className="text-lg font-semibold cursor-pointer select-none">{formatCurrency(totalAllBalance).replace('₹', '')}</div>
            <div className="text-xs text-gray-400">Total amount</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold cursor-pointer select-none">{user.totalDeposit || 0}</div>
            <div className="text-xs text-gray-400">Total deposit amount</div>
          </div>
        </div>
      </div>

      {/* Main Card */}
      <div className="mx-4 bg-card-base rounded-2xl p-4 shadow-lg border border-white/5">
        
        {/* Progress Rings */}
        <div className="flex justify-around items-center mb-6">
          <div className="flex flex-col items-center">
            {/* Main Ring */}
            <div className="w-20 h-20 rounded-full border-4 border-[#D4AF37] flex items-center justify-center mb-2 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
               <span className="font-bold">{Math.round(mainRatio)}%</span>
            </div>
            <span className="text-sm font-semibold">{formatCurrency(user.totalBalance)}</span>
            <span className="text-[10px] text-gray-400">Main wallet</span>
          </div>

          <div className="flex flex-col items-center">
            {/* 3rd Party Ring */}
            <div className={`w-20 h-20 rounded-full border-4 ${user.thirdPartyBalance > 0 ? 'border-blue-500' : 'border-gray-700'} flex items-center justify-center mb-2 transition-colors`}>
               <span className={`font-bold ${user.thirdPartyBalance > 0 ? 'text-blue-500' : 'text-gray-400'}`}>
                 {Math.round(thirdRatio)}%
               </span>
            </div>
            <span className="text-sm font-semibold">{formatCurrency(user.thirdPartyBalance)}</span>
            <span className="text-[10px] text-gray-400">3rd party wallet</span>
          </div>
        </div>

        <button 
          onClick={handleSync}
          disabled={isSyncing || user.thirdPartyBalance <= 0}
          className="w-full bg-gradient-gold text-black font-bold py-3 rounded-xl mb-6 shadow-md hover:scale-[1.02] transition-transform disabled:opacity-80 disabled:scale-100 flex items-center justify-center gap-2"
        >
          {isSyncing ? (
            <><RefreshCw size={18} className="animate-spin" /> Transferring...</>
          ) : (
            'Main wallet transfer'
          )}
        </button>

        {/* Action Grid */}
        <div className="grid grid-cols-4 gap-2 mb-6">
           <button onClick={() => navigate('deposit')} className="flex flex-col items-center">
             <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-1 hover:bg-white/10 transition-colors">
               <ArrowDownCircle size={24} className="text-blue-500" strokeWidth={1.5} />
             </div>
             <span className="text-[11px] text-gray-400">Deposit</span>
           </button>
           <button onClick={() => navigate('withdraw')} className="flex flex-col items-center">
             <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-1 hover:bg-white/10 transition-colors">
               <ArrowUpCircle size={24} className="text-[#32D74B]" strokeWidth={1.5} />
             </div>
             <span className="text-[11px] text-gray-400">Withdraw</span>
           </button>
           <button onClick={() => navigate('depositHistory')} className="flex flex-col items-center">
             <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-1 hover:bg-white/10 transition-colors">
               <History size={24} className="text-gray-300" strokeWidth={1.5} />
             </div>
             <span className="text-[11px] text-gray-400 text-center leading-tight">Deposit<br/>history</span>
           </button>
           <button onClick={() => navigate('withdrawHistory')} className="flex flex-col items-center">
             <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-1 hover:bg-white/10 transition-colors">
               <History size={24} className="text-gray-300" strokeWidth={1.5} />
             </div>
             <span className="text-[11px] text-gray-400 text-center leading-tight">Withdrawal<br/>history</span>
           </button>
        </div>

        {/* Sub Wallets Grid */}
        <div className="grid grid-cols-3 gap-2">
           <div className="bg-bg-base rounded-lg p-2 text-center relative overflow-hidden group hover:bg-gray-800 transition-colors cursor-pointer">
              <div className="text-sm font-semibold mt-1">0.00</div>
              <div className="text-[10px] text-gray-500">JIOBET</div>
           </div>
           <div className="bg-bg-base border border-gray-800 rounded-lg p-2 text-center hover:bg-gray-800 transition-colors cursor-pointer">
              <div className="text-sm font-semibold mt-1">0.00</div>
              <div className="text-[10px] text-gray-500">JIOGame</div>
           </div>
           <div className="bg-gradient-gold text-black rounded-lg p-2 text-center relative cursor-pointer shadow-md">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                <RefreshCw size={24} className="animate-spin-slow" />
              </div>
              <div className="text-sm font-bold mt-1">{user.lotteryWallet}</div>
              <div className="text-[10px] font-medium text-black/70">Lottery</div>
           </div>
        </div>
      </div>
    </div>
  );
}
