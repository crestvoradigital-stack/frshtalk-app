import { Router } from 'express';
import { db } from '../config/supabase.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// ============================================
// INITIATE CALL
// POST /api/calls/initiate
// ============================================
router.post('/initiate', authenticateToken, async (req, res) => {
  try {
    const { listenerId, callType } = req.body;
    const customerId = req.user?.userId;

    if (!customerId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'User not authenticated',
      });
    }

    // Validate input
    if (!listenerId || !callType) {
      return res.status(400).json({
        error: 'Invalid input',
        message: 'Listener ID and call type are required',
      });
    }

    if (!['voice', 'video'].includes(callType)) {
      return res.status(400).json({
        error: 'Invalid call type',
        message: 'Call type must be "voice" or "video"',
      });
    }

    // Check if listener exists and is available
    const listener = await db.getListenerProfile(listenerId);
    if (!listener) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Listener not found',
      });
    }

    if (!listener.is_available || listener.is_on_call) {
      return res.status(400).json({
        error: 'Listener unavailable',
        message: 'Listener is currently unavailable',
      });
    }

    // Check if customer has enough coins
    const customer = await db.getUserById(customerId);
    const minCoins = callType === 'voice' ? listener.voice_rate : listener.video_rate;

    if (customer.coins < minCoins) {
      return res.status(400).json({
        error: 'Insufficient coins',
        message: `You need at least ${minCoins} coins to start a ${callType} call`,
      });
    }

    // Create call record
    const call = await db.createCall({
      customer_id: customerId,
      listener_id: listenerId,
      call_type: callType,
      status: 'initiated',
      start_time: new Date().toISOString(),
    });

    // Update listener status
    await db.supabaseAdmin
      .from('listener_profiles')
      .update({ is_on_call: true })
      .eq('user_id', listenerId);

    res.json({
      success: true,
      message: 'Call initiated',
      call: {
        id: call.id,
        customerId: call.customer_id,
        listenerId: call.listener_id,
        callType: call.call_type,
        status: call.status,
        startTime: call.start_time,
      },
    });
  } catch (error: any) {
    console.error('Initiate call error:', error);
    res.status(500).json({
      error: 'Server error',
      message: error.message || 'Failed to initiate call',
    });
  }
});

// ============================================
// END CALL
// POST /api/calls/:callId/end
// ============================================
router.post('/:callId/end', authenticateToken, async (req, res) => {
  try {
    const { callId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'User not authenticated',
      });
    }

    // Get call details
    const { data: call } = await db.supabaseAdmin
      .from('calls')
      .select('*')
      .eq('id', callId)
      .single();

    if (!call) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Call not found',
      });
    }

    // Verify user is part of the call
    if (call.customer_id !== userId && call.listener_id !== userId) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You are not authorized to end this call',
      });
    }

    // Calculate duration and cost
    const endTime = new Date();
    const startTime = new Date(call.start_time);
    const durationSeconds = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
    const durationMinutes = Math.ceil(durationSeconds / 60);

    // Get listener profile for rates
    const listener = await db.getListenerProfile(call.listener_id);
    const ratePerMinute = call.call_type === 'voice' ? listener.voice_rate : listener.video_rate;
    const totalCost = durationMinutes * ratePerMinute;

    // Deduct coins from customer
    await db.supabaseAdmin
      .from('users')
      .update({
        coins: db.supabaseAdmin.sql`coins - ${totalCost}`,
      })
      .eq('id', call.customer_id);

    // Create deduction transaction
    await db.createTransaction({
      user_id: call.customer_id,
      transaction_type: 'deduct',
      amount: totalCost,
      coins: totalCost,
      status: 'completed',
      description: `${call.call_type} call with ${listener.users.username} (${durationMinutes} min)`,
      metadata: {
        callId: call.id,
        duration: durationMinutes,
        rate: ratePerMinute,
      },
    });

    // Update call record
    const updatedCall = await db.updateCall(callId, {
      status: 'ended',
      end_time: endTime.toISOString(),
      duration_seconds: durationSeconds,
      cost: totalCost,
    });

    // Update listener status
    await db.supabaseAdmin
      .from('listener_profiles')
      .update({
        is_on_call: false,
        total_calls: db.supabaseAdmin.sql`total_calls + 1`,
        total_minutes: db.supabaseAdmin.sql`total_minutes + ${durationMinutes}`,
      })
      .eq('user_id', call.listener_id);

    res.json({
      success: true,
      message: 'Call ended',
      call: {
        id: updatedCall.id,
        duration: durationMinutes,
        cost: totalCost,
        endTime: updatedCall.end_time,
      },
    });
  } catch (error: any) {
    console.error('End call error:', error);
    res.status(500).json({
      error: 'Server error',
      message: error.message || 'Failed to end call',
    });
  }
});

// ============================================
// GET USER CALLS
// GET /api/calls
// ============================================
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { limit = 20 } = req.query;

    if (!userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'User not authenticated',
      });
    }

    const calls = await db.getUserCalls(userId, parseInt(limit as string));

    res.json({
      success: true,
      count: calls.length,
      calls: calls.map((call) => ({
        id: call.id,
        type: call.call_type,
        status: call.status,
        duration: Math.ceil(call.duration_seconds / 60),
        cost: call.cost,
        rating: call.rating,
        startTime: call.start_time,
        endTime: call.end_time,
        otherUser: call.customer_id === userId ? call.listener : call.customer,
      })),
    });
  } catch (error: any) {
    console.error('Get calls error:', error);
    res.status(500).json({
      error: 'Server error',
      message: error.message || 'Failed to get calls',
    });
  }
});

// ============================================
// RATE CALL
// POST /api/calls/:callId/rate
// ============================================
router.post('/:callId/rate', authenticateToken, async (req, res) => {
  try {
    const { callId } = req.params;
    const { rating, feedback } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'User not authenticated',
      });
    }

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        error: 'Invalid rating',
        message: 'Rating must be between 1 and 5',
      });
    }

    // Get call
    const { data: call } = await db.supabaseAdmin
      .from('calls')
      .select('*')
      .eq('id', callId)
      .single();

    if (!call) {
      return res.status(404).json({
        error: 'Not found',
        message: 'Call not found',
      });
    }

    // Only customer can rate
    if (call.customer_id !== userId) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Only customers can rate calls',
      });
    }

    // Update call rating
    await db.updateCall(callId, {
      rating,
      feedback: feedback || null,
    });

    // Create review
    await db.supabaseAdmin
      .from('reviews')
      .insert({
        call_id: callId,
        reviewer_id: userId,
        listener_id: call.listener_id,
        rating,
        comment: feedback || null,
      });

    // Update listener rating
    await db.supabaseAdmin.rpc('update_listener_rating', {
      listener_uuid: call.listener_id,
    });

    res.json({
      success: true,
      message: 'Call rated successfully',
    });
  } catch (error: any) {
    console.error('Rate call error:', error);
    res.status(500).json({
      error: 'Server error',
      message: error.message || 'Failed to rate call',
    });
  }
});

export default router;
