import { Router } from 'express';
import { db } from '../config/supabase.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// GET messages for a call
router.get('/call/:callId', authenticateToken, async (req, res) => {
  try {
    const { callId } = req.params;
    const userId = req.user?.userId;

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
