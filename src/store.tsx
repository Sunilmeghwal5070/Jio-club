import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode, useRef } from 'react';
import { rtdb } from './firebase';
import { ref, onValue, set, update, get, child, onDisconnect, serverTimestamp } from 'firebase/database';

export type AppRoute = 
  | 'home' | 'promotion' | 'activity' | 'wallet' | 'account' 
  | 'depositHistory' | 'withdrawHistory' | 'gameHistory' | 'transaction' | 'notification' | 'vip' | 'settings' | 'attendance' | 'gift'
  | 'login' | 'register' | 'deposit' | 'withdraw' | 'addBank' | 'addUpi' | 'chooseBank' | 'changeAvatar' | 'changePassword' | 'bonusHistory'
  | 'attendanceHistory' | 'attendanceRules' | 'depositPayment' | 'wingo'
  | 'feedback' | 'announcement' | 'beginnerGuide' | 'aboutUs';

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
  phone: string;
  email?: string;
  loginPassword?: string;
  todayWithdrawalCount: number;
  maxWithdrawalAllowed: number;
  attendanceDays: number;
  lastAttendanceDate: string;
  blocked?: boolean;
  wagerReq?: number;
  withdrawalDetails?: {
    savedBank?: { bName: string, name: string, acc: string, ifsc: string };
    savedUpi?: { name: string, phone: string, upi: string };
  };
}

interface Transaction {
  id: string; type: string; status: 'Complete' | 'Failed'; amount: number; time: string; orderNumber: string;
}

