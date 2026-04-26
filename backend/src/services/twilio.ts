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
 * Send SMS (for notifications, not OTP)
 */
export async function sendSMS(
  to: string,
  message: string
): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    if (process.env.NODE_ENV === 'development' && !twilioClient) {
      console.log(`[DEV MODE] SMS to ${to}: ${message}`);
      return {
        success: true,
        message: 'SMS sent (development mode)',
      };
    }

    if (!twilioClient) {
      throw new Error('Twilio is not configured');
    }

    const result = await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to,
    });

    if (result.sid) {
      return {
        success: true,
        message: 'SMS sent successfully',
      };
    }

    return {
      success: false,
      message: 'Failed to send SMS',
    };
  } catch (error: any) {
    console.error('Twilio send SMS error:', error);
    return {
      success: false,
      message: error.message || 'Failed to send SMS',
    };
  }
}

export default {
  sendOTP,
  verifyOTP,
  sendSMS,
};
