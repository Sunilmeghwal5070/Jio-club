import React from 'react';
import { Header } from '../components/Header';

export function AboutUs() {
  return (
    <div className="pb-24 min-h-screen bg-[#0d1117]">
      <Header title="About Us" showBack />
      <div className="p-6">
        <div className="bg-[#161b22] p-8 rounded-[40px] border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl -mr-10 -mt-10" />
          
          <h1 className="text-4xl font-black italic tracking-tighter text-blue-500 mb-6 drop-shadow-sm">JIO CLUB</h1>
          
          <div className="space-y-6 text-gray-400 leading-relaxed">
            <p>
              Jio Club is India's leading platform for premium online gaming. We provide a secure, fair, and exciting environment for players to enjoy their favorite games.
            </p>
            
            <div className="space-y-2">
              <h3 className="text-white font-bold uppercase tracking-widest text-xs">Our Mission</h3>
              <p>To provide high-quality entertainment with the fastest withdrawal service and 24/7 customer support.</p>
            </div>

            <div className="pt-6 border-t border-white/5">
              <p className="text-[10px] uppercase font-mono tracking-widest">© 2024 JIO CLUB PREMIUM GAMING</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
