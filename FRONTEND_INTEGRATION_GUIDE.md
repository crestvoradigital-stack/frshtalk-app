# 🔌 Frontend Integration Guide

How to connect your FrshTalk frontend to the real backend API.

---

## 🎯 Overview

This guide will help you:
1. Set up environment variables
2. Create API client
3. Update AuthContext to use real API
4. Update WalletContext to use real API
5. Integrate WebSocket for real-time features
6. Add WebRTC for video calls
7. Test everything end-to-end

---

## 📋 Step 1: Environment Setup

### 1.1 Create `.env` file

Create `.env` in your project root:

```env
# Backend API
VITE_API_URL=http://localhost:3001
VITE_WS_URL=http://localhost:3001

# Razorpay
VITE_RAZORPAY_KEY=rzp_test_your_key_here

# WebRTC
VITE_STUN_SERVER_1=stun:stun.l.google.com:19302
VITE_STUN_SERVER_2=stun:stun1.l.google.com:19302
```

### 1.2 Production `.env.production`

```env
VITE_API_URL=https://your-backend-url.railway.app
VITE_WS_URL=https://your-backend-url.railway.app
VITE_RAZORPAY_KEY=rzp_live_your_live_key
VITE_STUN_SERVER_1=stun:stun.l.google.com:19302
VITE_STUN_SERVER_2=stun:stun1.l.google.com:19302
```

---

## 📦 Step 2: Install Dependencies

```bash
# Install Socket.io client for WebSocket
pnpm add socket.io-client

# Install for Razorpay
# (already installed from before)
```

---

## 🔧 Step 3: Create API Client

### 3.1 Create `src/lib/api.ts`

```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Helper to get auth token from localStorage
function getAuthToken(): string | null {
  return localStorage.getItem('frshtalk_auth_token');
}

// Helper to make authenticated requests
async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = getAuthToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Request failed');
  }

  return response.json();
}

export const api = {
  // Authentication
  auth: {
    sendOTP: async (phoneNumber: string) => {
      return fetchWithAuth('/api/auth/send-otp', {
        method: 'POST',
        body: JSON.stringify({ phoneNumber }),
      });
    },

    verifyOTP: async (phoneNumber: string, otp: string) => {
      return fetchWithAuth('/api/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ phoneNumber, otp }),
      });
    },

    logout: async (userId: string) => {
      return fetchWithAuth('/api/auth/logout', {
        method: 'POST',
        body: JSON.stringify({ userId }),
      });
    },
  },

  // Users
  users: {
    getProfile: async () => {
      return fetchWithAuth('/api/users/profile');
    },

    updateProfile: async (updates: any) => {
      return fetchWithAuth('/api/users/profile', {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });
    },
  },

  // Listeners
  listeners: {
    getAll: async (params?: { location?: string; tag?: string }) => {
      const query = new URLSearchParams(params as any).toString();
      return fetchWithAuth(`/api/listeners${query ? '?' + query : ''}`);
    },

    getById: async (id: string) => {
      return fetchWithAuth(`/api/listeners/${id}`);
    },
  },

  // Calls
  calls: {
    initiate: async (listenerId: string, callType: 'voice' | 'video') => {
      return fetchWithAuth('/api/calls/initiate', {
        method: 'POST',
        body: JSON.stringify({ listenerId, callType }),
      });
    },

    end: async (callId: string) => {
      return fetchWithAuth(`/api/calls/${callId}/end`, {
        method: 'POST',
      });
    },

    getHistory: async (limit = 20) => {
      return fetchWithAuth(`/api/calls?limit=${limit}`);
    },

    rate: async (callId: string, rating: number, feedback?: string) => {
      return fetchWithAuth(`/api/calls/${callId}/rate`, {
        method: 'POST',
        body: JSON.stringify({ rating, feedback }),
      });
    },
  },

  // Wallet
  wallet: {
    getBalance: async () => {
      return fetchWithAuth('/api/wallet/balance');
    },

    getTransactions: async (limit = 50) => {
      return fetchWithAuth(`/api/wallet/transactions?limit=${limit}`);
    },
  },

  // Payments
  payments: {
    getPackages: async () => {
      return fetchWithAuth('/api/payments/packages');
    },

    createOrder: async (packageId: string, coins: number, amount: number) => {
      return fetchWithAuth('/api/payments/create-order', {
        method: 'POST',
        body: JSON.stringify({ packageId, coins, amount }),
      });
    },

    verify: async (paymentData: any) => {
      return fetchWithAuth('/api/payments/verify', {
        method: 'POST',
        body: JSON.stringify(paymentData),
      });
    },
  },

  // Messages
  messages: {
    getCallMessages: async (callId: string) => {
      return fetchWithAuth(`/api/messages/call/${callId}`);
    },
  },
};
```

