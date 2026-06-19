import React from 'react';
import { useApp } from '../store';
import { Header } from '../components/Header';
import { ChevronRight, Lock, Mail, Info, Copy } from 'lucide-react';

export function Settings() {
  const { user, navigate } = useApp();

  return (
    <div className="min-h-screen bg-bg-base relative pb-6">
      <Header title="Settings Center" />

      <div className="px-4 mt-6">
        {/* Profile Card */}
        <div className="bg-card-base rounded-2xl p-4 shadow-sm mb-6 border border-card-base">
          <div className="flex items-center justify-between mb-6">
            <img src={user.avatar} alt="Avatar" className="w-16 h-16 rounded-full" />
            <div onClick={() => navigate('changeAvatar')} className="flex items-center gap-2 text-gray-400 cursor-pointer hover:text-white transition-colors">
              <span className="text-sm">Change avatar</span>
              <ChevronRight size={18} />
            </div>
          </div>
          
          <div className="flex items-center justify-between py-4 border-b border-white/5">
            <span className="text-gray-400 text-sm">Nickname</span>
            <div className="flex items-center gap-2 text-gray-200 cursor-pointer hover:text-white transition-colors" onClick={() => navigate('account')}>
              <span>{user.nickname}</span>
              <ChevronRight size={18} className="text-gray-500" />
            </div>
          </div>

          {user.phone && (
            <div className="flex items-center justify-between py-4 border-b border-white/5">
              <span className="text-gray-400 text-sm">Mobile Number</span>
              <div className="flex items-center gap-2 text-gray-200">
                <span>{user.phone.replace(/(\d{3})\d{4}(\d{3})/, '$1****$2')}</span>
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between pt-4 pb-2">
            <span className="text-gray-400 text-sm">UID</span>
            <div className="flex items-center gap-2 text-yellow-500">
              <span className="font-medium text-white">{user.uid}</span>
              <Copy size={16} className="cursor-pointer" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4 px-2">
          <div className="w-1 h-4 bg-primary rounded-full"></div>
          <h2 className="text-primary font-bold text-lg">Security information</h2>
        </div>

        {/* Security List */}
        <div onClick={() => navigate('changePassword')} className="bg-card-base rounded-xl p-2 flex items-center justify-between mb-3 shadow-sm cursor-pointer hover:bg-gray-800 transition-colors">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-yellow-600/20 rounded-lg flex items-center justify-center">
               <Lock size={20} className="text-yellow-500" />
             </div>
             <span className="text-gray-200">Login password</span>
           </div>
           <div className="flex items-center gap-2 text-gray-400 pr-2">
             <span className="text-sm">Edit</span>
             <ChevronRight size={18} />
           </div>
        </div>
        
        <div className="bg-card-base rounded-xl p-2 flex items-center justify-between mb-3 shadow-sm cursor-pointer hover:bg-gray-800 transition-colors">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-yellow-600/20 rounded-lg flex items-center justify-center">
               <Mail size={20} className="text-yellow-500" />
             </div>
             <span className="text-gray-200">Bind mailbox</span>
           </div>
           <div className="flex items-center gap-2 text-gray-400 pr-2">
             <span className="text-sm">to bind</span>
             <ChevronRight size={18} />
           </div>
        </div>
        
        <div className="bg-card-base rounded-xl p-2 flex items-center justify-between mb-3 shadow-sm cursor-pointer hover:bg-gray-800 transition-colors">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-yellow-600/20 rounded-lg flex items-center justify-center">
               <Info size={20} className="text-yellow-500" />
             </div>
             <span className="text-gray-200">Updated version</span>
           </div>
           <div className="flex items-center gap-2 text-gray-400 pr-2">
             <span className="text-sm">1.0.9</span>
             <ChevronRight size={18} />
           </div>
        </div>
      </div>
    </div>
  );
}
