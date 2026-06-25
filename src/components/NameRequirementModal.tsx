import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../store';
import { User, CheckCircle2, AlertCircle } from 'lucide-react';

export function NameRequirementModal() {
  const { showNamePopup, setShowNamePopup, setNickname, showToast } = useApp();
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) {
      showToast('Please enter a valid name (at least 2 characters)');
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await setNickname(name.trim());
      if (success) {
        showToast('Name updated successfully!');
        setShowNamePopup(false);
      } else {
        showToast('Failed to update name. Please try again.');
      }
    } catch (error) {
      showToast('An error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {showNamePopup && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-sm bg-[#1e232f] rounded-3xl overflow-hidden shadow-2xl relative border border-white/10"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#d97706] to-[#f59e0b] p-6 text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <User className="text-white w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-white">Set Your Nickname</h2>
              <p className="text-white/80 text-xs mt-1">Please provide a name to continue using the game</p>
            </div>

            {/* Body */}
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-400 ml-1">Real Name / Nickname</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name here..."
                      className="w-full bg-[#161a25] border border-white/5 rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[#d97706]/50 transition-colors"
                      autoFocus
                    />
                  </div>
                  <p className="text-[10px] text-gray-500 ml-1 flex items-center gap-1">
                    <AlertCircle size={10} /> This name will be visible in game records
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-orange-900/20 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:active:scale-100"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 size={18} />
                      Save & Continue
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
