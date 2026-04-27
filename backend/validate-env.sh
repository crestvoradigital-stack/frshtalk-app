#!/bin/bash

# ============================================
# FRSHTALK BACKEND - ENVIRONMENT VALIDATION
# ============================================
# This script validates your environment setup
# ============================================

set -e

echo "🔍 FrshTalk Backend - Environment Validation"
echo "============================================"

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found!"
    echo "   Run: ./setup-env.sh"
    exit 1
fi

# Load environment variables
set -a
source .env
set +a

echo "✅ .env file found"

# Validate required variables
REQUIRED_VARS=(
    "SUPABASE_URL"
    "SUPABASE_ANON_KEY"
    "SUPABASE_SERVICE_KEY"
    "JWT_SECRET"
    "RAZORPAY_KEY_ID"
    "RAZORPAY_KEY_SECRET"
    "TWILIO_ACCOUNT_SID"
    "TWILIO_AUTH_TOKEN"
    "TWILIO_VERIFY_SERVICE_SID"
)

MISSING_VARS=()

for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ] || [[ "${!var}" == *"your-"* ]] || [[ "${!var}" == *"example"* ]]; then
        MISSING_VARS+=("$var")
    fi
done

if [ ${#MISSING_VARS[@]} -eq 0 ]; then
    echo "✅ All required environment variables are configured"
else
    echo "❌ Missing or placeholder environment variables:"
    for var in "${MISSING_VARS[@]}"; do
        echo "   - $var"
    done
    echo ""
    echo "📝 Update these in your .env file"
    exit 1
fi

# Validate JWT secret length
if [ ${#JWT_SECRET} -lt 32 ]; then
    echo "❌ JWT_SECRET must be at least 32 characters long"
    exit 1
fi

echo "✅ JWT_SECRET length is valid"

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed"
    echo "   Install with: npm install -g pnpm"
    exit 1
fi

echo "✅ pnpm is installed"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    exit 1
fi

NODE_VERSION=$(node --version | sed 's/v//')
REQUIRED_NODE_VERSION="18.0.0"

if ! [ "$(printf '%s\n' "$REQUIRED_NODE_VERSION" "$NODE_VERSION" | sort -V | head -n1)" = "$REQUIRED_NODE_VERSION" ]; then
    echo "❌ Node.js version $NODE_VERSION is too old. Required: $REQUIRED_NODE_VERSION+"
    exit 1
fi

echo "✅ Node.js $NODE_VERSION is installed"

# Check if TypeScript is available
if ! command -v tsc &> /dev/null; then
    echo "❌ TypeScript is not installed"
    echo "   Install with: pnpm install"
    exit 1
fi

echo "✅ TypeScript is available"

echo ""
echo "🎉 Environment validation passed!"
echo ""
echo "🚀 Ready to run:"
echo "   pnpm install    # Install dependencies"
echo "   pnpm run build  # Build the project"
echo "   pnpm run dev    # Start development server"
echo ""
echo "📦 For deployment:"
echo "   ./deploy-to-railway.sh"