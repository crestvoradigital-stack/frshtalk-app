import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Transaction, CoinPackage } from '../types';
import { storage } from '../lib/storage';
import { useAuth } from './AuthContext';
import { generateId } from '../lib/utils';

interface WalletContextType {
  balance: number;
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  addCoins: (amount: number, packageData?: CoinPackage) => Promise<void>;
  deductCoins: (amount: number, description: string, metadata?: Record<string, unknown>) => Promise<void>;
  purchasePackage: (pkg: CoinPackage) => Promise<void>;
  refreshBalance: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const { user, updateUser } = useAuth();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load balance from storage on mount
  useEffect(() => {
    if (user) {
      const storedCoins = storage.getCoins();
      setBalance(storedCoins || user.coins);
    }
  }, [user]);

  const refreshBalance = () => {
    if (user) {
      const storedCoins = storage.getCoins();
      setBalance(storedCoins);
      updateUser({ coins: storedCoins });
    }
  };

  const addCoins = async (
    amount: number,
    packageData?: CoinPackage
  ): Promise<void> => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    setIsLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newBalance = balance + amount;

      // Create transaction record
      const transaction: Transaction = {
        id: generateId(),
        userId: user.id,
        type: 'purchase',
        amount,
        status: 'completed',
        timestamp: new Date(),
        description: packageData
          ? `Purchased ${packageData.coins} coins package`
          : `Added ${amount} coins`,
        metadata: packageData
          ? {
              packageId: packageData.id,
            }
          : undefined,
      };

      // Update balance
      setBalance(newBalance);
      storage.setCoins(newBalance);
      updateUser({ coins: newBalance });

      // Add transaction
      setTransactions((prev) => [transaction, ...prev]);

      setIsLoading(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add coins';
      setError(errorMessage);
      setIsLoading(false);
      throw new Error(errorMessage);
    }
  };

  const deductCoins = async (
    amount: number,
    description: string,
    metadata?: Record<string, unknown>
  ): Promise<void> => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    if (balance < amount) {
      throw new Error('Insufficient coins');
    }

    setIsLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newBalance = balance - amount;

      // Create transaction record
      const transaction: Transaction = {
        id: generateId(),
        userId: user.id,
        type: 'call',
        amount: -amount,
        status: 'completed',
        timestamp: new Date(),
        description,
        metadata: metadata as Transaction['metadata'],
      };

      // Update balance
      setBalance(newBalance);
      storage.setCoins(newBalance);
      updateUser({ coins: newBalance });

      // Add transaction
      setTransactions((prev) => [transaction, ...prev]);

      setIsLoading(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to deduct coins';
      setError(errorMessage);
      setIsLoading(false);
      throw new Error(errorMessage);
    }
  };

  const purchasePackage = async (pkg: CoinPackage): Promise<void> => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    setIsLoading(true);
    setError(null);

    try {
      // TODO: Integrate with payment gateway (Razorpay/Stripe)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const totalCoins = pkg.coins + (pkg.bonusCoins || 0);
      await addCoins(totalCoins, pkg);

      setIsLoading(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to purchase package';
      setError(errorMessage);
      setIsLoading(false);
      throw new Error(errorMessage);
    }
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
        purchasePackage,
        refreshBalance,
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
