# 🚂 Railway Deployment Plan - FrshTalk Backend

**Date:** April 27, 2026  
**Status:** ✅ READY FOR DEPLOYMENT  
**Estimated Cost:** $0-5/month (Railway free tier)

---

## 📋 Prerequisites Checklist

### ✅ Required Accounts (All FREE)
- [ ] **Railway Account**: https://railway.app
- [ ] **Supabase Account**: https://supabase.com
- [ ] **Twilio Account**: https://twilio.com (for OTP)
- [ ] **Razorpay Account**: https://razorpay.com (for payments)

### ✅ Required Data
- [ ] Supabase Project URL
- [ ] Supabase anon key
- [ ] Supabase service role key
- [ ] Twilio Account SID
- [ ] Twilio Auth Token
- [ ] Twilio Verify Service SID
- [ ] Razorpay Key ID
- [ ] Razorpay Key Secret
- [ ] Razorpay Webhook Secret

---

## 🚀 Step-by-Step Deployment

### Step 1: Prepare Your Repository

```bash
# Ensure you're in the backend directory
cd /workspaces/frshtalk-app/backend

# Verify all files are present
ls -la
# Should see: package.json, railway.json, src/, database/, etc.
```

### Step 2: Install Railway CLI

```bash
# Install Railway CLI globally
npm install -g @railway/cli

# Login to Railway (opens browser)
railway login
```

### Step 3: Initialize Railway Project

```bash
# Initialize new Railway project
railway init

# When prompted:
# - Choose: "Create new project"
# - Name: "frshtalk-backend"
# - Environment: "production"
```

### Step 4: Set Environment Variables

```bash
# Server Configuration
railway variables set NODE_ENV=production
railway variables set PORT=3001
railway variables set FRONTEND_URL=https://your-frontend-domain.com

# JWT Secret (Generate a secure one)
railway variables set JWT_SECRET=$(openssl rand -base64 32)

# Supabase Configuration
railway variables set SUPABASE_URL=https://your-project.supabase.co
railway variables set SUPABASE_ANON_KEY=your-anon-key-here
railway variables set SUPABASE_SERVICE_KEY=your-service-role-key-here

# Twilio Configuration
railway variables set TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxx
railway variables set TWILIO_AUTH_TOKEN=your-auth-token-here
railway variables set TWILIO_VERIFY_SERVICE_SID=VAxxxxxxxxxxxxxxxx

# Razorpay Configuration
railway variables set RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
railway variables set RAZORPAY_KEY_SECRET=your-key-secret-here
railway variables set RAZORPAY_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx

# App Configuration
railway variables set SIGNUP_BONUS_COINS=100
railway variables set VOICE_CALL_RATE=1
railway variables set VIDEO_CALL_RATE=6

# Rate Limiting
railway variables set RATE_LIMIT_WINDOW_MS=900000
railway variables set RATE_LIMIT_MAX_REQUESTS=100

# CORS Origins (comma-separated)
railway variables set CORS_ORIGINS=https://your-frontend-domain.com,http://localhost:5173
```

### Step 5: Deploy to Railway

```bash
# Deploy the application
railway up

# Wait for deployment (usually 2-3 minutes)
# Railway will automatically:
# - Install dependencies
# - Run TypeScript compilation
# - Start the server with "node dist/server.js"
```

### Step 6: Get Your Backend URL

```bash
# Get the deployed URL
railway domain

# Example output: https://frshtalk-backend.up.railway.app
```

### Step 7: Verify Deployment

```bash
# Test health endpoint
curl https://your-backend-url.com/health

# Should return:
{
  "status": "healthy",
  "timestamp": "2026-04-27T...",
  "uptime": 123.45,
  "environment": "production",
  "version": "1.0.0"
}
```

---

## 🔧 Configuration Files

### railway.json (Already Configured)
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "node dist/server.js",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### package.json Scripts (Already Configured)
```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/server.js"
  }
}
```

---