---

## 🔐 Step 4: Update AuthContext

Replace your `src/contexts/AuthContext.tsx` with real API integration:

```typescript
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../lib/api';
import { storage } from '../lib/storage';

interface User {
  id: string;
  username: string;
  phoneNumber: string;
  email?: string;
  avatar: string;
  role: 'customer' | 'listener';
  coins: number;
  isVerified: boolean;
  createdAt: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  login: (phoneNumber: string, otp: string) => Promise<void>;
  logout: () => Promise<void>;
  sendOTP: (phoneNumber: string) => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
    isLoading: true,
    error: null,
  });

  // Load auth state from localStorage on mount
  useEffect(() => {
    const token = storage.getAuthToken();
    const user = storage.getUser();

    if (token && user) {
      setAuthState({
        isAuthenticated: true,
        user,
        token,
        isLoading: false,
        error: null,
      });
    } else {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  const sendOTP = async (phoneNumber: string) => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));
      await api.auth.sendOTP(phoneNumber);
      setAuthState((prev) => ({ ...prev, isLoading: false }));
    } catch (error: any) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to send OTP',
      }));
      throw error;
    }
  };

  const login = async (phoneNumber: string, otp: string) => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

      const response = await api.auth.verifyOTP(phoneNumber, otp);

      const user: User = response.user;
      const token = response.token;

      // Save to localStorage
      storage.setAuthToken(token);
      storage.setUser(user);
      storage.setCoins(user.coins);

      // Update state
      setAuthState({
        isAuthenticated: true,
        user,
        token,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Login failed',
      }));
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (authState.user) {
        await api.auth.logout(authState.user.id);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear localStorage
      storage.clearAuth();

      // Reset state
      setAuthState({
        isAuthenticated: false,
        user: null,
        token: null,
        isLoading: false,
        error: null,
      });
    }
  };

  const updateUser = (updates: Partial<User>) => {
    if (authState.user) {
      const updatedUser = { ...authState.user, ...updates };
      storage.setUser(updatedUser);
      setAuthState((prev) => ({ ...prev, user: updatedUser }));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
        sendOTP,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
```

---

## 💰 Step 5: Update WalletContext

Update `src/contexts/WalletContext.tsx`:

```typescript
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../lib/api';
import { useAuth } from './AuthContext';

interface Transaction {
  id: string;
  type: 'purchase' | 'deduct' | 'refund' | 'bonus';
  amount: number;
  coins: number;
  status: 'completed' | 'pending' | 'failed';
  description: string;
  createdAt: string;
}

interface WalletContextType {
  balance: number;
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  addCoins: (packageId: string, coins: number, amount: number) => Promise<void>;
  deductCoins: (amount: number, description: string) => void;
  refreshBalance: () => Promise<void>;
  refreshTransactions: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const { user, updateUser } = useAuth();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load initial balance from user
  useEffect(() => {
    if (user) {
      setBalance(user.coins);
    }
  }, [user]);

  const refreshBalance = async () => {
    try {
      const response = await api.wallet.getBalance();
      setBalance(response.balance);
      updateUser({ coins: response.balance });
    } catch (error: any) {
      console.error('Failed to refresh balance:', error);
    }
  };

  const refreshTransactions = async () => {
    try {
      const response = await api.wallet.getTransactions();
      setTransactions(response.transactions);
    } catch (error: any) {
      console.error('Failed to refresh transactions:', error);
    }
  };

  const addCoins = async (packageId: string, coins: number, amount: number) => {
    setIsLoading(true);
    setError(null);

    try {
      // Create Razorpay order
      const orderResponse = await api.payments.createOrder(packageId, coins, amount);

      // Load Razorpay checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: orderResponse.order.amount,
        currency: orderResponse.order.currency,
        order_id: orderResponse.order.id,
        name: 'FrshTalk',
        description: `Purchase ${coins} coins`,
        handler: async (response: any) => {
          try {
            // Verify payment
            await api.payments.verify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            // Refresh balance and transactions
            await refreshBalance();
            await refreshTransactions();

            setIsLoading(false);
          } catch (error: any) {
            setError(error.message || 'Payment verification failed');
            setIsLoading(false);
          }
        },
        prefill: {
          contact: user?.phoneNumber,
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error: any) {
      setError(error.message || 'Failed to create payment order');
      setIsLoading(false);
    }
  };

  const deductCoins = (amount: number, description: string) => {
    const newBalance = Math.max(0, balance - amount);
    setBalance(newBalance);
    updateUser({ coins: newBalance });

    // Optimistic update - actual deduction happens on backend when call ends
  };

  return (
    <WalletContext.Provider
      value={{
        balance,
        transactions,
        isLoading,
        error,
        addCoins,
        deductCoins,
        refreshBalance,
        refreshTransactions,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
```

