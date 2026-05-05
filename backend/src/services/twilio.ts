import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

let twilioClient: ReturnType<typeof twilio> | null = null;

// Initialize Twilio client if credentials are provided
if (accountSid && authToken) {
  twilioClient = twilio(accountSid, authToken);
}

/**
 * Send OTP to phone number
 * Uses Twilio Verify API for secure OTP delivery
 */
export async function sendOTP(phoneNumber: string): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    // In development mode without Twilio, return success
    if (process.env.NODE_ENV === 'development' && !twilioClient) {
      console.log(`[DEV MODE] OTP would be sent to ${phoneNumber}`);
      console.log('[DEV MODE] Any 6-digit code will work for verification');
      return {
        success: true,
        message: 'OTP sent (development mode - any code works)',
      };
    }

    if (!twilioClient || !verifyServiceSid) {
      throw new Error('Twilio is not configured');
    }

    // Send OTP using Twilio Verify
    const verification = await twilioClient.verify.v2
      .services(verifyServiceSid)
      .verifications.create({
        to: phoneNumber,
        channel: 'sms',
      });

    if (verification.status === 'pending') {
      return {
        success: true,
        message: 'OTP sent successfully',
      };
    }

    return {
      success: false,
      message: 'Failed to send OTP',
    };
  } catch (error: any) {
    console.error('Twilio send OTP error:', error);
    return {
      success: false,
      message: error.message || 'Failed to send OTP',
    };
  }
}

/**
 * Verify OTP for phone number
 * Validates the OTP code against Twilio Verify API
 */
export async function verifyOTP(
  phoneNumber: string,
  code: string
): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    // In development mode without Twilio, accept any 6-digit code
    if (process.env.NODE_ENV === 'development' && !twilioClient) {
      if (/^\d{6}$/.test(code)) {
        console.log(`[DEV MODE] OTP ${code} verified for ${phoneNumber}`);
        return {
          success: true,
          message: 'OTP verified (development mode)',
        };
      } else {
        return {
          success: false,
          message: 'Invalid OTP format (must be 6 digits)',
        };
      }
    }

    if (!twilioClient || !verifyServiceSid) {
      throw new Error('Twilio is not configured');
    }

    // Verify OTP using Twilio Verify
    const verificationCheck = await twilioClient.verify.v2
      .services(verifyServiceSid)
      .verificationChecks.create({
        to: phoneNumber,
        code: code,
      });

    if (verificationCheck.status === 'approved') {
      return {
        success: true,
        message: 'OTP verified successfully',
      };
    }

    return {
      success: false,
      message: 'Invalid or expired OTP',
    };
  } catch (error: any) {
    console.error('Twilio verify OTP error:', error);

    // Check for specific Twilio errors
    if (error.code === 20404) {
      return {
        success: false,
        message: 'Verification expired or not found',
      };
    }

    return {
      success: false,
      message: error.message || 'OTP verification failed',
    };
  }
}

/**
 * Send a plain SMS message using Twilio
 */
export async function sendSMS(
  to: string,
  body: string
): Promise<{
  success: boolean;
  message: string;
  sid?: string;
}> {
  try {
    if (process.env.NODE_ENV === 'development' && !twilioClient) {
      console.log(`[DEV MODE] SMS to ${to}: ${body}`);
      return {
        success: true,
        message: 'SMS sent (development mode)',
        sid: `dev-sms-${Date.now()}`,
      };
    }

    if (!twilioClient) {
      throw new Error('Twilio is not configured');
    }

    const message = await twilioClient.messages.create({
      to,
      from: process.env.TWILIO_PHONE_NUMBER!,
      body,
    });

    return {
      success: true,
      message: 'SMS sent successfully',
      sid: message.sid,
    };
  } catch (error: any) {
    console.error('Twilio send SMS error:', error);
    return {
      success: false,
      message: error.message || 'Failed to send SMS',
    };
  }
}

/**
 * Initiate a voice call using Twilio
 */
