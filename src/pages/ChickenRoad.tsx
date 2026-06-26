import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../store';
import { rtdb } from '../firebase';
import { ref, update, set } from 'firebase/database';

// --- CONSTANT ASSETS ---
const FOOTPATH_URL = "https://i.pinimg.com/474x/aa/9b/33/aa9b3310480ef537ca53ce749f32ce32.jpg";
const CHICKEN_ALIVE_URL = "/chicken.png";
const CHICKEN_CRASH_URL = "/crash.png";

// --- ICONS ---
const Icons = {
    Menu: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>,
    Minus: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><line x1="4" y1="12" x2="20" y2="12"></line></svg>,
    Plus: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><line x1="12" y1="4" x2="12" y2="20"></line><line x1="4" y1="12" x2="20" y2="12"></line></svg>,
    Close: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
};

const BarricadeSVG = () => (
    <svg width="85" height="38" viewBox="0 0 120 50" style={{filter: 'drop-shadow(0px 6px 4px rgba(0,0,0,0.5))'}}>
        <defs>
            <pattern id="stripes" width="20" height="20" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                <rect width="10" height="20" fill="#F4D03F" />
                <rect x="10" width="10" height="20" fill="#333" />
            </pattern>
        </defs>
        <rect x="15" y="25" width="12" height="25" fill="#95A5A6" rx="2" stroke="#222" strokeWidth="2"/>
        <rect x="93" y="25" width="12" height="25" fill="#95A5A6" rx="2" stroke="#222" strokeWidth="2"/>
        <rect x="5" y="5" width="110" height="25" fill="url(#stripes)" stroke="#222" strokeWidth="3" rx="4"/>
        <rect x="5" y="5" width="110" height="5" fill="#FFF" opacity="0.4" rx="2"/>
    </svg>
);

const ManholeSVG = ({ multiplier }: { multiplier: number }) => (
    <div className="relative w-20 h-20 flex items-center justify-center">
        <svg width="85" height="85" viewBox="0 0 100 100" className="absolute inset-0 drop-shadow-lg">
            <circle cx="50" cy="50" r="46" fill="#3A3A3A" stroke="#222" strokeWidth="4"/>
            <circle cx="50" cy="50" r="38" fill="#4B4B4B" stroke="#2B2B2B" strokeWidth="3"/>
            <path d="M 30 25 L 30 75 M 40 20 L 40 80 M 50 18 L 50 82 M 60 20 L 60 80 M 70 25 L 70 75" stroke="#222" strokeWidth="5" strokeLinecap="round" opacity="0.6"/>
            <circle cx="50" cy="50" r="46" fill="url(#glare)" opacity="0.15"/>
            <defs>
                <linearGradient id="glare" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#FFF"/>
                    <stop offset="100%" stopColor="#000" stopOpacity="0"/>
                </linearGradient>
            </defs>
        </svg>
        <span className="relative z-10 text-white font-black text-xl drop-shadow-[0_2px_2px_rgba(0,0,0,0.9)]">{multiplier}x</span>
    </div>
);

