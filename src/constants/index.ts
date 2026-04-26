import { Banner, PromoOffer } from '../types';

// App Configuration
export const APP_CONFIG = {
  name: 'FrshTalk',
  maxWidth: '430px',
  defaultCoins: 100,
  signupBonusCoins: 100,
} as const;

// Call Rates
export const CALL_RATES = {
  voice: 1, // coins per minute
  video: 6, // coins per minute
} as const;

// Banner Slides
export const BANNER_SLIDES: Banner[] = [
  {
    id: 1,
    title: 'Take action',
    subtitle: 'Always report inappropriate behaviour',
    color: 'from-[#5c3d2e] to-[#8b5a3c]',
  },
  {
    id: 2,
    title: 'Stay safe',
    subtitle: 'Your privacy is our priority',
    color: 'from-[#2e4a5c] to-[#3c6b8b]',
  },
  {
    id: 3,
    title: 'Be respectful',
    subtitle: 'Treat others the way you want to be treated',
    color: 'from-[#4a2e5c] to-[#6b3c8b]',
  },
];

// Promo Offers
export const PROMO_OFFERS: PromoOffer[] = [
  {
    id: 'promo-1',
    discountAmount: 750,
    coins: 3600,
    price: 949,
    isPopular: true,
  },
  {
    id: 'promo-2',
    discountAmount: 450,
    coins: 2500,
    price: 688,
  },
];

// Topic Tags for Connecting Screen
export const TOPIC_TAGS = [
  { emoji: '🧳', text: 'Career Stress' },
  { emoji: '😞', text: 'Anxious Thoughts' },
  { emoji: '💔', text: 'Breakup Stress' },
  { emoji: '💬', text: 'Just Need To Talk' },
  { emoji: '😩', text: 'Missing Home' },
  { emoji: '🧠', text: 'Overthinking Again' },
  { emoji: '🌙', text: "Can't Sleep Properly" },
  { emoji: '👂', text: 'Need a Friend to Listen' },
  { emoji: '😰', text: 'Pressure' },
  { emoji: '🏠', text: 'Missing Home' },
] as const;

// Safety Messages
export const SAFETY_MESSAGES = [
  { icon: 'shield', text: 'Help keep our space safe' },
  { icon: 'check', text: 'Your safety comes first' },
  { emoji: '❤️', text: 'Be kind and respectful' },
] as const;

// Onboarding Slides
export const ONBOARDING_SLIDES = [
  {
    id: 1,
    title: 'Feeling low? Talk to our listeners',
    subtitle: 'Speak to people who understand and support you without judgment',
    illustration: 'chat',
  },
  {
    id: 2,
    title: 'Every call is safe and secure',
    subtitle: 'No abuse, no misbehaviour. We ensure a respectful platform',
    illustration: 'secure',
  },
  {
    id: 3,
    title: 'Your name & face, always private',
    subtitle: 'Your identity stays anonymous. Just a safe space to talk.',
    illustration: 'anonymous',
  },
] as const;

// Locations
export const LOCATIONS = [
  'All',
  'Hyderabad',
  'Bangalore',
  'Vizag',
  'Kurnool',
  'Chennai',
  'Mumbai',
  'Delhi',
] as const;

// Languages
export const LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
] as const;

// Listener Tags
export const LISTENER_TAGS = [
  'Family and relationships',
  'Films and music',
  'Career',
  'Childhood memories',
  'Emotional',
  'Emotional or Supportive talk',
  'Culture, Roots & Memories',
  'Mental Health',
  'Breakup',
  'Stress',
  'Anxiety',
  'Depression',
] as const;

// Animation Durations (in milliseconds)
export const ANIMATION_DURATIONS = {
  bannerRotation: 5000,
  promoRotation: 4000,
  safetyMessageRotation: 3000,
  dotAnimation: 500,
  refreshCooldown: 1000,
  newDosttsRefresh: 10000,
} as const;

// Validation Rules
export const VALIDATION_RULES = {
  phoneNumber: {
    minLength: 10,
    maxLength: 10,
    pattern: /^[6-9]\d{9}$/,
  },
  otp: {
    length: 6,
    pattern: /^\d{6}$/,
  },
  username: {
    minLength: 3,
    maxLength: 20,
    pattern: /^[a-z0-9_]+$/,
  },
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  authToken: 'frshtalk_auth_token',
  user: 'frshtalk_user',
  coins: 'frshtalk_coins',
  hasSeenOnboarding: 'frshtalk_onboarding',
  hasClaimedSignupBonus: 'frshtalk_signup_bonus',
  favorites: 'frshtalk_favorites',
  settings: 'frshtalk_settings',
} as const;

// API Endpoints (for future backend integration)
export const API_ENDPOINTS = {
  auth: {
    sendOTP: '/auth/send-otp',
    verifyOTP: '/auth/verify-otp',
    logout: '/auth/logout',
  },
  users: {
    profile: '/users/profile',
    update: '/users/update',
  },
  listeners: {
    list: '/listeners',
    detail: '/listeners/:id',
    availability: '/listeners/:id/availability',
  },
  calls: {
    initiate: '/calls/initiate',
    end: '/calls/end',
    history: '/calls/history',
  },
  wallet: {
    balance: '/wallet/balance',
    purchase: '/wallet/purchase',
    transactions: '/wallet/transactions',
  },
  reviews: {
    submit: '/reviews',
    list: '/reviews/:listenerId',
  },
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  network: 'Network error. Please check your connection.',
  invalidPhone: 'Please enter a valid 10-digit phone number.',
  invalidOTP: 'Please enter a valid 6-digit OTP.',
  insufficientCoins: 'Insufficient coins. Please recharge your wallet.',
  callFailed: 'Failed to connect. Please try again.',
  serverError: 'Something went wrong. Please try again later.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  otpSent: 'OTP sent successfully!',
  loginSuccess: 'Login successful!',
  purchaseSuccess: 'Coins added successfully!',
  feedbackSubmitted: 'Thank you for your feedback!',
  settingsSaved: 'Settings saved successfully!',
} as const;

// Achievement Categories
export const ACHIEVEMENT_CATEGORIES = {
  calls: 'Total Calls',
  listener: 'Listener Stats',
  social: 'Social',
  coins: 'Coins Earned',
} as const;

// Support Categories
export const SUPPORT_CATEGORIES = [
  { value: 'technical', label: 'Technical Issue' },
  { value: 'payment', label: 'Payment & Billing' },
  { value: 'abuse', label: 'Report Abuse' },
  { value: 'general', label: 'General Inquiry' },
] as const;

// Time Formats
export const TIME_FORMATS = {
  callHistory: 'hh:mm A',
  transaction: 'MMM DD, YYYY hh:mm A',
  short: 'MMM DD',
  long: 'MMMM DD, YYYY',
} as const;

// Coin Packages
export const COIN_PACKAGES: PromoOffer[] = [
  {
    id: 'basic',
    coins: 100,
    price: 99,
  },
  {
    id: 'popular',
    coins: 500,
    price: 449,
    discountAmount: 50,
    bonusCoins: 50,
    isPopular: true,
  },
  {
    id: 'premium',
    coins: 1000,
    price: 849,
    discountAmount: 150,
    bonusCoins: 100,
  },
  {
    id: 'elite',
    coins: 2500,
    price: 1999,
    discountAmount: 500,
    bonusCoins: 300,
  },
];
