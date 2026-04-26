import { Server as SocketServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { db } from '../config/supabase.js';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  username?: string;
}

// Store active connections
const activeConnections = new Map<string, string>(); // userId -> socketId
const activeRooms = new Map<string, Set<string>>(); // callId -> Set of userIds

export function setupWebSocketHandlers(io: SocketServer) {
  // Authentication middleware
  io.use((socket: AuthenticatedSocket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      socket.userId = decoded.userId;
      socket.username = decoded.username;
      next();
    } catch (err) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    const userId = socket.userId!;
    console.log(`User connected: ${userId} (${socket.id})`);

    // Store active connection
    activeConnections.set(userId, socket.id);

    // Update user online status
    db.updateUser(userId, { is_online: true });

    // ==========================================
    // USER STATUS EVENTS
    // ==========================================

    socket.on('user:online', async () => {
      await db.updateUser(userId, { is_online: true });
      socket.broadcast.emit('user:status', { userId, status: 'online' });
    });

    socket.on('user:offline', async () => {
      await db.updateUser(userId, { is_online: false });
      socket.broadcast.emit('user:status', { userId, status: 'offline' });
    });

    // ==========================================
    // CALL SIGNALING (WebRTC)
    // ==========================================

    // Join call room
    socket.on('call:join', async (data: { callId: string }) => {
      const { callId } = data;

      // Add user to room
      socket.join(`call:${callId}`);

      // Track room membership
      if (!activeRooms.has(callId)) {
        activeRooms.set(callId, new Set());
      }
      activeRooms.get(callId)!.add(userId);

      console.log(`User ${userId} joined call ${callId}`);

      // Notify other participants
      socket.to(`call:${callId}`).emit('call:user-joined', {
        userId,
        username: socket.username,
      });

      // Send list of existing participants
      const participants = Array.from(activeRooms.get(callId)!).filter(
        (id) => id !== userId
      );
      socket.emit('call:participants', { participants });
    });

    // WebRTC offer
    socket.on('call:offer', (data: { callId: string; targetUserId: string; offer: any }) => {
      const { callId, targetUserId, offer } = data;
      const targetSocketId = activeConnections.get(targetUserId);

      if (targetSocketId) {
        io.to(targetSocketId).emit('call:offer', {
          fromUserId: userId,
          offer,
        });
      }
    });

    // WebRTC answer
    socket.on('call:answer', (data: { callId: string; targetUserId: string; answer: any }) => {
      const { callId, targetUserId, answer } = data;
      const targetSocketId = activeConnections.get(targetUserId);

      if (targetSocketId) {
        io.to(targetSocketId).emit('call:answer', {
          fromUserId: userId,
          answer,
        });
      }
    });

    // ICE candidate
    socket.on('call:ice-candidate', (data: { callId: string; targetUserId: string; candidate: any }) => {
      const { callId, targetUserId, candidate } = data;
      const targetSocketId = activeConnections.get(targetUserId);

      if (targetSocketId) {
        io.to(targetSocketId).emit('call:ice-candidate', {
          fromUserId: userId,
          candidate,
        });
      }
    });

    // Leave call
    socket.on('call:leave', async (data: { callId: string }) => {
      const { callId } = data;

      socket.leave(`call:${callId}`);

      // Remove from room tracking
      activeRooms.get(callId)?.delete(userId);
      if (activeRooms.get(callId)?.size === 0) {
        activeRooms.delete(callId);
      }

      // Notify other participants
      socket.to(`call:${callId}`).emit('call:user-left', {
        userId,
      });

      console.log(`User ${userId} left call ${callId}`);
    });

    // ==========================================
    // MESSAGING
    // ==========================================

    socket.on('message:send', async (data: {
      callId: string;
      receiverId: string;
      content: string;
      type?: string;
    }) => {
      try {
        const { callId, receiverId, content, type = 'text' } = data;

        // Save message to database
        const message = await db.createMessage({
          call_id: callId,
          sender_id: userId,
          receiver_id: receiverId,
          content,
          message_type: type,
        });

        // Send to receiver
        const receiverSocketId = activeConnections.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('message:received', {
            id: message.id,
            callId,
            senderId: userId,
            content,
            type,
            timestamp: message.created_at,
          });
        }

        // Acknowledge to sender
        socket.emit('message:sent', {
          id: message.id,
          timestamp: message.created_at,
        });

        // Broadcast to call room
        socket.to(`call:${callId}`).emit('message:new', {
          id: message.id,
          senderId: userId,
          senderName: socket.username,
          content,
          type,
          timestamp: message.created_at,
        });
      } catch (error) {
        console.error('Message send error:', error);
        socket.emit('message:error', { error: 'Failed to send message' });
      }
    });

    socket.on('message:typing', (data: { callId: string; receiverId: string }) => {
      const { callId, receiverId } = data;
      const receiverSocketId = activeConnections.get(receiverId);

      if (receiverSocketId) {
        io.to(receiverSocketId).emit('message:typing', {
          userId,
          username: socket.username,
        });
      }
    });

    // ==========================================
    // NOTIFICATIONS
    // ==========================================

    socket.on('notification:read', async (data: { notificationId: string }) => {
      try {
        await db.markNotificationRead(data.notificationId);
      } catch (error) {
        console.error('Mark notification read error:', error);
      }
    });

    // ==========================================
    // DISCONNECT
    // ==========================================

    socket.on('disconnect', async () => {
      console.log(`User disconnected: ${userId} (${socket.id})`);

      // Remove from active connections
      activeConnections.delete(userId);

      // Remove from all rooms
      activeRooms.forEach((participants, callId) => {
        if (participants.has(userId)) {
          participants.delete(userId);
          socket.to(`call:${callId}`).emit('call:user-left', {
            userId,
          });
        }
      });

      // Update user online status (with delay to handle reconnections)
      setTimeout(async () => {
        if (!activeConnections.has(userId)) {
          await db.updateUser(userId, {
            is_online: false,
            last_seen: new Date().toISOString(),
          });
          socket.broadcast.emit('user:status', { userId, status: 'offline' });
        }
      }, 5000);
    });
  });

  console.log('✅ WebSocket handlers initialized');
}

// Helper function to emit to specific user
export function emitToUser(io: SocketServer, userId: string, event: string, data: any) {
  const socketId = activeConnections.get(userId);
  if (socketId) {
    io.to(socketId).emit(event, data);
  }
}

// Helper function to emit to call room
export function emitToCallRoom(io: SocketServer, callId: string, event: string, data: any) {
  io.to(`call:${callId}`).emit(event, data);
}

export { activeConnections, activeRooms };
