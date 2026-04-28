import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState } from '../types';
import { storage } from '../lib/storage';
import { APP_CONFIG } from '../constants';
import { generateId } from '../lib/utils';
import { apiPost } from '../lib/api';

interface AuthContextType extends AuthState {
  login: (phoneNumber: string, otp: string) => Promise<void>;
  logout: () => void;
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

  // Load user from storage on mount
  useEffect(() => {
    const loadUser = () => {
      try {
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
      } catch (error) {
        console.error('Failed to load user:', error);
        setAuthState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    loadUser();
  }, []);

  const login = async (phoneNumber: string, otp: string): Promise<void> => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // Call backend API
      const response = await apiPost<{ user: User; token: string }>('/auth/verify-otp', {
        phoneNumber,
        otp,
      });

      const { user, token } = response;

      // Save to storage
      storage.setAuthToken(token);
      storage.setUser(user);
      storage.setCoins(user.coins || 0);

      setAuthState({
        isAuthenticated: true,
        user,
        token,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Login failed',
      }));
      throw error;
    }
  };

  const logout = () => {
    storage.clearAll();
    setAuthState({
      isAuthenticated: false,
      user: null,
      token: null,
      isLoading: false,
      error: null,
    });
  };

  const updateUser = (updates: Partial<User>) => {
    if (authState.user) {
      const updatedUser = { ...authState.user, ...updates };
      storage.setUser(updatedUser);
      setAuthState((prev) => ({
        ...prev,
        user: updatedUser,
      }));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
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
