# Technical Design: Realtime Chat System

## 1. Overview

This document provides a comprehensive technical design for implementing a production-ready realtime chat system for the room rental management platform. The system leverages the existing Socket.IO infrastructure and follows established architectural patterns.

## 2. Current System Analysis

### 2.1 Existing Socket.IO Infrastructure

**Primary Implementation (socket.gateway.ts)**:
- Modern Socket.IO server with JWT authentication middleware
- User-based room management (`user:${userId}`)
- Helper functions: `emitToUser()`, `emitToAll()`, `getIO()`
- Authentication extracts `userId` and `houseId` from JWT token

**Legacy Implementation (sockets/)**:
- SockJS-based implementation with basic CHAT/BROADCAST events
- In-memory client management
- Will be deprecated in favor of Socket.IO

**Decision**: Use Socket.IO (socket.gateway.ts) as the foundation for chat implementation.

## 3. High-Level Design

### 3.1 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  (Web/Mobile App with Socket.IO Client + REST API calls)   │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ├──── Socket.IO Events ────┐
                 │                           │
                 └──── REST API ─────────────┤
                                             │
┌────────────────────────────────────────────▼─────────────────┐
│                     Backend Layer                             │
│                                                               │
│  ┌─────────────────┐         ┌──────────────────┐           │
│  │ Socket.IO       │         │  Express REST    │           │
│  │ Gateway         │◄────────┤  API Routes      │           │
│  │ (socket.gateway)│         │  (chat.routes)   │           │
│  └────────┬────────┘         └────────┬─────────┘           │
│           │                           │                      │
│           └───────────┬───────────────┘                      │
│                       │                                      │
│           ┌───────────▼──────────────┐                       │
│           │   Chat Socket Handler    │                       │
│           │   (chat.socket.ts)       │                       │
│           └───────────┬──────────────┘                       │
│                       │                                      │
│           ┌───────────▼──────────────┐                       │
│           │    Chat Service          │                       │
│           │    (chat.service.ts)     │                       │
│           └───────────┬──────────────┘                       │
│                       │                                      │
│           ┌───────────▼──────────────┐                       │
│           │  Chat Repository Layer   │                       │
│           │  - ConversationRepo      │                       │
│           │  - MessageRepo           │                       │
│           └───────────┬──────────────┘                       │
└───────────────────────┼──────────────────────────────────────┘
                        │
┌───────────────────────▼──────────────────────────────────────┐
│                   Data Layer (MongoDB)                        │
│                                                               │
│  ┌──────────────────┐         ┌──────────────────┐          │
│  │  Conversations   │         │    Messages      │          │
│  │   Collection     │◄────────┤   Collection     │          │
│  └──────────────────┘         └──────────────────┘          │
│                                                               │
│  ┌──────────────────┐                                        │
│  │     Users        │  (Existing - No Changes)              │
│  │   Collection     │                                        │
│  └──────────────────┘                                        │
└───────────────────────────────────────────────────────────────┘
```

### 3.2 Component Responsibilities

**Socket.IO Gateway** (existing):
- WebSocket connection management
- JWT authentication
- User room management
- Event emission utilities

**Chat Socket Handler** (new):
- Listen to chat-specific Socket.IO events
- Validate incoming messages
- Delegate business logic to service layer
- Emit responses to connected clients

**Chat Service** (new):
- Core business logic
- Conversation lifecycle management
- Message processing
- Coordinate between repositories

**Repository Layer** (new):
- Direct MongoDB operations
- Query optimization
- Data transformation

**Models** (new):
- Mongoose schemas
- TypeScript interfaces
- Data validation

### 3.3 Data Flow Diagrams

#### 3.3.1 Send Message Flow

```
Client A                Socket Handler           Service              Repository           MongoDB
   │                          │                     │                      │                  │
   │──send_message──────────►│                     │                      │                  │
   │  {to, content}           │                     │                      │                  │
   │                          │                     │                      │                  │
   │                          │──validate───────────►│                      │                  │
   │                          │                     │                      │                  │
   │                          │                     │──findConversation──►│                  │
   │                          │                     │   (A, B)             │──query──────────►│
   │                          │                     │                      │◄─result──────────│
   │                          │                     │◄─────────────────────│                  │
   │                          │                     │                      │                  │
   │                          │                     │  [if not exists]     │                  │
   │                          │                     │──createConversation─►│                  │
   │                          │                     │                      │──insert─────────►│
   │                          │                     │◄─────────────────────│                  │
   │                          │                     │                      │                  │
   │                          │                     │──createMessage──────►│                  │
   │                          │                     │                      │──insert─────────►│
   │                          │                     │◄─────────────────────│                  │
   │                          │                     │                      │                  │
   │                          │                     │──updateLastMessage──►│                  │
   │                          │                     │                      │──update─────────►│
   │                          │                     │◄─────────────────────│                  │
   │                          │◄────────────────────│                      │                  │
   │◄─message_sent────────────│                     │                      │                  │
   │  (confirmation)          │                     │                      │                  │
   │                          │                     │                      │                  │
   │                          │──emitToUser(B)─────►│                      │                  │
   │                          │  receive_message    │                      │                  │
   │                          │                     │                      │                  │
