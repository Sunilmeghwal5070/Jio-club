import React from 'react';
import { useApp } from '../store';
import { Header } from '../components/Header';
import { Calendar } from 'lucide-react';
import { formatCurrency } from '../utils';

export function AttendanceHistory() {
  const { bonusRecords } = useApp();
  
  const attendanceRecords = bonusRecords.filter(r => r.name === 'Attendance Bonus');

  return (
    <div className="min-h-screen bg-bg-base relative pb-6">
      <Header title="Attendance history" />

      <div className="pt-20 px-4">
        {attendanceRecords.length > 0 ? (
          <div className="space-y-3">
            {attendanceRecords.map(record => (
              <div key={record.id} className="bg-card-base p-4 rounded-xl flex items-center justify-between border border-white/5 space-x-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <div className="text-gray-200 text-sm font-medium mb-0.5">{record.name}</div>
                    <div className="text-xs text-gray-500">{record.date}</div>
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
            <svg width="120" height="100" viewBox="0 0 120 100" className="text-gray-600 mb-4 fill-current">
              <path d="M40 20h40v60H40z" opacity=".2"/>
              <path d="M50 10h40v60H50z" opacity=".5"/>
              <path d="M20 30L40 40V30z" opacity=".4"/>
              <circle cx="20" cy="50" r="4" opacity=".2"/>
              <circle cx="95" cy="40" r="5" opacity=".2"/>
            </svg>
            <span className="text-sm font-medium text-gray-400">No data</span>
          </div>
        )}
      </div>
    </div>
  );
}
