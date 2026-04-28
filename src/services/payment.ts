import { apiPost, apiGet } from '../lib/api';

export interface CoinPackage {
  id: number;
  coins: number;
  price: number;
  originalPrice?: number;
  discount?: number;
  badge?: string;
  tier: string;
}

export interface PaymentOrder {
  id: string;
  amount: number;
  currency: string;
  status: string;
  razorpayOrderId: string;
  coins: number;
}

export interface Transaction {
  id: string;
  userId: string;
  transactionType: 'credit' | 'debit';
  amount: number;
  coins: number;
  status: 'pending' | 'completed' | 'failed';
  description: string;
  createdAt: string;
  metadata?: any;
}

/**
 * Create a Razorpay payment order
 */
export async function createPaymentOrder(
  packageId: string,
  coins: number,
  amount: number
): Promise<{ success: boolean; order?: PaymentOrder; message: string }> {
  try {
    const response = await apiPost('/payments/create-order', {
      packageId,
      coins,
      amount,
    });

    return {
      success: true,
      order: {
        id: response.order.id,
        amount: response.order.amount,
        currency: response.order.currency,
        status: response.order.status,
        razorpayOrderId: response.order.id,
        coins,
      },
      message: 'Payment order created successfully',
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Failed to create payment order',
    };
  }
}

/**
 * Verify payment after successful Razorpay payment
 */
export async function verifyPayment(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string
): Promise<{ success: boolean; message: string }> {
  try {
    await apiPost('/payments/verify', {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    });

    return {
      success: true,
      message: 'Payment verified successfully',
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Payment verification failed',
    };
  }
}

/**
 * Get user's transaction history
 */
export async function getTransactionHistory(
  limit: number = 20
): Promise<{ success: boolean; transactions?: Transaction[]; message: string }> {
  try {
    const response = await apiGet(`/payments/transactions?limit=${limit}`);

    return {
      success: true,
      transactions: response.transactions,
      message: 'Transaction history retrieved successfully',
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Failed to get transaction history',
    };
  }
}

/**
 * Get user's current wallet balance
 */
export async function getWalletBalance(): Promise<{
  success: boolean;
  balance?: number;
  message: string;
}> {
  try {
    const response = await apiGet('/payments/balance');

    return {
      success: true,
      balance: response.balance,
      message: 'Wallet balance retrieved successfully',
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Failed to get wallet balance',
    };
  }
}

/**
 * Get available coin packages
 */
export function getCoinPackages(): CoinPackage[] {
  return [
    { id: 1, coins: 80, price: 62, tier: 'small' },
    { id: 2, coins: 300, price: 149, tier: 'small' },
    { id: 3, coins: 450, price: 251, tier: 'small' },
    { id: 4, coins: 1100, price: 550, tier: 'basket' },
    { id: 5, coins: 1800, price: 1055, badge: 'Hot', tier: 'basket' },
    { id: 6, coins: 3500, price: 1049, originalPrice: 1549, discount: 500, tier: 'basket' },
    { id: 7, coins: 5000, price: 1999, badge: 'Hot', tier: 'barrel' },
    { id: 8, coins: 9000, price: 2651, originalPrice: 3251, discount: 600, tier: 'barrel' },
    { id: 9, coins: 20000, price: 5000, originalPrice: 8000, discount: 3000, badge: 'Value Pack', tier: 'chest' },
    { id: 10, coins: 26000, price: 9999, tier: 'chest' },
    { id: 11, coins: 55000, price: 17999, tier: 'vault' },
    { id: 12, coins: 90000, price: 28999, tier: 'cart' },
  ];
}