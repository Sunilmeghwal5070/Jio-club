import React from 'react';
import { Header } from '../components/Header';
import { formatCurrency } from '../utils';

export function AttendanceRules() {
  const rules = [
    { day: 1, acc: 200, bonus: 6 },
    { day: 2, acc: 300, bonus: 16 },
    { day: 3, acc: 500, bonus: 26 },
    { day: 4, acc: 1000, bonus: 36 },
    { day: 5, acc: 3000, bonus: 66 },
    { day: 6, acc: 5000, bonus: 166 },
    { day: 7, acc: 10000, bonus: 266 },
  ];

  return (
    <div className="min-h-screen bg-[#1F1920] relative pb-6 text-gray-200">
      <Header title="Game Rules" />

      <div className="pt-16">
        <table className="w-full text-center text-sm">
          <thead>
            <tr className="bg-[#D98E2A] text-white">
              <th className="py-3 font-semibold w-1/3 leading-tight opacity-90">Continuous<br/>attendance</th>
              <th className="py-3 font-semibold w-1/3 leading-tight opacity-90 border-x border-white/20">Accumulated<br/>amount</th>
              <th className="py-3 font-semibold w-1/3 leading-tight opacity-90">Attendance<br/>bonus</th>
            </tr>
          </thead>
          <tbody>
            {rules.map((rule, idx) => (
              <tr key={rule.day} className={idx % 2 === 0 ? 'bg-[#3A2D35]' : 'bg-[#2E242A]'}>
                <td className="py-3.5 text-white/90">{rule.day}</td>
                <td className="py-3.5 text-white/70">{formatCurrency(rule.acc)}</td>
                <td className="py-3.5 text-white/70">{formatCurrency(rule.bonus)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6 mx-4 bg-[#231A1E] rounded-t-xl rounded-b-xl border border-white/5 relative shadow-xl overflow-hidden pb-4">
          <div className="bg-[#D98E2A] text-center font-bold text-white py-1.5 w-[140px] mx-auto rounded-b-xl mb-4 relative z-10 shadow-sm">
            Rules
          </div>
          
          <ul className="space-y-4 px-4 text-sm text-gray-400">
            <li className="flex gap-2.5">
              <span className="text-[#D98E2A] mt-1 shrink-0 text-[10px]">◆</span>
              <p className="leading-snug">The higher the number of consecutive login days, the more rewards you get, up to 7 consecutive days</p>
            </li>
            <li className="flex gap-2.5">
              <span className="text-[#D98E2A] mt-1 shrink-0 text-[10px]">◆</span>
              <p className="leading-snug">During the activity, please check once a day</p>
            </li>
            <li className="flex gap-2.5">
              <span className="text-[#D98E2A] mt-1 shrink-0 text-[10px]">◆</span>
              <p className="leading-snug">Players with no deposit history cannot claim the bonus</p>
            </li>
            <li className="flex gap-2.5">
              <span className="text-[#D98E2A] mt-1 shrink-0 text-[10px]">◆</span>
              <p className="leading-snug">Deposit requirements must be met from day one</p>
            </li>
            <li className="flex gap-2.5">
              <span className="text-[#D98E2A] mt-1 shrink-0 text-[10px]">◆</span>
              <p className="leading-snug">The platform reserves the right to final interpretation of this activity</p>
            </li>
            <li className="flex gap-2.5">
              <span className="text-[#D98E2A] mt-1 shrink-0 text-[10px]">◆</span>
              <p className="leading-snug">When you encounter problems, please contact customer service</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
