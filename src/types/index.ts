// User and Listener Types
export interface User {
  id: string;
  username: string;
  phoneNumber: string;
  avatar: string;
  role: 'customer' | 'listener';
  coins: number;
  createdAt: Date;
  isVerified: boolean;
}

export interface Listener extends User {
  role: 'listener';
  voiceRate: number;
  videoRate: number;
  tags: string[];
  isOnCall: boolean;
  waitTime?: number;
  rating: number;
  reviewCount: number;
  location: string;
  isOnline: boolean;
  languages: string[];
  bio?: string;
}

// Call Types
export type CallType = 'voice' | 'video';
export type CallStatus = 'connecting' | 'active' | 'ended' | 'missed' | 'cancelled';

export interface Call {
  id: string;
  listenerId: string;
  customerId: string;
  type: CallType;
  status: CallStatus;
  startTime: Date;
  endTime?: Date;
  duration: number; // in seconds
  cost: number; // in coins
  rating?: number;
  feedback?: string;
}

export interface CallHistory extends Call {
  listenerName: string;
  listenerAvatar: string;
  timestamp: Date;
  direction: 'incoming' | 'outgoing' | 'missed';
}

// Transaction Types
export type TransactionType = 'purchase' | 'call' | 'refund' | 'bonus' | 'referral';
export type TransactionStatus = 'pending' | 'completed' | 'failed';

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number; // in coins
  status: TransactionStatus;
  timestamp: Date;
  description: string;
  metadata?: {
    callId?: string;
    packageId?: string;
    referralCode?: string;
  };
}

// Wallet Types
export interface CoinPackage {
  id: string;
  coins: number;
  price: number; // in rupees
  discountAmount?: number;
  discountPercentage?: number;
  isPopular?: boolean;
  bonusCoins?: number;
}

export interface Wallet {
  userId: string;
  balance: number;
  totalSpent: number;
  totalEarned: number;
  lastUpdated: Date;
}

// Review and Rating Types
export interface Review {
  id: string;
  listenerId: string;
  customerId: string;
  callId: string;
  rating: number; // 1-5
  comment?: string;
  tags?: string[];
  createdAt: Date;
  isHelpful?: boolean;
  helpfulCount?: number;
}

// Achievement Types
export type AchievementCategory = 'calls' | 'listener' | 'social' | 'coins';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: AchievementCategory;
  icon: string;
  requirement: number;
  progress: number;
  isUnlocked: boolean;
  unlockedAt?: Date;
  reward?: {
    coins?: number;
    badge?: string;
  };
}

// Referral Types
export interface Referral {
  id: string;
  referrerId: string;
  referredUserId?: string;
  referralCode: string;
  status: 'pending' | 'completed';
  reward: number; // in coins
  createdAt: Date;
  completedAt?: Date;
}

// Settings Types
export interface UserSettings {
  userId: string;
  language: string;
  notifications: {
    push: boolean;
    email: boolean;
    sms: boolean;
  };
  privacy: {
    showOnlineStatus: boolean;
    allowDirectCalls: boolean;
  };
  soundEffects: boolean;
  autoRecord: boolean;
}

// Auth Types
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  phoneNumber: string;
  otp: string;
}

// Support Types
export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'technical' | 'payment' | 'abuse' | 'general';
  createdAt: Date;
  updatedAt: Date;
  responses?: TicketResponse[];
}

export interface TicketResponse {
  id: string;
  ticketId: string;
  message: string;
  isStaff: boolean;
  createdAt: Date;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'call' | 'transaction' | 'achievement' | 'system';
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
}

// Filter and Search Types
export interface ListenerFilters {
  location?: string;
  minRating?: number;
  maxWaitTime?: number;
  tags?: string[];
  languages?: string[];
  isOnline?: boolean;
  sortBy?: 'rating' | 'price' | 'availability';
}

// Analytics Types
export interface UserAnalytics {
  userId: string;
  totalCalls: number;
  totalDuration: number; // in seconds
  totalSpent: number; // in coins
  averageCallDuration: number;
  favoriteListeners: string[];
  preferredCallType: CallType;
  peakUsageHours: number[];
  monthlyStats: {
    month: string;
    calls: number;
    duration: number;
    spent: number;
  }[];
}

// UI State Types
export type Screen =
  | 'welcome'
  | 'login'
  | 'otp'
  | 'signup-bonus'
  | 'home'
  | 'connecting'
  | 'in-call'
  | 'post-call-feedback'
  | 'wallet'
  | 'transactions'
  | 'profile'
  | 'settings'
  | 'help'
  | 'listener-verification';

export interface LoadingState {
  isLoading: boolean;
  message?: string;
}

export interface ErrorState {
  hasError: boolean;
  message?: string;
  code?: string;
}

// Validation Types
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

// Banner and Promo Types
export interface Banner {
  id: number;
  title: string;
  subtitle: string;
  color: string;
  image?: string;
}

export interface PromoOffer extends CoinPackage {
  validUntil?: Date;
  isLimitedTime?: boolean;
}
