import React, { useState } from 'react';
import { useApp } from '../store';
import { X } from 'lucide-react';

export function FirstDepositModal() {
  const { showFirstDeposit, setShowFirstDeposit, navigate } = useApp();
  const [hideReminder, setHideReminder] = useState(false);

  if (!showFirstDeposit) return null;

  const close = () => {
    if (hideReminder) {
      localStorage.setItem('hideFirstDepositBonus', new Date().toDateString());
    }
    setShowFirstDeposit(false);
  };

  const items = [
    { d: 5000, b: 288 },
    { d: 1000, b: 88 },
    { d: 500, b: 58 },
    { d: 200, b: 18 },
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
      <div className="flex flex-col items-center w-full max-w-[340px] animate-scale-in">
        
        {/* Main Modal Card */}
        <div className="bg-[#282633] rounded-3xl w-full pt-8 pb-3 px-5 shadow-2xl text-white relative border border-white/5">
          <h2 className="text-2xl font-black text-primary text-center mb-1 tracking-tight drop-shadow-md">Extra first deposit bonus</h2>
          <p className="text-xs text-center text-gray-400 mb-6 font-medium">Each account can only receive rewards once</p>
          
          <div className="flex flex-col gap-3 max-h-[50vh] overflow-y-auto scrollbar-hide mb-4 pr-1">
            {items.map((item, i) => (
              <div 
                key={i} 
                onClick={() => { close(); navigate('deposit'); }}
                className="bg-bg-base rounded-2xl p-4 border border-white/5 relative overflow-hidden cursor-pointer hover:border-primary/50 transition-colors group"
                role="button"
              >
                {/* Decorative background shapes */}
                <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-colors"></div>
                
                <div className="flex justify-between items-center mb-1 relative z-10">
                  <div className="text-white font-medium text-sm">First deposit<span className="text-primary font-bold ml-1 text-base">{item.d}</span></div>
                  <div className="text-primary font-bold text-base">+ ₹{item.b}.00</div>
                </div>
                <p className="text-[10px] text-gray-500 mb-4 w-[85%] leading-tight relative z-10 font-medium">
                  Deposit {item.d} for the first time and you will receive {item.b} bonus
                </p>
                
                <div className="flex items-center gap-3 relative z-10">
                  <div className="flex-1 bg-black/50 rounded-full h-8 flex items-center justify-center relative overflow-hidden shadow-inner border border-white/5">
                    <span className="text-[11px] font-bold text-gray-400 relative z-10 tracking-wider">0/{item.d}</span>
                  </div>
                  <button 
                    onClick={() => { close(); navigate('deposit'); }} 
                    className="border border-primary text-primary hover:bg-primary hover:text-black transition-all rounded-xl px-5 py-1.5 text-sm font-bold shadow-sm"
                  >
                    Deposit
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
            <label className="flex items-center gap-2 cursor-pointer group" onClick={(e) => { e.preventDefault(); setHideReminder(!hideReminder); }}>
              <div className={`w-5 h-5 rounded-full border-[1.5px] flex items-center justify-center transition-colors ${hideReminder ? 'border-primary' : 'border-gray-500 group-hover:border-primary'}`}>
                 <div className={`w-2.5 h-2.5 rounded-full ${hideReminder ? 'bg-primary' : 'bg-transparent'}`}></div>
              </div>
              <span className="text-xs text-gray-500 font-medium group-hover:text-gray-300 transition-colors">No more reminders today</span>
            </label>
            <button 
              onClick={() => { close(); navigate('activity'); }} 
              className="bg-gradient-gold text-black px-6 py-2 rounded-full font-bold text-sm shadow-[0_4px_12px_rgba(234,179,8,0.3)] hover:scale-105 transition-transform"
            >
              Activity
            </button>
          </div>
        </div>

        {/* Close Button X below modal */}
        <button 
          onClick={close} 
          className="mt-6 w-12 h-12 rounded-full border-2 border-white/40 flex items-center justify-center text-white/70 hover:bg-white/10 hover:text-white hover:border-white transition-all shadow-lg backdrop-blur-sm"
        >
          <X size={24} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
