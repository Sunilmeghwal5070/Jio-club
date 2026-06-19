import React from 'react';
import { useApp } from '../store';
import { User, Users, Copy, ChevronRight, NotebookTabs, DollarSign, BookOpenCheck } from 'lucide-react';

export function Promotion() {
  return (
    <div className="pb-24 min-h-screen bg-bg-base relative">

      {/* Top Banner half */}
      <div className="bg-gradient-gold pt-6 pb-20 px-4 rounded-b-[40px] relative">
         <div className="absolute top-2 right-4 text-black text-xl opacity-80">📜</div>
         <h1 className="text-xl font-medium text-black text-center mb-8">Agency</h1>

         <div className="text-center font-bold text-4xl text-black mb-2">0</div>
         <div className="flex justify-center mb-2">
           <div className="bg-black/80 rounded-full px-4 py-1 text-primary text-sm shadow-md">
             Yesterday's total commission
           </div>
         </div>
         <div className="text-center text-black/70 text-[10px] uppercase font-semibold">
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
        <button className="w-full bg-gradient-gold text-black font-extrabold text-lg py-3 rounded-xl shadow-lg hover:scale-[1.01] transition-transform">
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