interface SystemConfig {
  upiId: string;
  merchantName: string;
  qrUrl: string;
  minDailyBonus: number;
  maxDailyBonus: number;
  minRegBonus: number;
  maxRegBonus: number;
  depositAmounts: string;
  depositBonuses: string;
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
  login: (phone: string, password?: string) => Promise<boolean>;
  registerUser: (data: Partial<User>) => Promise<boolean>;
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
  pendingDepositAmount: number;
  setPendingDepositAmount: (val: number) => void;
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
  showSystemPopup: boolean;
  setShowSystemPopup: (val: boolean) => void;
  systemPopupMessage: string;
  setSystemPopupMessage: (val: string) => void;
  systemPopupTitle: string;
  setSystemPopupTitle: (val: string) => void;
  triggerSystemPopup: (title: string, message: string) => void;
  sysConfig: SystemConfig;
  gamesList: any[];
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('auth') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('auth', String(isAuthenticated));
  }, [isAuthenticated]);

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
  const [pendingDepositAmount, setPendingDepositAmount] = useState<number>(0);
  const [banks, setBanks] = useState<any[]>([]);
  const [selectedUpiCode, setSelectedUpiCode] = useState<string>('');
  const [upis, setUpis] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [toastText, setToastText] = useState<string | null>(null);
  const [sysConfig, setSysConfig] = useState<SystemConfig>({
    upiId: "inrclub@upi",
    merchantName: "JIO CLUB",
    qrUrl: "",
    minDailyBonus: 5,
    maxDailyBonus: 25,
    minRegBonus: 10,
    maxRegBonus: 100,
    depositAmounts: "30,100,200,300,500,1000,2000,3000,5000",
    depositBonuses: "0,0,2,3,4,5,6,7,8"
  });
  const [gamesList, setGamesList] = useState<any[]>([]);
  const [wingoOverrides, setWingoOverrides] = useState<Record<string, any>>({});

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

  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem('userState');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      uid: '',
      nickname: 'Member',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
      vipLevel: 0,
      totalDeposit: 0,
      exp: 0,
      totalBalance: 0,
      thirdPartyBalance: 0,
      arWallet: 0,
      lotteryWallet: 0,
      safeBalance: 0.00,
      lastLogin: '',
      phone: '',
      todayWithdrawalCount: 0,
      maxWithdrawalAllowed: 0,
      attendanceDays: 0,
      lastAttendanceDate: '',
    };
  });

  const [bonusRecords, setBonusRecords] = useState<{ id: string, name: string, amount: number, date: string }[]>(() => {
    const saved = localStorage.getItem('bonusRecords');
    if (saved) {
      try { return JSON.parse(saved); } catch(e) {}
    }
    return [];
  });

  const [myBets, setMyBets] = useState<any[]>(() => {
    const saved = localStorage.getItem('myBets');
    if (saved) {
      try { return JSON.parse(saved); } catch(e) {}
    }
    return [];
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('transactionsState');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  // RTDB SYNC LOGIC
  const updatingFromRtdb = useRef(false);

  useEffect(() => {
    if (!isAuthenticated || !user.phone) return;

    const userRef = ref(rtdb, `users/${user.phone}`);
    const presenceRef = ref(rtdb, `users/${user.phone}/lastActive`);

    // Handle online status
    onDisconnect(presenceRef).set(serverTimestamp());
    const hb = setInterval(() => {
      set(presenceRef, serverTimestamp());
    }, 30000);

    const unsubscribe = onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        updatingFromRtdb.current = true;
        setUser(prev => {
          // Sync mapped fields from Admin
          const mappedUser = {
            ...prev,
            ...data,
            totalBalance: typeof data.balance === 'number' ? data.balance : prev.totalBalance,
            nickname: data.holderName || prev.nickname,
            // Add other mappings if necessary
          };
          return mappedUser;
        });
        
        if (data.history?.games) {
          const bets = Object.values(data.history.games).reverse();
          setMyBets(bets);
        }
        
        if (data.history?.deposits || data.history?.withdrawals) {
          const txs: Transaction[] = [];
          if (data.history.deposits) {
            Object.entries(data.history.deposits).forEach(([id, d]: [string, any]) => {
              txs.push({ id, type: 'Deposit', status: d.status === 'Completed' ? 'Complete' : 'Failed', amount: d.amount, time: d.date, orderNumber: id });
            });
          }
          if (data.history.withdrawals) {
            Object.entries(data.history.withdrawals).forEach(([id, w]: [string, any]) => {
              txs.push({ id, type: 'Withdraw', status: w.status === 'Completed' ? 'Complete' : 'Failed', amount: w.amount, time: w.date, orderNumber: id });
            });
          }
          setTransactions(txs.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()));
        }

        if (data.blocked && isAuthenticated) {
          setIsAuthenticated(false);
          showToast("Your account has been blocked by admin.");
          navigate('login');
        }

        setTimeout(() => { updatingFromRtdb.current = false; }, 100);
      }
    });

    const configRef = ref(rtdb, 'system_config');
    const configUnsubscribe = onValue(configRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setSysConfig(prev => ({ ...prev, ...data }));
    });

    const gamesRef = ref(rtdb, 'games');
    const gamesUnsubscribe = onValue(gamesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setGamesList(Object.values(data));
      }
    });

    // Listen to WinGo Admin Overrides
    const overrides = ['wingo_next_result_1m', 'wingo_next_result_3m', 'wingo_next_result_5m'];
    const overrideUnsubs = overrides.map(path => 
      onValue(ref(rtdb, path), (snapshot) => {
        setWingoOverrides(prev => ({ ...prev, [path]: snapshot.val() }));
      })
    );

    return () => {
      unsubscribe();
      configUnsubscribe();
      gamesUnsubscribe();
      overrideUnsubs.forEach(unsub => unsub());
      clearInterval(hb);
    };
  }, [isAuthenticated, user.phone]);

  // Sync LOCAL changes TO RTDB
  useEffect(() => {
    if (!isAuthenticated || !user.phone || updatingFromRtdb.current) return;

    const userRef = ref(rtdb, `users/${user.phone}`);
    update(userRef, {
      balance: user.totalBalance,
      holderName: user.nickname,
      avatar: user.avatar,
      lastLogin: user.lastLogin,
      uid: user.uid,
      vipLevel: user.vipLevel,
      totalDeposit: user.totalDeposit,
      exp: user.exp,
      phone: user.phone
    });
  }, [user.totalBalance, user.nickname, user.avatar, user.lastLogin, user.vipLevel]);

  useEffect(() => {
    localStorage.setItem('userState', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('transactionsState', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('bonusRecords', JSON.stringify(bonusRecords));
  }, [bonusRecords]);

  useEffect(() => {
    localStorage.setItem('myBets', JSON.stringify(myBets));
  }, [myBets]);

  const registerUser = async (data: Partial<User>) => {
    if (!data.phone) return false;
    
    setIsLoading(true);
    try {
      const userRef = ref(rtdb, `users/${data.phone}`);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        showToast("Phone number already registered!");
        return false;
      }

      const randomBonus = Math.floor(Math.random() * (sysConfig.maxRegBonus - sysConfig.minRegBonus + 1)) + sysConfig.minRegBonus;
      const newUser: User = {
        uid: Math.floor(1000000 + Math.random() * 9000000).toString(),
        nickname: data.nickname || `Member${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
        avatar: data.avatar || 'https://i.pravatar.cc/150?u=' + Math.random(),
        vipLevel: 0,
        totalDeposit: 0,
        exp: 0,
        totalBalance: randomBonus,
        thirdPartyBalance: 0,
        arWallet: 0,
        lotteryWallet: randomBonus,
        safeBalance: 0,
        lastLogin: new Date().toLocaleString(),
        phone: data.phone,
        loginPassword: data.loginPassword,
        todayWithdrawalCount: 0,
        maxWithdrawalAllowed: 0,
        attendanceDays: 0,
        lastAttendanceDate: '',
        wagerReq: 0
      };

      await set(userRef, {
        ...newUser,
        balance: newUser.totalBalance,
        holderName: newUser.nickname,
        createdAt: Date.now()
      });

      const bonusId = Math.random().toString(36).substr(2, 9);
      const bonusDate = new Date().toLocaleString();
      
      setTransactions([]);
      setMyBets([]);
      setBonusRecords([{ id: bonusId, name: 'Welcome Bonus', amount: randomBonus, date: bonusDate }]);
      
      await set(ref(rtdb, `users/${data.phone}/history/bonus/${bonusId}`), {
        id: bonusId, name: 'Welcome Bonus', amount: randomBonus, date: bonusDate
      });

      setUser(newUser);
      setIsAuthenticated(true);
      showToast(`Registered! Got ₹${randomBonus} bonus!`, 3000);
      navigate('home');
      return true;
    } catch (e) {
      showToast("Registration failed. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const login = async (phone: string, password?: string) => {
    setIsLoading(true);
    try {
      const userRef = ref(rtdb, `users/${phone}`);
      const snapshot = await get(userRef);
      if (!snapshot.exists()) {
        showToast("User not found!");
        return false;
      }

      const data = snapshot.val();
      if (password && data.loginPassword !== password) {
        showToast("Incorrect password!");
        return false;
      }

      if (data.blocked) {
        showToast("Your account is blocked.");
        return false;
      }

      // Clear old state before login
      setTransactions([]);
      setMyBets([]);
      setBonusRecords([]);

      const updatedUser = {
        ...user,
        ...data,
        totalBalance: data.balance || data.totalBalance || 0,
        nickname: data.holderName || data.nickname || "Member",
        lastLogin: new Date().toLocaleString()
      };
      
      setUser(updatedUser);
      setIsAuthenticated(true);
      navigate('home');
      return true;
    } catch (e) {
      showToast("Login failed.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = () => { 
    setIsAuthenticated(false); 
    setUser({
      uid: '',
      nickname: 'Member',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
      vipLevel: 0,
      totalDeposit: 0,
      exp: 0,
      totalBalance: 0,
      thirdPartyBalance: 0,
      arWallet: 0,
      lotteryWallet: 0,
      safeBalance: 0.00,
      lastLogin: '',
      phone: '',
      todayWithdrawalCount: 0,
      maxWithdrawalAllowed: 0,
      attendanceDays: 0,
      lastAttendanceDate: '',
    });
    setTransactions([]);
    setMyBets([]);
    setBonusRecords([]);
    localStorage.removeItem('userState');
    localStorage.removeItem('transactionsState');
    localStorage.removeItem('myBets');
    localStorage.removeItem('bonusRecords');
    localStorage.removeItem('auth');
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
    if (user.phone) {
      update(ref(rtdb, `users/${user.phone}/withdrawalDetails`), { savedBank: bank });
    }
  };

  const addUpi = (upi: any) => {
    setUpis(prev => [...prev, upi]);
    if (user.phone) {
      update(ref(rtdb, `users/${user.phone}/withdrawalDetails`), { savedUpi: upi });
    }
  };

  const addBonusRecord = useCallback((name: string, amount: number) => {
    const id = Math.random().toString(36).substr(2, 9);
    const date = new Date().toLocaleString('en-US', { hour12: false }).replace(',', '');
    setBonusRecords(prev => [{ id, name, amount, date }, ...prev]);
    if (user.phone) {
      set(ref(rtdb, `users/${user.phone}/history/bonus/${id}`), { id, name, amount, date });
    }
  }, [user.phone]);

  useEffect(() => {
    if (!isAuthenticated) return;
    
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
              
              // Use pre-fetched overrides from state
              let result: any = null;
              const overridePath = duration === 60 ? 'wingo_next_result_1m' : (duration === 180 ? 'wingo_next_result_3m' : 'wingo_next_result_5m');
              const overrideData = wingoOverrides[overridePath];
              
              if (overrideData && overrideData.number !== undefined) {
                const num = overrideData.number;
                const size = num >= 5 ? 'Big' : 'Small';
                let color = 'red';
                if (num === 0) color = 'split-red-purple';
                else if (num === 5) color = 'split-green-purple';
                else if (num % 2 !== 0) color = 'green';
                result = { num, size, color };
              }

              if (!result) {
                let hash = 0;
                for (let j = 0; j < bet.period.length; j++) {
                    hash = Math.imul(31, hash) + bet.period.charCodeAt(j) | 0;
                }
                const num = Math.abs(hash) % 10;
                const size = num >= 5 ? 'Big' : 'Small';
                let color = 'red';
                if (num === 0) color = 'split-red-purple';
                else if (num === 5) color = 'split-green-purple';
                else if (num % 2 !== 0) color = 'green';
                result = { num, size, color };
              }

              let won = false;
              if (bet.type === 'Big' && result.size === 'Big') won = true;
              if (bet.type === 'Small' && result.size === 'Small') won = true;
              if (bet.type === 'Win' && result.color.includes('green')) won = true;
              if (bet.type === 'Green' && result.color.includes('green')) won = true;
              if (bet.type === 'Red' && result.color.includes('red')) won = true;
              if (bet.type === 'Purple' && result.color.includes('purple')) won = true;
              if (typeof bet.type === 'number' && bet.type === result.num) won = true;

              const updatedBet = won 
                ? { ...bet, status: 'Succeed', payout: typeof bet.type === 'number' ? bet.amount * 9 : bet.amount * 1.96, result }
                : { ...bet, status: 'Failed', payout: -bet.amount, result };

              if (won) balanceAddition += updatedBet.payout;
              
              // Sync result to RTDB
              if (user.phone) {
                update(ref(rtdb, `users/${user.phone}/history/games/${bet.id || bet.period}`), updatedBet);
              }

              return updatedBet;
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
  }, [user.phone, isAuthenticated, wingoOverrides]);

  const [showSystemPopup, setShowSystemPopup] = useState(false);
  const [systemPopupMessage, setSystemPopupMessage] = useState('');
  const [systemPopupTitle, setSystemPopupTitle] = useState('WELCOME');

  const triggerSystemPopup = useCallback((title: string, message: string) => {
    setSystemPopupTitle(title);
    setSystemPopupMessage(message);
    setShowSystemPopup(true);
  }, []);

  const addTransaction = (tx: Transaction) => {
    setTransactions(prev => [tx, ...prev]);
    if (user.phone) {
      const type = tx.type === 'Deposit' ? 'deposits' : 'withdrawals';
      set(ref(rtdb, `users/${user.phone}/history/${type}/${tx.id}`), {
        amount: tx.amount,
        date: tx.time,
        status: tx.status === 'Complete' ? 'Completed' : 'Processing',
        utr: tx.orderNumber,
        method: tx.type === 'Deposit' ? 'UPI' : 'Bank'
      });
    }
  };

  return (
    <AppContext.Provider value={{
      currentRoute, navigate, goBack, user, setUser,
      transactions, addTransaction,
      isAuthenticated, login, registerUser, logout,
      showFirstDeposit, setShowFirstDeposit,
      showCaptcha, setShowCaptcha, triggerCaptcha, captchaSuccess,
      selectedBankName, setSelectedBankName,
      addingBankName, setAddingBankName,
      pendingDepositAmount, setPendingDepositAmount,
      banks, addBank,
      selectedUpiCode, setSelectedUpiCode,
      upis, addUpi,
      isLoading, setIsLoading,
      toastText, showToast,
      withdrawInstructions, setWithdrawInstructions,
      unreadNotifications, markNotificationsRead,
      myBets, setMyBets,
      bonusRecords, addBonusRecord,
      showSystemPopup, setShowSystemPopup,
      systemPopupMessage, setSystemPopupMessage,
      systemPopupTitle, setSystemPopupTitle,
      triggerSystemPopup,
      sysConfig,
      gamesList
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