---

## 🔌 Step 6: Create WebSocket Client

Create `src/lib/websocket.ts`:

```typescript
import { io, Socket } from 'socket.io-client';
import { storage } from './storage';

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:3001';

let socket: Socket | null = null;

export function connectWebSocket() {
  const token = storage.getAuthToken();

  if (!token) {
    console.error('No auth token found');
    return null;
  }

  if (socket?.connected) {
    return socket;
  }

  socket = io(WS_URL, {
    auth: { token },
    transports: ['websocket', 'polling'],
  });

  socket.on('connect', () => {
    console.log('✅ WebSocket connected');
    socket?.emit('user:online');
  });

  socket.on('disconnect', () => {
    console.log('❌ WebSocket disconnected');
  });

  socket.on('connect_error', (error) => {
    console.error('WebSocket connection error:', error);
  });

  return socket;
}

export function disconnectWebSocket() {
  if (socket) {
    socket.emit('user:offline');
    socket.disconnect();
    socket = null;
  }
}

export function getSocket() {
  return socket;
}

// Helper functions
export const ws = {
  // Call events
  joinCall: (callId: string) => {
    socket?.emit('call:join', { callId });
  },

  leaveCall: (callId: string) => {
    socket?.emit('call:leave', { callId });
  },

  sendOffer: (callId: string, targetUserId: string, offer: RTCSessionDescriptionInit) => {
    socket?.emit('call:offer', { callId, targetUserId, offer });
  },

  sendAnswer: (callId: string, targetUserId: string, answer: RTCSessionDescriptionInit) => {
    socket?.emit('call:answer', { callId, targetUserId, answer });
  },

  sendIceCandidate: (callId: string, targetUserId: string, candidate: RTCIceCandidate) => {
    socket?.emit('call:ice-candidate', { callId, targetUserId, candidate });
  },

  // Message events
  sendMessage: (callId: string, receiverId: string, content: string) => {
    socket?.emit('message:send', { callId, receiverId, content });
  },

  typing: (callId: string, receiverId: string) => {
    socket?.emit('message:typing', { callId, receiverId });
  },
};
```

---

## 📹 Step 7: Update ConnectingScreen with Real WebRTC

The backend already has WebRTC signaling. Here's how to use it in your `ConnectingScreen.tsx`:

```typescript
// Add to your imports
import { ws, connectWebSocket, getSocket } from '../lib/websocket';

// Inside your component
useEffect(() => {
  if (isConnected) {
    // Connect WebSocket
    connectWebSocket();
    const socket = getSocket();

    if (socket) {
      // Join call room
      ws.joinCall(callId);

      // Listen for WebRTC events
      socket.on('call:offer', async (data) => {
        // Handle incoming offer
        // Set remote description and create answer
      });

      socket.on('call:answer', async (data) => {
        // Handle answer
        // Set remote description
      });

      socket.on('call:ice-candidate', async (data) => {
        // Add ICE candidate
      });
    }

    return () => {
      ws.leaveCall(callId);
    };
  }
}, [isConnected, callId]);
```

---

## ✅ Step 8: Test Integration

### 8.1 Start Backend

```bash
cd backend
npm run dev
```

Backend should be running on `http://localhost:3001`

### 8.2 Start Frontend

```bash
cd ..
pnpm dev
```

Frontend should be running on `http://localhost:5173`

### 8.3 Test Login Flow

1. Open `http://localhost:5173`
2. Click "Login"
3. Enter phone number (in development mode, any 10-digit number works)
4. Enter any 6-digit OTP
5. Should login successfully and redirect to home

### 8.4 Test Listeners

1. Navigate to home screen
2. Should see list of listeners from database
3. Click on a listener
4. Should show listener details

### 8.5 Test Calls

1. Click voice/video call on a listener
2. Should create call in database
3. Should connect to WebSocket
4. End call
5. Should deduct coins and save to database

---

## 🎉 Congratulations!

Your frontend is now connected to the real backend!

### What's Working:
- ✅ Real OTP authentication
- ✅ Real user data
- ✅ Real listener data
- ✅ Real call tracking
- ✅ Real coin system
- ✅ Real payments (Razorpay)
- ✅ Real-time messaging
- ✅ WebRTC signaling

---

## 📝 Next Steps

1. Deploy backend to Railway
2. Update `.env.production` with production URLs
3. Test on production
4. Enable Razorpay live mode
5. Launch! 🚀

---

**Need help? Check:**
- [Backend README](./backend/README.md)
- [API Documentation](./backend/API_DOCUMENTATION.md)
- [Deployment Guide](./backend/DEPLOYMENT_GUIDE.md)
