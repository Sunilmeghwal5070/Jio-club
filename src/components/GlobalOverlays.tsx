import React from 'react';
import { useApp } from '../store';
import { Check } from 'lucide-react';

export function GlobalOverlays() {
  const { toastText } = useApp();

  return (
    <>
      {toastText && (
        <div className="fixed top-1/2 left-1/2 min-w-[200px] -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none animate-fade-in">
          <div className="bg-[#4d4d4d]/95 text-white rounded-md px-4 py-4 flex flex-col items-center justify-center gap-2 shadow-2xl">
            <Check size={28} className="text-white" strokeWidth={3} />
            <span className="text-sm font-medium">{toastText}</span>
          </div>
        </div>
      )}
    </>
  );
}
