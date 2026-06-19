import React from 'react';
import { Header } from '../components/Header';
import { FileText } from 'lucide-react';
import { useApp } from '../store';

export function GameHistory() {
  const { myBets } = useApp();

  return (
    <div className="min-h-screen bg-bg-base relative pb-6">
      <Header title="Game history" />
      <div className="px-3 mt-[72px]">
        {myBets.length > 0 ? (
          <div className="flex flex-col gap-2 mb-4">
            {myBets.map((bet, i) => (
              <div key={i} className="bg-card-base rounded-lg p-3 border border-white/5 flex flex-col gap-1 relative shadow">
                <div className="flex items-center gap-2">
                   <div className={`text-xs font-bold px-2 py-1 rounded shadow ${bet.type === 'Big' ? 'bg-[#D97706]' : bet.type === 'Small' ? 'bg-[#2563EB]' : typeof bet.type === 'number' ? 'bg-purple-500' : 'bg-emerald-500'} text-white`}>{bet.type}</div>
                   <div className="text-gray-300 font-mono text-sm tracking-tight">{bet.period}</div>
                </div>
                <div className="text-[10px] text-gray-500 font-mono">{bet.timestamp}</div>
                <div className={`absolute top-3 right-3 text-xs font-bold px-3 py-1 rounded shadow-sm border bg-black/20 ${bet.status === 'Succeed' ? 'border-[#32D74B] text-[#32D74B]' : bet.status === 'Failed' ? 'border-[#FF453A] text-[#FF453A]' : 'border-yellow-500 text-yellow-500'}`}>
                  {bet.status}
                </div>
                {bet.status !== 'Pending' && (
                  <div className={`absolute bottom-3 right-3 font-bold text-sm ${bet.payout > 0 ? 'text-[#32D74B]' : 'text-[#FF453A]'}`}>
                     {bet.payout > 0 ? `+₹${bet.payout.toFixed(2)}` : `-₹${Math.abs(bet.payout).toFixed(2)}`}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center mt-32 text-gray-500">
            <FileText size={64} className="mb-4 opacity-50" />
            <p>No game history available</p>
          </div>
        )}
      </div>
    </div>
  );
}
