#!/bin/bash

# FrshTalk API Testing Script
# Tests all implemented endpoints after deployment

BASE_URL="https://pretty-amazement-production-351b.up.railway.app"
FRONTEND_URL="https://frshtalk-app.vercel.app"

echo "🚀 FrshTalk API Testing Script"
echo "================================="
echo "Backend URL: $BASE_URL"
echo "Frontend URL: $FRONTEND_URL"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test function
test_endpoint() {
    local method=$1
    local endpoint=$2
    local description=$3
    local data=$4
    local auth=$5

    echo -n "Testing $description... "

    local cmd="curl -s -X $method"
    if [ "$auth" = "true" ]; then
        cmd="$cmd -H 'Authorization: Bearer test-token'"
    fi
    if [ -n "$data" ]; then
        cmd="$cmd -H 'Content-Type: application/json' -d '$data'"
    fi
    cmd="$cmd $BASE_URL$endpoint"

    local response=$(eval $cmd)
    local status=$?

    if [ $status -eq 0 ] && [ "$response" != "" ]; then
        echo -e "${GREEN}✓${NC}"
        echo "  Response: $response"
    else
        echo -e "${RED}✗${NC}"
        echo "  Error: Failed to connect or empty response"
    fi
    echo ""
}

# Health Check
echo "🔍 Health Checks"
echo "---------------"
test_endpoint "GET" "/health" "Backend Health"

# Authentication Endpoints
echo "🔐 Authentication Tests"
echo "----------------------"
test_endpoint "POST" "/api/auth/send-otp" "Send OTP" '{"phoneNumber":"+12345678901"}'
test_endpoint "POST" "/api/auth/verify-otp" "Verify OTP" '{"phoneNumber":"+12345678901","otp":"123456"}'
test_endpoint "POST" "/api/auth/refresh" "Refresh Token" '{"token":"test-token"}'

# User Management
echo "👤 User Management Tests"
echo "-----------------------"
test_endpoint "GET" "/api/users/profile" "Get Profile" "" "true"
test_endpoint "PATCH" "/api/users/profile" "Update Profile" '{"username":"UpdatedName"}' "true"
test_endpoint "GET" "/api/users/listeners" "Get User Listener List" "" "true"
test_endpoint "GET" "/api/listeners" "Get Listener List" "" "true"

# Voice Calling
echo "📞 Voice Calling Tests"
echo "---------------------"
test_endpoint "POST" "/api/calls/token" "Generate Voice Token" '{"roomName":"test-room"}' "true"
test_endpoint "POST" "/api/calls/initiate" "Initiate Call" '{"listenerId":"123","callType":"voice"}' "true"
test_endpoint "POST" "/api/calls/end" "End Call" '{"callId":"test-call"}' "true"
test_endpoint "GET" "/api/calls/history" "Call History" "" "true"
test_endpoint "GET" "/api/listeners/available" "Get Available Listeners" "" "true"

# Payments
echo "💳 Payment Tests"
echo "---------------"
test_endpoint "POST" "/api/payments/create-order" "Create Payment Order" '{"packageId":"starter","coins":100,"amount":99}' "true"
test_endpoint "POST" "/api/payments/order" "Create Payment Order Alias" '{"packageId":"starter","coins":100,"amount":99}' "true"
test_endpoint "POST" "/api/payments/verify" "Verify Payment" '{"razorpay_order_id":"test-order","razorpay_payment_id":"test-payment","razorpay_signature":"test-sig"}' "true"
test_endpoint "GET" "/api/payments/transactions" "Transaction History" "" "true"
test_endpoint "GET" "/api/payments/balance" "Payment Balance" "" "true"

# Wallet
echo "👛 Wallet Tests"
echo "--------------"
test_endpoint "GET" "/api/wallet/balance" "Get Wallet Balance" "" "true"
test_endpoint "GET" "/api/wallet/transactions" "Get Wallet Transactions" "" "true"

# Messages
echo "💬 Message Tests"
echo "---------------"
test_endpoint "GET" "/api/messages" "Get Messages" "" "true"
test_endpoint "GET" "/api/messages/call/test-call" "Get Call Messages" "" "true"

# Feedback
echo "📝 Feedback Tests"
echo "----------------"
test_endpoint "POST" "/api/feedback/submit" "Submit Feedback" '{"rating":5,"comment":"Great app!","category":"ui"}' "true"
test_endpoint "GET" "/api/feedback/stats" "Feedback Stats" "" "true"

# Support
echo "🆘 Support Tests"
echo "---------------"
test_endpoint "POST" "/api/support/tickets" "Create Support Ticket" '{"subject":"Test Issue","message":"Testing support"}' "true"
test_endpoint "GET" "/api/support/tickets" "Get Support Tickets" "" "true"

# Analytics
echo "📊 Analytics Tests"
echo "-----------------"
test_endpoint "GET" "/api/analytics/dashboard" "Dashboard Data" "" "true"
test_endpoint "GET" "/api/analytics/user-stats" "User Statistics" "" "true"

# Notifications
echo "🔔 Notification Tests"
echo "--------------------"
test_endpoint "GET" "/api/notifications" "Get Notifications" "" "true"
test_endpoint "POST" "/api/notifications/mark-read" "Mark as Read" '{"notificationId":"123"}' "true"

echo "🎉 Testing Complete!"
echo "==================="
echo "Note: Some endpoints may require valid authentication tokens for full functionality."
echo "Check Railway deployment status if endpoints are not responding."