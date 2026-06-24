import React, { useState } from 'react';
import { useApp } from '../store';
import { ChevronLeft, Lock, Smartphone, Users, FileText, Eye, EyeOff } from 'lucide-react';

export function Register() {
  const { navigate, registerUser, triggerCaptcha } = useApp();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);

  const handleRegister = async () => {
    if (!phone || !password || !agreed) return;
    
    setLoggingIn(true);
    await registerUser({ phone, loginPassword: password }); 
    setLoggingIn(false);
  };

  return (
    <div className="min-h-screen bg-bg-base relative flex flex-col">
      {/* Basic header for login flow */}
      <div className="flex items-center px-4 h-14 border-b border-white/5 relative bg-bg-base">
        <button onClick={() => navigate('login')} className="p-2 -ml-2 rounded-full absolute hover:bg-white/5 transition-colors">
          <ChevronLeft size={24} />
        </button>
        <div className="flex-1 flex justify-center items-center gap-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-black border-2 border-[#D4AF37] bg-gradient-to-r from-[#E8E8E8] to-[#D4AF37]">
            JC
          </div>
          <span className="text-xl font-bold tracking-tight text-gradient">JIO CLUB</span>
        </div>
        <div className="absolute right-4 flex items-center gap-1.5 text-xs bg-white/5 px-2.5 py-1 rounded-full cursor-pointer">
          <img src="https://flagcdn.com/w20/us.png" alt="EN" className="w-4 h-3 object-cover rounded-sm" />
          <span>EN</span>
        </div>
      </div>

      <div className="flex-1 px-5 pt-6 pb-8">
        <h1 className="text-gray-400 text-sm mb-4">Please register by phone number or email</h1>

        {/* Tab */}
        <div className="flex mb-8 border-b border-white/20">
          <div className="flex-1 flex flex-col items-center gap-2 pb-3 font-semibold text-primary border-b-2 border-primary">
            <Smartphone size={20} />
            <span className="text-sm">Register your phone</span>
          </div>
        </div>

        {/* Forms */}
        <div className="flex flex-col gap-5 mb-8">
           <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-sm text-gray-300 font-medium">
                <Smartphone size={16} className="text-primary" /> Phone number
              </label>
              <div className="flex gap-2">
                <div className="bg-card-base border border-white/5 rounded-xl px-3 py-3.5 flex items-center gap-1 w-[90px] shrink-0 text-gray-300">
                  <span>+91</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
                </div>
                <input 
                  type="tel"
                  placeholder="Please enter the phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="flex-1 bg-card-base border border-white/5 rounded-xl px-4 py-3.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 text-sm"
                />
              </div>
           </div>

           <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-sm text-gray-300 font-medium">
                <Lock size={16} className="text-primary" /> Set password
              </label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Set password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-card-base border border-white/5 rounded-xl px-4 py-3.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 text-sm pr-10"
                />
                <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
           </div>

           <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-sm text-gray-300 font-medium">
                <Lock size={16} className="text-primary" /> Confirm password
              </label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Confirm password"
                  className="w-full bg-card-base border border-white/5 rounded-xl px-4 py-3.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 text-sm pr-10"
                />
                <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
           </div>

           <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-sm text-gray-300 font-medium">
                <Users size={16} className="text-primary" /> Invite code
              </label>
              <input 
                type="text"
                placeholder="Please enter the invitation code"
                className="w-full bg-card-base border border-white/5 rounded-xl px-4 py-3.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 text-sm"
              />
           </div>

           <label className="flex items-center gap-2 cursor-pointer w-fit mt-2 group">
             <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${agreed ? 'bg-primary border-primary' : 'border-gray-500'}`}>
                {agreed && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>}
             </div>
             <input type="checkbox" className="hidden" checked={agreed} onChange={() => setAgreed(!agreed)} />
             <span className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">I have read and agree <span className="text-red-500">【Privacy Agreement】</span></span>
           </label>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4">
          <button 
            onClick={handleRegister}
            disabled={!phone || !password || !agreed || loggingIn}
            className="w-full bg-gradient-gold text-black font-extrabold text-lg py-3.5 rounded-full shadow-lg transition-all disabled:opacity-50 disabled:grayscale data-[loading=true]:scale-95"
            data-loading={loggingIn}
          >
            {loggingIn ? 'Registering...' : 'Register'}
          </button>
          
          <button 
            onClick={() => navigate('login')}
            className="w-full border-2 border-primary text-primary font-extrabold text-lg py-3.5 rounded-full shadow hover:bg-primary hover:text-black transition-colors"
          >
            I have an account <span className="text-white ml-1 font-black">Login</span>
          </button>
        </div>
      </div>
    </div>
  );
}
