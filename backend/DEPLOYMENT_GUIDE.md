# 🚀 FrshTalk Backend - Deployment Guide (FREE TIER)

Complete guide to deploy your FrshTalk backend using **100% FREE services**.

---

## 📋 Prerequisites

Before you start, create accounts on these free services:

1. ✅ **Supabase** - https://supabase.com (Database + Auth)
2. ✅ **Railway** - https://railway.app (Backend hosting)
3. ✅ **Razorpay** - https://razorpay.com (Payments - India)
4. ✅ **Twilio** - https://twilio.com (OTP SMS)

**Total Monthly Cost:** $0-15 (depending on usage)

---

## 🗄️ Step 1: Setup Supabase Database

### 1.1 Create Supabase Project

1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Fill in details:
   - **Name:** frshtalk-db
   - **Database Password:** (save this!)
   - **Region:** Choose closest to your users
4. Click "Create new project"
5. Wait ~2 minutes for setup

### 1.2 Run Database Schema

1. In Supabase Dashboard, click "SQL Editor"
2. Click "New query"
3. Copy entire content from `backend/database/schema.sql`
4. Paste and click "Run"
5. Wait for "Success" message

### 1.3 Get API Keys

1. Go to "Settings" → "API"
2. Copy these values:
   - **Project URL:** `https://xxx.supabase.co`
   - **anon (public) key:** `eyJhbGc...`
   - **service_role (secret) key:** `eyJhbGc...`
3. Save these - you'll need them later!

### 1.4 Setup Auth (Phone OTP)

