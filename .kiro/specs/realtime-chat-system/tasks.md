# Implementation Plan: Realtime Chat System

## Overview

This plan implements a production-ready realtime chat system using Socket.IO and REST APIs. The implementation follows the existing architectural patterns and integrates with the current Socket.IO infrastructure. Tasks are organized to build incrementally, validating functionality at each step.

## Tasks

- [ ] 1. Create data models and database schemas
  - [x] 1.1 Create Conversation model with participant and last message schemas
    - Define IParticipant, ILastMessage, and IConversation interfaces
    - Create Mongoose schema with proper types and validation
    - Add compound index on participantIds and updatedAt
    - Add unique index on participantIds to prevent duplicates
    - _Requirements: 2.6, 10.2_

  - [ ]* 1.2 Write property test for Conversation model
    - **Property 8: Conversation Uniqueness**
    - **Validates: Requirements 2.6**

  - [x] 1.3 Create Message model with status tracking
    - Define IMessage interface with conversationId, senderId, content, type, status
    - Create Mongoose schema with proper types and validation
    - Add compound indexes on conversationId with createdAt and _id
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 10.1_

  - [ ]* 1.4 Write property test for Message model
    - **Property 23: Message Round-Trip Persistence**
    - **Validates: Requirements 10.1**

- [ ] 2. Implement Chat Service business logic
  - [x] 2.1 Implement findOrCreateConversation method
    - Sort participantIds to ensure consistent ordering
    - Query for existing conversation using $all and $size operators
    - Fetch user details and create conversation only if createIfNotExists is true
    - _Requirements: 1.2, 2.6, 8.3_

  - [ ]* 2.2 Write property test for conversation creation
    - **Property 2: Conversation Creation on First Message**
    - **Validates: Requirements 1.2, 2.6, 10.2**

  - [x] 2.3 Implement createMessage method
    - Create message document with proper types
    - Update conversation's lastMessage and updatedAt fields atomically
    - Return created message with all fields
    - _Requirements: 1.1, 10.1, 10.3_

  - [ ]* 2.4 Write property test for message creation and last message update
    - **Property 1: Message Creation and Delivery**
    - **Property 20: Last Message Update Persistence**
    - **Validates: Requirements 1.1, 10.1, 10.3**

  - [x] 2.5 Implement getConversations method with cursor pagination
    - Build query with participantIds filter and optional cursor
    - Sort by updatedAt descending and _id descending
    - Fetch limit + 1 to determine if more pages exist
    - Return conversations array and nextCursor
    - _Requirements: 2.1, 2.4, 2.5, 13.1_

  - [ ]* 2.6 Write property test for conversation pagination
    - **Property 7: Conversation Pagination Bounds**
    - **Validates: Requirements 2.4, 2.5**

  - [x] 2.7 Implement getMessages method with cursor pagination
    - Build query with conversationId filter and optional cursor
    - Sort by createdAt descending and _id descending
    - Fetch limit + 1 to determine if more pages exist
    - Reverse results to show oldest first
    - _Requirements: 3.1, 3.2, 3.3, 13.2_

  - [ ]* 2.8 Write property test for message pagination and ordering
    - **Property 9: Message Chronological Ordering**
    - **Property 10: Message Pagination Bounds**
    - **Validates: Requirements 3.1, 3.2, 3.3**

  - [x] 2.9 Implement updateLastSeen and authorization helper methods
    - Implement updateLastSeen to update participant's lastSeen timestamp
    - Implement isParticipant to verify user is in conversation
    - Implement getConversationById for fetching single conversation
    - _Requirements: 4.1, 6.3, 10.4_

  - [ ]* 2.10 Write property test for authorization checks
    - **Property 11: Participant Authorization**
    - **Validates: Requirements 3.4, 4.3, 6.3**

