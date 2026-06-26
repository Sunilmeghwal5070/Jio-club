import React, { useEffect, useState } from 'react';
import { useApp } from '../store';
import { Header } from '../components/Header';

export function GamePlaceholder({ title }: { title: string }) {
  const { navigate } = useApp();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-bg-base relative pb-6 flex flex-col">
      <Header title={title} />
      
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {loading ? (
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400 font-bold">Loading {title}...</p>
          </div>
        ) : (
          <div className="bg-card-base p-6 rounded-2xl border border-white/5 shadow-xl text-center w-full max-w-sm">
            <div className="text-4xl mb-4">🎮</div>
            <h2 className="text-xl font-black mb-2 text-white uppercase">{title}</h2>
            <p className="text-sm text-gray-400 mb-6">
              Please paste the game logic code for {title} so I can fully implement it!
            </p>
            <button 
              onClick={() => navigate('home')}
              className="bg-blue-600 hover:bg-blue-500 text-white w-full py-3 rounded-xl font-bold uppercase"
            >
              Back to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
