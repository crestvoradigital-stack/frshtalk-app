import { Router } from 'express';
import { db } from '../config/supabase.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// ============================================
// CREATE SUPPORT TICKET
// POST /api/support/tickets
// ============================================
router.post('/tickets', authenticateToken, async (req, res) => {
  try {
    const { subject, message, category, priority } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'User not authenticated',
      });
    }

    // Validate input
    if (!subject || !message) {
      return res.status(400).json({
        error: 'Invalid input',
        message: 'Subject and message are required',
      });
    }

    // Create support ticket
    const { data: ticket, error: ticketError } = await db.supabaseAdmin
      .from('support_tickets')
      .insert({
        user_id: userId,
        subject,
        category: category || 'general',
        priority: priority || 'medium',
        status: 'open',
      })
      .select()
      .single();

    if (ticketError) {
      throw ticketError;
    }

    // Add initial message
    const { error: messageError } = await db.supabaseAdmin
      .from('support_messages')
      .insert({
        ticket_id: ticket.id,
        message,
        is_staff: false,
      });

    if (messageError) {
      throw messageError;
    }

    res.json({
      success: true,
      message: 'Support ticket created successfully',
      ticket: {
        id: ticket.id,
        subject: ticket.subject,
        category: ticket.category,
        priority: ticket.priority,
        status: ticket.status,
        createdAt: ticket.created_at,
      },
    });
  } catch (error: any) {
    console.error('Create support ticket error:', error);
    res.status(500).json({
      error: 'Server error',
      message: error.message || 'Failed to create support ticket',
    });
  }
});

// ============================================
// GET USER SUPPORT TICKETS
// GET /api/support/tickets
// ============================================
router.get('/tickets', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { status, limit = 20 } = req.query;

    if (!userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'User not authenticated',
      });
    }

    let query = db.supabaseAdmin
      .from('support_tickets')
      .select(`
        *,
        messages:support_messages(*)
      `)
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(parseInt(limit as string));

    if (status) {
      query = query.eq('status', status);
    }

    const { data: tickets, error } = await query;

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      tickets: tickets.map(ticket => ({
        id: ticket.id,
        subject: ticket.subject,
        category: ticket.category,
        status: ticket.status,
        priority: ticket.priority,
        createdAt: ticket.created_at,
        updatedAt: ticket.updated_at,
        messages: ticket.messages?.map(msg => ({
          id: msg.id,
          message: msg.message,
          isStaff: msg.is_staff,
          createdAt: msg.created_at,
        })) || [],
      })),
    });
  } catch (error: any) {
    console.error('Get support tickets error:', error);
    res.status(500).json({
      error: 'Server error',
      message: error.message || 'Failed to get support tickets',
    });
  }
});

// ============================================
// ADD MESSAGE TO TICKET
// POST /api/support/tickets/:ticketId/messages
// ============================================
router.post('/tickets/:ticketId/messages', authenticateToken, async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { message } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'User not authenticated',
      });
    }

    if (!message) {
      return res.status(400).json({
        error: 'Invalid input',
        message: 'Message is required',
      });
    }

    // Verify ticket ownership
    const { data: ticket } = await db.supabaseAdmin
      .from('support_tickets')
      .select('id, user_id')
      .eq('id', ticketId)
      .single();

    if (!ticket || ticket.user_id !== userId) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You can only add messages to your own tickets',
      });
    }

    // Add message
    const { data: newMessage, error } = await db.supabaseAdmin
      .from('support_messages')
      .insert({
        ticket_id: ticketId,
        message,
        is_staff: false,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Update ticket updated_at
    await db.supabaseAdmin
      .from('support_tickets')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', ticketId);

    res.json({
      success: true,
      message: 'Message added successfully',
      newMessage: {
        id: newMessage.id,
        message: newMessage.message,
        isStaff: false,
        createdAt: newMessage.created_at,
      },
    });
  } catch (error: any) {
    console.error('Add support message error:', error);
    res.status(500).json({
      error: 'Server error',
      message: error.message || 'Failed to add message',
    });
  }
});

export default router;