- [ ] 3. Checkpoint - Verify service layer
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 4. Implement Socket.IO event handlers
  - [x] 4.1 Create chat.socket.ts with send_message event handler
    - Validate message data (to, content, type)
    - Reject self-messages and invalid content
    - Sanitize message content (escape HTML, trim whitespace)
    - Call findOrCreateConversation with createIfNotExists=true
    - Call createMessage to persist the message
    - Emit message_sent confirmation to sender
    - Emit receive_message to recipient using SocketRooms.user()
    - Handle errors and emit error events
    - _Requirements: 1.1, 1.3, 1.4, 1.5, 1.6, 1.7, 6.4, 9.3, 12.1, 12.2, 12.3_

  - [ ]* 4.2 Write property test for message validation
    - **Property 3: Message Validation**
    - **Validates: Requirements 1.3, 1.4, 1.5**

  - [ ]* 4.3 Write property test for input sanitization
    - **Property 22: Input Sanitization**
    - **Validates: Requirements 12.1, 12.2, 12.3**

  - [x] 4.4 Implement message_seen event handler
    - Validate conversationId is provided
    - Verify user is participant using isParticipant
    - Call updateLastSeen to update timestamp
    - Emit seen_updated confirmation
    - Handle errors and emit error events
    - _Requirements: 4.1, 4.2, 4.3_

  - [ ]* 4.5 Write property test for last seen updates
    - **Property 12: Last Seen Update**
    - **Validates: Requirements 4.1, 10.4**

  - [x] 4.6 Implement typing event handler
    - Validate conversationId and to fields
    - Verify user is participant using isParticipant
    - Emit user_typing event to recipient using SocketRooms.user()
    - Silently ignore errors (non-critical feature)
    - _Requirements: 5.1, 5.2_

  - [ ]* 4.7 Write property test for typing event propagation
    - **Property 13: Typing Event Propagation**
    - **Validates: Requirements 5.1**

  - [x] 4.8 Export initChatSocketHandlers function
    - Wrap all event handlers in io.on("connection") callback
    - Extract userId from socket object (set by auth middleware)
    - Export function to be called from socket.gateway.ts
    - _Requirements: 9.1, 9.2_

- [ ] 5. Implement REST API layer
  - [x] 5.1 Create ChatController with getConversations endpoint
    - Extract userId from authenticated request
    - Parse cursor and limit query parameters
    - Call chatService.getConversations
    - Return success response with conversations and nextCursor
    - Handle errors with appropriate HTTP status codes
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 6.2_

  - [x] 5.2 Implement getMessages endpoint
    - Extract userId and conversationId from request
    - Verify user is participant using isParticipant
    - Parse cursor and limit query parameters
    - Call chatService.getMessages
    - Return success response with messages and nextCursor
    - Handle errors with appropriate HTTP status codes
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 6.2, 6.3_

  - [x] 5.3 Implement sendMessage endpoint
    - Extract userId from authenticated request
    - Validate to, content, and type fields
    - Call findOrCreateConversation with createIfNotExists=true
    - Call createMessage to persist the message
    - Return success response with message details
    - Handle errors with appropriate HTTP status codes
    - _Requirements: 1.1, 1.2, 6.2, 6.4_

  - [x] 5.4 Implement getConversationWithUser endpoint
    - Extract userId and otherUserId from request
    - Call findOrCreateConversation with createIfNotExists=false
    - Return response indicating existence and conversation data
    - Handle errors with appropriate HTTP status codes
    - _Requirements: 8.1, 8.2, 8.3_

  - [ ]* 5.5 Write property test for conversation lookup without creation
    - **Property 17: Conversation Lookup Without Creation**
    - **Validates: Requirements 8.1, 8.2, 8.3**

  - [x] 5.6 Create chat.routes.ts with authentication middleware
    - Define Express router
    - Apply authMiddleware to all routes
    - Register GET /conversations route
    - Register GET /messages/:conversationId route
    - Register POST /send route
    - Register GET /conversation/:otherUserId route
    - Export router
    - _Requirements: 6.2_

  - [ ]* 5.7 Write integration tests for REST API endpoints
    - Test authentication enforcement on all endpoints
    - Test authorization checks for conversation access
    - Test error responses with appropriate status codes
    - _Requirements: 6.1, 6.2, 6.3, 11.3_

