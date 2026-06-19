import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

export type AppRoute = 
  | 'home' | 'promotion' | 'activity' | 'wallet' | 'account' 
  | 'depositHistory' | 'withdrawHistory' | 'gameHistory' | 'transaction' | 'notification' | 'vip' | 'settings' | 'attendance' | 'gift'
  | 'login' | 'register' | 'deposit' | 'withdraw' | 'addBank' | 'addUpi' | 'chooseBank' | 'changeAvatar' | 'changePassword' | 'bonusHistory'
  | 'attendanceHistory' | 'attendanceRules';

export const getVipDetails = (exp: number) => {
  if (exp >= 6000) return { level: 4, dailyLimit: Infinity, amountLimit: Infinity, nextExp: 0, title: 'VIP4' };
  if (exp >= 5000) return { level: 3, dailyLimit: 10, amountLimit: 3000, nextExp: 6000, title: 'VIP3' };
  if (exp >= 1000) return { level: 2, dailyLimit: 5, amountLimit: 500, nextExp: 5000, title: 'VIP2' };
  if (exp >= 300) return { level: 1, dailyLimit: 2, amountLimit: 200, nextExp: 1000, title: 'VIP1' };
  return { level: 0, dailyLimit: 1, amountLimit: 100, nextExp: 300, title: 'VIP0' };
};

interface User {
  uid: string;
  nickname: string;
  avatar: string;
  vipLevel: number;
  totalDeposit: number;
  exp: number;
  totalBalance: number;
  thirdPartyBalance: number;
  arWallet: number;
  lotteryWallet: number;
  safeBalance: number;
  lastLogin: string;
  phone?: string;
  email?: string;
  loginPassword?: string;
  todayWithdrawalCount: number;
  maxWithdrawalAllowed: number;
  attendanceDays: number;
  lastAttendanceDate: string;
}

interface Transaction {
  id: string; type: string; status: 'Complete' | 'Failed'; amount: number; time: string; orderNumber: string;
}

