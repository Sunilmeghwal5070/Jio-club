import React, { useState } from 'react';
import { useApp } from '../store';
import { Header } from '../components/Header';
import { RefreshCw, QrCode, CreditCard, HelpCircle } from 'lucide-react';
import { formatCurrency } from '../utils';

export function Deposit() {
  const { user, setUser, navigate, addTransaction, setIsLoading, showToast, addBonusRecord } = useApp();
  const [activeChannel, setActiveChannel] = useState('UPI-QR');
  const [amount, setAmount] = useState<string>('');
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setRefreshing(false);
      showToast('Refresh successfully');
    }, 1000);
  };

  const amounts = [100, 200, 300, 500, 1000, 1500, 2000, 3000, 5000];

  const getBonus = (amt: number) => {
    const bonuses: Record<number, number> = {
      100: 6,
      200: 18,
      300: 30,
      500: 55,
      1000: 120,
      1500: 195,
      2000: 280,
      3000: 450,
      5000: 800
    };
    if (bonuses[amt]) return bonuses[amt];
    return Math.floor(amt * 0.1); 
  };

  const handleDeposit = () => {
    if (!amount || isNaN(Number(amount))) return;
    
    const depositAmt = Number(amount);
    const bonusAmt = getBonus(depositAmt);
    const totalAmt = depositAmt + bonusAmt;

    // Simulate creating a transaction
    addTransaction({
      id: `RC${Date.now()}`,
      type: activeChannel,
      status: 'Complete',
      amount: depositAmt,
      time: new Date().toISOString().replace('T', ' ').substring(0, 19),
      orderNumber: `RC${Date.now()}81064297c`
    });

    // Update user balance
    setUser({
      ...user,
      totalBalance: user.totalBalance + totalAmt,
      totalDeposit: (user.totalDeposit || 0) + depositAmt
    });
    
    if (bonusAmt > 0) {
      addBonusRecord('Deposit Bonus', bonusAmt);
    }
    
    showToast(`Deposited ${formatCurrency(depositAmt)} + ${formatCurrency(bonusAmt)} bonus`);
    setTimeout(() => navigate('wallet'), 1000);
  };

  return (
    <div className="min-h-screen bg-bg-base relative pb-32">
      <Header 
        title="Deposit" 
        rightContent={<button onClick={() => navigate('depositHistory')} className="text-gray-300 text-sm font-medium hover:text-white">Deposit history</button>}
      />

      <div className="px-4 mt-4">
        {/* Balance Card */}
        <div className="bg-gradient-to-tr from-cyan-400 to-green-300 rounded-3xl p-5 mb-4 shadow-lg text-black relative overflow-hidden">
          <div className="flex items-center gap-1 font-medium mb-1 relative z-10">
            <span>👍</span> Balance
          </div>
          <div className="flex items-center gap-2 mb-4 relative z-10">
            <span className="text-3xl font-bold">{formatCurrency(user.totalBalance)}</span>
            <RefreshCw 
              size={16} 
              className={`text-black/60 cursor-pointer ${refreshing ? 'animate-spin-once' : ''}`} 
              onClick={handleRefresh}
            />
          </div>
          <div className="flex justify-between items-end relative z-10">
            <CreditCard size={28} className="text-black/40" />
            <span className="font-mono text-black/60 tracking-widest text-lg">**** ****</span>
          </div>
        </div>

        {/* Payment Methods Grid */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div 
            onClick={() => setActiveChannel('UPI-QR')}
            className={`rounded-xl p-2 flex flex-col items-center justify-center h-20 transition-colors cursor-pointer shadow-md ${activeChannel === 'UPI-QR' ? 'bg-gradient-to-b from-yellow-300 to-yellow-500 text-black font-bold border-0' : 'bg-card-base border border-white/5 text-gray-400 hover:border-primary/50 hover:text-white'}`}
          >
            <QrCode size={24} className="mb-1" />
            <span className="text-[11px] text-center leading-tight">UPI-QR</span>
          </div>
          <div 
            onClick={() => setActiveChannel('UPI-QR PAY')}
            className={`rounded-xl p-2 flex flex-col items-center justify-center h-20 transition-colors cursor-pointer shadow-md ${activeChannel === 'UPI-QR PAY' ? 'bg-gradient-to-b from-yellow-300 to-yellow-500 text-black font-bold border-0' : 'bg-card-base border border-white/5 text-gray-400 hover:border-primary/50 hover:text-white'}`}
          >
            <QrCode size={24} className="mb-1" />
            <span className="text-[11px] text-center leading-tight">UPI-QR PAY</span>
          </div>
          <div 
            onClick={() => setActiveChannel('PAYTM')}
            className={`rounded-xl p-2 flex flex-col items-center justify-center h-20 transition-colors cursor-pointer shadow-md ${activeChannel === 'PAYTM' ? 'bg-gradient-to-b from-yellow-300 to-yellow-500 text-black font-bold border-0' : 'bg-card-base border border-white/5 text-gray-400 hover:border-primary/50 hover:text-white'}`}
          >
             <div className="bg-white rounded-full p-1 mb-1">
               <span className="text-[8px] font-black text-blue-500 px-1">Paytm</span>
             </div>
            <span className="text-[11px] text-center leading-tight">PAYTM</span>
          </div>
        </div>

        {/* Select Channel */}
        <div className="bg-card-base rounded-2xl p-4 shadow-sm mb-4 border border-card-base">
          <div className="flex items-center gap-2 mb-3 text-gray-200 font-medium">
            <div className="bg-yellow-600/20 p-1.5 rounded-lg border border-yellow-600/30">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EAB308" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            </div>
            Select channel
          </div>
          <div className="inline-flex flex-col bg-gradient-gold text-black px-6 py-2 rounded-xl shadow-md min-w-[150px]">
            <span className="font-semibold">{activeChannel}</span>
            <span className="text-xs font-medium">Balance:100 - 50K</span>
          </div>
        </div>

        {/* Deposit Amount */}
        <div className="bg-card-base rounded-2xl p-4 shadow-sm mb-4 border border-card-base">
          <div className="flex items-center gap-2 mb-4 text-white font-black text-lg">
            <div className="bg-yellow-600 text-black p-1 rounded font-bold leading-none">₹</div>
            Deposit amount
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            {amounts.map(amt => {
              const isSelected = amount === amt.toString();
              const bonusValue = getBonus(amt);
              return (
                <button 
                  key={amt} 
                  onClick={() => setAmount(amt.toString())}
                  className={`border transition-colors rounded-lg py-3 flex flex-col items-center justify-center font-bold relative ${isSelected ? 'bg-gradient-gold text-black border-yellow-500 shadow-md scale-[0.98]' : 'bg-[#1C1A24] text-gray-300 border-white/5 hover:border-primary/50 shadow-inner'}`}
                >
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow">+₹{bonusValue}</div>
                  <div className="flex items-center">
                    <span className={`${isSelected ? 'text-black/70' : 'text-gray-500'} mr-1`}>₹</span> {amt >= 1000 ? (amt/1000) + 'K' : amt}
                  </div>
                </button>
              );
            })}
          </div>

           <div className="flex justify-between items-center mb-2 px-1">
            <span className="text-gray-400 text-xs">Enter Amount</span>
            {amount && !isNaN(Number(amount)) && Number(amount) > 0 && (
              <span className="text-green-500 font-bold text-xs bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">
                Bonus +₹{getBonus(Number(amount))}
              </span>
            )}
          </div>
          <div className="bg-[#1C1A24] border border-white/5 rounded-full px-5 py-3 flex items-center mb-1 transition-colors focus-within:border-primary/50 relative z-20">
             <span className="text-primary font-bold text-lg mr-4">₹</span>
             <input 
               type="text"
               inputMode="numeric"
               placeholder="₹100.00 - ₹50,000.00" 
               value={amount}
               onChange={(e) => {
                 // only allow digits
                 const val = e.target.value.replace(/[^0-9]/g, '');
                 setAmount(val);
               }}
               className="flex-1 bg-transparent border-none outline-none text-white font-medium w-full min-w-0"
               style={{ caretColor: '#32D74B' }}
             />
             {amount && (
               <button onClick={() => setAmount('')} className="w-6 h-6 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center shrink-0 ml-2">
                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
               </button>
             )}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-[#282531] border border-[#3e3b4a] rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3 text-white font-bold">
            <div className="bg-yellow-600/20 p-1.5 rounded border border-yellow-600/30">
              <HelpCircle size={16} className="text-yellow-500" />
            </div>
            Recharge instructions
          </div>
          <ul className="text-gray-400 text-xs space-y-3 font-medium">
            <li className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-primary rotate-45 shrink-0 mt-1"></div>
              <span>If the transfer time is up, please fill out the deposit form again.</span>
            </li>
            <li className="flex items-start gap-2">
               <div className="w-1.5 h-1.5 bg-primary rotate-45 shrink-0 mt-1"></div>
               <span>The transfer amount must match the order you created, otherwise the money cannot be credited successfully.</span>
            </li>
            <li className="flex items-start gap-2">
               <div className="w-1.5 h-1.5 bg-primary rotate-45 shrink-0 mt-1"></div>
               <span>If you transfer the wrong amount, our company will not be responsible for the lost amount!</span>
            </li>
            <li className="flex items-start gap-2">
               <div className="w-1.5 h-1.5 bg-primary rotate-45 shrink-0 mt-1"></div>
               <span>Note: do not cancel the deposit order after the money has been transferred.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Floating Deposit Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#282633] border-t border-white/5 p-4 flex items-center justify-between z-50 shadow-[0_-4px_15px_rgba(0,0,0,0.5)] max-w-md mx-auto">
        <div className="text-gray-400 text-xs font-semibold">
          Recharge Method:<br/>
          <span className="text-white text-sm font-bold">{activeChannel}</span>
        </div>
        <button 
          onClick={handleDeposit}
          disabled={!amount}
          className="bg-gradient-gold disabled:from-gray-600 disabled:to-gray-500 text-black px-10 py-3 rounded-full font-extrabold text-sm shadow-md transition-colors"
        >
          Deposit
        </button>
      </div>
    </div>
  );
}
