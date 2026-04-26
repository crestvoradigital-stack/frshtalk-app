import { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { WalletProvider } from '../contexts/WalletContext';
import { LoadingSpinner } from './components/shared/LoadingSpinner';
import { storage } from '../lib/storage';
import {
  WelcomeScreen,
  DosttLogin,
  SignupBonusScreen,
  HomeScreen,
  WalletScreen,
  TransactionsScreen,
  ProfileScreen,
  LanguageSettingsScreen,
  HelpSupportScreen,
  AccountSettingsScreen,
  ReferralProgramScreen,
  AchievementsScreen,
  CrisisSupportScreen,
  AnalyticsDashboard,
  ListenerVerificationScreen,
  RecentsScreen,
} from './routes';

// Wrapper components that handle navigation
function WelcomeScreenWrapper() {
  const navigate = useNavigate();
  return <WelcomeScreen onLogin={() => navigate('/login')} />;
}

function DosttLoginWrapper() {
  const navigate = useNavigate();

  return (
    <DosttLogin
      onBack={() => navigate('/welcome')}
      onVerified={() => {}}
    />
  );
}

function SignupBonusWrapper() {
  const navigate = useNavigate();

  if (storage.getHasClaimedSignupBonus()) {
    return <Navigate to="/home" replace />;
  }

  return (
    <SignupBonusScreen
      onClaim={() => {
        storage.setHasClaimedSignupBonus(true);
        navigate('/home');
      }}
    />
  );
}

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner fullScreen message="Loading..." />;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/welcome" replace />;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner fullScreen message="Loading..." />;
  }

  return !isAuthenticated ? <>{children}</> : <Navigate to="/home" replace />;
}

function AppRoutes() {
  return (
    <div className="fixed inset-0 overflow-hidden">
      <div className="h-full w-full max-w-[430px] mx-auto">
        <Suspense fallback={<LoadingSpinner fullScreen message="Loading..." />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/welcome" element={<PublicRoute><WelcomeScreenWrapper /></PublicRoute>} />
            <Route path="/login" element={<PublicRoute><DosttLoginWrapper /></PublicRoute>} />

            {/* Signup Bonus - Show only if not claimed */}
            <Route path="/signup-bonus" element={<PrivateRoute><SignupBonusWrapper /></PrivateRoute>} />

            {/* Protected Routes */}
            <Route
              path="/home"
              element={
                <PrivateRoute>
                  <HomeScreen onBack={() => {}} />
                </PrivateRoute>
              }
            />
            <Route
              path="/recents"
              element={
                <PrivateRoute>
                  <RecentsScreen
                    activeTab="recents"
                    onTabChange={() => {}}
                    onOpenWallet={() => {}}
                  />
                </PrivateRoute>
              }
            />
            <Route
              path="/wallet"
              element={
                <PrivateRoute>
                  <WalletScreen currentCoins={0} onBack={() => {}} />
                </PrivateRoute>
              }
            />
            <Route
              path="/transactions"
              element={
                <PrivateRoute>
                  <TransactionsScreen coins={0} onBack={() => {}} onAddCoins={() => {}} />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <ProfileScreen
                    onNavigate={() => {}}
                    onWalletClick={() => {}}
                    onLogout={() => {}}
                    onSwitchToListener={() => {}}
                  />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile/language"
              element={
                <PrivateRoute>
                  <LanguageSettingsScreen onBack={() => {}} />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile/help"
              element={
                <PrivateRoute>
                  <HelpSupportScreen onBack={() => {}} />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile/account"
              element={
                <PrivateRoute>
                  <AccountSettingsScreen onBack={() => {}} />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile/referral"
              element={
                <PrivateRoute>
                  <ReferralProgramScreen onBack={() => {}} />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile/achievements"
              element={
                <PrivateRoute>
                  <AchievementsScreen onBack={() => {}} />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile/crisis-support"
              element={
                <PrivateRoute>
                  <CrisisSupportScreen onBack={() => {}} />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile/analytics"
              element={
                <PrivateRoute>
                  <AnalyticsDashboard onBack={() => {}} />
                </PrivateRoute>
              }
            />
            <Route
              path="/listener-verification"
              element={
                <PrivateRoute>
                  <ListenerVerificationScreen onBack={() => {}} onBecomeCustomer={() => {}} />
                </PrivateRoute>
              }
            />

            {/* Redirect root to welcome or home based on auth */}
            <Route path="/" element={<Navigate to="/welcome" replace />} />

            {/* 404 - Redirect to home or welcome */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <WalletProvider>
          <AppRoutes />
        </WalletProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
