import React from 'react';
import { useApp } from '../store';
import { Header } from '../components/Header';

export function Attendance() {
  const { addBonusRecord, showToast, user, setUser, navigate } = useApp();
  
  const rules = [
    { day: 1, acc: 200, bonus: 6 },
    { day: 2, acc: 300, bonus: 16 },
    { day: 3, acc: 500, bonus: 26 },
    { day: 4, acc: 1000, bonus: 36 },
    { day: 5, acc: 3000, bonus: 66 },
    { day: 6, acc: 5000, bonus: 166 },
    { day: 7, acc: 10000, bonus: 266 },
  ];

  const todayStr = new Date().toDateString();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toDateString();

  const attendedToday = user.lastAttendanceDate === todayStr;
  
  let currentStreak = user.attendanceDays || 0;
  if (!attendedToday && user.lastAttendanceDate !== yesterdayStr && user.lastAttendanceDate !== '') {
    currentStreak = 0; // streak broken
  }
  if (!attendedToday && currentStreak >= 7) {
    currentStreak = 0; // reset after 7 days
  }

  const nextDayIndex = Math.min(currentStreak, 6);
  const currentRule = rules[nextDayIndex];

  const [isClaiming, setIsClaiming] = React.useState(false);

  const handleAttendance = () => {
    if (attendedToday || isClaiming) {
      if (attendedToday) showToast('You have already claimed attendance for today');
      return;
    }
    
    setIsClaiming(true);

    if (user.totalDeposit < currentRule.acc) {
      showToast(`Accumulated deposit must reach ₹${currentRule.acc} to claim day ${currentRule.day} bonus`);
      setIsClaiming(false);
      return;
    }

    const bonus = currentRule.bonus;
    addBonusRecord('Attendance Bonus', bonus);
    
    setUser(prev => ({ 
      ...prev, 
      totalBalance: prev.totalBalance + bonus,
      attendanceDays: currentStreak + 1,
      lastAttendanceDate: todayStr
    }));
    
    showToast(`Claimed day ${currentRule.day} attendance bonus of ₹${bonus}`);
  };

  return (
    <div className="min-h-screen bg-bg-base relative pb-24">
      <Header title="Attendance" transparent />

      <div className="bg-red-500 pt-16 pb-8 px-4 relative overflow-hidden mt-[-56px] rounded-b-3xl">
         <div className="relative z-10">
           <h1 className="text-2xl font-semibold mb-1 text-white">Attendance bonus</h1>
           <p className="text-white/80 text-xs w-[200px] mb-4">
             Get rewards based on consecutive login days
           </p>

           <div className="bg-white text-red-500 font-medium py-1 px-3 rounded-l-md rounded-tr-md inline-block text-xs mb-4 shadow relative">
             Attended consecutively <span className="text-red-500 font-black text-sm">{currentStreak}</span> Day
             <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-l-[8px] border-l-white"></div>
           </div>

           <div className="text-white/80 text-xs mb-1">Accumulated Deposit</div>
           <div className="text-2xl font-bold text-white tracking-wide">₹{user.totalDeposit.toFixed(2)}</div>

           <div className="flex gap-4 mt-6">
             <button onClick={() => navigate('attendanceRules')} className="bg-gradient-gold text-black text-xs font-semibold px-4 py-1.5 rounded-full shadow">Game Rules</button>
             <button onClick={() => navigate('attendanceHistory')} className="border border-white text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow hover:bg-white/10 transition-colors">Attendance history</button>
           </div>
         </div>
         
         <div className="absolute right-0 bottom-0 text-9xl translate-x-4 translate-y-4 opacity-90 drop-shadow-2xl z-0">
           📅
         </div>
         <div className="absolute right-4 bottom-4 w-40 h-40 bg-pink-500 rounded-full blur-3xl opacity-50 z-0"></div>
      </div>

      <div className="px-4 mt-4">
        <div className="grid grid-cols-3 gap-3 mb-3">
          {rules.slice(0, 6).map((r, idx) => (
            <div key={r.day} className={`bg-card-base rounded-lg py-4 flex flex-col items-center justify-center gap-2 border border-white/5 ${idx < currentStreak ? 'opacity-100 border-primary' : 'opacity-50'}`}>
               <div className="text-white font-medium">₹{r.bonus.toFixed(2)}</div>
               <div className="w-10 h-10 rounded-full bg-gradient-gold p-0.5 shadow-lg">
                 <div className="w-full h-full rounded-full border-2 border-yellow-700 flex items-center justify-center text-yellow-800 text-lg">★</div>
               </div>
               <div className="text-[10px] text-gray-400 font-medium">{r.day} Day</div>
            </div>
          ))}
        </div>

        {/* Day 7 */}
        <div className={`bg-card-base rounded-lg p-4 border border-white/5 flex items-center justify-between ${currentStreak >= 7 ? 'opacity-100 border-primary' : 'opacity-50'}`}>
           <div className="text-6xl drop-shadow-lg -ml-2 -mt-4">🎁</div>
           <div className="flex flex-col items-center bg-bg-base/50 px-4 py-2 rounded-lg border border-white/5">
             <div className="flex items-center gap-4 text-white font-medium mb-1">
               <span className="w-4 h-[1px] bg-white/20 block"></span>
               ₹{rules[6].bonus.toFixed(2)}
               <span className="w-4 h-[1px] bg-white/20 block"></span>
             </div>
             <div className="text-[10px] text-gray-400">7 Day</div>
           </div>
        </div>

        <button 
          onClick={handleAttendance}
          disabled={attendedToday}
          className="w-full mt-6 bg-gradient-gold text-black font-bold py-3 rounded-xl shadow-lg hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:grayscale disabled:scale-100"
        >
          {attendedToday ? 'Attended' : 'Attendance'}
        </button>
      </div>

    </div>
  );
}
