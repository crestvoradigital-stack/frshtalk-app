import { Router } from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { db } from '../config/supabase.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

async function createOrderHandler(req: any, res: any) {
  try {
    const { packageId, coins, amount } = req.body;
    const userId = (req as any).user?.userId;

    if (!userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'User not authenticated',
      });
    }

    if (!coins || !amount) {
      return res.status(400).json({
        error: 'Invalid input',
        message: 'Coins and amount are required',
      });
    }

    const options = {
      amount: amount * 100,
      currency: 'INR',
      receipt: `order_${userId}_${Date.now()}`,
      notes: {
        userId,
        coins,
        packageId: packageId || 'custom',
      },
    };

    const order = await razorpay.orders.create(options);

    await db.createTransaction({
      user_id: userId,
      transaction_type: 'purchase',
      amount: amount,
      coins: coins,
      status: 'pending',
      payment_gateway: 'razorpay',
      order_id: order.id,
      description: `Purchase ${coins} coins`,
      metadata: {
        packageId,
        razorpayOrderId: order.id,
      },
    });

    res.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
      },
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error: any) {
    console.error('Create order error:', error);
    res.status(500).json({
      error: 'Server error',
      message: error.message || 'Failed to create payment order',
    });
  }
}

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

// ============================================
// CREATE PAYMENT ORDER
// POST /api/payments/create-order
// POST /api/payments/order
// ============================================
router.post('/create-order', authenticateToken, createOrderHandler);
router.post('/order', authenticateToken, createOrderHandler);

// ============================================
// VERIFY PAYMENT
// POST /api/payments/verify
// ============================================
router.post('/verify', authenticateToken, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'User not authenticated',
      });
    }

    // Verify signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({
        error: 'Invalid signature',
        message: 'Payment verification failed',
      });
    }

    // Get transaction from database
    const { data: transactions } = await db.supabaseAdmin
      .from('transactions')
      .select('*')
      .eq('order_id', razorpay_order_id)
      .eq('user_id', userId)
      .single();

    if (!transactions) {
      return res.status(404).json({
        error: 'Transaction not found',
        message: 'No pending transaction found for this order',
      });
    }

    // Update transaction status
    await db.supabaseAdmin
      .from('transactions')
      .update({
        status: 'completed',
        payment_id: razorpay_payment_id,
        updated_at: new Date().toISOString(),
      })
      .eq('order_id', razorpay_order_id);

    // Add coins to user account
    const user = await db.getUserById(userId);
    await db.updateUser(userId, {
      coins: user.coins + transactions.coins,
    });

    res.json({
      success: true,
      message: 'Payment verified successfully',
      coins: transactions.coins,
      newBalance: user.coins + transactions.coins,
    });
  } catch (error: any) {
    console.error('Verify payment error:', error);
    res.status(500).json({
      error: 'Server error',
      message: error.message || 'Failed to verify payment',
    });
  }
});

// ============================================
// GET USER PAYMENT TRANSACTIONS
// GET /api/payments/transactions
// ============================================
router.get('/transactions', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user?.userId;
    const limitRaw = Array.isArray(req.query.limit) ? req.query.limit[0] : req.query.limit;
    const limit = typeof limitRaw === 'string' ? parseInt(limitRaw, 10) : 20;

    if (!userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'User not authenticated',
      });
    }

    const transactions = await db.getUserTransactions(userId, limit);

    res.json({
      success: true,
      count: transactions.length,
      transactions,
    });
  } catch (error: any) {
    console.error('Get payment transactions error:', error);
    res.status(500).json({
      error: 'Server error',
      message: error.message || 'Failed to get payment transactions',
    });
  }
});

// ============================================
// GET USER WALLET BALANCE
// GET /api/payments/balance
// ============================================
router.get('/balance', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user?.userId;

    if (!userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'User not authenticated',
      });
    }

    const user = await db.getUserById(userId);

    res.json({
      success: true,
      balance: user.coins,
    });
  } catch (error: any) {
    console.error('Get payment balance error:', error);
    res.status(500).json({
      error: 'Server error',
      message: error.message || 'Failed to get payment balance',
    });
  }
});

// ============================================
// RAZORPAY WEBHOOK
// POST /api/payments/webhook
// ============================================
router.post('/webhook', async (req, res) => {
  try {
    const webhookSignature = req.headers['x-razorpay-signature'] as string;
    const webhookBody = JSON.stringify(req.body);

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET || '')
      .update(webhookBody)
      .digest('hex');

    if (webhookSignature !== expectedSignature) {
      return res.status(400).json({
        error: 'Invalid signature',
        message: 'Webhook verification failed',
      });
    }

    const event = req.body;

    // Handle different event types
    switch (event.event) {
      case 'payment.captured':
        console.log('Payment captured:', event.payload.payment.entity.id);
        // Payment successful - already handled in /verify endpoint
        break;

      case 'payment.failed':
        console.log('Payment failed:', event.payload.payment.entity.id);
        // Update transaction status to failed
        const orderId = event.payload.payment.entity.order_id;
        await db.supabaseAdmin
          .from('transactions')
          .update({ status: 'failed' })
          .eq('order_id', orderId);
        break;

      case 'refund.created':
        console.log('Refund created:', event.payload.refund.entity.id);
        // Handle refund
        const paymentId = event.payload.refund.entity.payment_id;
        await db.supabaseAdmin
          .from('transactions')
          .update({ status: 'refunded' })
          .eq('payment_id', paymentId);
        break;

      default:
        console.log('Unhandled event:', event.event);
    }

    res.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    res.status(500).json({
      error: 'Server error',
      message: error.message || 'Webhook processing failed',
    });
  }
});

// ============================================
// GET COIN PACKAGES
// GET /api/payments/packages
// ============================================
router.get('/packages', async (req, res) => {
  try {
    const packages = await db.getCoinPackages();

    res.json({
      success: true,
      packages: packages.map((pkg) => ({
        id: pkg.id,
        coins: pkg.coins,
        price: pkg.price,
        discount: pkg.discount_percentage,
        savings: Math.round(
          (pkg.price * pkg.discount_percentage) / (100 - pkg.discount_percentage)
        ),
      })),
    });
  } catch (error: any) {
    console.error('Get packages error:', error);
    res.status(500).json({
      error: 'Server error',
      message: error.message || 'Failed to get coin packages',
    });
  }
});

export default router;
