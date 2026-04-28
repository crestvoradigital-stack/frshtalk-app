import { apiPost, apiGet } from '../lib/api';

export interface FeedbackData {
  rating: number;
  comment?: string;
  category: 'bug' | 'feature' | 'ui' | 'performance' | 'other';
  tags?: string[];
  userAgent?: string;
  url?: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  category: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  updatedAt: string;
  messages: SupportMessage[];
}

export interface SupportMessage {
  id: string;
  ticketId: string;
  message: string;
  isStaff: boolean;
  createdAt: string;
  senderName?: string;
}

/**
 * Submit general app feedback
 */
export async function submitFeedback(feedback: FeedbackData): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const feedbackData = {
      ...feedback,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString(),
    };

    await apiPost('/feedback/submit', feedbackData);

    return {
      success: true,
      message: 'Feedback submitted successfully',
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Failed to submit feedback',
    };
  }
}

/**
 * Create a support ticket
 */
export async function createSupportTicket(
  subject: string,
  message: string,
  category: string,
  priority: 'low' | 'medium' | 'high' | 'urgent' = 'medium'
): Promise<{ success: boolean; ticketId?: string; message: string }> {
  try {
    const response = await apiPost('/support/tickets', {
      subject,
      message,
      category,
      priority,
    });

    return {
      success: true,
      ticketId: response.ticket.id,
      message: 'Support ticket created successfully',
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Failed to create support ticket',
    };
  }
}

/**
 * Get user's support tickets
 */
export async function getSupportTickets(): Promise<{
  success: boolean;
  tickets?: SupportTicket[];
  message: string;
}> {
  try {
    const response = await apiGet('/support/tickets');

    return {
      success: true,
      tickets: response.tickets,
      message: 'Support tickets retrieved successfully',
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Failed to get support tickets',
    };
  }
}

/**
 * Add message to support ticket
 */
export async function addSupportMessage(
  ticketId: string,
  message: string
): Promise<{ success: boolean; message: string }> {
  try {
    await apiPost(`/support/tickets/${ticketId}/messages`, {
      message,
    });

    return {
      success: true,
      message: 'Message added successfully',
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Failed to add message',
    };
  }
}

/**
 * Get app feedback statistics
 */
export async function getFeedbackStats(): Promise<{
  success: boolean;
  stats?: {
    totalFeedback: number;
    averageRating: number;
    categories: Record<string, number>;
    recentFeedback: any[];
  };
  message: string;
}> {
  try {
    const response = await apiGet('/feedback/stats');

    return {
      success: true,
      stats: response.stats,
      message: 'Feedback stats retrieved successfully',
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Failed to get feedback stats',
    };
  }
}