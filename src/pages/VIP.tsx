import React, { useState } from 'react';
import { useApp } from '../store';
import { Header } from '../components/Header';
import { Crown, Gift, Coins, Star, Layers, Activity } from 'lucide-react';
import { cn } from '../utils';

export function VIP() {
  const { user, myBets } = useApp();
  const [activeTab, setActiveTab] = useState<'History'|'Rules'>('History');
  const [activeVIP, setActiveVIP] = useState(1);

  const vipLevels = [
    { 
      level: 1, 
      req: 300, 
      max: 1000, 
      color: "from-slate-300 to-slate-400 text-slate-800",
      benefits: { levelUp: 30, monthly: 3, deposit: '1%', rebate: null, withdrawAmount: 200, withdrawLimit: '2 Times' }
    },
    { 
      level: 2, 
      req: 1000, 
      max: 5000, 
      color: "from-orange-300 to-orange-400 text-orange-900",
      benefits: { levelUp: 90, monthly: 6, deposit: null, rebate: '0.04%', withdrawAmount: 500, withdrawLimit: '5 Times' }
    },
    { 
      level: 3, 
      req: 5000, 
      max: 6000, 
      color: "from-rose-300 to-rose-400 text-rose-900",
      benefits: { levelUp: 300, monthly: 90, deposit: '3%', rebate: '0.1%', withdrawAmount: 3000, withdrawLimit: '10 Times' }
    },
    { 
      level: 4, 
      req: 6000, 
      max: 10000, 
      color: "from-purple-300 to-purple-400 text-purple-900",
      benefits: { levelUp: 600, monthly: 150, deposit: '5%', rebate: '0.2%', withdrawAmount: 'No Limit', withdrawLimit: 'Unlimited' }
    }
  ];

  const currentLevelData = vipLevels.find(v => v.level === activeVIP) || vipLevels[0];

  return (
    <div className="min-h-screen bg-bg-base pb-6">
      <Header title="VIP" />

      {/* Profile summary */}
      <div className="bg-card-base px-4 py-4 rounded-b-3xl">
        <div className="flex items-center gap-4 mb-6 mt-2">
          <img src={user.avatar} alt="Avatar" className="w-16 h-16 rounded-full" />
          <div>
            <div className="bg-gray-400 bg-opacity-20 inline-flex items-center px-2 py-0.5 rounded-full border border-gray-400/30 mb-1">
              <Crown size={12} className="text-gray-300 mr-1" />
              <span className="text-[10px] font-bold text-gray-300 italic">VIP{user.vipLevel || 0}</span>
            </div>
            <div className="text-lg font-medium">{user.nickname}</div>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-1 bg-bg-base rounded-xl p-3 text-center border border-white/5">
             <div className="text-primary font-bold text-lg mb-1">{user.exp || 0}</div>
             <div className="text-xs text-gray-500">Total EXP</div>
          </div>
          <div className="flex-1 bg-bg-base rounded-xl p-3 text-center border border-white/5">
             <div className="font-bold text-lg mb-1 flex items-center justify-center gap-1">{Math.ceil((new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} <span className="text-xs font-normal">Days</span></div>
             <div className="text-xs text-gray-500">Payout time</div>
          </div>
        </div>
        
        <div className="text-[10px] text-gray-500 mt-4 leading-relaxed">
          VIP level rewards are settled at 2:00 am on the 1st of every month
        </div>
      </div>

      {/* VIP Cards Carousel */}
      <div 
        className="overflow-x-auto snap-x snap-mandatory flex gap-4 px-4 py-6 scrollbar-hide"
        onScroll={(e) => {
          const container = e.currentTarget;
          const scrollLeft = container.scrollLeft;
          // each item is 85% width + 16px gap. estimate card width
          const cardWidth = container.clientWidth * 0.85 + 16;
          const index = Math.round(scrollLeft / cardWidth);
          if (vipLevels[index] && vipLevels[index].level !== activeVIP) {
            setActiveVIP(vipLevels[index].level);
          }
        }}
      >
        {vipLevels.map((lvl) => (
          <div 
             key={lvl.level}
             onClick={() => setActiveVIP(lvl.level)}
             className={cn(
               "snap-center shrink-0 w-[85%] rounded-2xl p-4 bg-gradient-to-br relative overflow-hidden transition-transform",
               lvl.color,
               activeVIP === lvl.level ? "scale-100 shadow-xl" : "scale-95 opacity-80"
             )}
          >
             <div className="absolute right-[-20px] top-4 opacity-50">
               <Crown size={100} strokeWidth={1} />
             </div>
             
             <div className="flex items-center gap-2 mb-2">
                <span className="font-black italic text-2xl drop-shadow-sm">VIP{lvl.level}</span>
                <span className="bg-red-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <LockIcon /> Not open yet
                </span>
             </div>
             <div className="text-xs font-medium opacity-80 mb-6">
               Upgrading VIP{lvl.level} requires<br/>
               {lvl.req} EXP
             </div>
             
             <div className="inline-block bg-black/10 px-2 py-0.5 rounded text-[10px] font-bold mb-8">
               Bet to upgrade (1 Bet = 1 EXP)
             </div>
             
             <div>
               <div className="flex bg-black/10 h-1.5 rounded-full overflow-hidden mb-1 relative">
                 <div className="absolute bg-white/50 h-full rounded-full" style={{ width: `${Math.min(100, ((user.exp || 0) / Math.max(lvl.max, 1)) * 100)}%` }}></div>
               </div>
               <div className="flex justify-between text-[10px] font-bold opacity-80">
                 <span>{user.exp || 0}/{lvl.max} EXP</span>
                 <span>{(lvl.max - (user.exp || 0)) > 0 ? `Need ${lvl.max - (user.exp || 0)} EXP for next level` : 'Level achieved!'}</span>
               </div>
             </div>
          </div>
        ))}
      </div>

      {/* Benefits Content */}
      <div className="px-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
          <span className="text-primary text-xl">💎</span> VIP{activeVIP} Benefits level
        </h2>
        
        <div className="bg-card-base rounded-2xl p-4 mb-6 shadow-sm flex flex-col gap-4">
          <BenefitRow 
            icon={<Gift className="text-white" size={24} />} 
            iconBg="bg-yellow-500"
            title="Level up rewards" 
            desc="Each account can only receive 1 time"
            values={[{icon: '💵', val: currentLevelData.benefits.levelUp}, {icon: '🛡️', val: 0}]}
          />
          <BenefitRow 
            icon={<Coins className="text-white" size={24} />} 
            iconBg="bg-yellow-600"
            title="Monthly reward" 
            desc="Each account can only receive 1 time per month"
            values={[{icon: '💵', val: currentLevelData.benefits.monthly}, {icon: '🛡️', val: 0}]}
          />
          {currentLevelData.benefits.deposit && (
             <BenefitRow 
                icon={<Star className="text-white" size={24} />} 
                iconBg="bg-green-500"
                title="Deposit Reward" 
                desc="Get rewards every deposit"
                values={[{icon: '💵', val: currentLevelData.benefits.deposit}]}
             />
          )}
          {currentLevelData.benefits.rebate && (
             <BenefitRow 
                icon={<Layers className="text-white" size={24} />} 
                iconBg="bg-yellow-700"
                title="Rebate rate" 
                desc="Increase income of rebate"
                values={[{icon: '🪙', val: currentLevelData.benefits.rebate}]}
             />
          )}
          <BenefitRow 
             icon={<Coins className="text-white" size={24} />} 
             iconBg="bg-blue-500"
             title="Daily Withdrawals" 
             desc="Withdrawal limits per day"
             values={[
               {icon: '💸', val: typeof currentLevelData.benefits.withdrawAmount === 'number' ? `₹${currentLevelData.benefits.withdrawAmount}` : currentLevelData.benefits.withdrawAmount},
               {icon: '🔢', val: typeof currentLevelData.benefits.withdrawLimit === 'number' ? `${currentLevelData.benefits.withdrawLimit} times` : currentLevelData.benefits.withdrawLimit}
             ]}
          />
        </div>

        {/* History / Rules Tabs */}
        <div className="flex mb-4">
           {['History', 'Rules'].map(tab => (
             <div 
               key={tab}
               onClick={() => setActiveTab(tab as any)}
               className={cn(
                 "flex-1 text-center py-3 font-medium border-b-2 text-sm transition-colors cursor-pointer",
                 activeTab === tab ? "border-primary text-primary" : "border-transparent text-gray-500"
               )}
             >
               {tab}
             </div>
           ))}
        </div>
        
        {activeTab === 'Rules' ? (
          <div className="bg-card-base p-4 rounded-xl text-gray-400 text-sm leading-relaxed mb-4">
             <h3 className="text-white font-bold mb-2">VIP Upgrade Rules</h3>
             <ul className="list-disc pl-4 space-y-2">
                <li>VIP levels are earned through total betting amount. 1 wager = 1 EXP.</li>
                <li>VIP levels require maintaining betting activity every month.</li>
                <li>Level up bonus is distributed immediately upon reaching the required EXP.</li>
                <li>Monthly bonuses are distributed on the 1st of every month at 02:00 AM.</li>
             </ul>
          </div>
        ) : (
          <div className="mb-4 space-y-3">
             {myBets.length > 0 ? myBets.slice().reverse().map(bet => (
                <div key={bet.id} className="bg-card-base p-4 rounded-xl flex items-center justify-between border border-white/5">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                         <Activity size={20} />
                      </div>
                      <div>
                         <div className="text-gray-200 text-sm font-medium mb-0.5">Game Wager</div>
                         <div className="text-xs text-gray-500">{bet.date}</div>
                      </div>
                   </div>
                   <div className="text-right">
                      <div className="text-[#32D74B] font-bold text-sm mb-0.5">+{bet.totalBet} EXP</div>
                      <div className="text-[10px] text-gray-400">Success</div>
                   </div>
                </div>
             )) : (
                <div className="flex flex-col items-center justify-center py-10 opacity-50">
                   <svg width="100" height="80" viewBox="0 0 100 80" className="text-gray-600 mb-2 fill-current">
                      <path d="M20 20h60v40H20z" opacity=".2"/><path d="M30 10h50v50H30z" opacity=".5"/>
                   </svg>
                   <span className="text-xs">No data</span>
                </div>
             )}
          </div>
        )}

      </div>
    </div>
  );
}


function BenefitRow({ icon, iconBg, title, desc, values }: any) {
  return (
    <div className="flex items-center gap-3">
      <div className={cn("w-12 h-12 rounded-xl flex flex-col justify-center items-center shrink-0 shadow-inner", iconBg)}>
        {icon}
      </div>
      <div className="flex-1">
        <div className="text-sm font-medium text-gray-200">{title}</div>
        <div className="text-[10px] text-gray-500">{desc}</div>
      </div>
      <div className="flex flex-col gap-1 items-end">
        {values.map((v: any, i: number) => (
          <div key={i} className="flex items-center gap-1 border border-primary text-primary rounded px-2 py-0.5 text-xs font-semibold bg-primary/5 min-w-[60px] justify-between">
            <span>{v.icon}</span> <span>{v.val}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function LockIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="relative -top-[1px]">
       <rect x="5" y="11" width="14" height="10" rx="2" ry="2"></rect>
       <path d="M7 11V7a5 5 0 0110 0v4"></path>
    </svg>
  )
}
