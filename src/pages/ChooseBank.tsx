import React, { useState, useMemo } from 'react';
import { useApp } from '../store';
import { Header } from '../components/Header';
import { Search } from 'lucide-react';

export function ChooseBank() {
  const { navigate, setAddingBankName } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const banksList = [
    'State Bank of India (SBI)',
    'HDFC Bank',
    'ICICI Bank',
    'Punjab National Bank (PNB)',
    'Axis Bank',
    'Kotak Mahindra Bank',
    'IndusInd Bank',
    'Bank of Baroda',
    'Bank of India',
    'Canara Bank',
    'Union Bank of India',
    'IDFC FIRST Bank',
    'Yes Bank',
    'Central Bank of India',
    'Indian Bank',
    'UCO Bank',
    'Bank of Maharashtra',
    'Punjab & Sind Bank',
    'Federal Bank',
    'South Indian Bank',
    'Karnataka Bank',
    'Karur Vysya Bank',
    'City Union Bank',
    'RBL Bank',
    'Bandhan Bank',
    'IDBI Bank',
    'Standard Chartered Bank',
    'Citi Bank',
    'HSBC Bank'
  ];

  const filteredBanks = useMemo(() => {
    if (!searchQuery.trim()) return banksList;
    return banksList.filter(b => b.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery]);

  const selectBank = (bank: string) => {
    setAddingBankName(bank);
    navigate('addBank');
  };

  return (
    <div className="min-h-screen bg-bg-base relative flex flex-col">
      <Header title="Choose a bank" />

      <div className="px-4 py-3 bg-bg-base sticky top-14 z-30">
        <div className="bg-[#2a2835] border border-white/5 rounded-lg px-4 py-2 flex items-center gap-3">
          <Search size={22} className="text-primary" />
          <input 
            type="text" 
            placeholder="Search bank" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-white placeholder:text-gray-500 focus:outline-none text-[15px]"
          />
        </div>
      </div>

      <div className="flex-1 px-4 pb-10">
         <div className="bg-[#2a2835] rounded-xl border border-white/5 overflow-hidden shadow-sm">
            <div className="px-4 py-3 text-sm text-gray-400 bg-[#2f2c3b] font-medium border-b border-white/5">
              Choose a bank
            </div>
            
            <div className="flex flex-col">
              {filteredBanks.map((bank, index) => (
                <div 
                  key={index}
                  onClick={() => selectBank(bank)}
                  className="px-5 py-[17px] border-b border-white/5 last:border-0 text-gray-300 font-medium text-[15px] hover:bg-white/5 transition-colors cursor-pointer"
                >
                  {bank}
                </div>
              ))}
              
              {filteredBanks.length === 0 && (
                <div className="px-5 py-8 text-center text-gray-500 text-sm">
                  No banks match your search.
                </div>
              )}
            </div>
         </div>
      </div>
    </div>
  );
}
