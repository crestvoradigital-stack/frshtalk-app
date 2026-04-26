# 📚 FrshTalk API Documentation

Complete API reference for FrshTalk backend.

**Base URL:** `https://your-backend-url.com`  
**WebSocket URL:** `https://your-backend-url.com`

---

## 🔐 Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

---

## 📍 Endpoints

### Health Check

#### GET `/health`
Check if the server is running.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-04-26T10:00:00.000Z",
  "uptime": 12345.67,
  "environment": "production",
  "version": "1.0.0"
}
```

---

## 🔑 Authentication Endpoints

### Send OTP

#### POST `/api/auth/send-otp`

Send OTP to user's phone number.

**Request Body:**
```json
{
  "phoneNumber": "+919876543210"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "phoneNumber": "+919876543210"
}
```

---

### Verify OTP & Login

#### POST `/api/auth/verify-otp`

Verify OTP and login/signup user.

**Request Body:**
```json
{
  "phoneNumber": "+919876543210",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "username": "user_3210",
    "phoneNumber": "+919876543210",
    "email": null,
    "avatar": "https://api.dicebear.com/...",
    "role": "customer",
    "coins": 100,
    "isVerified": true,
    "createdAt": "2026-04-26T10:00:00.000Z"
  },
  "isNewUser": true
}
```

---

### Refresh Token

#### POST `/api/auth/refresh`

Get a new JWT token.

**Request Body:**
```json
{
  "token": "old-jwt-token"
}
```

**Response:**
```json
{
  "success": true,
  "token": "new-jwt-token"
}
```

---

### Logout

#### POST `/api/auth/logout`

Logout user (updates online status).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "userId": "uuid"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 👤 User Endpoints

### Get Profile

#### GET `/api/users/profile`

Get current user's profile.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "username": "user_3210",
    "phoneNumber": "+919876543210",
    "email": "user@example.com",
    "avatar": "https://...",
    "role": "customer",
    "coins": 150,
    "isVerified": true,
    "isOnline": true,
    "createdAt": "2026-04-26T10:00:00.000Z"
  }
}
```

---

### Update Profile

#### PATCH `/api/users/profile`

Update user profile.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "username": "new_username",
  "email": "new@example.com",
  "avatar_url": "https://new-avatar.com/image.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "username": "new_username",
    "email": "new@example.com",
    "avatar": "https://new-avatar.com/image.jpg"
  }
}
```

---

## 👂 Listener Endpoints

### Get All Listeners

#### GET `/api/listeners`

Get list of available listeners.

**Query Parameters:**
- `location` (optional): Filter by location
- `tag` (optional): Filter by tag
- `sort` (optional): Sort by (default: "rating")

**Example:**
```
GET /api/listeners?location=Hyderabad&sort=rating
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "listeners": [
    {
      "id": "uuid",
      "username": "listener_name",
      "avatar": "https://...",
      "voiceRate": 1,
      "videoRate": 6,
      "tags": ["Family", "Career", "Emotional"],
      "rating": 4.8,
      "reviewCount": 234,
      "location": "Hyderabad",
      "languages": ["English", "Hindi", "Telugu"],
      "isOnline": true,
      "isVerified": true,
      "isOnCall": false,
      "totalCalls": 500
    }
  ]
}
```

---

### Get Listener by ID

#### GET `/api/listeners/:id`

Get detailed listener profile.

**Response:**
```json
{
  "success": true,
  "listener": {
    "id": "uuid",
    "username": "listener_name",
    "avatar": "https://...",
    "phoneNumber": "+919876543210",
    "bio": "Experienced listener...",
    "voiceRate": 1,
    "videoRate": 6,
    "tags": ["Family", "Career"],
    "rating": 4.8,
    "reviewCount": 234,
    "totalCalls": 500,
    "totalMinutes": 15000,
    "location": "Hyderabad",
    "languages": ["English", "Hindi"],
    "isOnline": true,
    "isVerified": true,
    "isAvailable": true,
    "isOnCall": false,
    "verificationStatus": "verified"
  }
}
```

---

### Update Listener Status

#### PATCH `/api/listeners/status`

Update listener availability status.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "isAvailable": true,
  "isOnCall": false
}
```

