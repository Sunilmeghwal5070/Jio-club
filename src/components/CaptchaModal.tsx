import React, { useState } from 'react';
import { useApp } from '../store';

export function CaptchaModal() {
  const { captchaSuccess, showCaptcha, setShowCaptcha } = useApp();
  const [sliderValue, setSliderValue] = useState(0);

  if (!showCaptcha) return null;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setSliderValue(val);
    
    // Simulate finding the "right" spot around 70-85
    if (val > 75 && val < 85) {
      setTimeout(() => {
        setSliderValue(0);
        captchaSuccess();
      }, 300);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-card-base rounded-xl w-full max-w-sm overflow-hidden border border-white/10 shadow-2xl animate-fade-in-up">
         
         {/* Top Image Section */}
         <div className="relative h-56 bg-gray-900 border-b border-white/10">
           <img 
             src="https://images.unsplash.com/photo-1432405972618-c600f487e62d?w=800&q=80" 
             alt="Captcha bg" 
             className="w-full h-full object-cover" 
           />
           
           {/* Dark Puzzle Hole Base */}
           <div 
             className="absolute top-1/2 left-[60%] -translate-y-1/2 w-14 h-14 bg-black/60 shadow-inner rounded drop-shadow-md backdrop-blur-sm mix-blend-multiply"
             style={{ clipPath: 'polygon(0% 0%, 35% 0%, 35% -15%, 65% -15%, 65% 0%, 100% 0%, 100% 35%, 115% 35%, 115% 65%, 100% 65%, 100% 100%, 65% 100%, 65% 115%, 35% 115%, 35% 100%, 0% 100%, 0% 65%, -15% 65%, -15% 35%, 0% 35%)' }}
           ></div>
           
           {/* Moving Puzzle Piece containing part of the image */}
           <div 
             className="absolute top-1/2 -translate-y-1/2 w-14 h-14 border border-white/50 rounded shadow-[0_0_10px_rgba(0,0,0,0.5)] z-10 transition-transform bg-white/20 backdrop-blur-sm"
             style={{ 
               transform: `translate(calc(${sliderValue}vw * 0.8), -50%)`,
               left: `10%`,
               clipPath: 'polygon(0% 0%, 35% 0%, 35% -15%, 65% -15%, 65% 0%, 100% 0%, 100% 35%, 115% 35%, 115% 65%, 100% 65%, 100% 100%, 65% 100%, 65% 115%, 35% 115%, 35% 100%, 0% 100%, 0% 65%, -15% 65%, -15% 35%, 0% 35%)'
             }}
           >
             <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1432405972618-c600f487e62d?w=800&q=80')] bg-fixed opacity-90 overflow-hidden"></div>
           </div>

           {/* Close Button top right */}
           <button 
             onClick={() => setShowCaptcha(false)}
             className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-black/40 rounded-full hover:bg-black/60 text-white border border-white/20"
           >
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
           </button>
         </div>
         
         {/* Bottom Control Section */}
         <div className="p-4 bg-card-base">
           <div className="flex items-center gap-3">
             <button title="Refresh" className="h-12 w-12 shrink-0 bg-bg-base border border-white/5 rounded-lg flex items-center justify-center hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 11-9-9c2.52 0 4.93 1 6.74 2.74L21 8"></path><path d="M21 3v5h-5"></path></svg>
             </button>
             
             {/* Slider Track */}
             <div className="relative flex-1 h-12 bg-bg-base border border-white/5 rounded-lg flex items-center overflow-hidden group">
                {/* Active Progress */}
                <div 
                  className="absolute inset-y-0 left-0 bg-[#A3E635]" 
                  style={{ width: `${sliderValue}%` }}
                ></div>
                
                {/* Text Label */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className={sliderValue > 0 ? "opacity-0" : "text-sm text-gray-500 font-medium"}>
                    Hold and slide
                  </span>
                </div>
                
                {/* Invisible native range slider */}
                <input 
                  type="range" min="0" max="100" value={sliderValue} onChange={handleSliderChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
                />
                
                {/* Slide Button visual */}
                <div 
                  className="absolute inset-y-0 w-12 bg-white rounded-lg border-2 border-transparent shadow-[0_0_10px_rgba(0,0,0,0.1)] flex items-center justify-center cursor-ew-resize transition-shadow z-10"
                  style={{ left: `calc(${sliderValue}% - ${sliderValue > 50 ? 48 : 0}px)` }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2.5"><polyline points="13 17 18 12 13 7"></polyline><polyline points="6 17 11 12 6 7"></polyline></svg>
                </div>
             </div>
           </div>
         </div>
      </div>
    </div>
  );
}
