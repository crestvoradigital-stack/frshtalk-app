import { Router } from 'express';
import { db } from '../config/supabase.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// GET all user messages
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = (req as any).user?.userId;

    if (!userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'User not authenticated',
      });
    }

    const { data: messages, error } = await db.supabaseAdmin
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      count: messages.length,
      messages,
    });
  } catch (error: any) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

// GET messages for a call
router.get('/call/:callId', authenticateToken, async (req, res) => {
  try {
    const callId = Array.isArray(req.params.callId) ? req.params.callId[0] : req.params.callId;
    const userId = (req as any).user?.userId;

    // Verify user is part of the call
    const { data: call } = await db.supabaseAdmin
      .from('calls')
      .select('*')
      .eq('id', callId)
      .single();

    if (!call || (call.customer_id !== userId && call.listener_id !== userId)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You do not have access to these messages',
      });
    }

    const messages = await db.getCallMessages(callId);

    res.json({
      success: true,
      count: messages.length,
      messages: messages.map((m) => ({
        id: m.id,
        content: m.content,
        sender: m.sender,
        type: m.message_type,
        isRead: m.is_read,
        createdAt: m.created_at,
      })),
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

export default router;