1. Go to "Authentication" → "Providers"
2. Enable "Phone"
3. Choose provider: "Twilio" (we'll set up Twilio next)
4. Save

---

## 📱 Step 2: Setup Twilio (OTP SMS)

### 2.1 Create Twilio Account

1. Go to https://www.twilio.com/try-twilio
2. Sign up (you get $15 free credit!)
3. Verify your email and phone

### 2.2 Get Credentials

1. Go to Twilio Console: https://console.twilio.com/
2. Copy these from dashboard:
   - **Account SID:** `ACxxxxxxxx`
   - **Auth Token:** `xxxxxxxx`

### 2.3 Create Verify Service

1. In Twilio Console, go to "Explore Products"
2. Click "Verify" → "Services"
3. Click "Create new Service"
4. Name: "FrshTalk OTP"
5. Click "Create"
6. Copy **Service SID:** `VAxxxxxxxx`

### 2.4 Buy Phone Number (Optional for SMS)

1. Go to "Phone Numbers" → "Buy a number"
2. Search for numbers in your country
3. Buy one (~$1/month)
4. Copy the phone number

**Note:** With Verify API, you don't need to buy a number! It handles everything.

---

## 💳 Step 3: Setup Razorpay (Payments)

### 3.1 Create Razorpay Account

1. Go to https://dashboard.razorpay.com/signup
2. Sign up with business details
3. Complete KYC (takes 24-48 hours)

### 3.2 Get API Keys

1. Go to https://dashboard.razorpay.com/app/keys
2. Switch to "Test Mode" (top-right)
3. Copy:
   - **Key ID:** `rzp_test_xxxxxxxx`
   - **Key Secret:** `xxxxxxxx`

### 3.3 Setup Webhook

1. Go to "Settings" → "Webhooks"
2. Click "Add New Webhook"
3. URL: `https://your-backend-url.com/api/payments/webhook`
   (You'll update this after deploying)
4. Events: Select "payment.captured", "payment.failed", "refund.created"
5. Click "Create Webhook"
6. Copy **Webhook Secret:** `whsec_xxxxxxxx`

---

## 🚂 Step 4: Deploy to Railway (FREE)

### 4.1 Install Railway CLI

```bash
# Using npm
npm install -g @railway/cli

# Using Homebrew (Mac)
brew install railway
```

### 4.2 Login to Railway

```bash
railway login
```

This opens browser - login with GitHub.

### 4.3 Initialize Project

```bash
cd backend
railway init
```

- Choose "Create new project"
- Name: "frshtalk-backend"

### 4.4 Add Environment Variables

```bash
# Add all your environment variables
railway variables set NODE_ENV=production
railway variables set PORT=3001
railway variables set JWT_SECRET=$(openssl rand -base64 32)

# Supabase
railway variables set SUPABASE_URL=https://xxx.supabase.co
railway variables set SUPABASE_ANON_KEY=your-anon-key
railway variables set SUPABASE_SERVICE_KEY=your-service-key

# Razorpay
railway variables set RAZORPAY_KEY_ID=rzp_test_xxx
railway variables set RAZORPAY_KEY_SECRET=your-secret
railway variables set RAZORPAY_WEBHOOK_SECRET=whsec_xxx

# Twilio
railway variables set TWILIO_ACCOUNT_SID=ACxxx
railway variables set TWILIO_AUTH_TOKEN=your-token
railway variables set TWILIO_VERIFY_SERVICE_SID=VAxxx

# App Config
railway variables set SIGNUP_BONUS_COINS=100
railway variables set CORS_ORIGINS=http://localhost:5173,https://your-frontend-url.com
```

### 4.5 Deploy

```bash
railway up
```

Wait ~2 minutes for deployment.

### 4.6 Get Your Backend URL

```bash
railway domain
```

Copy the URL: `https://frshtalk-backend.up.railway.app`

---

## 🌐 Alternative: Deploy to Vercel (FREE)

### 5.1 Install Vercel CLI

```bash
npm install -g vercel
```

### 5.2 Deploy

```bash
cd backend
vercel
```

Follow prompts:
- Choose "Create new project"
- Name: "frshtalk-backend"

### 5.3 Add Environment Variables

```bash
vercel env add NODE_ENV
# Enter: production

vercel env add SUPABASE_URL
# Enter your Supabase URL

# Repeat for all environment variables...
```

### 5.4 Deploy Again

```bash
vercel --prod
```

---

## ✅ Step 6: Verify Deployment

### 6.1 Test Health Check

```bash
curl https://your-backend-url.com/health
```

Should return:
```json
{
  "status": "healthy",
  "timestamp": "2026-04-26T...",
  "uptime": 123.45,
  "environment": "production",
  "version": "1.0.0"
}
```

### 6.2 Test OTP Send

```bash
curl -X POST https://your-backend-url.com/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "+919876543210"}'
```

Should return:
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "phoneNumber": "+919876543210"
}
```

### 6.3 Check WebSocket

```bash
# In browser console
const socket = io('https://your-backend-url.com', {
  auth: { token: 'your-jwt-token' }
});

socket.on('connect', () => {
  console.log('✅ WebSocket connected!');
});
```

---

## 🔒 Step 7: Update Razorpay Webhook

Now that you have your backend URL:

1. Go to Razorpay Dashboard → Settings → Webhooks
2. Edit your webhook
3. Update URL to: `https://your-backend-url.com/api/payments/webhook`
4. Save

---

## 🎨 Step 8: Update Frontend

Update your frontend `.env`:

```env
VITE_API_URL=https://your-backend-url.com
VITE_WS_URL=https://your-backend-url.com
VITE_RAZORPAY_KEY=rzp_test_your_key
```

---

## 📊 Cost Breakdown (Monthly)

| Service | Free Tier | Cost |
|---------|-----------|------|
| **Supabase** | 500MB DB, Unlimited API | **$0** |
| **Railway** | $5 credit/month | **$0-5** |
| **Razorpay** | 2% per transaction | **Pay as you go** |
| **Twilio OTP** | $15 credit initially | **~$0.0075/SMS** |
| **TURN Server** | Optional | **$0-10** |
| **TOTAL** | | **$0-15/month** |

---

## 🚀 Going to Production

### Enable Live Payments

1. **Razorpay:**
   - Complete KYC verification
   - Switch to "Live Mode"
   - Get live API keys
   - Update Railway variables

2. **Twilio:**
   - Add payment method
   - Get more credits
   - Keep using same Verify Service

### Scale Up (Optional)

When you have more users:

1. **Railway Pro:** $20/month
   - More resources
   - Better uptime
   - Priority support

2. **Supabase Pro:** $25/month
   - 8GB database
   - More storage
   - Better performance

---

## 🐛 Troubleshooting

### Backend won't start

```bash
# Check logs
railway logs

# Common issues:
# 1. Missing environment variables
railway variables
# Make sure all variables are set

# 2. Port binding
# Railway assigns PORT automatically, don't hardcode it
```

### OTP not sending

```bash
# Check Twilio logs
# Go to: https://console.twilio.com/us1/monitor/logs/sms

# Common issues:
# 1. Wrong phone format - must include country code: +919876543210
# 2. Unverified number in Twilio trial - verify it first
# 3. Insufficient balance - add credits
```

### Payments failing

```bash
# Check Razorpay logs
# Go to: https://dashboard.razorpay.com/app/payments

# Common issues:
# 1. Test mode vs Live mode mismatch
# 2. Wrong API keys
# 3. Webhook signature mismatch - check webhook secret
```

### Database errors

```bash
# Check Supabase logs
# Go to Supabase Dashboard → Database → Logs

# Common issues:
# 1. RLS policies blocking access - check policies
# 2. Wrong service_role key - use service key for backend
# 3. Schema not applied - run schema.sql again
```

---

## 📝 Monitoring

### Railway Dashboard

- View logs: `railway logs`
- View metrics: Railway Dashboard → Metrics
- View deployments: Railway Dashboard → Deployments

### Supabase Dashboard

- Database usage: Settings → Billing
- API requests: Home → API
- Real-time connections: Database → Realtime

### Set up Alerts

```bash
# Railway
# Go to Dashboard → Settings → Notifications
# Enable email alerts for:
# - Deployment failures
# - High resource usage
# - Service down

# Supabase
# Go to Settings → Alerts
# Enable:
# - Database size warnings
# - API rate limit warnings
```

---

## 🎉 Congratulations!

Your FrshTalk backend is now live on FREE tier!

### What you have:
- ✅ Complete REST API
- ✅ Real-time WebSocket server
- ✅ WebRTC signaling for video calls
- ✅ OTP authentication
- ✅ Razorpay payment integration
- ✅ PostgreSQL database
- ✅ Auto-scaling
- ✅ HTTPS enabled
- ✅ Global CDN

### Next Steps:
1. Update frontend to use new API URL
2. Test all features end-to-end
3. Invite beta testers
4. Monitor performance
5. Scale when needed!

---

## 📞 Need Help?

- **Railway Docs:** https://docs.railway.app
- **Supabase Docs:** https://supabase.com/docs
- **Razorpay Docs:** https://razorpay.com/docs
- **Twilio Docs:** https://www.twilio.com/docs

---

**Built with ❤️ for FrshTalk**
