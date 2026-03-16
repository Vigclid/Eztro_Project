import { Request, Response } from "express";
import { ChatService } from "./chat.service";
import { responseWrapper } from "../../interfaces/wrapper/ApiResponseWrapper";

const chatService = new ChatService();

export class ChatController {
  /**
   * GET /chat/conversations
   * Query: cursor?, limit?
   * Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5, 6.2
   */
  async getConversations(req: Request, res: Response) {
    try {
      // Extract userId from authenticated request
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json(responseWrapper("error", "Unauthorized"));
      }

      // Parse cursor and limit query parameters
      const { cursor, limit } = req.query;
      const parsedLimit = limit ? parseInt(limit as string, 10) : 25;

      // Validate limit
      if (isNaN(parsedLimit) || parsedLimit < 1 || parsedLimit > 100) {
        return res.status(400).json(responseWrapper("error", "Invalid limit parameter"));
      }

      // Call chatService.getConversations
      const result = await chatService.getConversations(
        userId.toString(),
        cursor as string | undefined,
        parsedLimit
      );

      // Return success response with conversations and nextCursor
      return res.status(200).json(
        responseWrapper("success", "Conversations retrieved successfully", result)
      );
    } catch (error: any) {
      // Handle errors with appropriate HTTP status codes
      console.error("Error in getConversations:", error);
      return res.status(500).json(
        responseWrapper("error", error.message || "Internal server error")
      );
    }
  }

  /**
   * GET /chat/messages/:conversationId
   * Query: cursor?, limit?
   * Validates: Requirements 3.1, 3.2, 3.3, 3.4, 6.2, 6.3
   */
  async getMessages(req: Request, res: Response) {
    try {
      // Extract userId from authenticated request
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json(responseWrapper("error", "Unauthorized"));
      }

      // Extract conversationId from request params
      const { conversationId } = req.params;

      // Verify user is participant using isParticipant
      const isParticipant = await chatService.isParticipant(
        conversationId,
        userId.toString()
      );
      
      if (!isParticipant) {
        return res.status(403).json(responseWrapper("error", "Forbidden: Not a participant"));
      }

      // Parse cursor and limit query parameters
      const { cursor, limit } = req.query;
      const parsedLimit = limit ? parseInt(limit as string, 10) : 50;

      // Validate limit
      if (isNaN(parsedLimit) || parsedLimit < 1 || parsedLimit > 100) {
        return res.status(400).json(responseWrapper("error", "Invalid limit parameter"));
      }

      // Call chatService.getMessages
      const result = await chatService.getMessages(
        conversationId,
        cursor as string | undefined,
        parsedLimit
      );

      // Return success response with messages and nextCursor
      return res.status(200).json(
        responseWrapper("success", "Messages retrieved successfully", result)
      );
    } catch (error: any) {
      // Handle errors with appropriate HTTP status codes
      console.error("Error in getMessages:", error);
      return res.status(500).json(
        responseWrapper("error", error.message || "Internal server error")
      );
    }
  }

  /**
   * POST /chat/send
   * Body: { to: string, content: string, type?: "text" | "image" | "file" }
   * Validates: Requirements 6.1, 6.4, 12.1, 12.2, 12.3
   */
  async sendMessage(req: Request, res: Response) {
    try {
      // Extract userId from authenticated request
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json(responseWrapper("error", "Unauthorized"));
      }

      // Extract to, content, type from request body
      const { to, content, type = "text" } = req.body;

      // Validate required fields
      if (!to || !content) {
        return res.status(400).json(responseWrapper("error", "Missing required fields"));
      }

      // Validate message type
      const validTypes = ["text", "image", "file"];
      if (!validTypes.includes(type)) {
        return res.status(400).json(responseWrapper("error", "Invalid message type"));
      }

      // Validate content is string and not empty after trim
      if (typeof content !== "string" || content.trim().length === 0) {
        return res.status(400).json(responseWrapper("error", "Message content cannot be empty"));
      }

      // Validate content length (max 5000 characters)
      if (content.length > 5000) {
        return res.status(400).json(responseWrapper("error", "Message content exceeds 5000 characters"));
      }

      // Reject self-messages
      if (to === userId.toString()) {
        return res.status(400).json(responseWrapper("error", "Cannot send message to yourself"));
      }

      // Find or create conversation
      const conversation = await chatService.findOrCreateConversation(
        userId.toString(),
        to,
        true
      );

      if (!conversation) {
        return res.status(500).json(responseWrapper("error", "Failed to create conversation"));
      }

      // Create message
      const message = await chatService.createMessage(
        conversation._id.toString(),
        userId.toString(),
        content.trim(),
        type as "text" | "image" | "file"
      );

      // Return success response with message details
      return res.status(201).json(
        responseWrapper("success", "Message sent successfully", {
          messageId: message._id,
          conversationId: conversation._id,
          content: message.content,
          type: message.type,
          createdAt: message.createdAt,
        })
      );
    } catch (error: any) {
      // Handle errors with appropriate HTTP status codes
      console.error("Error in sendMessage:", error);
      return res.status(500).json(
        responseWrapper("error", error.message || "Internal server error")
      );
    }
  }

  /**
   * GET /chat/conversation/:userId
   * Validates: Requirements 6.2, 6.3
   */
  async getConversationWithUser(req: Request, res: Response) {
    try {
      // Extract userId from authenticated request
      const currentUserId = req.user?.id;
      
      if (!currentUserId) {
        return res.status(401).json(responseWrapper("error", "Unauthorized"));
      }

      // Extract target userId from request params
      const { userId } = req.params;

      // Validate userId is provided
      if (!userId) {
        return res.status(400).json(responseWrapper("error", "Missing userId parameter"));
      }

      // Find conversation (do not create if not exists)
      const conversation = await chatService.findOrCreateConversation(
        currentUserId.toString(),
        userId,
        false
      );

      // Return null if conversation doesn't exist
      if (!conversation) {
        return res.status(200).json(
          responseWrapper("success", "No conversation found", { conversation: null })
        );
      }

      // Return conversation details
      return res.status(200).json(
        responseWrapper("success", "Conversation retrieved successfully", { conversation })
      );
    } catch (error: any) {
      // Handle errors with appropriate HTTP status codes
      console.error("Error in getConversationWithUser:", error);
      return res.status(500).json(
        responseWrapper("error", error.message || "Internal server error")
      );
    }
  }
}
