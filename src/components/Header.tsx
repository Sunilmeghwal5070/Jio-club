import React from 'react';
import { useApp } from '../store';
import { ChevronLeft } from 'lucide-react';
import { cn } from '../utils';

export function Header({ title, rightContent, transparent = false }: { title: string, rightContent?: React.ReactNode, transparent?: boolean }) {
  const { goBack } = useApp();

  return (
    <>
      {/* Spacer to prevent content from hiding under fixed header */}
      <div className="h-14 w-full"></div>
      <div className={cn(
        "flex items-center justify-between px-4 h-14 fixed top-0 w-full max-w-md z-40 transition-colors backdrop-blur-[30px] saturate-200",
        transparent ? "bg-transparent text-white" : "bg-[#041408]/60 text-white border-b border-[#32D74B]/20 shadow-sm"
      )}>
        <button onClick={goBack} className="p-2 -ml-2 rounded-full hover:bg-[#32D74B]/10 transition-colors relative z-10 active:scale-95">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-medium absolute inset-0 flex items-center justify-center pointer-events-none">{title}</h1>
        <div className="flex-shrink-0 min-w-8 relative z-10">
          {rightContent}
        </div>
      </div>
    </>
  );
}
