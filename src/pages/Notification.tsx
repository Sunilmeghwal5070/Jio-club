import React from 'react';
import { Header } from '../components/Header';
import { Bell } from 'lucide-react';
import { useApp } from '../store';

export function Notification() {
  const { unreadNotifications, markNotificationsRead } = useApp();

  React.useEffect(() => {
    // When visiting the page, mark notifications as read after 1 second
    const t = setTimeout(() => {
      markNotificationsRead();
    }, 1000);
    return () => clearTimeout(t);
  }, [markNotificationsRead]);

  return (
    <div className="min-h-screen bg-bg-base relative pb-6">
      <Header title="Notification" />
      <div className="px-4 py-4 space-y-4">
        <div className="bg-gradient-card rounded-2xl p-4 border border-white/5 relative">
          {unreadNotifications > 0 && <div className="absolute top-4 right-4 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>}
          <div className="text-[#32D74B] font-bold mb-1">Welcome to Jio Club!</div>
          <div className="text-sm text-gray-300">Get ₹100 on your first deposit. Don't miss out!</div>
          <div className="text-xs text-gray-500 mt-2">2 hours ago</div>
        </div>
        <div className="bg-gradient-card rounded-2xl p-4 border border-white/5 relative">
          {unreadNotifications > 1 && <div className="absolute top-4 right-4 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>}
          <div className="text-[#FF453A] font-bold mb-1">System Upgrade Notice</div>
          <div className="text-sm text-gray-300">We will be performing a short scheduled maintenance tonight at 2 AM.</div>
          <div className="text-xs text-gray-500 mt-2">1 day ago</div>
        </div>
        <div className="bg-gradient-card rounded-2xl p-4 border border-white/5 relative opacity-70">
          <div className="text-gray-300 font-bold mb-1">Daily Check-in Bonus</div>
          <div className="text-sm text-gray-400">Remember to claim your daily attendance bonus in the Activity section.</div>
          <div className="text-xs text-gray-500 mt-2">3 days ago</div>
        </div>
      </div>
    </div>
  );
}
