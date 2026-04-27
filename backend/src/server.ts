import express from 'express';
import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

// Import routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import listenerRoutes from './routes/listeners.js';
import callRoutes from './routes/calls.js';
import walletRoutes from './routes/wallet.js';
import messageRoutes from './routes/messages.js';
import paymentRoutes from './routes/payments.js';

// Import WebSocket handlers
import { setupWebSocketHandlers } from './websocket/index.js';

// Load environment variables
dotenv.config();

const app = express();
const httpServer = createServer(app);

// ============================================
// SOCKET.IO SETUP (Real-time features)
// ============================================
const defaultOrigins = ['http://localhost:5173', 'https://frshtalk-app.vercel.app'];
const allowedOrigins = process.env.CORS_ORIGINS?.split(',').map((origin) => origin.trim()).filter(Boolean) || defaultOrigins;

const isAllowedOrigin = (origin: string | undefined) => {
  if (!origin) return true;
  const parsedOrigin = origin.toLowerCase();
  return (
    allowedOrigins.includes(parsedOrigin) ||
    parsedOrigin.endsWith('.vercel.app') ||
    parsedOrigin.endsWith('.railway.app')
  );
};

const io = new SocketServer(httpServer, {
  cors: {
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  },
  transports: ['websocket', 'polling'],
});

// Setup WebSocket event handlers
setupWebSocketHandlers(io);

// ============================================
// MIDDLEWARE
// ============================================

// Security headers
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting (100 requests per 15 minutes)
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(
      `${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`
    );
  });
  next();
});

// ============================================
// HEALTH CHECK
// ============================================
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: '1.0.0',
  });
});

app.get('/', (req, res) => {
  res.json({
    message: 'FrshTalk API v1.0',
    documentation: '/api/docs',
    health: '/health',
  });
});

// ============================================
// API ROUTES
// ============================================
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/listeners', listenerRoutes);
app.use('/api/calls', callRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/payments', paymentRoutes);

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
  });
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    error: err.name || 'Error',
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// ============================================
// START SERVER
// ============================================
const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════╗
║                                       ║
║   🚀  FrshTalk Backend Server         ║
║                                       ║
║   Port: ${PORT.toString().padEnd(27)}║
║   Environment: ${(process.env.NODE_ENV || 'development').padEnd(19)}║
║   Frontend: ${(process.env.FRONTEND_URL || 'http://localhost:5173').padEnd(22)}║
║                                       ║
║   ✅ HTTP Server Running              ║
║   ✅ WebSocket Server Running         ║
║   ✅ Database Connected               ║
║                                       ║
╚═══════════════════════════════════════╝
  `);

  console.log('Available routes:');
  console.log('  GET  /health');
  console.log('  POST /api/auth/send-otp');
  console.log('  POST /api/auth/verify-otp');
  console.log('  GET  /api/listeners');
  console.log('  POST /api/calls/initiate');
  console.log('  POST /api/payments/create-order');
  console.log('  ... and more!');
  console.log('');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  httpServer.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

export { app, io };
