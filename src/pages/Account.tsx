import React, { useState } from 'react';
import { useApp } from '../store';
import { Header } from '../components/Header';
import { 
  Copy, RefreshCw, Archive, Bell, Gift, BarChart2, Globe, 
  Settings, MessageSquare, Megaphone, HelpCircle, BookOpen, 
  Info, ChevronRight, LogOut, ArrowDownCircle, ArrowUpCircle, Crown, ShieldCheck, Gamepad2, FileText, Smartphone, Check, Pencil, X
} from 'lucide-react';
import { formatCurrency } from '../utils';

export function Account() {
  const { user, setUser, navigate, logout, setIsLoading, showToast, unreadNotifications } = useApp();
  const [copied, setCopied] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [newNickname, setNewNickname] = useState(user.nickname);

  const handleSaveNickname = () => {
    if (newNickname.trim()) {
      setUser(prev => ({ ...prev, nickname: newNickname.trim() }));
      setIsEditingNickname(false);
      showToast('Nickname updated successfully');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(user.uid);
    setCopied(true);
    showToast('Copy successful');
    setTimeout(() => setCopied(false), 2000);
  };

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
      {/* Profile Header Block */}
      <div className="bg-bg-base px-4 pt-6 pb-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img src={user.avatar} alt="Avatar" className="w-16 h-16 rounded-full border-2 border-transparent" />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              {isEditingNickname ? (
                 <div className="flex items-center gap-2">
                    <input 
                      type="text" 
                      value={newNickname} 
                      onChange={e => setNewNickname(e.target.value)} 
                      className="bg-black/20 text-white px-2 py-0.5 rounded outline-none border border-white/20 w-32 text-sm focus:border-primary"
                    />
                    <Check size={16} className="text-blue-500 cursor-pointer" onClick={handleSaveNickname} />
                    <X size={16} className="text-[#FF453A] cursor-pointer" onClick={() => setIsEditingNickname(false)} />
                 </div>
              ) : (
                 <>
                   <h2 className="text-lg font-medium">{user.nickname}</h2>
                   <Pencil size={14} className="text-gray-400 cursor-pointer hover:text-white" onClick={() => { setNewNickname(user.nickname); setIsEditingNickname(true); }} />
                 </>
              )}
              <div className="bg-gray-400 bg-opacity-20 flex items-center px-2 py-0.5 rounded-full border border-gray-400/30">
                <Crown size={12} className="text-gray-300 mr-1" />
                <span className="text-[10px] font-bold text-gray-300 italic">VIP{user.vipLevel}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-1">
              <div 
                onClick={handleCopy}
                className="bg-orange-500/20 text-orange-400 text-[11px] inline-flex items-center gap-1 px-2 py-0.5 rounded-full cursor-pointer hover:bg-orange-500/30 transition-colors"
              >
                UID | {user.uid} {copied ? <Check size={10} /> : <Copy size={10} />}
              </div>
            </div>
            <div className="text-[10px] text-gray-500">
              Last login: {user.lastLogin}
            </div>
          </div>
        </div>
      </div>

      {/* Main Balance Card */}
      <div className="mx-4 mb-4 bg-gradient-to-r from-[#2583F7] via-[#145DD8] to-[#6366f1] rounded-2xl p-6 shadow-xl relative overflow-hidden border border-white/10">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-3xl -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-400/30 rounded-full blur-2xl -ml-12 -mb-12" />

        <div className="text-sm text-blue-100 mb-1 font-medium relative z-10">Total balance</div>
        <div className="flex items-center gap-2 mb-8 relative z-10">
          <div className="text-3xl font-black text-white tracking-tight drop-shadow-sm">{formatCurrency(user.totalBalance)}</div>
          <RefreshCw 
            size={16} 
            className={`text-blue-200 cursor-pointer ${refreshing ? 'animate-spin-once text-white' : 'hover:text-white'}`} 
            onClick={handleRefresh}
          />
        </div>
        
        <div className="grid grid-cols-4 gap-2 relative z-10">
          <button onClick={() => navigate('wallet')} className="flex flex-col items-center group active:scale-90 transition-transform">
            <div className="w-12 h-12 bg-gradient-to-b from-sky-400 to-blue-600 rounded-2xl flex items-center justify-center mb-1 shadow-[0_4px_12px_rgba(37,99,235,0.4)] border border-white/20">
              <Archive size={24} className="text-white" strokeWidth={1.5} />
            </div>
            <span className="text-[10px] font-bold text-blue-50 uppercase tracking-widest">Wallet</span>
          </button>
          <button onClick={() => navigate('deposit')} className="flex flex-col items-center group active:scale-90 transition-transform">
            <div className="w-12 h-12 bg-gradient-to-b from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center mb-1 shadow-[0_4px_12px_rgba(16,185,129,0.4)] border border-white/20">
              <ArrowDownCircle size={24} className="text-white" strokeWidth={1.5} />
            </div>
            <span className="text-[10px] font-bold text-white uppercase tracking-widest">Deposit</span>
          </button>
          <button onClick={() => navigate('withdraw')} className="flex flex-col items-center group active:scale-90 transition-transform">
            <div className="w-12 h-12 bg-gradient-to-b from-amber-400 to-orange-600 rounded-2xl flex items-center justify-center mb-1 shadow-[0_4px_12px_rgba(245,158,11,0.4)] border border-white/20">
              <ArrowUpCircle size={24} className="text-white" strokeWidth={1.5} />
            </div>
            <span className="text-[10px] font-bold text-blue-50 uppercase tracking-widest">Withdraw</span>
          </button>
          <button onClick={() => navigate('vip')} className="flex flex-col items-center group active:scale-90 transition-transform">
            <div className="w-12 h-12 bg-gradient-to-b from-purple-400 to-indigo-600 rounded-2xl flex items-center justify-center mb-1 shadow-[0_4px_12px_rgba(139,92,246,0.4)] border border-white/20">
              <Crown size={24} className="text-white" strokeWidth={1.5} />
            </div>
            <span className="text-[10px] font-bold text-blue-50 uppercase tracking-widest">VIP</span>
          </button>
        </div>
      </div>

      {/* History Grid */}
      <div className="grid grid-cols-2 gap-3 mx-4 mb-4">
        {[
          { title: 'Game History', desc: 'My game history', icon: <Gamepad2 size={24} className="text-red-400" strokeWidth={1.5} />, bg: 'bg-white/5', action: () => navigate('gameHistory') },
          { title: 'Transaction', desc: 'My transaction history', icon: <FileText size={24} className="text-sky-400" strokeWidth={1.5} />, bg: 'bg-white/5', action: () => navigate('transaction') },
          { title: 'Deposit', desc: 'My deposit history', icon: <ArrowDownCircle size={24} className="text-blue-500" strokeWidth={1.5} />, bg: 'bg-white/5', action: () => navigate('depositHistory') },
          { title: 'Withdraw', desc: 'My withdraw history', icon: <ArrowUpCircle size={24} className="text-blue-500" strokeWidth={1.5} />, bg: 'bg-white/5', action: () => navigate('withdrawHistory') },
        ].map((item, i) => (
          <div key={i} onClick={item.action} className="bg-card-base rounded-xl p-3 flex gap-3 shadow-sm cursor-pointer hover:bg-gray-800 transition-colors">
            <div className={`w-10 h-10 rounded-lg ${item.bg} flex items-center justify-center shrink-0`}>
              {item.icon}
            </div>
            <div className="flex flex-col justify-center">
              <div className="text-sm font-semibold whitespace-nowrap">{item.title}</div>
              <div className="text-[10px] text-gray-500 leading-tight">{item.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* List Items */}
      <div className="mx-4 mb-4 bg-card-base rounded-2xl overflow-hidden shadow-sm">
        {[
          { icon: <Bell size={20} className="text-yellow-600" />, label: 'Notification', badge: unreadNotifications > 0 ? unreadNotifications.toString() : null, action: () => navigate('notification') },
          { icon: <Gift size={20} className="text-yellow-500" />, label: 'Gifts', action: () => navigate('gift') },
          { icon: <BarChart2 size={20} className="text-yellow-500" />, label: 'Game statistics', action: () => navigate('gameHistory') },
        ].map((item: any, i) => (
          <div key={i} onClick={item.action} className="flex items-center justify-between p-4 border-b border-white/5 last:border-0 hover:bg-white/5 cursor-pointer transition-colors">
            <div className="flex items-center gap-3">
              {item.icon}
              <span className="text-sm">{item.label}</span>
            </div>
            <div className="flex items-center gap-2">
              {item.badge && <span className="bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">{item.badge}</span>}
              {item.rightText && <span className="text-xs text-gray-400">{item.rightText}</span>}
              <ChevronRight size={16} className="text-gray-500" />
            </div>
          </div>
        ))}
      </div>

      {/* Service Center */}
      <div className="mx-4 mb-6 bg-card-base rounded-2xl p-4 shadow-sm">
        <h3 className="text-sm text-gray-300 mb-4">Service center</h3>
         <div className="grid grid-cols-3 gap-y-6">
          {[
            { icon: <Settings size={24} className="text-blue-500" />, label: 'Settings', action: () => navigate('settings') },
            { icon: <MessageSquare size={24} className="text-blue-400" />, label: 'Feedback', action: () => navigate('feedback') },
            { icon: <Megaphone size={24} className="text-orange-400" />, label: 'Announcement', action: () => navigate('announcement') },
            { icon: <BookOpen size={24} className="text-indigo-400" />, label: "Beginner's Guide", action: () => navigate('beginnerGuide') },
            { icon: <Info size={24} className="text-purple-400" />, label: 'About us', action: () => navigate('aboutUs') },
          ].map((item, i) => (
            <div key={i} onClick={item.action} className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity text-center">
               <div className="mb-2">{item.icon}</div>
               <span className="text-[11px] text-gray-400 w-16 leading-tight">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Logout */}
      <div className="mx-4 mb-8">
        <button onClick={logout} className="w-full border border-primary text-primary hover:bg-primary hover:text-black transition-colors rounded-3xl py-3 flex items-center justify-center gap-2 font-medium">
          <LogOut size={18} />
          Log out
        </button>
      </div>
    </div>
  );
}
