# 🚀 FrshTalk Backend

Complete backend server for FrshTalk - Voice & Video Calling Platform

**100% FREE TIER DEPLOYMENT** 🎉

---

## 📦 What's Included

- ✅ **REST API** - Complete CRUD operations
- ✅ **WebSocket Server** - Real-time messaging
- ✅ **WebRTC Signaling** - Video call support
- ✅ **OTP Authentication** - Twilio integration
- ✅ **Payment Gateway** - Razorpay integration
- ✅ **PostgreSQL Database** - Supabase
- ✅ **JWT Authentication** - Secure token-based auth
- ✅ **Rate Limiting** - DDoS protection
- ✅ **CORS** - Cross-origin security
- ✅ **TypeScript** - Type-safe code

---

## 🏗️ Architecture

```
backend/
├── src/
│   ├── server.ts              # Main server entry point
│   ├── config/
│   │   └── supabase.ts        # Database client & helpers
│   ├── routes/
│   │   ├── auth.ts            # Authentication routes
│   │   ├── users.ts           # User management
│   │   ├── listeners.ts       # Listener profiles
│   │   ├── calls.ts           # Call management
│   │   ├── wallet.ts          # Coin balance
│   │   ├── payments.ts        # Razorpay integration
│   │   └── messages.ts        # Chat messages
│   ├── middleware/
│   │   └── auth.ts            # JWT verification
│   ├── services/
│   │   └── twilio.ts          # OTP service
│   └── websocket/
│       └── index.ts           # WebSocket handlers
├── database/
│   └── schema.sql             # PostgreSQL schema
├── package.json
├── tsconfig.json
├── .env.example
├── DEPLOYMENT_GUIDE.md        # Step-by-step deployment
├── API_DOCUMENTATION.md       # API reference
└── README.md                  # This file
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- Accounts created on:
  - Supabase (free)
  - Railway/Vercel (free)
  - Razorpay (free)
  - Twilio (free $15 credit)

### Installation

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env and add your credentials
nano .env
```

### Local Development

```bash
# Run in development mode
npm run dev

# Server will start on http://localhost:3001
```

### Build for Production

```bash
# Compile TypeScript
npm run build

# Start production server
npm start
```

---

## 🗄️ Database Setup

### Run Schema

1. Create Supabase project at https://supabase.com
2. Open SQL Editor
3. Run `database/schema.sql`

### Seed Data (Optional)

The schema includes default coin packages. To add more:

```sql
INSERT INTO coin_packages (coins, price, discount_percentage, is_active)
VALUES (1000, 799, 20, true);
```

---

## 🔑 Environment Variables

See `.env.example` for all required variables.

### Required Variables

```env
# Server
NODE_ENV=development
PORT=3001

# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_KEY=xxx

# JWT
JWT_SECRET=xxx

# Razorpay
RAZORPAY_KEY_ID=rzp_test_xxx
RAZORPAY_KEY_SECRET=xxx
RAZORPAY_WEBHOOK_SECRET=xxx

# Twilio
TWILIO_ACCOUNT_SID=ACxxx
TWILIO_AUTH_TOKEN=xxx
TWILIO_VERIFY_SERVICE_SID=VAxxx
```

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/send-otp` - Send OTP
- `POST /api/auth/verify-otp` - Verify OTP & Login
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/logout` - Logout

### Users
- `GET /api/users/profile` - Get profile
- `PATCH /api/users/profile` - Update profile

### Listeners
- `GET /api/listeners` - Get all listeners
- `GET /api/listeners/:id` - Get listener by ID
- `PATCH /api/listeners/status` - Update status

### Calls
- `POST /api/calls/initiate` - Start call
- `POST /api/calls/:id/end` - End call
- `GET /api/calls` - Get call history
- `POST /api/calls/:id/rate` - Rate call

### Wallet
- `GET /api/wallet/balance` - Get balance
- `GET /api/wallet/transactions` - Get transactions

### Payments
- `GET /api/payments/packages` - Get coin packages
- `POST /api/payments/create-order` - Create payment
- `POST /api/payments/verify` - Verify payment
- `POST /api/payments/webhook` - Razorpay webhook

### Messages
- `GET /api/messages/call/:id` - Get call messages