## 🌐 Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `NODE_ENV` | ✅ | Environment | `production` |
| `PORT` | ✅ | Server port | `3001` |
| `JWT_SECRET` | ✅ | JWT signing key | `openssl rand -base64 32` |
| `SUPABASE_URL` | ✅ | Supabase project URL | `https://xxx.supabase.co` |
| `SUPABASE_ANON_KEY` | ✅ | Supabase public key | `eyJhbGc...` |
| `SUPABASE_SERVICE_KEY` | ✅ | Supabase service key | `eyJhbGc...` |
| `TWILIO_ACCOUNT_SID` | ✅ | Twilio account SID | `ACxxxxxxxx` |
| `TWILIO_AUTH_TOKEN` | ✅ | Twilio auth token | `xxxxxxxx` |
| `TWILIO_VERIFY_SERVICE_SID` | ✅ | Twilio verify service | `VAxxxxxxxx` |
| `RAZORPAY_KEY_ID` | ✅ | Razorpay key ID | `rzp_test_xxx` |
| `RAZORPAY_KEY_SECRET` | ✅ | Razorpay secret | `xxxxxxxx` |
| `RAZORPAY_WEBHOOK_SECRET` | ✅ | Razorpay webhook secret | `whsec_xxx` |
| `SIGNUP_BONUS_COINS` | ✅ | Welcome bonus | `100` |
| `CORS_ORIGINS` | ✅ | Allowed frontend URLs | `https://app.com` |

---

## 🔍 Troubleshooting

### Build Failures
```bash
# Check build logs
railway logs

# Common issues:
# - Missing environment variables
# - TypeScript compilation errors
# - Node version mismatch
```

### Runtime Errors
```bash
# Check application logs
railway logs --app

# Common issues:
# - Database connection failures
# - Invalid API keys
# - CORS configuration
```

### Environment Variables
```bash
# List all variables
railway variables

# Update a variable
railway variables set VARIABLE_NAME=new_value

# Redeploy after variable changes
railway up
```

---

## 📊 Monitoring & Maintenance

### Health Checks
- Railway automatically monitors your app
- Health endpoint: `GET /health`
- Automatic restarts on failures

### Logs
```bash
# View recent logs
railway logs

# View specific service logs
railway logs --service your-service-name

# Follow logs in real-time
railway logs --follow
```

### Scaling
- Railway free tier: 512MB RAM, 1 CPU
- Upgrade for more resources if needed
- Automatic scaling available on paid plans

---

## 🔗 Integration with Frontend

### Update Frontend Environment
After deployment, update your frontend's `.env` file:

```bash
# In your frontend project
VITE_API_BASE_URL=https://your-backend-url.com/api
```

### CORS Configuration
Ensure your `CORS_ORIGINS` includes your frontend URL:

```bash
railway variables set CORS_ORIGINS=https://your-frontend-domain.com
```

---

## 💰 Cost Breakdown

### FREE Services
- **Railway**: $5 free credit/month
- **Supabase**: 500MB DB, unlimited API calls
- **Twilio**: $15 free credit for SMS
- **Razorpay**: Pay per transaction only

### Potential Costs
- Railway: ~$5/month after free credit
- Twilio SMS: $0.0075 per message
- Razorpay: 2% per transaction
- Supabase: Free for basic usage

**Total Estimated Cost:** $0-15/month

---

## 🎯 Next Steps After Deployment

1. **Test All Endpoints**
   ```bash
   # Test authentication
   curl -X POST https://your-backend-url.com/api/auth/send-otp \
     -H "Content-Type: application/json" \
     -d '{"phoneNumber": "+919876543210"}'
   ```

2. **Update Frontend**
   - Set `VITE_API_BASE_URL` to your Railway URL
   - Deploy frontend to Vercel/Netlify

3. **Setup Webhooks**
   - Configure Razorpay webhook URL
   - Test payment flows

4. **Monitor & Optimize**
   - Check Railway dashboard for metrics
   - Monitor error logs
   - Optimize database queries if needed

---

## 📞 Support

- **Railway Docs**: https://docs.railway.app/
- **Supabase Docs**: https://supabase.com/docs
- **Twilio Docs**: https://www.twilio.com/docs
- **Razorpay Docs**: https://razorpay.com/docs/

**Your backend will be live at:** `https://frshtalk-backend.up.railway.app`

🚀 **Happy Deploying!**