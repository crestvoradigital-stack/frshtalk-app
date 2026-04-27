#!/bin/bash

# ============================================
# FRSHTALK BACKEND - RAILWAY DEPLOYMENT SCRIPT
# ============================================
# This script helps automate Railway deployment setup
# Run this from the backend directory
# ============================================

set -e  # Exit on any error

echo "🚂 FrshTalk Backend - Railway Deployment Setup"
echo "=============================================="

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Installing..."
    npm install -g @railway/cli
    echo "✅ Railway CLI installed"
fi

# Check if user is logged in
echo "🔐 Checking Railway login status..."
if ! railway whoami &> /dev/null; then
    echo "Please login to Railway:"
    railway login
fi

echo "✅ Railway CLI ready"

# Initialize project
echo "📁 Initializing Railway project..."
railway init

echo "🔧 Setting up environment variables..."
echo "⚠️  IMPORTANT: Make sure you have these values ready:"
echo "   - Supabase URL, anon key, service key"
echo "   - Twilio Account SID, Auth Token, Verify Service SID"
echo "   - Razorpay Key ID, Key Secret, Webhook Secret"
echo ""
read -p "Do you have all environment variables ready? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Please gather your environment variables first."
    echo "📖 Check RAILWAY_DEPLOYMENT_PLAN.md for details."
    exit 1
fi

# Set environment variables
echo "🔑 Setting environment variables..."

# Server config
railway variables set NODE_ENV=production
railway variables set PORT=3001

# Generate JWT secret
JWT_SECRET=$(openssl rand -base64 32)
railway variables set JWT_SECRET="$JWT_SECRET"
echo "✅ Generated JWT secret"

# Prompt for required variables
echo "📝 Please enter your configuration values:"
echo ""

read -p "Supabase URL (https://xxx.supabase.co): " SUPABASE_URL
railway variables set SUPABASE_URL="$SUPABASE_URL"

read -p "Supabase Anon Key: " SUPABASE_ANON_KEY
railway variables set SUPABASE_ANON_KEY="$SUPABASE_ANON_KEY"

read -p "Supabase Service Key: " SUPABASE_SERVICE_KEY
railway variables set SUPABASE_SERVICE_KEY="$SUPABASE_SERVICE_KEY"

read -p "Twilio Account SID: " TWILIO_ACCOUNT_SID
railway variables set TWILIO_ACCOUNT_SID="$TWILIO_ACCOUNT_SID"

read -p "Twilio Auth Token: " TWILIO_AUTH_TOKEN
railway variables set TWILIO_AUTH_TOKEN="$TWILIO_AUTH_TOKEN"

read -p "Twilio Verify Service SID: " TWILIO_VERIFY_SERVICE_SID
railway variables set TWILIO_VERIFY_SERVICE_SID="$TWILIO_VERIFY_SERVICE_SID"

read -p "Razorpay Key ID: " RAZORPAY_KEY_ID
railway variables set RAZORPAY_KEY_ID="$RAZORPAY_KEY_ID"

read -p "Razorpay Key Secret: " RAZORPAY_KEY_SECRET
railway variables set RAZORPAY_KEY_SECRET="$RAZORPAY_KEY_SECRET"

read -p "Razorpay Webhook Secret: " RAZORPAY_WEBHOOK_SECRET
railway variables set RAZORPAY_WEBHOOK_SECRET="$RAZORPAY_WEBHOOK_SECRET"

read -p "Frontend URL (for CORS): " FRONTEND_URL
railway variables set FRONTEND_URL="$FRONTEND_URL"
railway variables set CORS_ORIGINS="$FRONTEND_URL,http://localhost:5173"

# Set default app config
railway variables set SIGNUP_BONUS_COINS=100
railway variables set VOICE_CALL_RATE=1
railway variables set VIDEO_CALL_RATE=6
railway variables set RATE_LIMIT_WINDOW_MS=900000
railway variables set RATE_LIMIT_MAX_REQUESTS=100

echo "🚀 Deploying to Railway..."
railway up

echo "⏳ Waiting for deployment (usually 2-3 minutes)..."
sleep 10

echo "🌐 Getting your backend URL..."
BACKEND_URL=$(railway domain)
echo "✅ Backend deployed at: $BACKEND_URL"

echo ""
echo "🎉 DEPLOYMENT COMPLETE!"
echo "=========================="
echo "Backend URL: $BACKEND_URL"
echo "Health Check: $BACKEND_URL/health"
echo ""
echo "📝 Next Steps:"
echo "1. Test the health endpoint"
echo "2. Update your frontend VITE_API_BASE_URL"
echo "3. Deploy your frontend"
echo ""
echo "📖 See RAILWAY_DEPLOYMENT_PLAN.md for full documentation"