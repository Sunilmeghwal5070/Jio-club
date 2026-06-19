import React from 'react';
import { useApp } from '../store';
import { Header } from '../components/Header';
import { Gift, Calendar } from 'lucide-react';
import { formatCurrency } from '../utils';

export function BonusHistory() {
  const { bonusRecords } = useApp();

  return (
    <div className="min-h-screen bg-bg-base relative pb-6">
      <Header title="Bonus Details" />

      <div className="pt-20 px-4">
        {bonusRecords.length > 0 ? (
          <div className="space-y-3">
            {bonusRecords.map(record => (
              <div key={record.id} className="bg-card-base p-4 rounded-xl flex items-center justify-between border border-white/5 space-x-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
                    <Gift size={20} />
                  </div>
                  <div>
                    <div className="text-gray-200 text-sm font-medium mb-0.5">{record.name}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar size={10} />
                      {record.date}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[#32D74B] font-bold text-sm mb-0.5 whitespace-nowrap">+{formatCurrency(record.amount)}</div>
                  <div className="text-[10px] text-gray-400">Claimed</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 opacity-50">
            <svg width="100" height="80" viewBox="0 0 100 80" className="text-gray-600 mb-2 fill-current">
              <path d="M20 20h60v40H20z" opacity=".2"/><path d="M30 10h50v50H30z" opacity=".5"/>
            </svg>
            <span className="text-xs">No bonus records found</span>
          </div>
        )}
      </div>
    </div>
  );
}
