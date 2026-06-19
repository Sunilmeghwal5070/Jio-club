import React, { useState } from 'react';
import { useApp, getVipDetails } from '../store';
import { Header } from '../components/Header';
import { RefreshCw, CreditCard, PlusSquare } from 'lucide-react';
import { formatCurrency } from '../utils';

export function Withdraw() {
  const { user, setUser, navigate, selectedBankName, selectedUpiCode, addTransaction, setIsLoading, showToast, withdrawInstructions } = useApp();
  const [activeTab, setActiveTab] = useState('BANK CARD');
  const [amount, setAmount] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const withdrawAmountInput = Number(amount);
  const isSecondWithdrawal = user.todayWithdrawalCount >= 1;
  const withdrawalFee = isSecondWithdrawal ? 25 : 0;
  const totalAmountToDeduct = withdrawAmountInput > 0 ? withdrawAmountInput + withdrawalFee : 0;
  const vipInfo = getVipDetails(user.exp);

  const handleRefresh = () => {
    setRefreshing(true);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setRefreshing(false);
      showToast('Refresh successfully');
    }, 1000);
  };

  const handleWithdraw = () => {
    if (!amount) return; 
    
    if (activeTab === 'UPI' && !selectedUpiCode) return;
    if (activeTab === 'BANK CARD' && !selectedBankName) return;

    if (isNaN(withdrawAmountInput) || withdrawAmountInput <= 0) return;

    if (user.todayWithdrawalCount >= vipInfo.dailyLimit) {
      alert(`Daily withdrawal limit reached (${vipInfo.dailyLimit}). Upgrade VIP or try again tomorrow.`);
      return;
    }

    if (withdrawAmountInput > vipInfo.amountLimit) {
      alert(`Exceeds maximum allowed withdrawal of ₹${vipInfo.amountLimit} per transaction for your VIP level.`);
      return;
    }

    if (totalAmountToDeduct > user.totalBalance) {
      alert(`Insufficient balance. Note: A fee of ₹${withdrawalFee} applies.`);
      return;
    }

    addTransaction({
      id: `WD${Date.now()}`,
      type: activeTab,
      status: 'Complete',
      amount: -totalAmountToDeduct,
      time: new Date().toISOString().replace('T', ' ').substring(0, 19),
      orderNumber: `WD${Date.now()}81064297c`
    });

    setUser({
      ...user,
      totalBalance: user.totalBalance - totalAmountToDeduct,
      todayWithdrawalCount: user.todayWithdrawalCount + 1,
    });
    
    showToast(`Successfully withdrawn ₹${withdrawAmountInput}${isSecondWithdrawal ? ` (Fee: ₹25)` : ''}`);
    navigate('wallet');
  };

  return (
    <div className="min-h-screen bg-bg-base relative pb-6">
      <Header 
        title="Withdraw" 
        rightContent={<button onClick={() => navigate('withdrawHistory')} className="text-gray-300 text-sm font-medium hover:text-white">Withdrawal history</button>}
      />

      <div className="px-4 mt-4">
        {/* Balance Card */}
        <div className="bg-gradient-to-tr from-cyan-400 to-green-300 rounded-3xl p-5 mb-4 shadow-lg text-black relative overflow-hidden">
          <div className="flex items-center gap-1 font-medium mb-1 relative z-10">
            <span>👍</span> Available balance
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

        {/* Withdraw Methods */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div 
             onClick={() => setActiveTab('UPI')}
             className={`rounded-xl p-3 flex flex-col items-center justify-center text-sm font-bold shadow-md cursor-pointer transition-colors ${activeTab === 'UPI' ? 'bg-gradient-gold text-black' : 'bg-card-base text-gray-400 border border-white/5'}`}
          >
            <div className="bg-white rounded p-1 flex items-center justify-center mb-1">
               <span className="text-[10px] font-black text-black">UPI</span>
            </div>
            UPI
          </div>
          <div 
             onClick={() => setActiveTab('BANK CARD')}
             className={`rounded-xl p-3 flex flex-col items-center justify-center text-sm font-bold shadow-md cursor-pointer transition-colors ${activeTab === 'BANK CARD' ? 'bg-gradient-gold text-black' : 'bg-card-base text-gray-400 border border-white/5'}`}
          >
            <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded p-1 mb-1">
               <CreditCard size={18} className="text-white" />
            </div>
            BANK CARD
          </div>
        </div>

        {/* Add Method Area */}
        <div 
          onClick={() => navigate(activeTab === 'UPI' ? 'addUpi' : 'addBank')}
          className="bg-[#282633] border border-white/5 rounded-xl p-6 flex flex-col items-center justify-center gap-2 mb-4 cursor-pointer hover:bg-gray-800 transition-colors shadow-sm"
        >
          {activeTab === 'UPI' ? (
            selectedUpiCode ? (
              <div className="flex items-center gap-2 text-white font-bold">
                 <div className="bg-white rounded p-0.5"><span className="text-[10px] font-black text-black">UPI</span></div>
                 {selectedUpiCode} <span className="text-xs text-gray-400 ml-2 font-normal">(Linked)</span>
              </div>
            ) : (
               <>
                 <div className="w-10 h-10 border border-dashed border-gray-500 rounded-lg flex items-center justify-center mb-1">
                   <span className="text-gray-400 text-2xl font-light leading-none">+</span>
                 </div>
                 <span className="text-gray-400 text-sm font-medium">Add a UPI address</span>
               </>
            )
          ) : (
            selectedBankName ? (
              <div className="flex items-center gap-2 text-white font-bold">
                 <CreditCard size={20} className="text-primary" />
                 {selectedBankName} <span className="text-xs text-gray-400 ml-2 font-normal">(Linked)</span>
              </div>
            ) : (
               <>
                 <div className="w-10 h-10 border border-dashed border-gray-500 rounded-lg flex items-center justify-center mb-1">
                   <span className="text-gray-400 text-2xl font-light leading-none">+</span>
                 </div>
                 <span className="text-gray-400 text-sm font-medium">Add a bank account number</span>
               </>
            )
          )}
        </div>

        {((activeTab === 'UPI' && !selectedUpiCode) || (activeTab === 'BANK CARD' && !selectedBankName)) && (
          <div className="text-red-500 text-xs text-center font-medium mb-6">
            Need to add beneficiary information to be able to<br/>withdraw money
          </div>
        )}

        {/* Amount Input */}
        <div className="bg-[#1C1A24] border border-white/5 rounded-full px-5 py-3.5 flex items-center mb-4">
           <span className="text-primary font-bold text-lg mr-4">₹</span>
           <input 
             type="number" 
             placeholder="Please enter the amount" 
             value={amount}
             onChange={(e) => setAmount(e.target.value)}
             className="flex-1 bg-transparent border-none outline-none text-white font-medium placeholder:text-gray-600"
           />
           {amount && (
             <button onClick={() => setAmount('')} className="w-5 h-5 rounded-full border border-gray-500 text-gray-500 flex items-center justify-center hover:bg-white/10 shrink-0">
               <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
             </button>
           )}
        </div>

        <div className="flex justify-between items-center px-1 mb-2 text-sm">
          <span className="text-gray-400">Withdrawable balance <span className="text-[#32D74B] font-bold">₹{user.totalBalance.toFixed(2)}</span></span>
          <button 
             onClick={() => {
               const maxAvail = user.totalBalance - withdrawalFee;
               const finalAmount = Math.min(maxAvail, vipInfo.amountLimit);
               setAmount(finalAmount > 0 ? finalAmount.toString() : '0');
             }}
             className="border border-[#32D74B] text-[#32D74B] px-4 py-0.5 rounded-full font-bold text-xs hover:bg-[#32D74B]/10"
          >
            All
          </button>
        </div>
        
        {withdrawalFee > 0 && (
          <div className="flex justify-between items-center px-1 mb-2 text-sm">
            <span className="text-gray-400">Withdrawal fee</span>
            <span className="text-red-500 font-bold">₹{withdrawalFee.toFixed(2)}</span>
          </div>
        )}
        
        <div className="flex justify-between items-center px-1 mb-6 text-sm">
          <span className="text-gray-400">Withdrawal amount received</span>
          <span className="text-primary font-bold">₹{amount ? (withdrawAmountInput > 0 ? (withdrawAmountInput).toFixed(2) : '0.00') : '0.00'}</span>
        </div>

        <button 
           onClick={handleWithdraw}
           disabled={!amount || !selectedBankName}
           className="w-full bg-[#3e3b4a] disabled:opacity-80 text-gray-300 font-extrabold text-lg py-3.5 rounded-full shadow mb-6 transition-colors data-[active=true]:bg-gradient-gold data-[active=true]:text-black"
           data-active={(!!amount && !!selectedBankName)}
        >
          Withdraw
        </button>

        {/* Instructions */}
        <div className="bg-[#282633] border border-white/5 rounded-2xl p-5 shadow-sm">
          <ul className="text-gray-400 text-xs space-y-4 font-medium">
            {withdrawInstructions.map((instruction, index) => (
              <li key={index} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-primary rotate-45 shrink-0 mt-1"></div>
                <span>{instruction.split(/₹\d+(?:,\d+)*(?:\.\d+)?|\d+:\d+(?:-\d+:\d+)?|\b\d+\b/).map((part, i, arr) => {
                  const match = instruction.slice(part.length).match(/₹\d+(?:,\d+)*(?:\.\d+)?|\d+:\d+(?:-\d+:\d+)?|\b\d+\b/);
                  const highlights = instruction.match(/₹\d+(?:,\d+)*(?:\.\d+)?|\d+:\d+(?:-\d+:\d+)?|\b\d+\b/g) || [];
                  return (
                    <React.Fragment key={i}>
                      {part}
                      {i < arr.length - 1 && <span className="text-red-500">{highlights[i]}</span>}
                    </React.Fragment>
                  );
                })}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* History Area */}
        <div className="mt-6 mb-4 font-bold text-lg flex items-center gap-2 px-1">
          <div className="w-4 h-5 bg-gradient-gold rounded-sm flex items-center justify-center shadow-sm">
            <div className="w-2.5 h-[1px] bg-black"></div>
          </div>
          Withdrawal history
        </div>
        
        <div className="flex flex-col items-center justify-center py-8 opacity-50">
           <svg width="100" height="80" viewBox="0 0 100 80" className="text-gray-600 mb-2 fill-current">
              <path d="M20 20h60v40H20z" opacity=".2"/><path d="M30 10h50v50H30z" opacity=".5"/>
           </svg>
           <span className="text-xs font-medium">No data</span>
        </div>
        
        <button onClick={() => navigate('withdrawHistory')} className="w-full border border-primary text-primary font-bold text-sm py-3.5 rounded-full mt-2 hover:bg-primary/10 transition-colors">
          All history
        </button>

      </div>
    </div>
  );
}
