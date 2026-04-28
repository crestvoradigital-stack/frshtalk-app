import { apiPost, apiGet } from '../lib/api';

export interface CallParticipant {
  id: string;
  username: string;
  avatar: string;
  isOnline: boolean;
}

export interface CallSession {
  id: string;
  participants: CallParticipant[];
  callType: 'voice' | 'video';
  status: 'connecting' | 'connected' | 'ended';
  startTime?: Date;
  duration?: number;
  cost?: number;
}

/**
 * Initiate a voice/video call
 */
export async function initiateCall(
  listenerId: string,
  callType: 'voice' | 'video' = 'voice'
): Promise<{ success: boolean; callId?: string; message: string }> {
  try {
    const response = await apiPost('/calls/initiate', {
      listenerId,
      callType,
    });

    return {
      success: true,
      callId: response.call.id,
      message: 'Call initiated successfully',
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Failed to initiate call',
    };
  }
}

/**
 * Generate Twilio voice token for WebRTC
 */
export async function generateVoiceToken(
  roomName?: string
): Promise<{ success: boolean; token?: string; identity?: string; message: string }> {
  try {
    const response = await apiPost('/calls/token', {
      roomName,
    });

    return {
      success: true,
      token: response.token,
      identity: response.identity,
      message: 'Token generated successfully',
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Failed to generate token',
    };
  }
}

/**
 * End a call
 */
export async function endCall(
  callId: string
): Promise<{ success: boolean; message: string }> {
  try {
    await apiPost(`/calls/${callId}/end`);

    return {
      success: true,
      message: 'Call ended successfully',
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Failed to end call',
    };
  }
}

/**
 * Get user's call history
 */
export async function getCallHistory(
  limit: number = 20
): Promise<{ success: boolean; calls?: any[]; message: string }> {
  try {
    const response = await apiGet(`/calls?limit=${limit}`);

    return {
      success: true,
      calls: response.calls,
      message: 'Call history retrieved successfully',
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Failed to get call history',
    };
  }
}

/**
 * Rate a call
 */
export async function rateCall(
  callId: string,
  rating: number,
  feedback?: string
): Promise<{ success: boolean; message: string }> {
  try {
    await apiPost(`/calls/${callId}/rate`, {
      rating,
      feedback,
    });

    return {
      success: true,
      message: 'Call rated successfully',
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Failed to rate call',
    };
  }
}

/**
 * Get available listeners
 */
export async function getAvailableListeners(): Promise<{
  success: boolean;
  listeners?: CallParticipant[];
  message: string;
}> {
  try {
    const response = await apiGet('/listeners/available');

    return {
      success: true,
      listeners: response.listeners,
      message: 'Available listeners retrieved successfully',
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Failed to get available listeners',
    };
  }
}