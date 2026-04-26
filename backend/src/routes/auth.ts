import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../config/supabase.js';
import { sendOTP, verifyOTP } from '../services/twilio.js';

const router = Router();

// ============================================
// SEND OTP
// POST /api/auth/send-otp
// ============================================
router.post('/send-otp', async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    // Validate phone number
    if (!phoneNumber || !/^\+?[1-9]\d{9,14}$/.test(phoneNumber)) {
      return res.status(400).json({
        error: 'Invalid phone number',
        message: 'Please provide a valid phone number',
      });
    }

    // Send OTP via Twilio
    const result = await sendOTP(phoneNumber);

    if (!result.success) {
      return res.status(500).json({
        error: 'Failed to send OTP',
        message: result.message,
      });
    }

    res.json({
      success: true,
      message: 'OTP sent successfully',
      phoneNumber,
    });
  } catch (error: any) {
    console.error('Send OTP error:', error);
    res.status(500).json({
      error: 'Server error',
      message: error.message || 'Failed to send OTP',
    });
  }
});

// ============================================
// VERIFY OTP & LOGIN
// POST /api/auth/verify-otp
// ============================================
router.post('/verify-otp', async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;

    // Validate input
    if (!phoneNumber || !otp) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Phone number and OTP are required',
      });
    }

    // Verify OTP with Twilio
    const verification = await verifyOTP(phoneNumber, otp);

    if (!verification.success) {
      return res.status(401).json({
        error: 'Invalid OTP',
        message: verification.message || 'OTP verification failed',
      });
    }

    // Check if user exists
    let user = await db.getUserByPhone(phoneNumber);

    // Create new user if doesn't exist
    if (!user) {
      const username = `user_${phoneNumber.slice(-4)}_${Math.random().toString(36).substr(2, 5)}`;

      user = await db.createUser({
        phone_number: phoneNumber,
        username,
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${phoneNumber}`,
        role: 'customer',
        coins: parseInt(process.env.SIGNUP_BONUS_COINS || '100'),
        is_verified: true,
      });

      // Record signup bonus transaction
      await db.createTransaction({
        user_id: user.id,
        transaction_type: 'bonus',
        amount: 0,
        coins: parseInt(process.env.SIGNUP_BONUS_COINS || '100'),
        status: 'completed',
        description: 'Signup bonus',
      });
    }

    // Update last seen
    await db.updateUser(user.id, {
      last_seen: new Date().toISOString(),
      is_online: true,
    });

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        phoneNumber: user.phone_number,
        role: user.role,
      },
      process.env.JWT_SECRET!,
      { expiresIn: '30d' }
    );

    // Return user data and token
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        phoneNumber: user.phone_number,
        email: user.email,
        avatar: user.avatar_url,
        role: user.role,
        coins: user.coins,
        isVerified: user.is_verified,
        createdAt: user.created_at,
      },
      isNewUser: !user.created_at || new Date().getTime() - new Date(user.created_at).getTime() < 60000,
    });
  } catch (error: any) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      error: 'Server error',
      message: error.message || 'Failed to verify OTP',
    });
  }
});

// ============================================
// REFRESH TOKEN
// POST /api/auth/refresh
// ============================================
router.post('/refresh', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        error: 'Missing token',
        message: 'Token is required',
      });
    }

    // Verify old token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    // Generate new token
    const newToken = jwt.sign(
      {
        userId: decoded.userId,
        phoneNumber: decoded.phoneNumber,
        role: decoded.role,
      },
      process.env.JWT_SECRET!,
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      token: newToken,
    });
  } catch (error: any) {
    res.status(401).json({
      error: 'Invalid token',
      message: error.message || 'Token refresh failed',
    });
  }
});

// ============================================
// LOGOUT
// POST /api/auth/logout
// ============================================
router.post('/logout', async (req, res) => {
  try {
    const userId = req.body.userId;

    if (userId) {
      // Update online status
      await db.updateUser(userId, {
        is_online: false,
        last_seen: new Date().toISOString(),
      });
    }

    res.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error: any) {
    console.error('Logout error:', error);
    res.status(500).json({
      error: 'Server error',
      message: error.message || 'Logout failed',
    });
  }
});

export default router;
