import React from 'react';
import { useApp } from '../store';
import { Header } from '../components/Header';

export function Feedback() {
  return (
    <div className="pb-24 min-h-screen bg-[#0d1117]">
      <Header title="Feedback" showBack />
      <div className="p-4">
        <div className="bg-[#161b22] p-6 rounded-3xl border border-white/5 shadow-xl">
          <p className="text-gray-400 text-sm mb-6">Your feedback is very important to us. Please share your suggestions or issues.</p>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Category</label>
              <select className="w-full bg-[#0d1117] border border-white/10 rounded-2xl p-4 text-white focus:border-primary outline-none transition-colors">
                <option>General Feedback</option>
                <option>Bug Report</option>
                <option>Payment Issue</option>
                <option>Game Suggestion</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">Message</label>
              <textarea 
                rows={5}
                placeholder="Type your message here..."
                className="w-full bg-[#0d1117] border border-white/10 rounded-2xl p-4 text-white focus:border-primary outline-none transition-colors resize-none"
              />
            </div>
            <button className="w-full bg-gradient-blue text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-500/20 active:scale-95 transition-transform uppercase tracking-wider">
              Submit Feedback
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