const Sidewalk = () => (
    <div 
        className="w-full h-full relative" 
        style={{
            backgroundImage: `url('${FOOTPATH_URL}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
        }}
    />
);

const VehicleSVG = ({ seed }: { seed: number }) => {
    const types = [
        { color: '#E41C38', type: 'firetruck', h: 220 },
        { color: '#F1C40F', type: 'taxi', h: 140 },
        { color: '#3498DB', type: 'police', h: 150 },
        { color: '#2ECC71', type: 'truck', h: 200 },
        { color: '#9B59B6', type: 'car', h: 130 },
        { color: '#34495E', type: 'suv', h: 160 }
    ];
    const v = types[seed % types.length];
    
    return (
        <svg width="120" height={v.h} viewBox={`0 0 100 ${v.h}`} className="drop-shadow-2xl">
            <rect x="5" y="5" width="90" height={v.h - 10} rx="15" fill="rgba(0,0,0,0.5)" />
            <rect x="10" y="10" width="80" height={v.h - 20} rx="12" fill={v.color} stroke="#111" strokeWidth="3"/>
            <rect x="15" y="20" width="70" height="25" rx="4" fill="#2C3E50"/>
            <rect x="15" y={v.h - 45} width="70" height="20" rx="4" fill="#2C3E50"/>
            <rect x="20" y="55" width="60" height={v.h - 110} rx="5" fill="#000" opacity="0.15"/>
            <circle cx="25" cy="15" r="4" fill="#FFF" opacity="0.9"/>
            <circle cx="75" cy="15" r="4" fill="#FFF" opacity="0.9"/>
            <rect x="20" y={v.h - 15} width="15" height="5" fill="#E74C3C" rx="2"/>
            <rect x="65" y={v.h - 15} width="15" height="5" fill="#E74C3C" rx="2"/>
        </svg>
    );
};

const MULTIPLIERS: Record<string, number[]> = {
    Easy: [1.02, 1.08, 1.14, 1.21, 1.30, 1.43, 1.58, 1.75, 1.95, 2.20, 2.50, 2.85, 3.25, 3.75, 4.30, 5.00, 6.0, 7.5, 9.0],
    Medium: [1.10, 1.25, 1.45, 1.70, 2.05, 2.50, 3.10, 3.85, 4.80, 6.00, 7.50, 9.50, 12.0, 15.0, 20.0, 25.0],
    Hard: [1.25, 1.60, 2.10, 2.80, 3.80, 5.20, 7.10, 9.80, 13.5, 18.5, 25.0, 35.0, 50.0],
    Hardcore: [1.45, 2.22, 3.47, 5.56, 9.13, 15.20, 25.50, 43.00, 75.00, 130.0, 230.0]
};

const getNextMult = (diff: string, s: number) => {
    const arr = MULTIPLIERS[diff];
    if(s < arr.length) return arr[s];
    return parseFloat((arr[arr.length-1] * Math.pow(1.15, s - arr.length + 1)).toFixed(2));
};

const getCrashStep = (diff: string, streak: number) => {
    const r = Math.random();
    if (streak >= 3) {
        if (diff === 'Hardcore') return 1;
        if (diff === 'Hard') return r < 0.8 ? 1 : 2;
        if (diff === 'Medium') return r < 0.7 ? 1 : 2;
        return r < 0.6 ? 2 : 3;
    }
    if (streak === 2) {
        if (diff === 'Hardcore') return r < 0.7 ? 1 : 2;
        if (diff === 'Hard') return r < 0.55 ? 1 : 2;
        if (diff === 'Medium') return r < 0.45 ? 2 : 3;
        return r < 0.35 ? 2 : 3;
    }
    if (streak === 1) {
        if (diff === 'Hardcore') return r < 0.5 ? 1 : 2;
        if (diff === 'Hard') return r < 0.35 ? 2 : 3;
        return 3 + Math.floor(Math.random() * 2);
    }
    if (diff === 'Easy') {
        return 3 + Math.floor(Math.random() * 6);
    }
    if (diff === 'Medium') {
        if (r < 0.15) return 2;
        return 3 + Math.floor(Math.random() * 4);
    }
    if (diff === 'Hard') {
        if (r < 0.15) return 1;
        if (r < 0.45) return 2;
        return 3 + Math.floor(Math.random() * 3);
    }
    if (diff === 'Hardcore') {
        if (r < 0.25) return 1;
        if (r < 0.70) return 2;
        return 3 + Math.floor(Math.random() * 2);
    }
    return 2;
};

const LANE_WIDTH = 135; 

let globalAudioCtx: AudioContext | null = null;
let soundEnabled = true;

const playSound = (type: string) => {
    if (!soundEnabled) return;
    try {
        const Ctx = window.AudioContext || (window as any).webkitAudioContext;
        if (!globalAudioCtx) {
            globalAudioCtx = new Ctx();
        }
        const ctx = globalAudioCtx!;
        if (ctx.state === 'suspended') {
            ctx.resume();
        }
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        const now = ctx.currentTime;

        if (type === 'click') {
            osc.type = 'sine'; osc.frequency.setValueAtTime(800, now);
            gain.gain.setValueAtTime(0.3, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
            osc.start(now); osc.stop(now + 0.1);
        } else if (type === 'hop') {
            osc.type = 'sine'; osc.frequency.setValueAtTime(300, now); osc.frequency.linearRampToValueAtTime(600, now + 0.15);
            gain.gain.setValueAtTime(0.4, now); gain.gain.linearRampToValueAtTime(0, now + 0.15);
            osc.start(now); osc.stop(now + 0.15);
        } else if (type === 'win') {
            osc.type = 'triangle'; osc.frequency.setValueAtTime(523.25, now); osc.frequency.setValueAtTime(783.99, now + 0.2);
            gain.gain.setValueAtTime(0.5, now); gain.gain.linearRampToValueAtTime(0, now + 0.5);
            osc.start(now); osc.stop(now + 0.5);
        } else if (type === 'crash') {
            osc.type = 'sawtooth'; osc.frequency.setValueAtTime(150, now); osc.frequency.exponentialRampToValueAtTime(40, now + 0.4);
            gain.gain.setValueAtTime(1.0, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
            osc.start(now); osc.stop(now + 0.4);
        }
    } catch(e){
        console.error("Audio error: ", e);
    }
};

export function ChickenRoad() {
    const { user, setUser, navigate, addTransaction } = useApp();
    const balance = user.totalBalance || 0;
    
    const [isSplash, setIsSplash] = useState(true);
    const [splashProgress, setSplashProgress] = useState(0);
    
    const [gameState, setGameState] = useState('idle'); 
    const [difficulty, setDifficulty] = useState('Medium');
    const [betAmount, setBetAmount] = useState(1.00);
    
    const [step, setStep] = useState(0);
    const [crashStep, setCrashStep] = useState(999);
    const [currentMultiplier, setCurrentMultiplier] = useState(1.00);
    
    const [isHopping, setIsHopping] = useState(false);
    const [winNotif, setWinNotif] = useState<number | null>(null);
    
    const [betModalOpen, setBetModalOpen] = useState(false);
    const [depositModalOpen, setDepositModalOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [howToPlayOpen, setHowToPlayOpen] = useState(false);
    
    const [tab, setTab] = useState('bet'); 
    const [isAutoPlaying, setIsAutoPlaying] = useState(false);
    const [autoCashOutMult, setAutoCashOutMult] = useState(1.50);

    const [consecutiveWins, setConsecutiveWins] = useState(() => {
        try {
            return parseInt(localStorage.getItem('cr2_consecutive_wins') || '0', 10);
        } catch(e) { return 0; }
    });

    const [autoRounds, setAutoRounds] = useState(10);
    const [roundsRemaining, setRoundsRemaining] = useState(0);
    const [isHoldingPlay, setIsHoldingPlay] = useState(false);
    const holdTimer = useRef<any>(null);

    const trackRef = useRef<HTMLDivElement>(null);

    const syncBalance = (newBalance: number) => {
        setUser({ ...user, totalBalance: newBalance });
        if (user.phone) {
            update(ref(rtdb, 'users/' + user.phone), { balance: newBalance });
        }
    };

    const pushGameHistoryToFirebase = (betAmt: number, winAmt: number, status: string, multiplier: string | number) => {
        if (!user.phone) return;
        const netAmt = status === 'Succeed' ? (winAmt - betAmt) : -betAmt;
        const periodStr = Math.floor(Date.now() / 1000).toString().slice(-6); 
        const uniqueKey = Date.now() + '_' + Math.random().toString(36).substr(2, 5);

        const newRecord = {
            game: 'Chicken Road',
            period: periodStr,
            selection: status === 'Succeed' ? `${multiplier}x` : 'Lost',
            amount: betAmt,
            status: status,
            net: netAmt,
            date: new Date().toLocaleString(),
            timestamp: Date.now()
        };

        set(ref(rtdb, `users/${user.phone}/history/games/${uniqueKey}`), newRecord);
    };

    useEffect(() => {
        if (!isSplash) return;
        let start = 0;
        const duration = 1500; 
        const interval = duration / 100;
        const timer = setInterval(() => {
            start += 1;
            setSplashProgress(start);
            if (start >= 100) {
                clearInterval(timer);
                setTimeout(() => setIsSplash(false), 200);
            }
        }, interval);
        return () => clearInterval(timer);
    }, [isSplash]);

    useEffect(() => {
        if (trackRef.current) {
            const scrollPos = step * LANE_WIDTH - (window.innerWidth / 2 - LANE_WIDTH / 2);
            trackRef.current.scrollTo({ left: Math.max(0, scrollPos), behavior: 'smooth' });
        }
    }, [step]);

    useEffect(() => {
        let timer: any;
        if (gameState === 'playing' && tab === 'auto' && isAutoPlaying) {
            timer = setTimeout(() => {
                const curMult = parseFloat(currentMultiplier.toString());
                const targetMult = parseFloat(autoCashOutMult.toString());
                if (step > 0 && curMult >= targetMult) { 
                    handleCashOut(); 
                } else { 
                    handleGo(); 
                }
            }, 800);
        } else if (gameState === 'idle' && tab === 'auto' && isAutoPlaying) {
            if (roundsRemaining > 0) {
                timer = setTimeout(() => {
                    setRoundsRemaining(r => r - 1);
                    handlePlay();
                }, 1200);
            } else {
                setIsAutoPlaying(false);
            }
        }
        return () => clearTimeout(timer);
    }, [gameState, isAutoPlaying, step, currentMultiplier, tab, roundsRemaining, autoCashOutMult]);

    const handlePlay = () => {
        if (balance < betAmount) {
            playSound('click'); setDepositModalOpen(true); setIsAutoPlaying(false);
            return;
        }
        playSound('click');
        const nextBalance = parseFloat((balance - betAmount).toFixed(2));
        syncBalance(nextBalance);
        setStep(0); 
        setCurrentMultiplier(1.00);
        
        const targetCrash = getCrashStep(difficulty, consecutiveWins);
        setCrashStep(targetCrash);
        setWinNotif(null);
        setGameState('playing');
    };

    const handleGo = () => {
        if (gameState !== 'playing' || isHopping) return;
        playSound('hop');
        setIsHopping(true);
        
        setTimeout(() => {
            const nextStep = step + 1;
            setStep(nextStep);
            
            if (nextStep === crashStep) {
                playSound('crash');
                setGameState('crashed');
                setIsAutoPlaying(false);
                setRoundsRemaining(0);
                
                setConsecutiveWins(0);
                try { localStorage.setItem('cr2_consecutive_wins', '0'); } catch(e){}

                pushGameHistoryToFirebase(betAmount, 0, 'Failed', 0);

                setTimeout(() => { setGameState('idle'); setStep(0); }, 3500); 
            } else {
                setCurrentMultiplier(getNextMult(difficulty, nextStep - 1));
            }
        }, 150);

        setTimeout(() => { setIsHopping(false); }, 300);
    };

    const handleCashOut = () => {
        if (gameState !== 'playing' || step === 0) return;
        playSound('win');
        const win = parseFloat((betAmount * currentMultiplier).toFixed(2));
        const nextBalance = parseFloat((balance + win).toFixed(2));
        syncBalance(nextBalance);
        setWinNotif(win);
        setGameState('cashed_out');
        
        setConsecutiveWins(prev => {
            const next = prev + 1;
            try { localStorage.setItem('cr2_consecutive_wins', next.toString()); } catch(e){}
            return next;
        });
        
        pushGameHistoryToFirebase(betAmount, win, 'Succeed', currentMultiplier.toFixed(2));

        setTimeout(() => { setWinNotif(null); setGameState('idle'); setStep(0); }, 3000);
    };

    const handlePlayButtonStart = (e: any) => {
        if (gameState !== 'idle') return;
        e.preventDefault();
        setIsHoldingPlay(true);
        holdTimer.current = setTimeout(() => {
            setIsAutoPlaying(true);
            setRoundsRemaining(autoRounds - 1);
            setIsHoldingPlay(false);
            handlePlay();
        }, 600); 
    };

    const handlePlayButtonEnd = () => {
        clearTimeout(holdTimer.current);
        if (isHoldingPlay) {
            setIsHoldingPlay(false);
            handlePlay(); 
        }
    };

    const stopAutoPlay = () => {
        playSound('click');
        setIsAutoPlaying(false);
        setRoundsRemaining(0);
    };

    const toggleSound = () => {
        soundEnabled = !soundEnabled;
    };

    if (isSplash) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a]">
                <div className="text-center z-10 animate-fade-in w-4/5 flex flex-col items-center">
                    <h1 className="text-[#FFD147] font-black text-3xl mb-1 drop-shadow-lg flex flex-col items-center">
                        <span className="text-white text-5xl mb-3 font-sans tracking-wide font-black">JIO CLUB</span>
                        <span className="text-[#E74C3C] text-4xl font-black">CHICKEN ROAD</span>
                    </h1>
                    
                    <div className="w-36 h-36 rounded-full bg-white flex items-center justify-center border-4 border-[#FFD147] mb-6 shadow-2xl overflow-hidden">
                        <img 
                            src={CHICKEN_ALIVE_URL} 
                            className="w-28 h-28 object-contain animate-chicken-breathing" 
                            alt="Game Logo Badge"
                        />
                    </div>
                    
                    <div className="w-full bg-gray-700/50 h-3 rounded-full overflow-hidden mb-3 border border-gray-600">
                        <div className="bg-[#F4D03F] h-full transition-all duration-75" style={{width: `${splashProgress}%`}}></div>
                    </div>
                    <div className="text-[#F4D03F] font-black text-lg tracking-wider mb-6">{splashProgress}%</div>
                    <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">100% Provably Fair Game</p>
                </div>
            </div>
        );
    }

    const totalLanes = Math.max(15, step + 8);
    const lanes = Array.from({length: totalLanes}).map((_, i) => i);

    const feathers = Array.from({length: 12}).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const distance = 80 + Math.random() * 80;
        return {
            id: i,
            dx: `${Math.cos(angle) * distance}px`,
            dy: `${Math.sin(angle) * distance - 20}px`,
            rot: `${Math.random() * 360}deg`
        };
    });

    return (
        <div className="flex flex-col min-h-screen bg-[#222] font-sans text-white overflow-hidden relative" style={{ userSelect: 'none' }}>
            {winNotif && (
                <div className="animate-float-win bg-[#2ECC71] text-white px-6 py-2 rounded-full font-black text-sm shadow-[0_5px_15px_rgba(46,204,113,0.5)] border-2 border-white/30 whitespace-nowrap">
                    +{winNotif.toFixed(2)} INR
                </div>
            )}

            <div className="bg-[#FFD147] p-2 px-3 flex justify-between items-center shadow-md z-30 shrink-0">
                <span onClick={() => { playSound('click'); navigate('home'); }} className="text-white font-black text-lg cursor-pointer opacity-80">&larr;</span>
                <h1 className="text-white font-black text-lg tracking-wide drop-shadow-md">JIO CLUB</h1>
                <div className="w-6"></div>
            </div>

            <div className="bg-[#333] p-2 px-3 flex justify-between items-center border-b-4 border-[#222] shrink-0 z-20 shadow-sm">
                <div className="text-white font-black text-base tracking-tighter flex items-center gap-1">
                    JIO CLUB
                </div>
                <div className="flex items-center gap-2">
                    <div className="text-[#F4D03F] font-black text-sm bg-black/30 px-2.5 py-1 rounded-lg border border-white/10">{balance.toFixed(2)} INR</div>
                    <button 
                        onClick={(e) => { e.stopPropagation(); playSound('click'); setMenuOpen(true); }} 
                        className="bg-gray-300 rounded-full p-1 text-[#333] shadow active:scale-95"
                    >
                        <Icons.Menu />
                    </button>
                </div>
            </div>

            <div 
                className={`flex-1 relative bg-[#5B5B5B] z-0 overflow-x-auto overflow-y-hidden scroll-smooth cursor-pointer scrollbar-hide ${gameState==='crashed' ? 'shake-effect' : ''}`} 
                ref={trackRef}
                onClick={() => {
                    if (gameState === 'playing') {
                        handleGo();
                    }
                }}
            >
                <div className="absolute top-0 h-full flex w-max">
                    {lanes.map(i => (
                        <div key={i} className="relative h-full shrink-0 flex items-center justify-center border-r-[8px] border-dashed border-white/20" style={{ width: LANE_WIDTH }}>
                            
                            {i === 0 && <Sidewalk />}
                            
                            {i > step + 2 && gameState !== 'crashed' && i % 2 !== 0 && (
                                <div className="ambient-traffic" style={{animationDelay: `${Math.random() * 2}s`}}>
                                    <VehicleSVG seed={i} />
                                </div>
                            )}

                            {i > 0 && i <= step && !(gameState === 'crashed' && i === crashStep) && (
                                <div className="absolute top-[12%] left-1/2 -translate-x-1/2 z-10">
                                    <BarricadeSVG />
                                </div>
                            )}
                            
                            {i > step && gameState !== 'crashed' && gameState !== 'cashed_out' && (
                                <div className={`absolute left-1/2 -translate-x-1/2 z-10 transition-all duration-300 ${i === step + 1 ? 'opacity-100 scale-100' : 'opacity-40 scale-90'}`}>
                                    <ManholeSVG multiplier={getNextMult(difficulty, i-1)} />
                                </div>
                            )}

                            {i === step && (
                                <div className={`absolute top-[68%] z-20 ${isHopping ? 'hopping' : ''}`} style={{ left: `50%`, transform: 'translate(-50%, -50%)' }}>
                                    
                                    {gameState === 'crashed' && (
                                        <div className="absolute inset-0 flex items-center justify-center -z-10">
                                            <svg viewBox="0 0 100 100" className="w-32 h-32 animate-splat text-[#C0392B] fill-current">
                                                <path d="M50 15 C40 12, 35 25, 25 30 C15 35, 12 48, 18 58 C24 68, 32 72, 42 78 C52 84, 68 85, 75 75 C82 65, 85 52, 80 42 C75 32, 60 18, 50 15 Z" />
                                                <circle cx="22" cy="22" r="5" />
                                                <circle cx="78" cy="22" r="7" />
                                                <circle cx="82" cy="68" r="4" />
                                                <circle cx="18" cy="68" r="6" />
                                            </svg>
                                        </div>
                                    )}

                                    {gameState === 'crashed' ? (
                                        <img 
                                            src={CHICKEN_CRASH_URL} 
                                            className="w-40 h-40 object-contain animate-crash-squish remove-bg drop-shadow-[0_8px_6px_rgba(0,0,0,0.5)]" 
                                            alt="Accident Chicken"
                                        />
                                    ) : (
                                        <img 
                                            src={CHICKEN_ALIVE_URL} 
                                            className="w-40 h-40 object-contain animate-chicken-breathing remove-bg drop-shadow-[0_12px_10px_rgba(0,0,0,0.45)]" 
                                            alt="Active Chicken"
                                        />
                                    )}

                                    {gameState === 'crashed' && feathers.map(f => (
                                        <div key={f.id} className="feather-item w-8 h-8" style={{ '--dx': f.dx, '--dy': f.dy, '--rot': f.rot, left: '30%', top: '30%' } as React.CSSProperties}>
                                            <svg viewBox="0 0 24 24" fill="white" className="opacity-85">
                                                <path d="M12 2C8 6 4 12 6 18C8 16 10 14 12 12C14 14 16 16 18 18C20 12 16 6 12 2Z"/>
                                            </svg>
                                        </div>
                                    ))}

                                    {step > 0 && gameState !== 'crashed' && (
                                        <div className="absolute top-full mt-2 bg-[#425C81] text-white px-4 py-1.5 rounded-xl text-lg font-black shadow-lg text-center left-1/2 -translate-x-1/2 before:content-[''] before:absolute before:-top-3 before:left-1/2 before:-translate-x-1/2 before:border-[6px] before:border-transparent before:border-b-[#425C81]">
                                            {currentMultiplier.toFixed(2)}x
                                        </div>
                                    )}
                                </div>
                            )}

                            {i === crashStep && gameState === 'crashed' && (
                                <div className="strike-car z-30">
                                    <VehicleSVG seed={crashStep * 7} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-[#333] rounded-t-2xl pt-2 px-3 pb-3 shadow-[0_-8px_20px_rgba(0,0,0,0.6)] z-30 shrink-0 border-t-4 border-[#222]">
                <div className="flex justify-between items-center text-[#888] text-[10px] font-bold mb-1.5 px-1">
                    <span>Bet ID: DLP{Math.floor(Math.random()*1000000000)}WH</span>
                    {isAutoPlaying && (
                        <span className="text-[#2ECC71] bg-[#2ECC71]/10 px-2 py-0.5 rounded font-black uppercase text-[9px] animate-pulse">
                            Auto Remaining: {roundsRemaining + 1}
                        </span>
                    )}
                </div>

                <div className="flex justify-center mb-2">
                    <div className="bg-[#222] rounded-full p-0.5 flex w-40 text-xs font-bold text-gray-400 border border-black/40">
                        <button onClick={()=>{playSound('click'); setTab('bet'); stopAutoPlay();}} className={`flex-1 rounded-full py-1 transition-colors ${tab === 'bet' ? 'bg-[#555] text-white shadow' : 'hover:text-white'}`}>Bet</button>
                        <button onClick={()=>{playSound('click'); setTab('auto');}} className={`flex-1 rounded-full py-1 transition-colors ${tab === 'auto' ? 'bg-[#555] text-white shadow' : 'hover:text-white'}`}>Auto</button>
                    </div>
                </div>

                <div className="flex gap-1.5 mb-2">
                    <div className="flex-[2] flex items-center justify-between bg-[#222] rounded-lg p-0.5 border-b-2 border-black/50">
                        <button onClick={()=>{playSound('click'); setBetAmount(Math.max(1, betAmount-1));}} disabled={gameState!=='idle'} className="w-7 h-7 flex items-center justify-center text-gray-300 disabled:opacity-50"><Icons.Minus/></button>
                        <div onClick={() => { if(gameState==='idle') {playSound('click'); setBetModalOpen(true);} }} className="flex-1 text-center font-bold text-white text-xs cursor-pointer py-1">
                            {betAmount.toFixed(2)} INR
                        </div>
                        <button onClick={()=>{playSound('click'); setBetAmount(betAmount+1);}} disabled={gameState!=='idle'} className="w-7 h-7 flex items-center justify-center text-gray-300 disabled:opacity-50"><Icons.Plus/></button>
                    </div>
                    <button onClick={()=>{playSound('click'); setBetAmount(Math.max(1, betAmount/2));}} disabled={gameState!=='idle'} className="flex-1 py-1.5 bg-[#222] rounded-lg font-bold text-gray-300 text-[10px] border-b-2 border-black/50 disabled:opacity-50 active:scale-95">x0.5</button>
                    <button onClick={()=>{playSound('click'); setBetAmount(betAmount*2);}} disabled={gameState!=='idle'} className="flex-1 py-1.5 bg-[#222] rounded-lg font-bold text-gray-300 text-[10px] border-b-2 border-black/50 disabled:opacity-50 active:scale-95">x2.0</button>
                </div>

                <div className="relative mb-2">
                    <select value={difficulty} onChange={(e) => {playSound('click'); setDifficulty(e.target.value);}} disabled={gameState!=='idle'} className="w-full bg-[#222] text-white font-bold p-2 rounded-lg appearance-none outline-none border-b-2 border-black/50 disabled:opacity-50 text-xs">
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                        <option value="Hardcore">Hardcore</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs">▼</div>
                </div>

                {tab === 'auto' && (
                    <div className="grid grid-cols-2 gap-2 mb-2 bg-[#444] p-2 rounded-lg border border-[#222]">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-300 font-bold text-[10px]">Auto Cashout</span>
                            <div className="flex items-center gap-1">
                                <input type="number" step="0.01" value={autoCashOutMult} onChange={(e)=>setAutoCashOutMult(parseFloat(e.target.value)||1.01)} disabled={gameState!=='idle'} className="w-11 bg-[#222] rounded p-0.5 text-center text-white font-bold outline-none border border-black/50 text-[10px]"/>
                                <span className="text-gray-400 font-bold text-[10px]">x</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between border-l border-gray-600 pl-2">
                            <span className="text-gray-300 font-bold text-[10px]">Rounds</span>
                            <div className="flex items-center gap-1">
                                <button onClick={()=>{playSound('click'); setAutoRounds(Math.max(1, autoRounds-5));}} disabled={gameState!=='idle'} className="bg-[#222] w-4 h-4 rounded text-white text-[9px]">-</button>
                                <span className="text-white font-bold text-[10px]">{autoRounds}</span>
                                <button onClick={()=>{playSound('click'); setAutoRounds(autoRounds+5);}} disabled={gameState!=='idle'} className="bg-[#222] w-4 h-4 rounded text-white text-[9px]">+</button>
                            </div>
                        </div>
                    </div>
                )}

                {gameState === 'idle' ? (
                    tab === 'auto' ? (
                        <button 
                            onMouseDown={handlePlayButtonStart}
                            onMouseUp={handlePlayButtonEnd}
                            onTouchStart={handlePlayButtonStart}
                            onTouchEnd={handlePlayButtonEnd}
                            className={`w-full py-2.5 rounded-xl font-black text-white text-lg shadow-[0_3px_0_rgba(0,0,0,0.4)] transition-all ${isAutoPlaying ? 'bg-[#E74C3C]' : isHoldingPlay ? 'bg-orange-500 scale-95' : 'bg-[#2ECC71]'}`}>
                            {isAutoPlaying ? 'STOP AUTO' : isHoldingPlay ? 'HOLDING...' : 'PLAY (HOLD FOR AUTO)'}
                        </button>
                    ) : (
                        <button onClick={handlePlay} className="w-full py-2.5 rounded-xl font-black text-white text-lg shadow-[0_3px_0_rgba(0,0,0,0.4)] active:translate-y-0.5 active:shadow-none transition-all bg-[#2ECC71]">
                            PLAY
                        </button>
                    )
                ) : (
                    <div className="flex gap-2">
                        <button onClick={handleCashOut} disabled={step===0} className="flex-[1.2] bg-[#F4D03F] py-2 rounded-xl flex flex-col items-center justify-center text-[#222] shadow-[0_3px_0_rgba(0,0,0,0.4)] active:translate-y-0.5 active:shadow-none transition-all disabled:opacity-50">
                            <span className="font-black text-xs uppercase tracking-wide">CASH OUT</span>
                            {step > 0 && <span className="font-black text-[11px]">{(betAmount * currentMultiplier).toFixed(2)} INR</span>}
                        </button>
                        <button onClick={handleGo} className="flex-1 bg-[#2ECC71] py-2 rounded-xl font-black text-white text-lg shadow-[0_3px_0_rgba(0,0,0,0.4)] active:translate-y-0.5 active:shadow-none transition-all">
                            GO
                        </button>
                    </div>
                )}
            </div>

            {menuOpen && (
                <div className="absolute inset-0 z-50 bg-black/50 flex justify-end animate-fade-in" onClick={() => setMenuOpen(false)}>
                    <div className="w-64 bg-[#333] h-full border-l border-gray-800 shadow-2xl p-4 flex flex-col gap-4 animate-slide-in-left" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center border-b border-gray-600 pb-3">
                            <span className="text-white font-black text-base">Settings</span>
                            <button 
                                onClick={() => { playSound('click'); setMenuOpen(false); }} 
                                className="bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 active:scale-95 shadow-lg transition-all"
                            >
                                <Icons.Close /> CANCEL
                            </button>
                        </div>
                        
                        <div className="flex justify-between items-center bg-[#222] p-3 rounded-lg border border-[#222]">
                            <span className="text-gray-300 font-bold text-sm">Sound Effects</span>
                            <div onClick={() => { playSound('click'); toggleSound(); }} className={`w-10 h-5 flex items-center rounded-full p-0.5 cursor-pointer transition-colors ${soundEnabled ? 'bg-[#2ECC71]' : 'bg-gray-600'}`}>
                                <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform ${soundEnabled ? 'translate-x-5' : 'translate-x-0'}`}></div>
                            </div>
                        </div>

                        <button onClick={()=>{playSound('click'); setHowToPlayOpen(true); setMenuOpen(false);}} className="w-full text-left bg-[#222] p-3 rounded-lg border border-[#222] text-gray-300 font-bold text-sm hover:text-white transition-colors">
                            How To Play ?
                        </button>

                        <button onClick={() => { playSound('click'); navigate('home'); }} className="w-full text-center mt-auto bg-[#E74C3C] p-3 rounded-lg text-white font-bold text-sm shadow-lg active:scale-95">
                            Exit Game
                        </button>
                    </div>
                </div>
            )}

            {howToPlayOpen && (
                <div className="absolute inset-0 z-50 bg-[#333] flex flex-col animate-slide-up">
                    <div className="bg-[#FFD147] p-3 flex items-center justify-between shadow-md">
                        <h2 className="text-black font-black text-lg">How To Play</h2>
                        <button onClick={()=>{playSound('click'); setHowToPlayOpen(false);}} className="text-black font-bold text-2xl">&times;</button>
                    </div>
                    <div className="flex-1 p-5 overflow-y-auto space-y-4 text-gray-300">
                        <div className="text-center flex flex-col items-center">
                            <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center border-2 border-[#FFD147] shadow-md overflow-hidden">
                                <img src={CHICKEN_ALIVE_URL} className="w-20 h-20 object-contain" alt="Chicken Rules" />
                            </div>
                            <h3 className="text-white font-black text-xl uppercase mt-2">Chicken Road Rules</h3>
                        </div>
                        <div className="bg-[#222] p-4 rounded-xl border border-[#222] shadow-inner">
                            <h4 className="text-[#2ECC71] font-bold text-sm mb-1">1. Choose Difficulty</h4>
                            <p className="text-xs leading-relaxed">Select Easy, Medium, Hard, or Hardcore. Higher difficulty means bigger multipliers but higher risk!</p>
                        </div>
                        <div className="bg-[#222] p-4 rounded-xl border border-[#222] shadow-inner">
                            <h4 className="text-[#2ECC71] font-bold text-sm mb-1">2. Cross the Road</h4>
                            <p className="text-xs leading-relaxed">Tap "GO" or click directly on the road to hop across the lanes. Each successfully crossed lane increases your multiplier value.</p>
                        </div>
                        <div className="bg-[#222] p-4 rounded-xl border border-[#222] shadow-inner">
                            <h4 className="text-[#2ECC71] font-bold text-sm mb-1">3. Cash Out before Crash!</h4>
                            <p className="text-xs leading-relaxed">Secure your total winnings by tapping "Cash Out". If a vehicle squishes the chicken before cashing out, the bet is lost.</p>
                        </div>
                        <p className="text-center text-[10px] text-gray-500 font-bold py-2">100% Provably Fair. RTP 96%.</p>
                    </div>
                </div>
            )}

            {betModalOpen && (
                <div className="absolute inset-0 z-50 bg-black/80 flex items-end justify-center animate-fade-in" onClick={() => setBetModalOpen(false)}>
                    <div className="bg-[#3A3A3A] w-full rounded-t-2xl p-4 border-t border-gray-600 animate-slide-up" onClick={e=>e.stopPropagation()}>
                        <div className="text-center text-white font-bold mb-3 text-sm">SELECT BET</div>
                        <div className="grid grid-cols-2 gap-2 mb-4">
                            {[1, 10, 50, 100, 200, 500, 1000, 5000].map(amt => (
                                <button key={amt} onClick={() => { playSound('click'); setBetAmount(amt); setBetModalOpen(false); }} className="bg-[#222] py-2.5 rounded-xl text-gray-300 font-bold text-xs hover:bg-[#555] hover:text-white transition-colors border-b-2 border-black/50">
                                    {amt} INR
                                </button>
                            ))}
                        </div>
                        <button onClick={()=>{playSound('click'); setBetModalOpen(false);}} className="w-full bg-[#E74C3C] py-2.5 rounded-xl text-white font-bold text-xs shadow-lg active:scale-95">Cancel</button>
                    </div>
                </div>
            )}

            {depositModalOpen && (
                <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-[#333] border-2 border-[#FFD147] shadow-2xl rounded-3xl p-5 w-full max-w-[300px] flex flex-col items-center text-center">
                        <div className="text-5xl mb-2">💸</div>
                        <h2 className="text-xl font-black text-[#FFD147] mb-1 drop-shadow-md">OUT OF FUNDS!</h2>
                        <p className="text-gray-300 text-xs mb-4 font-semibold">Deposit now to get up to 500% Bonus and keep crossing safely!</p>
                        <button onClick={() => { playSound('click'); navigate('deposit'); }} className="w-full py-3 bg-[#2ECC71] rounded-xl font-black tracking-wider text-white text-base shadow-[0_4px_0_rgba(0,0,0,0.3)] active:translate-y-1 active:shadow-none transition-all">
                            DEPOSIT NOW
                        </button>
                        <button onClick={() => { playSound('click'); setDepositModalOpen(false); }} className="mt-3 text-gray-400 font-bold text-xs underline">Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
}
