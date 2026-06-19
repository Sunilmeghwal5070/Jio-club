import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { useApp } from '../store';

export function Gift() {
  const { setUser, showToast } = useApp();
  const [code, setCode] = useState('');
  
  const [giftHistory, setGiftHistory] = useState<any[]>(() => {
    const saved = localStorage.getItem('giftHistory');
    if (saved) {
      try { return JSON.parse(saved); } catch(e) {}
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('giftHistory', JSON.stringify(giftHistory));
  }, [giftHistory]);

  const handleReceive = () => {
    if (!code.trim()) {
      showToast('Please enter a gift code');
      return;
    }
    
    if (giftHistory.find(g => g.code === code.trim())) {
      showToast('Gift code has already been used');
      return;
    }
    
    // Give random payout between 10 to 50
    const amount = 10 + Math.floor(Math.random() * 41);
    
    setGiftHistory(prev => [{
      code: code.trim(),
      amount,
      date: new Date().toLocaleString()
    }, ...prev]);
    
    setUser(u => ({ ...u, totalBalance: u.totalBalance + amount }));
    showToast(`Successfully received ₹${amount.toFixed(2)}`);
    setCode('');
  };

  return (
    <div className="min-h-screen bg-bg-base relative pb-6">
      <Header title="Gift" />

      <div className="w-full bg-gradient-to-tr from-[#FEEBC8] to-[#FBD38D] relative overflow-hidden flex items-center justify-center min-h-[160px] max-h-[220px]">
        <img 
          src="https://i.pinimg.com/474x/9d/f2/8a/9df28af26cef78a9308a393f40a34887.jpg" 
          alt="Gift Code Banner" 
          className="w-full h-full object-cover absolute inset-0 z-10"
        />
      </div>

      <div className="px-4 mt-2">
        <div className="bg-card-base rounded-2xl p-6 shadow-sm border border-card-base mb-4">
          <h2 className="text-gray-300 mb-1 font-medium">Hi</h2>
          <h2 className="text-gray-300 mb-6 font-medium">We have a gift for you</h2>

          <label className="text-gray-300 text-sm block mb-3 font-medium">Please enter the gift code below</label>
          <input 
            type="text" 
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Please enter gift code" 
            className="w-full bg-bg-base text-white px-4 py-3 rounded-full mb-6 border-none focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-gray-600"
          />

          <button onClick={handleReceive} className="w-full bg-gradient-gold text-black font-semibold text-lg py-2.5 rounded-full shadow-lg hover:opacity-90 transition-opacity">
            Receive
          </button>
        </div>

        <a 
          href="https://t.me/" 
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-[#2AABEE] text-white font-bold text-lg py-3 rounded-xl shadow border border-white/5 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity mb-4"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.5 2L2 10.5l6 2.5 1.5 7 4-4.5 5 4 3-17.5z"></path></svg>
          Join Telegram Channel
        </a>

        <div className="bg-card-base rounded-2xl p-4 shadow-sm min-h-[250px] border border-white/5 flex flex-col mb-4">
          <div className="flex items-center gap-2 text-yellow-500 font-medium mb-4">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            <span className="text-white">History</span>
          </div>

          <div className="flex-1 flex flex-col items-center">
            {giftHistory.length > 0 ? (
              <div className="w-full space-y-2">
                {giftHistory.map((item, idx) => (
                  <div key={idx} className="bg-bg-base p-3 rounded-xl border border-white/5 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-bold text-gray-200">{item.code}</div>
                      <div className="text-[10px] text-gray-500">{item.date}</div>
                    </div>
                    <div className="text-[#32D74B] font-bold text-sm">+₹{item.amount.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center opacity-50 pb-8 mt-10">
                 <svg width="120" height="80" viewBox="0 0 100 80" className="text-gray-600 mb-4 fill-current">
                    <path d="M20 20h60v40H20z" opacity=".2"/><path d="M30 10h50v50H30z" opacity=".5"/>
                 </svg>
                 <span className="text-gray-500 text-sm">No data</span>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
