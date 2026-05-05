import { Router } from 'express';
import { db } from '../config/supabase.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// GET user notifications
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user?.userId;
    const limitRaw = Array.isArray(req.query.limit) ? req.query.limit[0] : req.query.limit;
    const limit = typeof limitRaw === 'string' ? parseInt(limitRaw, 10) : 50;

    if (!userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'User not authenticated',
      });
    }

    const notifications = await db.getUserNotifications(userId, limit);

    res.json({
      success: true,
      count: notifications.length,
      notifications,
    });
  } catch (error: any) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      error: 'Server error',
      message: error.message || 'Failed to get notifications',
    });
  }
});

// Mark a notification as read
router.post('/mark-read', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user?.userId;
    const { notificationId } = req.body;

    if (!userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'User not authenticated',
      });
    }

    if (!notificationId) {
      return res.status(400).json({
        error: 'Invalid input',
        message: 'Notification ID is required',
      });
    }

    await db.markNotificationRead(notificationId);

    res.json({
      success: true,
      message: 'Notification marked as read',
    });
  } catch (error: any) {
    console.error('Mark notification read error:', error);
    res.status(500).json({
      error: 'Server error',
      message: error.message || 'Failed to mark notification as read',
    });
  }
});

export default router;
