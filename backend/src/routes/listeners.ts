import { Router } from 'express';
import { db } from '../config/supabase.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';

const router = Router();

// ============================================
// GET ALL LISTENERS
// GET /api/listeners
// ============================================
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { location, tag, sort = 'rating' } = req.query;

    const filters: any = {};
    if (location) filters.location = location;
    if (tag) filters.tag = tag;

    const listeners = await db.getListeners(filters);

    // Format response
    const formatted = listeners.map((listener) => ({
      id: listener.users.id,
      username: listener.users.username,
      avatar: listener.users.avatar_url,
      voiceRate: listener.voice_rate,
      videoRate: listener.video_rate,
      tags: listener.tags || [],
      rating: parseFloat(listener.rating),
      reviewCount: listener.review_count,
      location: listener.location,
      languages: listener.languages || [],
      isOnline: listener.users.is_online,
      isVerified: listener.users.is_verified,
      isOnCall: listener.is_on_call,
      totalCalls: listener.total_calls,
    }));

    res.json({
      success: true,
      count: formatted.length,
      listeners: formatted,
    });
  } catch (error: any) {
    console.error('Get listeners error:', error);
    res.status(500).json({
      error: 'Server error',
      message: error.message || 'Failed to get listeners',
    });
  }
});

// ============================================
// GET LISTENER BY ID
// GET /api/listeners/:id
// ============================================
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const listener = await db.getListenerProfile(id);

    if (!listener) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Listener not found',
      });
    }

    res.json({
      success: true,
      listener: {
        id: listener.users.id,
        username: listener.users.username,
        avatar: listener.users.avatar_url,
        phoneNumber: listener.users.phone_number,
        bio: listener.bio,
        voiceRate: listener.voice_rate,
        videoRate: listener.video_rate,
        tags: listener.tags || [],
        rating: parseFloat(listener.rating),
        reviewCount: listener.review_count,
        totalCalls: listener.total_calls,
        totalMinutes: listener.total_minutes,
        location: listener.location,
        languages: listener.languages || [],
        isOnline: listener.users.is_online,
        isVerified: listener.users.is_verified,
        isAvailable: listener.is_available,
        isOnCall: listener.is_on_call,
        verificationStatus: listener.verification_status,
      },
    });
  } catch (error: any) {
    console.error('Get listener error:', error);
    res.status(500).json({
      error: 'Server error',
      message: error.message || 'Failed to get listener',
    });
  }
});

// ============================================
// UPDATE LISTENER STATUS
// PATCH /api/listeners/status
// ============================================
router.patch('/status', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { isAvailable, isOnCall } = req.body;

    if (!userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'User not authenticated',
      });
    }

    const updates: any = {};
    if (typeof isAvailable === 'boolean') updates.is_available = isAvailable;
    if (typeof isOnCall === 'boolean') updates.is_on_call = isOnCall;

    const { data, error } = await db.supabaseAdmin
      .from('listener_profiles')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      message: 'Status updated',
      profile: data,
    });
  } catch (error: any) {
    console.error('Update status error:', error);
    res.status(500).json({
      error: 'Server error',
      message: error.message || 'Failed to update status',
    });
  }
});

export default router;
