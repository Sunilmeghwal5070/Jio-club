import React, { useState, useEffect } from 'react';
import { useApp } from '../store';
import { formatCurrency } from '../utils';
import { ArrowLeft, Copy } from 'lucide-react';

export function DepositPayment() {
  const { navigate, goBack, pendingDepositAmount, user, setUser, addTransaction, addBonusRecord, showToast, sysConfig } = useApp();
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [utr, setUtr] = useState('');

  const upiId = sysConfig.upiId || 'meghwal.12@superyes';
  const merchantName = sysConfig.merchantName || 'JioClub';

  useEffect(() => {
    if (!pendingDepositAmount) {
      goBack();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          goBack();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [pendingDepositAmount, goBack]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('Copied to clipboard');
  };

  const getBonus = (amt: number) => {
    const amounts = sysConfig.depositAmounts.split(',').map(Number);
    const bonusesArr = sysConfig.depositBonuses.split(',').map(Number);
    const idx = amounts.indexOf(amt);
    if (idx !== -1) {
      const percentage = bonusesArr[idx] || 0;
      return Math.floor(amt * (percentage / 100));
    }
    return 0;
  };

  const handleSubmit = () => {
    if (utr.length !== 12) {
      showToast('Please enter a valid 12 digits UTR');
      return;
    }

    const depositAmt = pendingDepositAmount;
    const bonusAmt = getBonus(depositAmt);
    const totalAmt = depositAmt + bonusAmt;

    // Simulate creating a transaction
    addTransaction({
      id: `RC${Date.now()}`,
      type: 'UPI-QR',
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
    
    showToast(`Deposited ${formatCurrency(depositAmt)} + ${formatCurrency(bonusAmt)} bonus successfully!`);
    setTimeout(() => navigate('wallet'), 1000);
  };

  return (
    <div className="min-h-screen bg-[#1E1C25] relative pb-6 text-gray-200">
      <div className="bg-[#151515] px-4 py-3 flex items-center justify-between shadow-lg sticky top-0 z-40 border-b border-white/5">
        <div className="flex items-center gap-3">
          <ArrowLeft size={24} className="text-yellow-500 cursor-pointer" onClick={goBack} />
          <span className="text-lg font-bold text-white">Scan to Pay</span>
        </div>
      </div>

      <div className="p-4">
        <div className="bg-[#1F1E29] rounded-xl p-4 border border-white/10 flex justify-between items-center mb-4">
          <div className="text-3xl font-bold text-white">₹{pendingDepositAmount}</div>
          <div className="text-red-500 font-mono text-xl">{formatTime(timeLeft)}</div>
        </div>

        <div className="bg-[#2B2936] rounded-xl p-6 border border-white/5 flex flex-col items-center">
          <div className="bg-white p-2 rounded-xl mb-6">
            {/* Generate a mock QR code image using a placeholder API */}
            <img 
              src={sysConfig.qrUrl || `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=${upiId}&pn=${merchantName}&am=${pendingDepositAmount}`} 
              alt="QR Code" 
              className="w-48 h-48 rounded"
            />
          </div>

          <p className="text-center text-sm text-gray-400 mb-6">
            Scan QR code using Paytm, PhonePe, Google Pay, or any UPI App to pay.
          </p>

          <div className="w-full bg-[#1F1E29] rounded-lg p-3 mb-6 relative border border-white/5">
            <div className="text-xs text-gray-500 mb-1">UPI ID</div>
            <div className="text-yellow-500 font-medium tracking-wider">{upiId}</div>
            <button 
              onClick={() => handleCopy(upiId)}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-yellow-500 text-black px-3 py-1 rounded-md text-xs font-bold flex items-center gap-1"
            >
              <Copy size={12} /> Copy
            </button>
          </div>

          <div className="w-full text-center mb-3">
            <span className="text-xs text-yellow-500 font-semibold tracking-wide">🚀 Instant Mobile App Pay (No scan required):</span>
          </div>

          <div className="flex w-full gap-3 mb-3">
            <a href={`phonepe://pay?pa=${upiId}&pn=${merchantName}&am=${pendingDepositAmount}`} className="flex-1 bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors">
              <div className="w-4 h-4 rounded-full bg-white/20"></div> PhonePe
            </a>
            <a href={`paytmmp://pay?pa=${upiId}&pn=${merchantName}&am=${pendingDepositAmount}`} className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors">
              <div className="w-4 h-4 rounded-full bg-white/20"></div> Paytm
            </a>
          </div>

          <a href={`upi://pay?pa=${upiId}&pn=${merchantName}&am=${pendingDepositAmount}`} className="w-full bg-yellow-600 hover:bg-yellow-500 text-black font-extrabold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors">
            📱 Pay using other UPI Apps (GPay, BHIM, etc)
          </a>
        </div>

        <div className="mt-6">
          <div className="text-sm font-bold text-gray-300 mb-2">UTR Number / Ref. No.</div>
          <div className="relative">
            <input 
              type="text" 
              maxLength={12}
              value={utr}
              onChange={(e) => setUtr(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="Enter 12 digits UTR" 
              className="w-full bg-[#2B2936] border border-white/10 text-white rounded-lg p-4 font-mono text-lg focus:outline-none focus:border-yellow-500 transition-colors"
            />
            <button 
              onClick={async () => {
                try {
                  const text = await navigator.clipboard.readText();
                  if (text && text.match(/^\d{12}$/)) {
                    setUtr(text);
                  } else if (text) {
                     setUtr(text.replace(/[^0-9]/g, '').substring(0, 12));
                  }
                } catch (err) {
                  showToast('Clipboard access denied');
                }
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-yellow-500 text-black px-4 py-2 rounded font-bold text-sm"
            >
              Paste
            </button>
          </div>
        </div>

        <button 
          onClick={handleSubmit}
          className="w-full bg-yellow-500 text-black font-extrabold text-lg py-4 rounded-xl shadow-lg mt-8 active:scale-95 transition-transform"
        >
          SUBMIT UTR
        </button>
      </div>
    </div>
  );
}
