import { Router } from 'express';
import { db } from '../config/supabase.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// ============================================
// SUBMIT FEEDBACK
// POST /api/feedback/submit
// ============================================
router.post('/submit', authenticateToken, async (req, res) => {
  try {
    const { rating, comment, category, tags, userAgent, url } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'User not authenticated',
      });
    }

    // Validate input
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        error: 'Invalid rating',
        message: 'Rating must be between 1 and 5',
      });
    }

    if (!category || !['bug', 'feature', 'ui', 'performance', 'other'].includes(category)) {
      return res.status(400).json({
        error: 'Invalid category',
        message: 'Please provide a valid feedback category',
      });
    }

    // Create feedback entry
    const { data: feedback, error } = await db.supabaseAdmin
      .from('feedback')
      .insert({
        user_id: userId,
        rating,
        comment: comment || null,
        category,
        tags: tags || [],
        user_agent: userAgent,
        url: url || null,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      message: 'Feedback submitted successfully',
      feedback: {
        id: feedback.id,
        rating: feedback.rating,
        category: feedback.category,
        createdAt: feedback.created_at,
      },
    });
  } catch (error: any) {
    console.error('Submit feedback error:', error);
    res.status(500).json({
      error: 'Server error',
      message: error.message || 'Failed to submit feedback',
    });
  }
});

// ============================================
// GET FEEDBACK STATS
// GET /api/feedback/stats
// ============================================
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'User not authenticated',
      });
    }

    // Get feedback statistics
    const { data: stats, error } = await db.supabaseAdmin
      .rpc('get_feedback_stats');

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      stats,
    });
  } catch (error: any) {
    console.error('Get feedback stats error:', error);
    res.status(500).json({
      error: 'Server error',
      message: error.message || 'Failed to get feedback stats',
    });
  }
});

// ============================================
// GET USER FEEDBACK
// GET /api/feedback
// ============================================
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user?.userId;
    const limitRaw = Array.isArray(req.query.limit) ? req.query.limit[0] : req.query.limit;
    const limitString = typeof limitRaw === 'string' ? limitRaw : '20';

    if (!userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'User not authenticated',
      });
    }

    const { data: feedback, error } = await db.supabaseAdmin
      .from('feedback')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(parseInt(limitString));

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      feedback: feedback.map(f => ({
        id: f.id,
        rating: f.rating,
        comment: f.comment,
        category: f.category,
        tags: f.tags,
        createdAt: f.created_at,
      })),
    });
  } catch (error: any) {
    console.error('Get feedback error:', error);
    res.status(500).json({
      error: 'Server error',
      message: error.message || 'Failed to get feedback',
    });
  }
});

export default router;