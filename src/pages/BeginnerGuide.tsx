import React from 'react';
import { Header } from '../components/Header';
import { BookOpen, Target, ShieldCheck, Wallet } from 'lucide-react';

export function BeginnerGuide() {
  const steps = [
    { icon: <ShieldCheck className="text-blue-400" />, title: 'Register Account', desc: 'Click on Register and fill in your details to create a secure account.' },
    { icon: <Wallet className="text-yellow-400" />, title: 'Make a Deposit', desc: 'Choose from multiple payment methods to top up your balance instantly.' },
    { icon: <Target className="text-red-400" />, title: 'Pick a Game', desc: 'Explore our vast library of slots, lottery and popular games.' },
    { icon: <BookOpen className="text-green-400" />, title: 'Start Winning', desc: 'Play responsibly and enjoy the premium gaming experience.' },
  ];

  return (
    <div className="pb-24 min-h-screen bg-[#0d1117]">
      <Header title="Beginner's Guide" showBack />
      <div className="p-4 space-y-4">
        {steps.map((step, idx) => (
          <div key={idx} className="bg-[#161b22] p-6 rounded-3xl border border-white/5 flex gap-4 items-start">
            <div className="bg-white/5 p-3 rounded-2xl">
              {step.icon}
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight mb-1">{step.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