interface AppContextType {
  currentRoute: AppRoute;
  navigate: (route: AppRoute) => void;
  goBack: () => void;
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  transactions: Transaction[];
  addTransaction: (tx: Transaction) => void;
  isAuthenticated: boolean;
  login: (data?: Partial<User>) => void;
  registerUser: (data?: Partial<User>) => void;
  logout: () => void;
  showFirstDeposit: boolean;
  setShowFirstDeposit: (val: boolean) => void;
  showCaptcha: boolean;
  setShowCaptcha: (val: boolean) => void;
  captchaSuccess: () => void;
  triggerCaptcha: (onSuccess: () => void) => void;
  selectedBankName: string;
  setSelectedBankName: (val: string) => void;
  addingBankName: string;
  setAddingBankName: (val: string) => void;
  banks: any[];
  addBank: (bank: any) => void;
  selectedUpiCode: string;
  setSelectedUpiCode: (val: string) => void;
  upis: any[];
  addUpi: (upi: any) => void;
  isLoading: boolean;
  setIsLoading: (val: boolean) => void;
  toastText: string | null;
  showToast: (text: string, duration?: number) => void;
  withdrawInstructions: string[];
  setWithdrawInstructions: (instructions: string[]) => void;
  unreadNotifications: number;
  markNotificationsRead: () => void;
  myBets: any[];
  setMyBets: React.Dispatch<React.SetStateAction<any[]>>;
  bonusRecords: { id: string, name: string, amount: number, date: string }[];
  addBonusRecord: (name: string, amount: number) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('auth') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('auth', String(isAuthenticated));
  }, [isAuthenticated]);

  // Default to login
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(() => {
    return localStorage.getItem('route') as AppRoute || (localStorage.getItem('auth') === 'true' ? 'home' : 'login');
  });

  useEffect(() => {
    localStorage.setItem('route', currentRoute);
  }, [currentRoute]);

  const [routeHistory, setRouteHistory] = useState<AppRoute[]>(() => {
    const saved = localStorage.getItem('route') as AppRoute;
    const isAuth = localStorage.getItem('auth') === 'true';
    return [saved || (isAuth ? 'home' : 'login')];
  });

  useEffect(() => {
    window.history.replaceState({ route: currentRoute }, '', '#' + currentRoute);

    const handlePopState = (event: PopStateEvent) => {
      setRouteHistory(prev => {
        if (prev.length > 1) {
          const newHistory = [...prev];
          newHistory.pop();
          setCurrentRoute(newHistory[newHistory.length - 1]);
          return newHistory;
        } else if (prev[0] !== 'home' && prev[0] !== 'login') {
            const fallback = localStorage.getItem('auth') === 'true' ? 'home' : 'login';
            setCurrentRoute(fallback as AppRoute);
            return [fallback as AppRoute]
        }
        return prev;
      });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const [showFirstDeposit, setShowFirstDeposit] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [captchaCallback, setCaptchaCallback] = useState<(() => void) | null>(null);
  const [selectedBankName, setSelectedBankName] = useState<string>('');
  const [addingBankName, setAddingBankName] = useState<string>('');
  const [banks, setBanks] = useState<any[]>([]);
  const [selectedUpiCode, setSelectedUpiCode] = useState<string>('');
  const [upis, setUpis] = useState<any[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [toastText, setToastText] = useState<string | null>(null);
  const [unreadNotifications, setUnreadNotifications] = useState(() => {
    const saved = localStorage.getItem('unreadNotifications');
    if (saved !== null) {
      try { return JSON.parse(saved); } catch(e) {}
    }
    return 3;
  });
  const markNotificationsRead = useCallback(() => {
    setUnreadNotifications(0);
    localStorage.setItem('unreadNotifications', JSON.stringify(0));
  }, []);


  const [withdrawInstructions, setWithdrawInstructions] = useState<string[]>([
    'Need to bet ₹0.00 to be able to withdraw',
    'Withdraw time 00:00-23:59',
    'Inday Remaining Withdrawal Times: 3',
    'Withdrawal amount range ₹110.00-₹50,000.00',
    'Please confirm your beneficial account information before withdrawing. If your information is incorrect, our company will not be liable for the amount of loss',
    'If your beneficial information is incorrect, please contact customer service'
  ]);

  const showToast = (text: string, duration = 2000) => {
    setToastText(text);
    setTimeout(() => {
      setToastText(prev => prev === text ? null : prev);
    }, duration);
  };

  const navigate = (route: AppRoute) => {
    setCurrentRoute(route);
    setRouteHistory(prev => {
      const newHistory = [...prev, route];
      window.history.pushState({ route }, '', '#' + route);
      return newHistory;
    });
  };

  const goBack = () => {
    if (routeHistory.length > 1) {
      window.history.back();
    } else {
      const fallback = localStorage.getItem('auth') === 'true' ? 'home' : 'login';
      if (currentRoute !== fallback) {
        navigate(fallback as AppRoute);
      }
    }
  };

  const registerUser = (data?: Partial<User>) => {
    const randomBonus = Math.floor(Math.random() * (25 - 10 + 1)) + 10;
    
    // Add bonus record directly by setting state
    const id = Math.random().toString(36).substr(2, 9);
    const date = new Date().toLocaleString('en-US', { hour12: false }).replace(',', '');
    setBonusRecords(prev => [{ id, name: 'Welcome Bonus', amount: randomBonus, date }, ...prev]);

    setUser(prev => ({ 
      ...prev, 
      ...(data || {}), 
      totalBalance: prev.totalBalance + randomBonus,
      lotteryWallet: prev.lotteryWallet + randomBonus 
    }));
    setIsAuthenticated(true);
    showToast(`Registered successfully! You got a ₹${randomBonus} welcome bonus!`, 3000);
    navigate('home');
    setTimeout(() => {
      const hiddenDate = localStorage.getItem('hideFirstDepositBonus');
      if (hiddenDate !== new Date().toDateString()) {
        setShowFirstDeposit(true);
      }
    }, 1500);
  };
  
  const login = (data?: Partial<User>) => {
    if (data) setUser(prev => ({ ...prev, ...data }));
    setIsAuthenticated(true);
    navigate('home');
    // Show first deposit bonus shortly after login, if not hidden today
    setTimeout(() => {
      const hiddenDate = localStorage.getItem('hideFirstDepositBonus');
      if (hiddenDate !== new Date().toDateString()) {
        setShowFirstDeposit(true);
      }
    }, 1500);
  };
  
  const logout = () => { 
    setIsAuthenticated(false); 
    navigate('login'); 
  };

  const triggerCaptcha = (onSuccess: () => void) => {
    setCaptchaCallback(() => onSuccess);
    setShowCaptcha(true);
  };

  const captchaSuccess = () => {
    setShowCaptcha(false);
    if (captchaCallback) captchaCallback();
    setCaptchaCallback(null);
  };

  const addBank = (bank: any) => {
    setBanks(prev => [...prev, bank]);
  };

  const addUpi = (upi: any) => {
    setUpis(prev => [...prev, upi]);
  };

  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem('userState');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      uid: '1386823',
      nickname: 'MemberNNGE7BFH',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
      vipLevel: 0,
      totalDeposit: 0,
      exp: 0,
      totalBalance: 0,
      thirdPartyBalance: 0,
      arWallet: 0,
      lotteryWallet: 0,
      safeBalance: 0.00,
      lastLogin: '2026-06-17 23:32:48',
      phone: '9876543210',
      todayWithdrawalCount: 0,
      maxWithdrawalAllowed: 0,
      attendanceDays: 0,
      lastAttendanceDate: '',
    };
  });

  useEffect(() => {
    localStorage.setItem('userState', JSON.stringify(user));
  }, [user]);

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('transactionsState');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('transactionsState', JSON.stringify(transactions));
  }, [transactions]);

  const [bonusRecords, setBonusRecords] = useState<{ id: string, name: string, amount: number, date: string }[]>(() => {
    const saved = localStorage.getItem('bonusRecords');
    if (saved) {
      try { return JSON.parse(saved); } catch(e) {}
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('bonusRecords', JSON.stringify(bonusRecords));
  }, [bonusRecords]);

  const addBonusRecord = useCallback((name: string, amount: number) => {
    const id = Math.random().toString(36).substr(2, 9);
    const date = new Date().toLocaleString('en-US', { hour12: false }).replace(',', '');
    
    setBonusRecords(prev => [{ id, name, amount, date }, ...prev]);
  }, []);

  const [myBets, setMyBets] = useState<any[]>(() => {
    const saved = localStorage.getItem('myBets');
    if (saved) {
      try { return JSON.parse(saved); } catch(e) {}
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('myBets', JSON.stringify(myBets));
  }, [myBets]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMyBets(prevBets => {
        let changed = false;
        let balanceAddition = 0;
        const now = Date.now();
        
        const newBets = prevBets.map(bet => {
          if (bet.status === 'Pending') {
            const tabCode = bet.period.slice(8, 11);
            const durationMap: Record<string, number> = {'100': 30, '101': 60, '103': 180, '105': 300};
            const duration = durationMap[tabCode];
            if (!duration) return bet;
            
            const date = new Date(now);
            const yyyy = date.getFullYear();
            const mm = String(date.getMonth() + 1).padStart(2, '0');
            const dd = String(date.getDate()).padStart(2, '0');
            const startOfDay = new Date(date).setHours(0,0,0,0);
            const msPassed = now - startOfDay;
            const periodsPassed = Math.floor(msPassed / (duration * 1000));
            const currentPeriod = `${yyyy}${mm}${dd}${tabCode}${String(10000 + periodsPassed)}`;

            if (bet.period < currentPeriod) {
              changed = true;
              
              let hash = 0;
              for (let i = 0; i < bet.period.length; i++) {
                  hash = Math.imul(31, hash) + bet.period.charCodeAt(i) | 0;
              }
              const num = Math.abs(hash) % 10;
              const size = num >= 5 ? 'Big' : 'Small';
              let color = 'red';
              if (num === 0) color = 'split-red-purple';
              else if (num === 5) color = 'split-green-purple';
              else if (num % 2 !== 0) color = 'green';
              const result = { num, size, color };

              let won = false;
              if (bet.type === 'Big' && result.size === 'Big') won = true;
              if (bet.type === 'Small' && result.size === 'Small') won = true;
              if (bet.type === 'Green' && result.color.includes('green')) won = true;
              if (bet.type === 'Red' && result.color.includes('red')) won = true;
              if (bet.type === 'Purple' && result.color.includes('purple')) won = true;
              if (typeof bet.type === 'number' && bet.type === result.num) won = true;

              if (won) {
                 let payout = 0;
                 if (typeof bet.type === 'number') payout = bet.amount * 9;
                 else payout = bet.amount * 1.96;
                 
                 balanceAddition += payout;
                 return { ...bet, status: 'Succeed', payout, result };
              } else {
                 return { ...bet, status: 'Failed', payout: -bet.amount, result };
              }
            }
          }
          return bet;
        });

        if (changed) {
           if (balanceAddition > 0) {
             setUser(u => ({ ...u, totalBalance: u.totalBalance + balanceAddition }));
           }
           return newBets;
        }
        return prevBets;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const addTransaction = (tx: Transaction) => setTransactions(prev => [tx, ...prev]);

  return (
    <AppContext.Provider value={{
      currentRoute, navigate, goBack, user, setUser,
      transactions, addTransaction,
      isAuthenticated, login, registerUser, logout,
      showFirstDeposit, setShowFirstDeposit,
      showCaptcha, setShowCaptcha, triggerCaptcha, captchaSuccess,
      selectedBankName, setSelectedBankName,
      addingBankName, setAddingBankName,
      banks, addBank,
      selectedUpiCode, setSelectedUpiCode,
      upis, addUpi,
      isLoading, setIsLoading,
      toastText, showToast,
      withdrawInstructions, setWithdrawInstructions,
      unreadNotifications, markNotificationsRead,
      myBets, setMyBets,
      bonusRecords, addBonusRecord
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