Client B◄─receive_message────│                     │                      │                  │
```

#### 3.3.2 Load Conversations Flow

```
Client              Controller           Service              Repository           MongoDB
   │                     │                   │                      │                  │
   │──GET /conversations─►│                   │                      │                  │
   │  ?cursor=&limit=25  │                   │                      │                  │
   │                     │──getConversations─►│                      │                  │
   │                     │                   │──findByUser─────────►│                  │
   │                     │                   │  (userId, cursor)    │──query──────────►│
   │                     │                   │                      │◄─result──────────│
   │                     │                   │◄─────────────────────│                  │
   │                     │◄──────────────────│                      │                  │
   │◄─200 OK─────────────│                   │                      │                  │
   │  {conversations,    │                   │                      │                  │
   │   nextCursor}       │                   │                      │                  │
```

#### 3.3.3 Message Seen Flow

```
Client              Socket Handler       Service              Repository           MongoDB
   │                     │                   │                      │                  │
   │──message_seen──────►│                   │                      │                  │
   │  {conversationId}   │                   │                      │                  │
   │                     │──updateLastSeen──►│                      │                  │
   │                     │                   │──updateParticipant──►│                  │
   │                     │                   │                      │──update─────────►│
   │                     │                   │◄─────────────────────│                  │
   │                     │◄──────────────────│                      │                  │
   │◄─seen_updated───────│                   │                      │                  │
```

## 4. Low-Level Design

### 4.1 MongoDB Schema Design

#### 4.1.1 Conversation Model

```typescript
// Backend/src/modules/chat/conversation.model.ts

import mongoose, { Document, Types } from "mongoose";

export interface IParticipant {
  userId: Types.ObjectId;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  lastSeen?: Date;
}

export interface ILastMessage {
  messageId: Types.ObjectId;
  content: string;
  senderId: Types.ObjectId;
  createdAt: Date;
}

export interface IConversation extends Document {
  type: "direct";
  participants: IParticipant[];
  participantIds: Types.ObjectId[];
  lastMessage?: ILastMessage;
  createdAt: Date;
  updatedAt: Date;
}

