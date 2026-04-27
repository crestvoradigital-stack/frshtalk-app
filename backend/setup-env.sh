#!/bin/bash

# ============================================
# FRSHTALK BACKEND - ENVIRONMENT SETUP SCRIPT
# ============================================
# This script helps you set up environment variables
# for local development and deployment
# ============================================

set -e

echo "🔧 FrshTalk Backend - Environment Setup"
echo "========================================"

# Check if .env file exists
if [ -f ".env" ]; then
    echo "⚠️  .env file already exists!"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Setup cancelled."
        exit 1
    fi
fi

# Copy .env.example to .env
cp .env.example .env
echo "✅ Created .env file from .env.example"

# Generate JWT secret
JWT_SECRET=$(openssl rand -base64 32)
sed -i.bak "s|JWT_SECRET=.*|JWT_SECRET=$JWT_SECRET|" .env
echo "✅ Generated JWT secret"

# Remove backup file
rm .env.bak

echo ""
echo "📝 Please update the following values in your .env file:"
echo "======================================================"
echo ""
echo "🔵 Supabase (https://supabase.com/dashboard):"
echo "   - SUPABASE_URL"
echo "   - SUPABASE_ANON_KEY"
echo "   - SUPABASE_SERVICE_KEY"
echo ""
echo "📱 Twilio (https://console.twilio.com):"
echo "   - TWILIO_ACCOUNT_SID"
echo "   - TWILIO_AUTH_TOKEN"
echo "   - TWILIO_VERIFY_SERVICE_SID"
echo ""
echo "💳 Razorpay (https://dashboard.razorpay.com):"
echo "   - RAZORPAY_KEY_ID"
echo "   - RAZORPAY_KEY_SECRET"
echo "   - RAZORPAY_WEBHOOK_SECRET"
echo ""
echo "🌐 Frontend URL (for CORS):"
echo "   - FRONTEND_URL"
echo ""
echo "📖 For detailed setup instructions, see:"
echo "   - DEPLOYMENT_GUIDE.md"
echo "   - RAILWAY_DEPLOYMENT_PLAN.md"
echo ""
echo "🚀 Once configured, run:"
echo "   pnpm run dev  # for development"
echo "   ./deploy-to-railway.sh  # for deployment"