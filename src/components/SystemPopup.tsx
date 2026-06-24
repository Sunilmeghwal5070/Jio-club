import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell } from 'lucide-react';
import { useApp } from '../store';

export function SystemPopup() {
  const { 
    showSystemPopup, 
    setShowSystemPopup, 
    systemPopupMessage, 
    systemPopupTitle 
  } = useApp();

  return (
    <AnimatePresence>
      {showSystemPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSystemPopup(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          {/* Modal */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-sm bg-[#1E1C25] rounded-3xl overflow-hidden shadow-2xl"
          >
            {/* Header with gradient and icon */}
            <div className="bg-gradient-blue pt-10 pb-8 px-6 flex flex-col items-center">
              <div className="bg-white/20 p-3 rounded-full mb-4">
                <Bell size={40} className="text-white fill-white" />
              </div>
              <h2 className="text-2xl font-black text-white tracking-widest text-center uppercase">
                {systemPopupTitle}
              </h2>
            </div>
            
            {/* Content Body */}
            <div className="p-8">
              <p className="text-gray-300 text-center leading-relaxed mb-8 font-medium">
                {systemPopupMessage}
              </p>
              
              <button 
                onClick={() => setShowSystemPopup(false)}
                className="w-full bg-gradient-to-r from-[#2583F7] to-[#145DD8] hover:from-[#145DD8] hover:to-[#1149A6] text-white font-black py-4 rounded-2xl shadow-[0_8px_20px_rgba(37,131,247,0.4)] active:scale-95 transition-all uppercase tracking-[2px] border border-white/20"
              >
                CONFIRM
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