export async function initiateVoiceCall(
  from: string,
  to: string,
  callType: 'voice' | 'video' = 'voice'
): Promise<{
  success: boolean;
  message: string;
  callSid?: string;
  callDetails?: any;
}> {
  try {
    if (process.env.NODE_ENV === 'development' && !twilioClient) {
      console.log(`[DEV MODE] Voice call from ${from} to ${to} (${callType})`);
      return {
        success: true,
        message: 'Voice call initiated (development mode)',
        callSid: `dev-call-${Date.now()}`,
        callDetails: {
          from,
          to,
          status: 'initiated',
          type: callType,
        },
      };
    }

    if (!twilioClient) {
      throw new Error('Twilio is not configured');
    }

    // For voice calls, we'll use Twilio's REST API to create a call
    const call = await twilioClient.calls.create({
      url: `${process.env.BASE_URL || 'https://your-app-url.com'}/api/calls/twiml/${callType}`,
      from: process.env.TWILIO_PHONE_NUMBER || from,
      to: to,
      statusCallback: `${process.env.BASE_URL || 'https://your-app-url.com'}/api/calls/status`,
      statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
      statusCallbackMethod: 'POST',
    });

    return {
      success: true,
      message: 'Voice call initiated successfully',
      callSid: call.sid,
      callDetails: {
        from: call.from,
        to: call.to,
        status: call.status,
        direction: call.direction,
        startTime: call.startTime,
      },
    };
  } catch (error: any) {
    console.error('Twilio initiate voice call error:', error);
    return {
      success: false,
      message: error.message || 'Failed to initiate voice call',
    };
  }
}

/**
 * Generate a Twilio client token for WebRTC voice/video calls
 */
export async function generateVoiceToken(
  identity: string,
  roomName?: string
): Promise<{
  success: boolean;
  message: string;
  token?: string;
}> {
  try {
    if (process.env.NODE_ENV === 'development' && !twilioClient) {
      console.log(`[DEV MODE] Voice token generated for ${identity}`);
      return {
        success: true,
        message: 'Voice token generated (development mode)',
        token: `dev-token-${Date.now()}`,
      };
    }

    if (!twilioClient) {
      throw new Error('Twilio is not configured');
    }

    // Generate Access Token for Twilio Client SDK
    const AccessToken = twilio.jwt.AccessToken;
    const VoiceGrant = AccessToken.VoiceGrant;

    const token = new AccessToken(
      accountSid!,
      process.env.TWILIO_API_KEY_SID!,
      process.env.TWILIO_API_KEY_SECRET!,
      {
        identity,
      }
    );

    // Add voice grant
    const voiceGrant = new VoiceGrant({
      outgoingApplicationSid: process.env.TWILIO_TWIML_APP_SID,
      incomingAllow: true,
    });
    token.addGrant(voiceGrant);

    return {
      success: true,
      message: 'Voice token generated successfully',
      token: token.toJwt(),
    };
  } catch (error: any) {
    console.error('Twilio generate voice token error:', error);
    return {
      success: false,
      message: error.message || 'Failed to generate voice token',
    };
  }
}

/**
 * End a voice call
 */
export async function endVoiceCall(callSid: string): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    if (process.env.NODE_ENV === 'development' && !twilioClient) {
      console.log(`[DEV MODE] Voice call ${callSid} ended`);
      return {
        success: true,
        message: 'Voice call ended (development mode)',
      };
    }

    if (!twilioClient) {
      throw new Error('Twilio is not configured');
    }

    await twilioClient.calls(callSid).update({ status: 'completed' });

    return {
      success: true,
      message: 'Voice call ended successfully',
    };
  } catch (error: any) {
    console.error('Twilio end voice call error:', error);
    return {
      success: false,
      message: error.message || 'Failed to end voice call',
    };
  }
}

export default {
  sendOTP,
  verifyOTP,
  sendSMS,
  initiateVoiceCall,
  generateVoiceToken,
  endVoiceCall,
};
