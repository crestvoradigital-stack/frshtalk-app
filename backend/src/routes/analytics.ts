import { Router } from 'express';
import { db } from '../config/supabase.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// GET analytics dashboard summary
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    const [{ count: totalUsers }, { count: totalListeners }, { count: totalCalls }] = await Promise.all([
      db.supabaseAdmin.from('users').select('id', { count: 'exact' }),
      db.supabaseAdmin.from('listener_profiles').select('id', { count: 'exact' }),
      db.supabaseAdmin.from('calls').select('id', { count: 'exact' }),
    ]);

    const revenueResult = await db.supabaseAdmin
      .from('calls')
      .select('cost');

    const totalRevenue = revenueResult.data?.reduce((sum: number, row: any) => sum + (row.cost || 0), 0) ?? 0;

    res.json({
      success: true,
      dashboard: {
        totalUsers: totalUsers ?? 0,
        totalListeners: totalListeners ?? 0,
        totalCalls: totalCalls ?? 0,
        totalRevenue,
      },
    });
  } catch (error: any) {
    console.error('Analytics dashboard error:', error);
    res.status(500).json({
      error: 'Server error',
      message: error.message || 'Failed to get analytics dashboard',
    });
  }
});

// GET user-specific analytics
router.get('/user-stats', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user?.userId;

    if (!userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'User not authenticated',
      });
    }

    const [{ data: transactions }, { data: calls }] = await Promise.all([
      db.supabaseAdmin.from('transactions').select('transaction_type, amount, coins, status, created_at').eq('user_id', userId),
      db.supabaseAdmin
        .from('calls')
        .select('id, customer_id, listener_id, cost, call_type, status, start_time, end_time')
        .or(`customer_id.eq.${userId},listener_id.eq.${userId}`),
    ]);

    const totalTransactions = transactions?.length ?? 0;
    const totalCalls = calls?.length ?? 0;
    const totalSpent = calls?.reduce((sum: number, row: any) => {
      return sum + (row.customer_id === userId ? (row.cost || 0) : 0);
    }, 0) ?? 0;
    const totalEarned = calls?.reduce((sum: number, row: any) => {
      return sum + (row.listener_id === userId ? (row.cost || 0) : 0);
    }, 0) ?? 0;

    res.json({
      success: true,
      userStats: {
        totalTransactions,
        totalCalls,
        totalSpent,
        totalEarned,
        transactions,
        calls,
      },
    });
  } catch (error: any) {
    console.error('User analytics error:', error);
    res.status(500).json({
      error: 'Server error',
      message: error.message || 'Failed to get user analytics',
    });
  }
});

export default router;
