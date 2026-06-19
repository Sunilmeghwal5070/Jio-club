import React from 'react';
import { useApp } from '../store';
import { Header } from '../components/Header';
import { FileText } from 'lucide-react';
import { cn } from '../utils';

export function Transaction() {
  const { transactions } = useApp();

  return (
    <div className="min-h-screen bg-bg-base relative pb-6">
      <Header title="Transactions" />
      <div className="px-4 mt-4">
        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-20 text-gray-500">
            <FileText size={64} className="mb-4 opacity-50" />
            <p>No transactions available</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
             {transactions.map(tx => (
               <div key={tx.id} className="bg-card-base rounded-xl p-4 shadow-sm border border-card-base">
                  <div className="flex justify-between items-center mb-4">
                    <div className={cn("text-white text-sm font-bold px-3 py-1 rounded", tx.amount > 0 ? "bg-green-500" : "bg-orange-500")}>
                      {tx.amount > 0 ? "Deposit" : "Withdraw"}
                    </div>
                    <div className={cn("text-sm font-bold", tx.status === 'Complete' ? "text-green-500" : "text-red-500")}>
                      {tx.status}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                     <div className="flex justify-between text-sm">
                       <span className="text-gray-400">Balance</span>
                       <span className={cn("font-medium", tx.amount > 0 ? "text-green-500" : "text-orange-500")}>
                         {tx.amount > 0 ? '+' : ''}₹{Math.abs(tx.amount).toFixed(2)}
                       </span>
                     </div>
                     <div className="flex justify-between text-sm">
                       <span className="text-gray-400">Time</span>
                       <span className="text-gray-300">{tx.time}</span>
                     </div>
                  </div>
               </div>
             ))}
          </div>
        )}
      </div>
    </div>
  );
}
