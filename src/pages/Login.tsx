import React, { useState, useEffect } from 'react';
import { useApp } from '../store';
import { ChevronLeft, Lock, Mail, Smartphone, Eye, EyeOff } from 'lucide-react';

export function Login() {
  const { navigate, login, triggerCaptcha } = useApp();
  const [tab, setTab] = useState<'phone'|'email'>('phone');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [loggingIn, setLoggingIn] = useState(false);

  useEffect(() => {
    const savedPhone = localStorage.getItem('remember_phone');
    const savedPass = localStorage.getItem('remember_pass');
    if (savedPhone) setPhone(savedPhone);
    if (savedPass) setPassword(savedPass);
  }, []);

  const handleLogin = async () => {
    if (!phone || !password) return;
    setLoggingIn(true);
    
    const success = await login(phone, password);
    setLoggingIn(false);

    if (success && rememberMe) {
      localStorage.setItem('remember_phone', phone);
      localStorage.setItem('remember_pass', password);
    } else if (success) {
      localStorage.removeItem('remember_phone');
      localStorage.removeItem('remember_pass');
    }
  };

  return (
    <div className="min-h-screen bg-bg-base relative flex flex-col">
      {/* Basic header for login flow */}
      <div className="flex items-center px-4 h-14 border-b border-white/5 relative bg-bg-base">
        <button onClick={() => {}} className="p-2 -ml-2 rounded-full absolute">
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
        <h1 className="text-2xl font-bold text-white mb-2">Log in</h1>
        <p className="text-xs text-gray-400 mb-8 max-w-[280px]">
          Please log in with your phone number or email<br/>
          If you forget your password, please contact customer service
        </p>

        {/* Tabs */}
        <div className="flex mb-6 border-b border-white/10">
          <button 
            onClick={() => setTab('phone')}
            className={`flex-1 flex flex-col items-center gap-2 pb-3 font-semibold transition-colors ${tab === 'phone' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
          >
            <Smartphone size={20} />
            <span className="text-sm">Phone number</span>
          </button>
          <button 
            onClick={() => setTab('email')}
            className={`flex-1 flex flex-col items-center gap-2 pb-3 font-semibold transition-colors ${tab === 'email' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
          >
            <Mail size={20} />
            <span className="text-sm">Email Login</span>
          </button>
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
                <Lock size={16} className="text-primary" /> Password
              </label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-card-base border border-white/5 rounded-xl px-4 py-3.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 text-sm pr-10"
                />
                <button 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                >
                  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
           </div>

           <label className="flex items-center gap-2 cursor-pointer w-fit mt-1 group" onClick={(e) => { e.preventDefault(); setRememberMe(!rememberMe); }}>
             <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${rememberMe ? 'bg-primary border-primary' : 'border-gray-500 bg-transparent'}`}>
                {rememberMe && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>}
             </div>
             <span className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">Remember password</span>
           </label>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4">
          <button 
            onClick={handleLogin}
            disabled={!phone || !password || loggingIn}
            className="w-full bg-gradient-gold text-black font-extrabold text-lg py-3.5 rounded-full shadow-lg transition-all disabled:opacity-50 disabled:grayscale data-[loading=true]:scale-95"
            data-loading={loggingIn}
          >
            {loggingIn ? 'Logging in...' : 'Log in'}
          </button>
          
          <button 
            onClick={() => navigate('register')}
            className="w-full border-2 border-primary text-primary font-extrabold text-lg py-3.5 rounded-full shadow hover:bg-primary hover:text-black transition-colors"
          >
            Register
          </button>
        </div>

        {/* Footer links */}
        <div className="flex justify-between items-center mt-12 px-2">
           <button className="flex flex-col items-center gap-2 group">
             <div className="w-12 h-12 rounded-full border border-white/10 bg-card-base flex items-center justify-center group-hover:border-primary/50 transition-colors">
               <Lock size={20} className="text-primary" />
             </div>
             <span className="text-xs text-gray-400 font-medium group-hover:text-white transition-colors">Forgot password</span>
           </button>
           <button className="flex flex-col items-center gap-2 group">
             <div className="w-12 h-12 rounded-full border border-white/10 bg-card-base flex items-center justify-center group-hover:border-primary/50 transition-colors">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
             </div>
             <span className="text-xs text-gray-400 font-medium group-hover:text-white transition-colors">Customer Service</span>
           </button>
        </div>
      </div>
    </div>
  );
}