**Response:**
```json
{
  "success": true,
  "message": "Status updated",
  "profile": { ... }
}
```

---

## 📞 Call Endpoints

### Initiate Call

#### POST `/api/calls/initiate`

Start a new call.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "listenerId": "uuid",
  "callType": "voice"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Call initiated",
  "call": {
    "id": "uuid",
    "customerId": "uuid",
    "listenerId": "uuid",
    "callType": "voice",
    "status": "initiated",
    "startTime": "2026-04-26T10:00:00.000Z"
  }
}
```

---

### End Call

#### POST `/api/calls/:callId/end`

End an active call.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Call ended",
  "call": {
    "id": "uuid",
    "duration": 10,
    "cost": 10,
    "endTime": "2026-04-26T10:10:00.000Z"
  }
}
```

---

### Get User Calls

#### GET `/api/calls`

Get user's call history.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `limit` (optional): Number of calls to return (default: 20)

**Response:**
```json
{
  "success": true,
  "count": 15,
  "calls": [
    {
      "id": "uuid",
      "type": "voice",
      "status": "ended",
      "duration": 10,
      "cost": 10,
      "rating": 5,
      "startTime": "2026-04-26T10:00:00.000Z",
      "endTime": "2026-04-26T10:10:00.000Z",
      "otherUser": {
        "id": "uuid",
        "username": "listener_name",
        "avatar": "https://..."
      }
    }
  ]
}
```

---

### Rate Call

#### POST `/api/calls/:callId/rate`

Rate a completed call.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "rating": 5,
  "feedback": "Great listener, very helpful!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Call rated successfully"
}
```

---

## 💰 Wallet Endpoints

### Get Balance

#### GET `/api/wallet/balance`

Get user's coin balance.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "balance": 150
}
```

---

### Get Transactions

#### GET `/api/wallet/transactions`

Get user's transaction history.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `limit` (optional): Number of transactions (default: 50)

**Response:**
```json
{
  "success": true,
  "count": 25,
  "transactions": [
    {
      "id": "uuid",
      "type": "deduct",
      "amount": 10,
      "coins": 10,
      "status": "completed",
      "description": "voice call with listener_name (10 min)",
      "createdAt": "2026-04-26T10:10:00.000Z"
    }
  ]
}
```

---

## 💳 Payment Endpoints

### Get Coin Packages

#### GET `/api/payments/packages`

Get available coin packages.

**Response:**
```json
{
  "success": true,
  "packages": [
    {
      "id": "uuid",
      "coins": 100,
      "price": 99,
      "discount": 0,
      "savings": 0
    },
    {
      "id": "uuid",
      "coins": 500,
      "price": 449,
      "discount": 10,
      "savings": 50
    }
  ]
}
```

---

### Create Payment Order

#### POST `/api/payments/create-order`

Create Razorpay payment order.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "packageId": "uuid",
  "coins": 500,
  "amount": 449
}
```

**Response:**
```json
{
  "success": true,
  "order": {
    "id": "order_xxx",
    "amount": 44900,
    "currency": "INR",
    "receipt": "order_uuid_timestamp"
  },
  "key": "rzp_test_xxx"
}
```

---

### Verify Payment

#### POST `/api/payments/verify`

Verify Razorpay payment.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "razorpay_order_id": "order_xxx",
  "razorpay_payment_id": "pay_xxx",
  "razorpay_signature": "signature_xxx"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "coins": 500,
  "newBalance": 650
}
```

---

## 💬 Message Endpoints

### Get Call Messages

#### GET `/api/messages/call/:callId`

