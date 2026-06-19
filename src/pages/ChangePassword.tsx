import React, { useState } from 'react';
import { useApp } from '../store';
import { Header } from '../components/Header';
import { Lock, Eye, EyeOff } from 'lucide-react';

export function ChangePassword() {
  const { user, setUser, goBack, showToast } = useApp();
  
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSave = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      showToast('Please fill all fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('New passwords do not match');
      return;
    }
    if (user.loginPassword && oldPassword !== user.loginPassword) {
      showToast('Old password is incorrect');
      return;
    }

    setUser({ ...user, loginPassword: newPassword });
    showToast('Password changed successfully');
    setTimeout(() => goBack(), 1500);
  };

  return (
    <div className="min-h-screen bg-bg-base relative pb-6">
      <Header title="Change login password" />

      <div className="px-5 pt-6 flex flex-col gap-5 mt-14">
        <PasswordInput 
          label="Login password" 
          value={oldPassword} 
          onChange={setOldPassword} 
          placeholder="Login password"
          show={showOld}
          setShow={setShowOld}
        />

        <PasswordInput 
          label="New login password" 
          value={newPassword} 
          onChange={setNewPassword} 
          placeholder="New login password"
          show={showNew}
          setShow={setShowNew}
        />

        <PasswordInput 
          label="Confirm new password" 
          value={confirmPassword} 
          onChange={setConfirmPassword} 
          placeholder="Confirm new password"
          show={showConfirm}
          setShow={setShowConfirm}
        />

        <div className="flex justify-end mt-1">
          <button className="text-sm text-gray-400 font-medium hover:text-white transition-colors">
            Forgot original login password &gt;
          </button>
        </div>

        <button 
          onClick={handleSave}
          disabled={!oldPassword || !newPassword || !confirmPassword}
          className="mt-4 w-full bg-gradient-gold text-black font-extrabold text-lg py-3.5 rounded-full shadow-lg transition-all disabled:opacity-50 disabled:grayscale"
        >
          Save changes
        </button>
      </div>
    </div>
  );
}

function PasswordInput({ label, value, onChange, placeholder, show, setShow }: any) {
  return (
    <div className="flex flex-col gap-2">
      <label className="flex items-center gap-2 text-sm text-gray-300 font-medium">
        <Lock size={16} className="text-primary" /> {label}
      </label>
      <div className="relative">
        <input 
          type={show ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-card-base border border-white/5 rounded-xl px-4 py-3.5 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 text-sm pr-10"
        />
        <button 
          onClick={() => setShow(!show)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
        >
          {show ? <Eye size={18} /> : <EyeOff size={18} />}
        </button>
      </div>
    </div>
  );
}
