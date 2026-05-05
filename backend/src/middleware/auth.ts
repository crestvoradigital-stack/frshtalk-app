import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    phoneNumber: string;
    role: string;
  };
}

/**
 * Middleware to authenticate JWT token
 */
export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Access token is required',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      phoneNumber: string;
      role: string;
      iat?: number;
      exp?: number;
    };

    (req as AuthRequest).user = {
      userId: decoded.userId,
      phoneNumber: decoded.phoneNumber,
      role: decoded.role,
    };
    next();
  } catch (error) {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Invalid or expired token',
    });
  }
}

/**
 * Middleware to check if user is a listener
 */
export function isListener(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if ((req as AuthRequest).user?.role !== 'listener') {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'This action requires listener role',
    });
  }
  next();
}

/**
 * Middleware to check if user is an admin
 */
export function isAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if ((req as AuthRequest).user?.role !== 'admin') {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'This action requires admin role',
    });
  }
  next();
}

/**
 * Optional authentication - doesn't fail if no token
 */
export function optionalAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        userId: string;
        phoneNumber: string;
        role: string;
      };
      req.user = decoded;
    } catch (error) {
      // Token invalid, but don't fail - just continue without user
    }
  }

  next();
}
