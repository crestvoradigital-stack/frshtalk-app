import { Router } from 'express';
import { db } from '../config/supabase.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// GET user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.userId;
    const user = await db.getUserById(userId!);

    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        phoneNumber: user.phone_number,
        email: user.email,
        avatar: user.avatar_url,
        role: user.role,
        coins: user.coins,
        isVerified: user.is_verified,
        isOnline: user.is_online,
        createdAt: user.created_at,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

// UPDATE user profile
router.patch('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { username, email, avatar_url } = req.body;

    const updates: any = {};
    if (username) updates.username = username;
    if (email) updates.email = email;
    if (avatar_url) updates.avatar_url = avatar_url;

    const updatedUser = await db.updateUser(userId!, updates);

    res.json({
      success: true,
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        avatar: updatedUser.avatar_url,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

export default router;
