import React, { useEffect } from 'react';
import { AppProvider, useApp } from './store';
import { BottomNav } from './components/BottomNav';
import { Home } from './pages/Home';
import { Wallet } from './pages/Wallet';
import { Account } from './pages/Account';
import { Activity } from './pages/Activity';
import { Promotion } from './pages/Promotion';
import { DepositHistory } from './pages/DepositHistory';
import { WithdrawHistory } from './pages/WithdrawHistory';
import { VIP } from './pages/VIP';
import { Attendance } from './pages/Attendance';
import { Gift } from './pages/Gift';
import { Settings } from './pages/Settings';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Deposit } from './pages/Deposit';
import { Withdraw } from './pages/Withdraw';
import { AddBank } from './pages/AddBank';
import { AddUpi } from './pages/AddUpi';
import { ChooseBank } from './pages/ChooseBank';
import { GameHistory } from './pages/GameHistory';
import { Transaction } from './pages/Transaction';
import { Notification } from './pages/Notification';
import { CaptchaModal } from './components/CaptchaModal';
import { FirstDepositModal } from './components/FirstDepositModal';
import { GlobalOverlays } from './components/GlobalOverlays';

import { Wingo } from './pages/Wingo';
import { WalletContainer } from './pages/WalletContainer';
import { AboutUs } from './pages/AboutUs';
import { Announcement } from './pages/Announcement';
import { BeginnerGuide } from './pages/BeginnerGuide';
import { Feedback } from './pages/Feedback';
import { ChangeAvatar } from './pages/ChangeAvatar';
import { ChangePassword } from './pages/ChangePassword';
import { BonusHistory } from './pages/BonusHistory';
import { AttendanceHistory } from './pages/AttendanceHistory';
import { AttendanceRules } from './pages/AttendanceRules';

import { DepositPayment } from './pages/DepositPayment';
import { SystemPopup } from './components/SystemPopup';

function MainLayout() {
  const { currentRoute, isAuthenticated, showCaptcha, showFirstDeposit } = useApp();

  const renderPage = () => {
    // If not authenticated, force login or register
    if (!isAuthenticated && currentRoute !== 'register') {
      return <Login />;
    }

    switch (currentRoute) {
      case 'home': return <Home />;
      case 'depositPayment': return <DepositPayment />;
      case 'wingo': return <Wingo />;
      case 'wallet': return <WalletContainer />;
      case 'account': return <Account />;
      case 'activity': return <Activity />;
      case 'promotion': return <Promotion />;
      case 'feedback': return <Feedback />;
      case 'announcement': return <Announcement />;
      case 'beginnerGuide': return <BeginnerGuide />;
      case 'aboutUs': return <AboutUs />;
      case 'depositHistory': return <DepositHistory />;
      case 'withdrawHistory': return <WithdrawHistory />;
      case 'gameHistory': return <GameHistory />;
      case 'transaction': return <Transaction />;
      case 'notification': return <Notification />;
      case 'vip': return <VIP />;
      case 'attendance': return <Attendance />;
      case 'gift': return <Gift />;
      case 'settings': return <Settings />;
      case 'login': return <Login />;
      case 'register': return <Register />;
      case 'deposit': return <Deposit />;
      case 'withdraw': return <Withdraw />;
      case 'addBank': return <AddBank />;
      case 'addUpi': return <AddUpi />;
      case 'chooseBank': return <ChooseBank />;
      case 'changeAvatar': return <ChangeAvatar />;
      case 'changePassword': return <ChangePassword />;
      case 'bonusHistory': return <BonusHistory />;
      case 'attendanceHistory': return <AttendanceHistory />;
      case 'attendanceRules': return <AttendanceRules />;
      default: return <Home />;
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-bg-base min-h-screen text-white relative shadow-2xl font-sans overflow-x-hidden">
      <div className={currentRoute === 'wingo' ? 'hidden' : ''}>
         {renderPage()}
      </div>
      
      {currentRoute === 'wingo' && (
        <div className="fixed inset-0 z-[110] bg-bg-base overflow-y-auto">
          <Wingo />
        </div>
      )}

      <BottomNav />
      {showCaptcha && <CaptchaModal />}
      {showFirstDeposit && <FirstDepositModal />}
      <GlobalOverlays />
      <SystemPopup />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-black flex justify-center w-full">
        <MainLayout />
      </div>
    </AppProvider>
  );
}
