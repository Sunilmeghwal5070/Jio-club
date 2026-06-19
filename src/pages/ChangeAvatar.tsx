import React from 'react';
import { useApp } from '../store';
import { Header } from '../components/Header';
import { Check } from 'lucide-react';

export function ChangeAvatar() {
  const { user, setUser, goBack, showToast } = useApp();

  const avatars = Array.from({ length: 15 }).map((_, i) => `https://api.dicebear.com/7.x/adventurer/svg?seed=Avatar${i}&backgroundColor=e2e8f0,f8fafc`);

  const handleSelect = (avatar: string) => {
    setUser({ ...user, avatar });
    showToast('Avatar changed successfully');
    setTimeout(() => goBack(), 1000);
  };

  return (
    <div className="min-h-screen bg-bg-base relative pb-6">
      <Header title="Change avatar" />

      <div className="px-4 py-4 grid grid-cols-3 gap-3">
        {avatars.map((avatar, i) => {
          const isSelected = user.avatar === avatar;
          return (
            <div 
              key={i} 
              onClick={() => handleSelect(avatar)}
              className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer transition-all duration-200 ${isSelected ? 'border-2 border-red-500 shadow-md scale-[0.98]' : 'border border-transparent'}`}
            >
              <img src={avatar} alt={`Avatar ${i}`} className="w-full h-full object-cover bg-gray-200" />
              {isSelected && (
                <div className="absolute bottom-1 right-1 bg-red-500 rounded-full p-0.5">
                  <Check size={16} className="text-white" strokeWidth={3} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