- [ ] 6. Checkpoint - Verify API layer
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 7. Integrate with existing Socket.IO infrastructure
  - [x] 7.1 Update socket.gateway.ts to initialize chat handlers
    - Import initChatSocketHandlers from chat.socket.ts
    - Call initChatSocketHandlers(io) after Socket.IO server initialization
    - Ensure existing authentication middleware remains intact
    - Ensure existing user room joining remains intact
    - _Requirements: 6.1, 9.1, 9.2_

  - [ ]* 7.2 Write property test for WebSocket authentication
    - **Property 14: Authentication Enforcement**
    - **Validates: Requirements 6.1, 6.5**

  - [ ]* 7.3 Write property test for WebSocket room management
    - **Property 18: WebSocket Room Management**
    - **Validates: Requirements 9.2**

  - [x] 7.4 Update socket.rooms.ts to add conversation room helper
    - Add conversation: (conversationId: string) => `conversation:${conversationId}` to SocketRooms
    - Keep existing user room helper
    - _Requirements: 9.2_

  - [x] 7.5 Register chat routes in main routes file
    - Import chatRoutes from modules/chat/chat.routes
    - Register router.use("/chat", chatRoutes) in routes/index.routes.ts
    - _Requirements: 6.2_

- [ ] 8. Add error handling and logging
  - [~] 8.1 Add comprehensive error handling to socket handlers
    - Wrap all socket event handlers in try-catch blocks
    - Emit error events with descriptive messages for validation errors
    - Emit generic error messages for server errors
    - Log all errors with context using logger utility
    - _Requirements: 11.1, 11.2, 11.4_

  - [ ]* 8.2 Write property test for error handling
    - **Property 21: Comprehensive Error Handling**
    - **Validates: Requirements 11.1, 11.2, 11.3, 11.4**

  - [~] 8.2 Add comprehensive error handling to REST controllers
    - Wrap all controller methods in try-catch blocks
    - Return appropriate HTTP status codes (400, 403, 500)
    - Use errorResponse wrapper for consistent error format
    - Log all errors with context using logger utility
    - _Requirements: 11.3, 11.4_

  - [~] 8.3 Add input validation helpers
    - Create validateSendMessage function to check to, content, and length
    - Create sanitizeMessage function to escape HTML and trim whitespace
    - Apply validation before processing in socket handlers
    - _Requirements: 1.3, 1.4, 1.5, 12.1, 12.2, 12.3_

- [ ] 9. Final integration and verification
  - [~] 9.1 Verify database indexes are created
    - Check conversations collection has participantIds + updatedAt index
    - Check conversations collection has unique participantIds index
    - Check messages collection has conversationId + createdAt index
    - Check messages collection has conversationId + _id index
    - _Requirements: 13.3_

  - [~] 9.2 Test end-to-end message flow
    - Verify WebSocket connection with JWT authentication
    - Verify send_message creates conversation and message
    - Verify receive_message is delivered to recipient
    - Verify message_sent confirmation is sent to sender
    - Verify REST API returns correct conversation and message data
    - _Requirements: 1.1, 1.2, 1.6, 1.7, 9.1, 9.2, 9.3_

  - [ ]* 9.3 Write integration test for complete message flow
    - **Property 1: Message Creation and Delivery**
    - **Property 4: Operation Confirmations**
    - **Validates: Requirements 1.1, 1.6, 1.7, 9.3**

  - [~] 9.3 Verify conversation list and pagination
    - Verify conversations are ordered by updatedAt descending
    - Verify lastMessage and participant data is included
    - Verify pagination returns correct number of results
    - Verify nextCursor is provided when more results exist
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

  - [ ]* 9.4 Write integration test for conversation pagination
    - **Property 5: Conversation List Ordering**
    - **Property 6: Conversation Data Completeness**
    - **Validates: Requirements 2.1, 2.2, 2.3**

  - [~] 9.4 Verify message history and pagination
    - Verify messages are ordered chronologically (oldest first)
    - Verify pagination returns correct number of results
    - Verify nextCursor is provided when more results exist
    - Verify authorization prevents unauthorized access
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

  - [~] 9.5 Verify authentication and authorization
    - Verify JWT validation on WebSocket connections
    - Verify JWT validation on REST API requests
    - Verify participant checks prevent unauthorized access
    - Verify sender identity verification on message send
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ] 10. Final checkpoint - Complete system verification
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- The implementation uses TypeScript as specified in the design document
- All socket handlers integrate with existing Socket.IO infrastructure
- Database indexes are critical for performance and should be verified
- Property tests validate universal correctness properties from the design
- Integration tests verify end-to-end flows across components