**Full API docs:** [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

---

## 🔌 WebSocket Events

### Client → Server

- `user:online` - Mark user online
- `user:offline` - Mark user offline
- `call:join` - Join call room
- `call:offer` - Send WebRTC offer
- `call:answer` - Send WebRTC answer
- `call:ice-candidate` - Send ICE candidate
- `call:leave` - Leave call
- `message:send` - Send message
- `message:typing` - Typing indicator

### Server → Client

- `user:status` - User status change
- `call:user-joined` - User joined call
- `call:user-left` - User left call
- `call:offer` - Received WebRTC offer
- `call:answer` - Received WebRTC answer
- `call:ice-candidate` - Received ICE candidate
- `message:received` - New message
- `message:new` - Message broadcast
- `message:typing` - User typing

---

## 🚀 Deployment

### Railway (Recommended)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Add environment variables
railway variables set NODE_ENV=production
# ... add all other variables

# Deploy
railway up
```

**Detailed guide:** [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

---

## 🧪 Testing

### Test Health Endpoint

```bash
curl http://localhost:3001/health
```

### Test OTP Send

```bash
curl -X POST http://localhost:3001/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "+919876543210"}'
```

### Test Protected Endpoint

```bash
curl -X GET http://localhost:3001/api/users/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Test WebSocket

```javascript
const socket = io('http://localhost:3001', {
  auth: { token: 'YOUR_JWT_TOKEN' }
});

socket.on('connect', () => console.log('Connected!'));
```

---

## 📊 Database Schema

### Tables

- **users** - User accounts
- **listener_profiles** - Listener details
- **calls** - Call sessions
- **messages** - Chat messages
- **transactions** - Coin transactions
- **favorites** - User favorites
- **reviews** - Call ratings
- **coin_packages** - Available packages
- **notifications** - Push notifications

**Full schema:** [database/schema.sql](./database/schema.sql)

---

## 🔒 Security Features

- ✅ JWT authentication
- ✅ Rate limiting (100 req/15min)
- ✅ Helmet.js security headers
- ✅ CORS protection
- ✅ SQL injection prevention (Supabase prepared statements)
- ✅ XSS protection (JSON escaping)
- ✅ Razorpay signature verification
- ✅ WebSocket authentication
- ✅ Row Level Security (RLS) in database

---

## 📈 Monitoring

### Logs

```bash
# Railway
railway logs

# Local
npm run dev
# Logs appear in terminal
```

### Metrics

- **Railway:** Dashboard → Metrics
- **Supabase:** Dashboard → Database
- **Razorpay:** Dashboard → Payments
- **Twilio:** Console → Monitor

---

## 🐛 Troubleshooting

### Port already in use

```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9
```

### Database connection failed

1. Check Supabase URL and keys
2. Verify database schema is applied
3. Check network connectivity

### OTP not sending

1. Verify Twilio credentials
2. Check phone number format (+919876543210)
3. Verify sufficient Twilio balance
4. Check Twilio logs

### Payment webhook not working

1. Verify webhook URL is correct
2. Check Razorpay webhook secret
3. Ensure endpoint is publicly accessible
4. Check Razorpay webhook logs

---

## 🛠️ Development

### Code Structure

- **Routes:** Define endpoints
- **Controllers:** Business logic (inline in routes for simplicity)
- **Middleware:** Auth, validation
- **Services:** External APIs (Twilio, Razorpay)
- **WebSocket:** Real-time handlers
- **Config:** Database, environment

### Adding New Endpoint

1. Create route in `src/routes/`
2. Import in `src/server.ts`
3. Add to router: `app.use('/api/new', newRoute)`
4. Document in API_DOCUMENTATION.md

### Adding New WebSocket Event

1. Add handler in `src/websocket/index.ts`
2. Document event in API_DOCUMENTATION.md

---

## 📝 Scripts

```bash
npm run dev      # Development server (hot reload)
npm run build    # Build TypeScript
npm start        # Production server
npm run lint     # Lint code
npm run format   # Format code
```

---

## 🌟 Features

### Current
- ✅ Phone OTP authentication
- ✅ User profiles
- ✅ Listener discovery
- ✅ Voice/video call initiation
- ✅ Real-time messaging
- ✅ WebRTC signaling
- ✅ Coin wallet system
- ✅ Razorpay payments
- ✅ Call ratings & reviews
- ✅ Favorites system
- ✅ Transaction history
- ✅ Notifications

### Coming Soon
- 🔜 Email authentication
- 🔜 Social login (Google, Facebook)
- 🔜 Push notifications (FCM)
- 🔜 Admin dashboard
- 🔜 Analytics & reporting
- 🔜 Automated testing
- 🔜 API rate limiting per user

---

## 💰 Cost Breakdown

**Free Tier (Starting):**

| Service | Cost |
|---------|------|
| Supabase | $0 |
| Railway | $0 (with $5 credit) |
| Razorpay | 2% per transaction |
| Twilio OTP | ~$0.0075/SMS |
| **Total** | **~$0-15/month** |

**Scaling (1000+ users):**

| Service | Cost |
|---------|------|
| Supabase Pro | $25/month |
| Railway Pro | $20/month |
| Razorpay | 2% per transaction |
| Twilio | Based on usage |
| **Total** | **~$50-100/month** |

---

## 📞 Support

- **Documentation:** [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- **Deployment:** [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- **Issues:** Create issue on GitHub
- **Email:** support@frshtalk.com

---

## 📄 License

MIT License - See LICENSE file

---

## 🙏 Acknowledgments

- **Supabase** - Database & Auth
- **Railway** - Hosting
- **Razorpay** - Payments
- **Twilio** - OTP
- **Socket.io** - WebSocket

---

**Built with ❤️ for FrshTalk**

**Version:** 1.0.0  
**Last Updated:** April 26, 2026