const ParticipantSchema = new mongoose.Schema({
  userId: { type: Types.ObjectId, ref: "users", required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  profilePicture: { type: String },
  lastSeen: { type: Date },
}, { _id: false });

const LastMessageSchema = new mongoose.Schema({
  messageId: { type: Types.ObjectId, required: true },
  content: { type: String, required: true },
  senderId: { type: Types.ObjectId, required: true },
  createdAt: { type: Date, required: true },
}, { _id: false });

const ConversationSchema = new mongoose.Schema<IConversation>({
  type: { type: String, enum: ["direct"], default: "direct", required: true },
  participants: { type: [ParticipantSchema], required: true },
  participantIds: { type: [Types.ObjectId], required: true },
  lastMessage: { type: LastMessageSchema },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { versionKey: false });

// Indexes
ConversationSchema.index({ participantIds: 1, updatedAt: -1 });
ConversationSchema.index({ participantIds: 1 }, { unique: true });

export default mongoose.model<IConversation>("conversations", ConversationSchema);
```

#### 4.1.2 Message Model

```typescript
// Backend/src/modules/chat/message.model.ts

import mongoose, { Document, Types } from "mongoose";

export interface IMessage extends Document {
  conversationId: Types.ObjectId;
  senderId: Types.ObjectId;
  content: string;
  type: "text" | "image" | "file";
  status: "sent" | "delivered" | "read";
  createdAt: Date;
}

const MessageSchema = new mongoose.Schema<IMessage>({
  conversationId: { type: Types.ObjectId, ref: "conversations", required: true },
  senderId: { type: Types.ObjectId, ref: "users", required: true },
  content: { type: String, required: true },
  type: { type: String, enum: ["text", "image", "file"], default: "text" },
  status: { type: String, enum: ["sent", "delivered", "read"], default: "sent" },
  createdAt: { type: Date, default: Date.now },
}, { versionKey: false });

// Indexes
MessageSchema.index({ conversationId: 1, createdAt: -1 });
MessageSchema.index({ conversationId: 1, _id: -1 });

export default mongoose.model<IMessage>("messages", MessageSchema);
```

### 4.2 Service Layer

#### 4.2.1 Chat Service

```typescript
// Backend/src/modules/chat/chat.service.ts

import { Types } from "mongoose";
import ConversationModel, { IConversation, IParticipant } from "./conversation.model";
import MessageModel, { IMessage } from "./message.model";
import userModel from "../users/user.model";

export class ChatService {
  
  /**
   * Find or create conversation between two users
   * Only creates if message is being sent (not on chat open)
   */
  async findOrCreateConversation(
    userId1: string,
    userId2: string,
    createIfNotExists: boolean = false
  ): Promise<IConversation | null> {
    const participantIds = [
      new Types.ObjectId(userId1),
      new Types.ObjectId(userId2)
    ].sort((a, b) => a.toString().localeCompare(b.toString()));

    let conversation = await ConversationModel.findOne({
      participantIds: { $all: participantIds, $size: 2 }
    });

    if (!conversation && createIfNotExists) {
      // Fetch user details
      const users = await userModel.find({
        _id: { $in: participantIds }
      }).select("firstName lastName profilePicture");

      const participants: IParticipant[] = users.map(user => ({
        userId: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePicture: user.profilePicture,
      }));

      conversation = await ConversationModel.create({
        type: "direct",
        participants,
        participantIds,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return conversation;
  }

  /**
   * Create a new message and update conversation
   */
  async createMessage(
    conversationId: string,
    senderId: string,
    content: string,
    type: "text" | "image" | "file" = "text"
  ): Promise<IMessage> {
    const message = await MessageModel.create({
      conversationId: new Types.ObjectId(conversationId),
      senderId: new Types.ObjectId(senderId),
      content,
      type,
      status: "sent",
      createdAt: new Date(),
    });

    // Update conversation's lastMessage and updatedAt
    await ConversationModel.findByIdAndUpdate(conversationId, {
      lastMessage: {
        messageId: message._id,
        content: message.content,
        senderId: message.senderId,
        createdAt: message.createdAt,
      },
      updatedAt: new Date(),
    });

    return message;
  }

  /**
   * Get conversations for a user with cursor-based pagination
   */
  async getConversations(
    userId: string,
    cursor?: string,
    limit: number = 25
  ): Promise<{ conversations: IConversation[]; nextCursor: string | null }> {
    const query: any = {
      participantIds: new Types.ObjectId(userId),
    };

    if (cursor) {
      query._id = { $lt: new Types.ObjectId(cursor) };
    }

    const conversations = await ConversationModel.find(query)
      .sort({ updatedAt: -1, _id: -1 })
      .limit(limit + 1)
      .exec();

    const hasMore = conversations.length > limit;
    const results = hasMore ? conversations.slice(0, limit) : conversations;
    const nextCursor = hasMore ? results[results.length - 1]._id.toString() : null;

    return { conversations: results, nextCursor };
  }

  /**
   * Get messages for a conversation with cursor-based pagination
   */
  async getMessages(
    conversationId: string,
    cursor?: string,
    limit: number = 50
  ): Promise<{ messages: IMessage[]; nextCursor: string | null }> {
    const query: any = {
      conversationId: new Types.ObjectId(conversationId),
    };

    if (cursor) {
      query._id = { $lt: new Types.ObjectId(cursor) };
    }

    const messages = await MessageModel.find(query)
      .sort({ createdAt: -1, _id: -1 })
      .limit(limit + 1)
      .exec();

    const hasMore = messages.length > limit;
    const results = hasMore ? messages.slice(0, limit) : messages;
    const nextCursor = hasMore ? results[results.length - 1]._id.toString() : null;

    // Reverse to show oldest first
    return { messages: results.reverse(), nextCursor };
  }

  /**
   * Update participant's lastSeen timestamp
   */
  async updateLastSeen(conversationId: string, userId: string): Promise<void> {
    await ConversationModel.updateOne(
      { _id: new Types.ObjectId(conversationId), "participants.userId": new Types.ObjectId(userId) },
      { $set: { "participants.$.lastSeen": new Date() } }
    );
  }

  /**
   * Get single conversation by ID
   */
  async getConversationById(conversationId: string): Promise<IConversation | null> {
    return ConversationModel.findById(conversationId);
  }

  /**
   * Check if user is participant in conversation
   */
  async isParticipant(conversationId: string, userId: string): Promise<boolean> {
    const conversation = await ConversationModel.findOne({
      _id: new Types.ObjectId(conversationId),
      participantIds: new Types.ObjectId(userId),
    });
    return !!conversation;
  }
}
```

### 4.3 Socket Event Handlers

```typescript
// Backend/src/modules/chat/chat.socket.ts

import { Socket } from "socket.io";
import { ChatService } from "./chat.service";
import { getIO } from "../../core/socket/socket.gateway";
import { SocketRooms } from "../../core/socket/socket.rooms";

const chatService = new ChatService();

export function initChatSocketHandlers(io: any) {
  
  io.on("connection", (socket: Socket) => {
    const userId = (socket as any).userId as string;

    /**
     * Event: send_message
     * Payload: { to: string, content: string, type?: "text" | "image" | "file" }
     */
    socket.on("send_message", async (data: { to: string; content: string; type?: string }) => {
      try {
        const { to, content, type = "text" } = data;

        // Validation
        if (!to || !content) {
          socket.emit("error", { message: "Missing required fields" });
          return;
        }

        if (to === userId) {
          socket.emit("error", { message: "Cannot send message to yourself" });
          return;
        }

        // Find or create conversation (create on first message)
        let conversation = await chatService.findOrCreateConversation(userId, to, true);

        if (!conversation) {
          socket.emit("error", { message: "Failed to create conversation" });
          return;
        }

        // Create message
        const message = await chatService.createMessage(
          conversation._id.toString(),
          userId,
          content,
          type as any
        );

        // Emit confirmation to sender
        socket.emit("message_sent", {
          messageId: message._id,
          conversationId: conversation._id,
          content: message.content,
          createdAt: message.createdAt,
        });

        // Emit to receiver
        getIO().to(SocketRooms.user(to)).emit("receive_message", {
          messageId: message._id,
          conversationId: conversation._id,
          senderId: userId,
          content: message.content,
          type: message.type,
          createdAt: message.createdAt,
        });

      } catch (error: any) {
        console.error("send_message error:", error);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    /**
     * Event: message_seen
     * Payload: { conversationId: string }
     */
    socket.on("message_seen", async (data: { conversationId: string }) => {
      try {
        const { conversationId } = data;

        if (!conversationId) {
          socket.emit("error", { message: "Missing conversationId" });
          return;
        }

        // Verify user is participant
        const isParticipant = await chatService.isParticipant(conversationId, userId);
        if (!isParticipant) {
          socket.emit("error", { message: "Unauthorized" });
          return;
        }

        // Update lastSeen
        await chatService.updateLastSeen(conversationId, userId);

        // Emit confirmation
        socket.emit("seen_updated", { conversationId, timestamp: new Date() });

      } catch (error: any) {
        console.error("message_seen error:", error);
        socket.emit("error", { message: "Failed to update seen status" });
      }
    });

    /**
     * Event: typing
     * Payload: { conversationId: string, to: string }
     */
    socket.on("typing", async (data: { conversationId: string; to: string }) => {
      try {
        const { conversationId, to } = data;

        // Verify user is participant
        const isParticipant = await chatService.isParticipant(conversationId, userId);
        if (!isParticipant) return;

        // Emit to receiver
        getIO().to(SocketRooms.user(to)).emit("user_typing", {
          conversationId,
          userId,
        });

      } catch (error: any) {
        console.error("typing error:", error);
      }
    });

  });
}
```

### 4.4 REST API Layer

#### 4.4.1 Controller

```typescript
// Backend/src/modules/chat/chat.controller.ts

import { Request, Response } from "express";
import { ChatService } from "./chat.service";
import { successResponse, errorResponse } from "../../interfaces/wrapper/ApiResponseWrapper";

const chatService = new ChatService();

export class ChatController {
  
  /**
   * GET /chat/conversations
   * Query: cursor?, limit?
   */
  async getConversations(req: Request, res: Response) {
    try {
      const userId = (req as any).userId; // From auth middleware
      const { cursor, limit } = req.query;

      const result = await chatService.getConversations(
        userId,
        cursor as string,
        limit ? parseInt(limit as string) : 25
      );

      return successResponse(res, result, "Conversations retrieved successfully");
    } catch (error: any) {
      return errorResponse(res, error.message, 500);
    }
  }

  /**
   * GET /chat/messages/:conversationId
   * Query: cursor?, limit?
   */
  async getMessages(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const { conversationId } = req.params;
      const { cursor, limit } = req.query;

      // Verify user is participant
      const isParticipant = await chatService.isParticipant(conversationId, userId);
      if (!isParticipant) {
        return errorResponse(res, "Unauthorized", 403);
      }

      const result = await chatService.getMessages(
        conversationId,
        cursor as string,
        limit ? parseInt(limit as string) : 50
      );

      return successResponse(res, result, "Messages retrieved successfully");
    } catch (error: any) {
      return errorResponse(res, error.message, 500);
    }
  }

  /**
   * POST /chat/send
   * Body: { to: string, content: string, type?: string }
   */
  async sendMessage(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const { to, content, type = "text" } = req.body;

      if (!to || !content) {
        return errorResponse(res, "Missing required fields", 400);
      }

      // Find or create conversation
      let conversation = await chatService.findOrCreateConversation(userId, to, true);

      if (!conversation) {
        return errorResponse(res, "Failed to create conversation", 500);
      }

      // Create message
      const message = await chatService.createMessage(
        conversation._id.toString(),
        userId,
        content,
        type
      );

      return successResponse(res, {
        messageId: message._id,
        conversationId: conversation._id,
        content: message.content,
        createdAt: message.createdAt,
      }, "Message sent successfully");

    } catch (error: any) {
      return errorResponse(res, error.message, 500);
    }
  }

  /**
   * GET /chat/conversation/:otherUserId
   * Get or check conversation with another user
   */
  async getConversationWithUser(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const { otherUserId } = req.params;

      const conversation = await chatService.findOrCreateConversation(userId, otherUserId, false);

      if (!conversation) {
        return successResponse(res, { exists: false, conversation: null }, "No conversation found");
      }

      return successResponse(res, { exists: true, conversation }, "Conversation found");
    } catch (error: any) {
      return errorResponse(res, error.message, 500);
    }
  }
}
```

#### 4.4.2 Routes

```typescript
// Backend/src/modules/chat/chat.routes.ts

import { Router } from "express";
import { ChatController } from "./chat.controller";
import { authMiddleware } from "../../middlewares/authMiddleware";

const router = Router();
const chatController = new ChatController();

// All routes require authentication
router.use(authMiddleware);

router.get("/conversations", chatController.getConversations.bind(chatController));
router.get("/messages/:conversationId", chatController.getMessages.bind(chatController));
router.post("/send", chatController.sendMessage.bind(chatController));
router.get("/conversation/:otherUserId", chatController.getConversationWithUser.bind(chatController));

export default router;
```

### 4.5 Integration with Existing System

#### 4.5.1 Update socket.gateway.ts

```typescript
// Backend/src/core/socket/socket.gateway.ts
// Add chat socket initialization

import { initChatSocketHandlers } from "../../modules/chat/chat.socket";

export function initSocketGateway(httpServer: HttpServer): SocketServer {
  io = new SocketServer(httpServer, {
    cors: { origin: "*" },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      (socket as any).userId = decoded.id;
      (socket as any).houseId = decoded.houseId;
      next();
    } catch {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket: Socket) => {
    const userId = (socket as any).userId as string;
    socket.join(SocketRooms.user(userId));
  });

  // Initialize chat socket handlers
  initChatSocketHandlers(io);

  return io;
}
```

#### 4.5.2 Update socket.rooms.ts

```typescript
// Backend/src/core/socket/socket.rooms.ts

export const SocketRooms = {
  user: (userId: string) => `user:${userId}`,
  conversation: (conversationId: string) => `conversation:${conversationId}`,
} as const;
```

#### 4.5.3 Register Routes

```typescript
// Backend/src/routes/index.routes.ts
// Add chat routes

import chatRoutes from "../modules/chat/chat.routes";

router.use("/chat", chatRoutes);
```

## 5. Index Strategy

### 5.1 Conversations Collection

```javascript
// Compound index for finding conversations by participant and sorting
db.conversations.createIndex({ participantIds: 1, updatedAt: -1 });

// Unique index to prevent duplicate conversations
db.conversations.createIndex({ participantIds: 1 }, { unique: true });
```

### 5.2 Messages Collection

```javascript
// Compound index for pagination within conversation
db.messages.createIndex({ conversationId: 1, createdAt: -1 });

// Alternative index using _id for cursor-based pagination
db.messages.createIndex({ conversationId: 1, _id: -1 });
```

## 6. Error Handling & Validation

### 6.1 Socket Event Validation

```typescript
// Validation helper
function validateSendMessage(data: any): { valid: boolean; error?: string } {
  if (!data.to || typeof data.to !== "string") {
    return { valid: false, error: "Invalid recipient" };
  }
  if (!data.content || typeof data.content !== "string" || data.content.trim().length === 0) {
    return { valid: false, error: "Message content is required" };
  }
  if (data.content.length > 5000) {
    return { valid: false, error: "Message too long (max 5000 characters)" };
  }
  return { valid: true };
}
```

### 6.2 Error Response Format

```typescript
// Socket error event
socket.emit("error", {
  code: "VALIDATION_ERROR",
  message: "Invalid message format",
  timestamp: new Date(),
});

// REST API error response
{
  success: false,
  message: "Unauthorized access",
  statusCode: 403
}
```

## 7. Performance Optimizations

### 7.1 Caching Strategy

```typescript
// Optional: Cache active conversations in Redis
// Key: `user:${userId}:conversations`
// TTL: 5 minutes
// Invalidate on new message
```

### 7.2 Query Optimization

- Use lean() for read-only queries
- Project only required fields
- Limit result sets appropriately
- Use cursor-based pagination (more efficient than offset)

### 7.3 Connection Management

- Implement connection pooling (MongoDB default)
- Set appropriate timeout values
- Handle disconnections gracefully

## 8. Security Considerations

### 8.1 Authentication

- JWT validation on Socket.IO connection
- JWT validation on REST API endpoints
- Verify user permissions before operations

### 8.2 Authorization

- Verify user is participant before accessing conversation
- Validate sender identity matches authenticated user
- Prevent unauthorized message access

### 8.3 Input Sanitization

```typescript
import validator from "validator";

function sanitizeMessage(content: string): string {
  // Escape HTML to prevent XSS
  return validator.escape(content.trim());
}
```

### 8.4 Rate Limiting

```typescript
// Implement rate limiting for message sending
// Example: Max 10 messages per minute per user
const rateLimiter = new Map<string, { count: number; resetAt: number }>();
```

## 9. Testing Strategy

### 9.1 Unit Tests

- Service layer methods
- Validation functions
- Data transformation logic

### 9.2 Integration Tests

- Socket event flows
- REST API endpoints
- Database operations

### 9.3 Load Tests

- Concurrent connections
- Message throughput
- Database query performance

## 10. Monitoring & Logging

### 10.1 Metrics to Track

- Active WebSocket connections
- Messages sent per minute
- Average message delivery time
- Database query performance
- Error rates

### 10.2 Logging

```typescript
import logger from "../../utils/logger";

logger.info("Message sent", {
  userId,
  conversationId,
  messageId,
  timestamp: new Date(),
});

logger.error("Failed to send message", {
  userId,
  error: error.message,
  stack: error.stack,
});
```

## 11. Deployment Considerations

### 11.1 Environment Variables

```env
# Socket.IO
SOCKET_IO_CORS_ORIGIN=*
SOCKET_IO_PING_TIMEOUT=60000
SOCKET_IO_PING_INTERVAL=25000

# Chat
CHAT_MESSAGE_MAX_LENGTH=5000
CHAT_CONVERSATION_PAGE_SIZE=25
CHAT_MESSAGE_PAGE_SIZE=50
```

### 11.2 Scaling

- Use Redis adapter for Socket.IO in multi-server setup
- Implement sticky sessions for WebSocket connections
- Consider message queue for high-volume scenarios

## 12. Future Enhancements

- Group chat support
- File/image upload
- Message reactions
- Read receipts
- Push notifications
- Message search
- Message editing/deletion
- Typing indicators with debounce
- Online/offline status
- Message encryption

## 13. Summary

This design provides a production-ready realtime chat system that:

✅ Integrates seamlessly with existing Socket.IO infrastructure
✅ Follows established architectural patterns
✅ Implements efficient cursor-based pagination
✅ Prevents duplicate conversations
✅ Handles business rules correctly (lazy conversation creation)
✅ Provides both Socket.IO and REST API interfaces
✅ Includes proper error handling and validation
✅ Optimizes database queries with appropriate indexes
✅ Maintains security through authentication and authorization
✅ Scales horizontally with proper design patterns

The implementation can proceed module by module, starting with models, then service layer, followed by Socket handlers and REST API.


## 14. Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Message Creation and Delivery

*For any* valid message sent from one user to another, the system should create the message in the database and deliver it to the recipient in realtime.

**Validates: Requirements 1.1, 1.7, 9.3, 10.1**

### Property 2: Conversation Creation on First Message

*For any* two users without an existing conversation, sending a message between them should create exactly one new conversation.

**Validates: Requirements 1.2, 2.6, 10.2**

### Property 3: Message Validation

*For any* message that is self-directed, has whitespace-only content, or exceeds 5000 characters, the system should reject the message with an appropriate error.

**Validates: Requirements 1.3, 1.4, 1.5**

### Property 4: Operation Confirmations

*For any* successful operation (message sent, conversation marked as seen), the system should emit a confirmation event to the requesting user.

**Validates: Requirements 1.6, 4.2**

### Property 5: Conversation List Ordering

*For any* user's conversation list, conversations should be ordered by most recent activity (updatedAt timestamp) in descending order.

**Validates: Requirements 2.1**

### Property 6: Conversation Data Completeness

*For any* conversation returned to a user, it should include last message details (if messages exist) and complete participant information (name, profile picture).

**Validates: Requirements 2.2, 2.3**

### Property 7: Conversation Pagination Bounds

*For any* request for conversations, the system should return at most 25 conversations and provide a cursor when more exist.

**Validates: Requirements 2.4, 2.5**

### Property 8: Conversation Uniqueness

*For any* two users, there should exist at most one conversation between them in the database.

**Validates: Requirements 2.6**

### Property 9: Message Chronological Ordering

*For any* conversation's message history, messages should be returned in chronological order (oldest first) based on createdAt timestamp.

**Validates: Requirements 3.1**

### Property 10: Message Pagination Bounds

*For any* request for messages, the system should return at most 50 messages and provide a cursor when more exist.

**Validates: Requirements 3.2, 3.3**

### Property 11: Participant Authorization

*For any* operation on a conversation (viewing messages, marking as seen, typing), the system should verify the user is a participant and reject unauthorized access.

**Validates: Requirements 3.4, 4.3, 5.2, 6.3**

### Property 12: Last Seen Update

*For any* user marking a conversation as seen, the system should update that user's lastSeen timestamp in the conversation's participant array.

**Validates: Requirements 4.1, 10.4**

### Property 13: Typing Event Propagation

*For any* valid typing event in a conversation, the system should emit the event to the other participant in realtime.

**Validates: Requirements 5.1**

### Property 14: Authentication Enforcement

*For any* WebSocket connection or REST API request, the system should validate the JWT token and reject invalid or missing tokens.

**Validates: Requirements 6.1, 6.2, 6.5**

### Property 15: Sender Identity Verification

*For any* message send operation, the system should verify the sender identity matches the authenticated user from the JWT token.

**Validates: Requirements 6.4**

### Property 16: Message Type Default

*For any* message created without an explicit type field, the system should default the type to "text".

**Validates: Requirements 7.4**

### Property 17: Conversation Lookup Without Creation

*For any* conversation lookup operation, the system should return the conversation if it exists or indicate non-existence, but never create a new conversation.

**Validates: Requirements 8.1, 8.2, 8.3**

### Property 18: WebSocket Room Management

*For any* user who successfully connects via WebSocket, the system should join them to their user-specific room (user:${userId}).

**Validates: Requirements 9.2**

### Property 19: Graceful Disconnection Handling

*For any* WebSocket disconnection event, the system should handle it gracefully without crashing or leaving orphaned resources.

**Validates: Requirements 9.4**

### Property 20: Last Message Update Persistence

*For any* new message created in a conversation, the system should immediately update the conversation's lastMessage field in the database.

**Validates: Requirements 10.3**

### Property 21: Comprehensive Error Handling

*For any* error (validation, authorization, server), the system should emit an appropriate error event or HTTP response with descriptive information and log the error with context.

**Validates: Requirements 11.1, 11.2, 11.3, 11.4**

### Property 22: Input Sanitization

*For any* message content received, the system should escape HTML characters, trim whitespace, and validate all fields before processing.

**Validates: Requirements 12.1, 12.2, 12.3**

### Property 23: Message Round-Trip Persistence

*For any* message created through the send operation, querying the database immediately after should return an equivalent message with the same content and metadata.

**Validates: Requirements 10.1**

### Property 24: Conversation Round-Trip Persistence

*For any* conversation created, querying the database immediately after should return an equivalent conversation with the same participants and metadata.

**Validates: Requirements 10.2**
