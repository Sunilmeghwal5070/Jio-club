import React from 'react';
import { useApp } from '../store';
import { ChevronLeft } from 'lucide-react';
import { cn } from '../utils';

interface HeaderProps {
  title: string;
  rightContent?: React.ReactNode;
  transparent?: boolean;
  withSwitcher?: boolean;
  showBack?: boolean;
}

export function Header({ title, rightContent, transparent = false, withSwitcher = false, showBack = true }: HeaderProps) {
  const { goBack, navigate, currentRoute } = useApp();

  return (
    <>
      {/* Spacer to prevent content from hiding under fixed header */}
      <div className="h-14 w-full"></div>
      <div className={cn(
        "flex items-center justify-between px-4 h-14 fixed top-0 w-full max-w-md z-40 transition-colors backdrop-blur-[30px] saturate-200",
        transparent ? "bg-transparent text-white" : "bg-[#161b22]/90 text-white border-b border-blue-500/10 shadow-lg"
      )}>
        {showBack ? (
          <button onClick={goBack} className="p-2 -ml-2 rounded-full hover:bg-white/5 transition-colors relative z-10 active:scale-95">
            <ChevronLeft size={24} className="text-gray-400" />
          </button>
        ) : (
          <div className="w-10"></div>
        )}

        {withSwitcher ? (
          <div className="absolute inset-x-0 flex items-center justify-center pointer-events-none">
            <div className="bg-black/40 p-1 rounded-full flex border border-white/5 pointer-events-auto">
              <button 
                onClick={() => navigate('deposit')}
                className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-tight transition-all ${currentRoute === 'deposit' ? 'bg-blue-600 text-white shadow-xl' : 'text-gray-400 hover:text-white'}`}
              >
                Deposit
              </button>
              <button 
                onClick={() => navigate('withdraw')}
                className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-tight transition-all ${currentRoute === 'withdraw' ? 'bg-sky-600 text-white shadow-xl' : 'text-gray-400 hover:text-white'}`}
              >
                Withdraw
              </button>
            </div>
          </div>
        ) : (
          <h1 className="text-lg font-medium absolute inset-0 flex items-center justify-center pointer-events-none tracking-tight">{title}</h1>
        )}

        <div className="flex-shrink-0 min-w-8 relative z-10">
          {rightContent}
        </div>
      </div>
    </>
  );
}
