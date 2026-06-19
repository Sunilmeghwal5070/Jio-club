import React, { useState } from 'react';
import { useApp } from '../store';
import { Header } from '../components/Header';
import { AlertCircle, Smartphone, User, QrCode } from 'lucide-react';

export function AddUpi() {
  const { navigate, addUpi, setSelectedUpiCode } = useApp();
  const [recipientName, setRecipientName] = useState('');
  const [upiAddress, setUpiAddress] = useState('');
  const [phone, setPhone] = useState('');

  const handleSave = () => {
    if (!recipientName || !upiAddress || !phone) return;
    
    addUpi({
      recipientName,
      upiAddress,
      phone
    });
    setSelectedUpiCode(upiAddress);
    navigate('withdraw');
  };

  return (
    <div className="min-h-screen bg-bg-base relative pb-6">
      <Header title="Add UPI" />

      <div className="px-5 mt-4">
        {/* Warning card */}
        <div className="bg-red-500/10 border border-red-500/20 rounded-full px-4 py-2 flex items-center gap-2 mb-8">
           <AlertCircle size={16} className="text-red-500 shrink-0" />
           <p className="text-xs text-red-500 font-medium">To ensure the safety of your funds, please bind your UPI</p>
        </div>

        <div className="flex flex-col gap-6">
           {/* Full Recipient Name */}
           <InputRow 
             icon={<User size={20} className="text-primary" />} 
             label="Full recipient's name"
             placeholder="Please enter the recipient's name"
             value={recipientName}
             onChange={(e) => setRecipientName(e.target.value)}
           />

           {/* UPI Address */}
           <InputRow 
             icon={<QrCode size={20} className="text-primary" />} 
             label="UPI Address"
             placeholder="Please enter your UPI address (e.g. name@okhdfcbank)"
             value={upiAddress}
             onChange={(e) => setUpiAddress(e.target.value)}
           />

           {/* Phone Number */}
           <InputRow 
             icon={<Smartphone size={20} className="text-primary" />} 
             label="Phone number"
             placeholder="Please enter your phone number"
             value={phone}
             onChange={(e) => setPhone(e.target.value)}
           />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-[#1C1A24] border-t border-white/5 p-4 z-50 max-w-md mx-auto">
        <button 
           onClick={handleSave}
           disabled={!recipientName || !upiAddress || !phone}
           className="w-full bg-[#3e3b4a] disabled:opacity-80 text-gray-300 font-extrabold text-[17px] py-[14px] rounded-full shadow tracking-wider transition-colors data-[active=true]:bg-gradient-gold data-[active=true]:text-black"
           data-active={!!(recipientName && upiAddress && phone)}
        >
          Save
        </button>
      </div>
    </div>
  );
}

function InputRow({ icon, label, placeholder, value, onChange }: any) {
  return (
    <div className="flex items-center gap-3 bg-[#1C1A24] border border-white/5 rounded-xl p-3 shadow-innerfocus-within:border-primary/50 transition-colors">
      <div className="w-10 h-10 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="flex-1">
        <label className="text-[11px] text-gray-500 font-semibold mb-0.5 block">{label}</label>
        <input 
          type="text" 
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full bg-transparent border-none outline-none text-white text-sm font-medium placeholder:text-gray-600"
        />
      </div>
    </div>
  );
}
