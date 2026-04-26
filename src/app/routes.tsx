import { lazy } from 'react';

// Lazy load components for better performance
export const WelcomeScreen = lazy(() =>
  import('./components/WelcomeScreen').then((module) => ({ default: module.WelcomeScreen }))
);

export const DosttLogin = lazy(() =>
  import('./components/DosttLogin.improved').then((module) => ({ default: module.DosttLogin }))
);

export const SignupBonusScreen = lazy(() =>
  import('./components/SignupBonusScreen').then((module) => ({ default: module.SignupBonusScreen }))
);

export const HomeScreen = lazy(() =>
  import('./components/HomeScreen').then((module) => ({ default: module.HomeScreen }))
);

export const WalletScreen = lazy(() =>
  import('./components/WalletScreen').then((module) => ({ default: module.WalletScreen }))
);

export const TransactionsScreen = lazy(() =>
  import('./components/TransactionsScreen').then((module) => ({ default: module.TransactionsScreen }))
);

export const ProfileScreen = lazy(() =>
  import('./components/ProfileScreen').then((module) => ({ default: module.ProfileScreen }))
);

export const LanguageSettingsScreen = lazy(() =>
  import('./components/LanguageSettingsScreen').then((module) => ({ default: module.LanguageSettingsScreen }))
);

export const HelpSupportScreen = lazy(() =>
  import('./components/HelpSupportScreen').then((module) => ({ default: module.HelpSupportScreen }))
);

export const AccountSettingsScreen = lazy(() =>
  import('./components/AccountSettingsScreen').then((module) => ({ default: module.AccountSettingsScreen }))
);

export const ReferralProgramScreen = lazy(() =>
  import('./components/ReferralProgramScreen').then((module) => ({ default: module.ReferralProgramScreen }))
);

export const AchievementsScreen = lazy(() =>
  import('./components/AchievementsScreen').then((module) => ({ default: module.AchievementsScreen }))
);

export const CrisisSupportScreen = lazy(() =>
  import('./components/CrisisSupportScreen').then((module) => ({ default: module.CrisisSupportScreen }))
);

export const AnalyticsDashboard = lazy(() =>
  import('./components/AnalyticsDashboard').then((module) => ({ default: module.AnalyticsDashboard }))
);

export const ListenerVerificationScreen = lazy(() =>
  import('./components/ListenerVerificationScreen').then((module) => ({ default: module.ListenerVerificationScreen }))
);

export const ConnectingScreen = lazy(() =>
  import('./components/ConnectingScreen').then((module) => ({ default: module.ConnectingScreen }))
);

export const RecentsScreen = lazy(() =>
  import('./components/RecentsScreen').then((module) => ({ default: module.RecentsScreen }))
);
