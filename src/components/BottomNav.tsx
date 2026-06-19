import React from 'react';
import { useApp } from '../store';
import { cn } from '../utils';
import { Heart, Gift, Gamepad2, Wallet, UserRound } from 'lucide-react';
import { motion } from 'motion/react';

export function BottomNav() {
  const { currentRoute, navigate, unreadNotifications } = useApp();

  // Hide bottom nav on some pages
  const hiddenRoutes = ['depositHistory', 'vip', 'settings', 'attendance', 'gift', 'login', 'register', 'deposit', 'withdraw', 'addBank', 'chooseBank', 'wingo'];
  if (hiddenRoutes.includes(currentRoute)) return null;

  const navItems: Array<{id: any, label: string, icon: any, special?: boolean}> = [
    { id: 'promotion', label: 'Promotion', icon: Heart },
    { id: 'activity', label: 'Activity', icon: Gift },
    { id: 'home', label: 'Home', icon: Gamepad2, special: true },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'account', label: 'Account', icon: UserRound },
  ];

  return (
    <>
      {/* Spacer to prevent content from hiding behind the nav */}
      <div className="h-20 shrink-0 pointer-events-none" />
      <div className="fixed bottom-0 left-0 right-0 h-[68px] bg-[#151515] shadow-[0_-5px_20px_rgba(0,0,0,0.9)] flex items-center justify-around z-[100] px-2 pb-safe border-t border-[#333]">
        {navItems.map((item) => {
          const isActive = currentRoute === item.id;
          const Icon = item.icon;

          if (item.special) {
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className="relative -top-5 flex flex-col items-center justify-center transform active:scale-95 transition-transform"
              >
                <div className={cn(
                  "w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 border-4 border-[#151515] shadow-lg",
                  isActive 
                    ? "bg-[#32D74B] text-white" 
                    : "bg-[#2a2a2a] text-gray-300 hover:text-white"
                )}>
                  <Icon size={28} className={isActive ? "text-black" : ""} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className={cn(
                  "text-[11px] mt-1 font-extrabold transition-colors duration-300",
                  isActive ? "text-[#32D74B]" : "text-gray-400"
                )}>{item.label}</span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              className="flex flex-col items-center justify-center p-2 w-16 relative transform active:scale-95 transition-transform"
            >
              <div className={cn(
                "p-1 rounded-xl mb-0.5 transition-all text-gray-400 drop-shadow-sm",
                isActive ? "text-[#32D74B]" : "text-gray-400 hover:text-gray-200"
              )}>
                {item.id === 'account' && unreadNotifications > 0 && (
                   <span className="absolute top-1 right-2 w-3 h-3 bg-red-600 rounded-full border-2 border-[#151515] shadow-sm"></span>
                )}
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={cn(
                "text-[10px] font-extrabold transition-colors drop-shadow-sm",
                isActive ? "text-[#32D74B]" : "text-gray-400"
              )}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
}
