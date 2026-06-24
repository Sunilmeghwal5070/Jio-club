import React from 'react';
import { useApp } from '../store';
import { User, Users, Copy, ChevronRight, NotebookTabs, DollarSign, BookOpenCheck } from 'lucide-react';

export function Promotion() {
  return (
    <div className="pb-24 min-h-screen bg-bg-base relative">

      {/* Top Banner half */}
      <div className="bg-gradient-blue pt-6 pb-20 px-4 rounded-b-[40px] relative">
         <div className="absolute top-2 right-4 text-white text-xl opacity-80">📜</div>
         <h1 className="text-xl font-bold text-white text-center mb-8 uppercase tracking-widest">Agency</h1>

         <div className="text-center font-black text-4xl text-white mb-2 drop-shadow-md">0</div>
         <div className="flex justify-center mb-2">
           <div className="bg-white/20 backdrop-blur-md rounded-full px-4 py-1 text-white text-sm shadow-md border border-white/10">
             Yesterday's total commission
           </div>
         </div>
         <div className="text-center text-white/70 text-[10px] uppercase font-bold tracking-wider">
           Upgrade the level to increase commission income
         </div>
      </div>

      {/* Stats Board */}
      <div className="mx-4 -mt-16 bg-card-base rounded-2xl overflow-hidden shadow-xl mb-4">
        {/* Tabs */}
        <div className="flex">
           <div className="flex-1 bg-yellow-600/90 text-white font-medium py-3 flex items-center justify-center gap-2 border-b-2 border-yellow-400">
             <User size={18} /> Direct subordinates
           </div>
           <div className="flex-1 bg-yellow-600/50 text-white/50 font-medium py-3 flex items-center justify-center gap-2 border-b-2 border-transparent">
             <Users size={18} /> Team subordinates
           </div>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 divide-x divide-white/10 p-4">
           {/* Direct */}
           <div className="text-center flex flex-col gap-4 py-2 pr-2">
             <div>
               <div className="text-sm font-bold">0</div>
               <div className="text-[10px] text-gray-400">number of register</div>
             </div>
             <div>
               <div className="text-sm font-bold text-green-500">0</div>
               <div className="text-[10px] text-gray-400">Deposit number</div>
             </div>
             <div>
               <div className="text-sm font-bold text-yellow-500">0</div>
               <div className="text-[10px] text-gray-400">Deposit amount</div>
             </div>
             <div>
               <div className="text-sm font-bold pb-2">0</div>
               <div className="text-[10px] text-gray-400 leading-tight">Number of people making first deposit</div>
             </div>
           </div>
           
           {/* Team */}
           <div className="text-center flex flex-col gap-4 py-2 pl-2">
             <div>
               <div className="text-sm font-bold">0</div>
               <div className="text-[10px] text-gray-400">number of register</div>
             </div>
             <div>
               <div className="text-sm font-bold text-green-500">0</div>
               <div className="text-[10px] text-gray-400">Deposit number</div>
             </div>
             <div>
               <div className="text-sm font-bold text-yellow-500">0</div>
               <div className="text-[10px] text-gray-400">Deposit amount</div>
             </div>
             <div>
               <div className="text-sm font-bold pb-2">0</div>
               <div className="text-[10px] text-gray-400 leading-tight">Number of people making first deposit</div>
             </div>
           </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mx-4 mb-4">
        <button className="w-full bg-gradient-to-r from-[#2583F7] to-[#145DD8] hover:from-[#145DD8] hover:to-[#1149A6] text-white font-black text-lg py-4 rounded-2xl shadow-[0_8px_20px_rgba(37,131,247,0.4)] active:scale-95 transition-all uppercase tracking-[2px] border border-white/20">
          Download QR Code
        </button>
      </div>

      <div className="mx-4 bg-card-base rounded-xl p-4 shadow-sm flex items-center justify-between mb-4 border border-card-base">
         <div className="flex items-center gap-3">
           <DownloadBox />
           <span className="text-sm text-gray-300">Copy invitation code</span>
         </div>
         <div className="text-sm text-gray-300 flex items-center gap-2">
           627341386823 <Copy size={16} className="cursor-pointer hover:text-white" />
         </div>
      </div>

      {/* Menu List */}
      <div className="mx-4 bg-card-base rounded-2xl overflow-hidden shadow-sm">
        {[
          { icon: <NotebookTabs size={20} className="text-yellow-500" />, label: 'Subordinate data' },
          { icon: <DollarSign size={20} className="text-yellow-500" />, label: 'Commission detail' },
          { icon: <BookOpenCheck size={20} className="text-yellow-600" />, label: 'Invitation rules' },
        ].map((item, i) => (
          <div key={i} className="flex items-center justify-between p-4 border-b border-white/5 last:border-0 hover:bg-white/5 cursor-pointer">
            <div className="flex items-center gap-3">
              {item.icon}
              <span className="text-sm text-gray-200">{item.label}</span>
            </div>
            <ChevronRight size={20} className="text-gray-500" />
          </div>
        ))}
      </div>
    </div>
  );
}

function DownloadBox() {
  return (
    <div className="w-6 h-6 bg-yellow-600/20 rounded flex items-center justify-center">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-yellow-500">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
      </svg>
    </div>
  )
}
