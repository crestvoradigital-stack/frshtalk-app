import { Router } from 'express';
import { db } from '../config/supabase.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// GET wallet balance
router.get('/balance', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.userId;
    const user = await db.getUserById(userId!);

    res.json({
      success: true,
      balance: user.coins,
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

// GET transactions
router.get('/transactions', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { limit = 50 } = req.query;

    const transactions = await db.getUserTransactions(userId!, parseInt(limit as string));

    res.json({
      success: true,
      count: transactions.length,
      transactions: transactions.map((t) => ({
        id: t.id,
        type: t.transaction_type,
        amount: t.amount,
        coins: t.coins,
        status: t.status,
        description: t.description,
        createdAt: t.created_at,
      })),
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

export default router;
