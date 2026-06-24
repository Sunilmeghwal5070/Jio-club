import React, { useState } from 'react';
import { useApp } from '../store';
import { Header } from '../components/Header';
import { LayoutGrid, CreditCard, Copy } from 'lucide-react';
import { cn } from '../utils';

export function WithdrawHistory() {
  const { transactions } = useApp();
  const [filterType, setFilterType] = useState('All');
  const [filterDate, setFilterDate] = useState('');

  const types = ['All', 'BANK CARD', 'UPI'];

  const filtered = transactions.filter(tx => {
    if (tx.amount >= 0) return false;
    if (filterType !== 'All' && tx.type !== filterType) return false;
    if (filterDate && !tx.time.startsWith(filterDate)) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-bg-base pb-6">
      <Header title="Withdraw history" />

      <div className="px-4">
        {/* Filter Type */}
        <div className="flex gap-2 overflow-x-auto py-4 scrollbar-hide">
           {types.map(type => (
             <button 
               key={type}
               onClick={() => setFilterType(type)}
               className={cn(
                 "flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm whitespace-nowrap shrink-0 shadow-sm transition-colors",
                 filterType === type ? "bg-gradient-gold text-black font-semibold" : "bg-card-base border border-white/5 text-gray-400"
               )}
             >
               {type === 'All' ? <LayoutGrid size={16} /> : <CreditCard size={16} />}
               {type}
             </button>
           ))}
        </div>

        {/* Dropdowns */}
        <div className="flex gap-2 mb-4">
          <div className="flex-1 bg-card-base border border-white/5 rounded-lg px-3 py-2.5 flex items-center justify-between relative cursor-pointer group">
            <span className="text-sm text-gray-300">{filterType}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-500"><path d="M6 9l6 6 6-6"/></svg>
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            >
              {types.map(t => <option key={t} value={t} className="bg-bg-base text-white">{t}</option>)}
            </select>
          </div>
          <div className="flex-1 bg-card-base border border-white/5 rounded-lg px-3 py-2.5 flex items-center justify-between relative cursor-pointer">
            <span className="text-sm text-gray-300">{filterDate || 'Choose a date'}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-500"><path d="M6 9l6 6 6-6"/></svg>
             <input 
               type="date" 
               value={filterDate}
               onChange={(e) => setFilterDate(e.target.value)}
               className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
             />
          </div>
        </div>

        {/* List */}
        <div className="flex flex-col gap-3">
           {filtered.length > 0 ? filtered.map(tx => (
             <div key={tx.id} className="bg-card-base rounded-xl p-4 shadow-sm border border-card-base">
                <div className="flex justify-between items-center mb-4">
                  <div className="bg-blue-600 text-white text-sm font-bold px-3 py-1 rounded">Withdraw</div>
                  <div className={cn("text-sm font-bold", tx.status === 'Complete' ? "text-blue-500" : "text-red-500")}>
                    {tx.status}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                   <div className="flex justify-between text-sm">
                     <span className="text-gray-400">Balance</span>
                     <span className="text-orange-500 font-medium">₹{Math.abs(tx.amount).toFixed(2)}</span>
                   </div>
                   <div className="flex justify-between text-sm">
                     <span className="text-gray-400">Type</span>
                     <span className="text-gray-300">{tx.type}</span>
                   </div>
                   <div className="flex justify-between text-sm">
                     <span className="text-gray-400">Time</span>
                     <span className="text-gray-300">{tx.time}</span>
                   </div>
                   <div className="flex justify-between text-sm">
                     <span className="text-gray-400">Order number</span>
                     <div className="flex items-center gap-1.5 text-gray-300">
                       <span className="text-xs truncate max-w-[120px]">{tx.orderNumber}</span> 
                       <Copy size={14} className="text-gray-500 cursor-pointer" />
                     </div>
                   </div>
                </div>
             </div>
           )) : (
             <div className="flex flex-col items-center justify-center py-10 opacity-50">
               <span className="text-sm font-medium">No data</span>
             </div>
           )}
        </div>

        <div className="text-center text-primary font-bold text-sm my-6">
          No more
        </div>
      </div>
    </div>
  );
}
