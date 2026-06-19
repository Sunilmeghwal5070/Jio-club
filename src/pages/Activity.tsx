import React from 'react';
import { useApp } from '../store';
import { formatCurrency } from '../utils';

export function Activity() {
  const { navigate, bonusRecords } = useApp();

  const totalBonus = bonusRecords.reduce((acc, curr) => acc + curr.amount, 0);
  
  const todayStr = new Date().toLocaleString('en-US', { hour12: false }).split(' ')[0];
  const todayBonus = bonusRecords
    .filter(r => r.date.startsWith(todayStr))
    .reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="pb-24">
      <div className="px-4 py-3 flex items-center justify-between sticky top-0 z-40 bg-[#18181A]/60 backdrop-blur-[30px] saturate-200 border-b border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)] transition-colors">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-black border-2 border-[#D4AF37] bg-gradient-to-r from-[#E8E8E8] to-[#D4AF37]">
            JC
          </div>
          <span className="text-xl font-bold tracking-tight text-gradient">JIO CLUB</span>
        </div>
      </div>

      {/* Bonus Headers */}
      <div className="flex items-center justify-around py-6 relative">
        <div className="text-center w-1/2">
          <div className="text-xs text-gray-400 mb-1">Today's bonus</div>
          <div className="text-xl font-bold">{formatCurrency(todayBonus)}</div>
        </div>
        <div className="absolute top-1/2 -translate-y-1/2 left-1/2 w-[1px] h-10 bg-gray-600"></div>
        <div className="text-center w-1/2">
          <div className="text-xs text-gray-400 mb-1">Total bonus</div>
          <div className="text-xl font-bold">{formatCurrency(totalBonus)}</div>
        </div>
      </div>
      
      <div className="flex justify-center mb-6">
        <button 
          onClick={() => navigate('bonusHistory')}
          className="border border-primary text-primary px-6 py-1.5 rounded-full text-sm font-medium hover:bg-primary/10 transition-colors"
        >
          Bonus details
        </button>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-2 gap-3 mx-4 mb-4">
        <div onClick={() => navigate('gift')} className="bg-card-base rounded-2xl overflow-hidden cursor-pointer">
          <div className="h-28 bg-gradient-to-b from-rose-300 to-red-400 flex flex-col justify-end p-2 relative overflow-hidden">
             <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-red-500 rounded-full blur-xl opacity-50"></div>
             <div className="absolute inset-0 flex items-center justify-center text-6xl">🧧</div>
          </div>
          <div className="p-3">
            <div className="font-bold mb-1">Gifts</div>
            <div className="text-[10px] text-gray-400 leading-tight">Enter the redemption code to receive gift rewards</div>
          </div>
        </div>
        
        <div onClick={() => navigate('attendance')} className="bg-card-base rounded-2xl overflow-hidden cursor-pointer">
          <div className="h-28 bg-gradient-to-b from-orange-300 to-orange-400 flex flex-col justify-end p-2 relative overflow-hidden">
             <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-yellow-500 rounded-full blur-xl opacity-50"></div>
             <div className="absolute inset-0 flex items-center justify-center text-6xl">📅</div>
          </div>
          <div className="p-3">
            <div className="font-bold mb-1">Attendance bonus</div>
            <div className="text-[10px] text-gray-400 leading-tight">The more consecutive days you sign in, the higher the reward will be.</div>
          </div>
        </div>
      </div>

      {/* Banner 1 */}
      <div className="mx-4 bg-card-base rounded-2xl overflow-hidden mb-4 border border-card-base shadow-sm">
        <div className="h-32 bg-gradient-to-r from-emerald-400 to-teal-400 relative p-4 flex flex-col justify-center">
            <div className="text-yellow-200 text-[10px] font-bold tracking-widest uppercase items-center flex gap-1 mb-1">
              Lucky 10 Days ♣️
            </div>
            <div className="text-3xl font-black text-yellow-300 drop-shadow-md">
              <span className="text-xl">₹</span>308,000
            </div>
            <div className="text-2xl font-black text-white drop-shadow-md tracking-wide">
              REWARD
            </div>
            
            <div className="absolute right-0 bottom-0 text-7xl opacity-90 drop-shadow-2xl translate-x-2 translate-y-2">
              🎰
            </div>
        </div>
        <div className="py-2.5 px-4 font-semibold text-sm">Lucky 10 Days</div>
      </div>
      
      {/* Banner 2 */}
      <div className="mx-4 bg-card-base rounded-2xl overflow-hidden mb-4 border border-card-base shadow-sm">
        <div className="h-16 bg-gradient-to-r from-green-500 to-green-600 relative p-4 flex items-center justify-between">
            <div className="text-4xl font-black text-yellow-300 drop-shadow-md italic">
              35%
            </div>
            <div className="text-5xl opacity-50 drop-shadow-xl translate-y-2 translate-x-4">
              🛡️
            </div>
        </div>
      </div>
    </div>
  );
}
