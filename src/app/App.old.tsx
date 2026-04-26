import { useState } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { DosttLogin } from './components/DosttLogin';
import { HomeScreen } from './components/HomeScreen';
import { WalletScreen } from './components/WalletScreen';
import { ConnectingScreen } from './components/ConnectingScreen';
import { SignupBonusScreen } from './components/SignupBonusScreen';

type Screen = 'welcome' | 'login' | 'home' | 'signup-bonus';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [showSignupBonus, setShowSignupBonus] = useState(true);

  const handleLogin = () => {
    setCurrentScreen('login');
  };

  const handleVerifyOTP = () => {
    if (showSignupBonus) {
      setCurrentScreen('signup-bonus');
    } else {
      setCurrentScreen('home');
    }
  };

  const handleClaimBonus = () => {
    setShowSignupBonus(false);
    setCurrentScreen('home');
  };

  const handleBack = () => {
    if (currentScreen === 'login') {
      setCurrentScreen('welcome');
    }
  };

  if (currentScreen === 'welcome') {
    return (
      <div className="fixed inset-0 overflow-hidden">
        <div className="h-full w-full max-w-[430px] mx-auto">
          <WelcomeScreen onLogin={handleLogin} />
        </div>
      </div>
    );
  }

  if (currentScreen === 'login') {
    return (
      <div className="fixed inset-0 overflow-hidden">
        <div className="h-full w-full max-w-[430px] mx-auto">
          <DosttLogin onBack={handleBack} onVerified={handleVerifyOTP} />
        </div>
      </div>
    );
  }

  if (currentScreen === 'signup-bonus') {
    return (
      <div className="fixed inset-0 overflow-hidden">
        <div className="h-full w-full max-w-[430px] mx-auto">
          <SignupBonusScreen onClaim={handleClaimBonus} />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 overflow-hidden">
      <div className="h-full w-full max-w-[430px] mx-auto">
        <HomeScreen onBack={handleBack} />
      </div>
    </div>
  );
}