Get all messages for a call.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "count": 5,
  "messages": [
    {
      "id": "uuid",
      "content": "Hello!",
      "sender": {
        "id": "uuid",
        "username": "user_name",
        "avatar": "https://..."
      },
      "type": "text",
      "isRead": true,
      "createdAt": "2026-04-26T10:05:00.000Z"
    }
  ]
}
```

---

## 🔌 WebSocket Events

### Connection

```javascript
import { io } from 'socket.io-client';

const socket = io('https://your-backend-url.com', {
  auth: {
    token: 'your-jwt-token'
  }
});

socket.on('connect', () => {
  console.log('Connected!');
});
```

---

### User Status

**Emit:**
```javascript
socket.emit('user:online');
socket.emit('user:offline');
```

**Listen:**
```javascript
socket.on('user:status', (data) => {
  // data = { userId, status: 'online' | 'offline' }
});
```

---

### Call Events

**Join Call:**
```javascript
socket.emit('call:join', { callId: 'uuid' });
```

**Listen for participants:**
```javascript
socket.on('call:participants', (data) => {
  // data = { participants: ['userId1', 'userId2'] }
});

socket.on('call:user-joined', (data) => {
  // data = { userId, username }
});

socket.on('call:user-left', (data) => {
  // data = { userId }
});
```

---

### WebRTC Signaling

**Send Offer:**
```javascript
socket.emit('call:offer', {
  callId: 'uuid',
  targetUserId: 'uuid',
  offer: rtcPeerConnection.localDescription
});
```

**Listen for Offer:**
```javascript
socket.on('call:offer', (data) => {
  // data = { fromUserId, offer }
});
```

**Send Answer:**
```javascript
socket.emit('call:answer', {
  callId: 'uuid',
  targetUserId: 'uuid',
  answer: rtcPeerConnection.localDescription
});
```

**Listen for Answer:**
```javascript
socket.on('call:answer', (data) => {
  // data = { fromUserId, answer }
});
```

**ICE Candidates:**
```javascript
socket.emit('call:ice-candidate', {
  callId: 'uuid',
  targetUserId: 'uuid',
  candidate: iceCandidate
});

socket.on('call:ice-candidate', (data) => {
  // data = { fromUserId, candidate }
});
```

**Leave Call:**
```javascript
socket.emit('call:leave', { callId: 'uuid' });
```

---

### Messaging

**Send Message:**
```javascript
socket.emit('message:send', {
  callId: 'uuid',
  receiverId: 'uuid',
  content: 'Hello!',
  type: 'text'
});
```

**Listen for Messages:**
```javascript
socket.on('message:received', (data) => {
  // data = { id, callId, senderId, content, type, timestamp }
});

socket.on('message:new', (data) => {
  // data = { id, senderId, senderName, content, type, timestamp }
});
```

**Typing Indicator:**
```javascript
socket.emit('message:typing', {
  callId: 'uuid',
  receiverId: 'uuid'
});

socket.on('message:typing', (data) => {
  // data = { userId, username }
});
```

---

## 🚨 Error Responses

All errors follow this format:

```json
{
  "error": "Error Type",
  "message": "Human-readable error message"
}
```

### Status Codes

- `200` - Success
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

---

## 📝 Rate Limiting

- **Limit:** 100 requests per 15 minutes per IP
- **Headers returned:**
  - `X-RateLimit-Limit`: Total requests allowed
  - `X-RateLimit-Remaining`: Requests remaining
  - `X-RateLimit-Reset`: Time when limit resets

---

## 🔒 Security

### JWT Token
- Expires in 30 days
- Use `/api/auth/refresh` to get new token

### HTTPS
- All requests must use HTTPS in production
- WebSocket connections upgraded to WSS

### CORS
- Configured to allow only your frontend domain
- Update `CORS_ORIGINS` in environment variables

---

**Need help? Check the [Deployment Guide](./DEPLOYMENT_GUIDE.md)**
