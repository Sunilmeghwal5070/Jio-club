import React from 'react';
import { Header } from '../components/Header';

export function Announcement() {
  const news = [
    { id: 1, title: 'Big Win Weekend!', date: '2024-03-20', content: 'Join us this weekend for double rewards on all slots!' },
    { id: 2, title: 'New Game: Golden Dragon', date: '2024-03-18', content: 'Our latest addition Golden Dragon is now live. Try your luck!' },
    { id: 3, title: 'System Maintenance', date: '2024-03-15', content: 'Scheduled maintenance complete. Performance improved.' },
  ];

  return (
    <div className="pb-24 min-h-screen bg-[#0d1117]">
      <Header title="Announcement" showBack />
      <div className="p-4 space-y-4">
        {news.map(item => (
          <div key={item.id} className="bg-[#161b22] p-5 rounded-3xl border border-white/5 shadow-md">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-blue-400">{item.title}</h3>
              <span className="text-[10px] text-gray-500 font-mono tracking-tighter">{item.date}</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">{item.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
