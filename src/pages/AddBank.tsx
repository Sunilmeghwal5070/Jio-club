import React, { useState } from 'react';
import { useApp } from '../store';
import { Header } from '../components/Header';
import { AlertCircle, Landmark, User, CreditCard, Smartphone, Key } from 'lucide-react';

export function AddBank() {
  const { navigate, addBank, selectedBankName, setSelectedBankName, addingBankName } = useApp();
  const [recipientName, setRecipientName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [ifsc, setIfsc] = useState('');

  const handleSave = () => {
    if (!addingBankName || !recipientName || !accountNumber || !ifsc) return;
    
    addBank({
      bankName: addingBankName,
      recipientName,
      accountNumber,
      phone,
      ifsc
    });
    
    setSelectedBankName(addingBankName);
    navigate('withdraw');
  };

  return (
    <div className="min-h-screen bg-bg-base relative pb-6">
      <Header title="Add a bank account number" />

      <div className="px-5 mt-4">
        {/* Warning card */}
        <div className="bg-red-500/10 border border-red-500/20 rounded-full px-4 py-2 flex items-center gap-2 mb-8">
           <AlertCircle size={16} className="text-red-500 shrink-0" />
           <p className="text-xs text-red-500 font-medium">To ensure the safety of your funds, please bind your bank account</p>
        </div>

        <div className="flex flex-col gap-6">
           {/* Choose Bank Button */}
           <div className="flex flex-col gap-2">
             <label className="flex items-center gap-2 text-sm font-medium text-white mb-1">
               <Landmark size={20} className="text-primary" /> Choose a bank
             </label>
             <button 
               onClick={() => navigate('chooseBank')}
               className="bg-gradient-gold text-black rounded-lg px-4 py-3.5 w-full flex items-center justify-between font-bold text-[15px] shadow-sm hover:opacity-90"
             >
               {addingBankName || 'Please select a bank'}
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
             </button>
           </div>

           {/* Full Recipient Name */}
           <InputRow 
             icon={<User size={20} className="text-primary" />} 
             label="Full recipient's name"
             placeholder="Please enter the recipient's name"
             value={recipientName}
             onChange={(e) => setRecipientName(e.target.value)}
           />

           {/* Bank Account Number */}
           <InputRow 
             icon={<CreditCard size={20} className="text-primary" />} 
             label="Bank account number"
             placeholder="Please enter your bank account number"
             value={accountNumber}
             onChange={(e) => setAccountNumber(e.target.value)}
           />

           {/* Phone Number */}
           <InputRow 
             icon={<Smartphone size={20} className="text-primary" />} 
             label="Phone number"
             placeholder="Please enter your phone number"
             value={phone}
             onChange={(e) => setPhone(e.target.value)}
           />

           {/* IFSC Code */}
           <InputRow 
             icon={<Key size={20} className="text-primary inline-block rotate-[-45deg]" />} 
             label="IFSC code"
             placeholder="Please enterIFSC code"
             value={ifsc}
             onChange={(e) => setIfsc(e.target.value)}
           />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-[#1C1A24] border-t border-white/5 p-4 z-50 max-w-md mx-auto">
        <button 
           onClick={handleSave}
           disabled={!addingBankName || !recipientName || !accountNumber || !ifsc}
           className="w-full bg-[#3e3b4a] disabled:opacity-80 text-gray-300 font-extrabold text-[17px] py-[14px] rounded-full shadow tracking-wider transition-colors data-[active=true]:bg-gradient-gold data-[active=true]:text-black"
           data-active={!!(addingBankName && recipientName && accountNumber && ifsc)}
        >
          Save
        </button>
      </div>
    </div>
  );
}

function InputRow({ icon, label, placeholder, value, onChange }: any) {
  return (
    <div className="flex flex-col gap-2">
      <label className="flex items-center gap-2 text-sm font-medium text-white mb-1">
        {icon} {label}
      </label>
      <input 
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full bg-[#2a2835] border border-white/5 rounded-lg px-4 py-3.5 text-white placeholder:text-gray-500 focus:outline-none focus:border-primary/50 text-[15px] font-medium"
      />
    </div>
  )
}
