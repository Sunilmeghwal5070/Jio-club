import React from 'react';
import { useApp } from '../store';
import { Header } from '../components/Header';
import { formatCurrency } from '../utils';
import { 
  Wallet, 
  ArrowDownCircle, 
  ArrowUpCircle,
  History,
  ShieldCheck,
  CreditCard
} from 'lucide-react';

export function WalletContainer() {
  const { user, navigate } = useApp();

  return (
    <div className="pb-24 min-h-screen bg-bg-base">
      <Header title="Wallet" />
      
      <div className="px-4 pt-6">
        {/* Main Balance Card */}
        <div className="bg-gradient-blue rounded-[32px] p-8 mb-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-400/10 blur-2xl rounded-full -ml-12 -mb-12" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                <Wallet size={20} className="text-white" />
              </div>
              <span className="text-sm font-bold text-white/80 uppercase tracking-widest">Total Balance</span>
            </div>
            
            <div className="text-5xl font-black text-white tracking-tighter mb-8 drop-shadow-lg">
              {formatCurrency(user.totalBalance)}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => navigate('deposit')}
                className="bg-white text-blue-600 px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all"
              >
                <ArrowDownCircle size={18} /> Deposit
              </button>
              <button 
                onClick={() => navigate('withdraw')}
                className="bg-blue-700/40 backdrop-blur-md border border-white/20 text-white px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all"
              >
                <ArrowUpCircle size={18} /> Withdraw
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats/Links */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-card-base p-5 rounded-3xl border border-white/5 flex flex-col items-center">
            <div className="p-3 bg-blue-500/10 rounded-2xl mb-3">
              <ShieldCheck size={24} className="text-blue-500" />
            </div>
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Safety Status</span>
            <span className="text-xs font-bold text-blue-400">Vip Protected</span>
          </div>
          <div className="bg-card-base p-5 rounded-3xl border border-white/5 flex flex-col items-center">
            <div className="p-3 bg-blue-500/10 rounded-2xl mb-3">
              <CreditCard size={24} className="text-blue-500" />
            </div>
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Bank Account</span>
            <span className="text-xs font-bold text-gray-400">Verified</span>
          </div>
        </div>

        {/* History Links */}
        <div className="bg-card-base rounded-[32px] overflow-hidden border border-white/5">
          <div 
            onClick={() => navigate('depositHistory')}
            className="flex items-center justify-between p-6 hover:bg-white/5 transition-colors border-b border-white/5 cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-2xl">
                <History size={20} className="text-blue-500" />
              </div>
              <div>
                <p className="font-bold text-white">Deposit History</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Manage top-ups</p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-500">→</div>
          </div>
          
          <div 
            onClick={() => navigate('withdrawHistory')}
            className="flex items-center justify-between p-6 hover:bg-white/5 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-2xl">
                <History size={20} className="text-blue-500" />
              </div>
              <div>
                <p className="font-bold text-white">Withdrawal History</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Manage payouts</p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-500">→</div>
          </div>
        </div>
      </div>
    </div>
  );
}
