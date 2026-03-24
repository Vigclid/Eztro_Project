import { Socket } from "socket.io";
import { ChatService } from "./chat.service";
import { getIO } from "../../core/socket/socket.gateway";
import { SocketRooms } from "../../core/socket/socket.rooms";
import { uploadImage } from "../../utils/imageUtils";

const chatService = new ChatService();

/**
 * Escape HTML characters to prevent XSS attacks
 * Validates: Requirement 12.1
 */
function escapeHtml(text: string): string {
  const htmlEscapeMap: { [key: string]: string } = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "/": "&#x2F;",
  };
  return text.replace(/[&<>"'/]/g, (char) => htmlEscapeMap[char]);
}

/**
 * Sanitize message content
 * Validates: Requirements 12.1, 12.2
 */
function sanitizeContent(content: string): string {
  // Trim whitespace (Requirement 12.2)
  const trimmed = content.trim();
  // Escape HTML characters (Requirement 12.1)
  return escapeHtml(trimmed);
}

/**
 * Initialize chat socket event handlers
 */
export function initChatSocketHandlers(io: any) {
  io.on("connection", (socket: Socket) => {
    const userId = (socket as any).userId as string;

    /**
     * Event: send_message
     * Payload: { to: string, content: string, type?: "text" | "image" | "file", imageBase64?: string }
     * Validates: Requirements 1.1, 1.3, 1.4, 1.5, 1.6, 1.7, 6.4, 9.3, 12.1, 12.2, 12.3
     */
    socket.on(
      "send_message",
      async (data: { to: string; content: string; type?: string; imageBase64?: string }) => {
        try {
          const { to, content, type = "text", imageBase64 } = data;
          // Validate required fields (Requirement 1.1)
          if (!to || (!content && !imageBase64)) {
            socket.emit("error", { message: "Missing required fields" });
            return;
          }

          // Reject self-messages (Requirement 1.3)
          if (to === userId) {
            socket.emit("error", { message: "Cannot send message to yourself" });
            return;
          }

          let finalContent = "";
          let finalType = type;

          // Handle image messages
          if (type === "image" && imageBase64) {
            try {
              // Upload image to Cloudinary (type 5 = image_Message folder)
              const uploadResult = await uploadImage(imageBase64, 5, false);

              if (!uploadResult || !uploadResult.secure_url) {
                socket.emit("error", { message: "Failed to upload image" });
                return;
              } // Store Cloudinary URL as content
              finalContent = uploadResult.secure_url;
            } catch (uploadError: any) {
              console.error("Image upload error:", uploadError);
              socket.emit("error", { message: "Failed to upload image: " + uploadError.message });
              return;
            }
          } else {
            // For text messages, sanitize content
            finalContent = sanitizeContent(content);

            // Validate content is not empty after sanitization (Requirement 1.4)
            if (!finalContent) {
              socket.emit("error", { message: "Message content cannot be empty" });
              return;
            }
          }

          // Validate content length (Requirement 1.5)
          if (finalContent.length > 5000) {
            socket.emit("error", { message: "Message content exceeds 5000 characters" });
            return;
          }

          // Validate message type (Requirement 12.3)
          const validTypes = ["text", "image", "file"];
          if (!validTypes.includes(finalType)) {
            socket.emit("error", { message: "Invalid message type" });
            return;
          }

          // Find or create conversation (Requirement 1.2)
          const conversation = await chatService.findOrCreateConversation(userId, to, true);

          if (!conversation) {
            socket.emit("error", { message: "Failed to create conversation" });
            return;
          }

          // Create message (Requirement 1.1)
          const message = await chatService.createMessage(
            conversation._id.toString(),
            userId,
            finalContent,
            finalType as "text" | "image" | "file"
          );

          // Emit confirmation to sender (Requirement 1.6)
          socket.emit("message_sent", {
            messageId: message._id,
            conversationId: conversation._id,
            content: message.content,
            type: message.type,
            createdAt: message.createdAt,
          });

          // Also emit receive_message to sender for immediate display
          socket.emit("receive_message", {
            _id: message._id,
            messageId: message._id,
            conversationId: conversation._id,
            senderId: userId,
            content: message.content,
            type: message.type,
            status: message.status,
            createdAt: message.createdAt,
          });

          // Calculate unread count for recipient
          const unreadCount = await chatService.getUnreadCount(
            conversation._id.toString(),
            to
          );

          // Emit to recipient (Requirements 1.7, 9.3)
          getIO().to(SocketRooms.user(to)).emit("receive_message", {
            _id: message._id,
            messageId: message._id,
            conversationId: conversation._id,
            senderId: userId,
            content: message.content,
            type: message.type,
            status: message.status,
            createdAt: message.createdAt,
          });

          // Emit conversation update with unread count
          getIO().to(SocketRooms.user(to)).emit("conversation_updated", {
            conversationId: conversation._id,
            unreadCount,
          });
        } catch (error: any) {
          console.error("send_message error:", error);
          socket.emit("error", { message: "Failed to send message" });
        }
      }
    );

    /**
     * Event: message_seen
     * Payload: { conversationId: string }
     * Validates: Requirements 4.1, 4.2, 4.3
     */
    socket.on("message_seen", async (data: { conversationId: string }) => {
      try {
        const { conversationId } = data;

        // Validate conversationId is provided (Requirement 4.1)
        if (!conversationId) {
          socket.emit("error", { message: "Missing conversationId" });
          return;
        }

        // Verify user is participant (Requirement 4.3)
        const isParticipant = await chatService.isParticipant(conversationId, userId);
        if (!isParticipant) {
          socket.emit("error", { message: "Unauthorized" });
          return;
        }

        // Update lastSeen timestamp (Requirement 4.1)
        await chatService.updateLastSeen(conversationId, userId);

        // Emit confirmation (Requirement 4.2)
        socket.emit("seen_updated", { conversationId, timestamp: new Date() });
      } catch (error: any) {
        console.error("message_seen error:", error);
        socket.emit("error", { message: "Failed to update seen status" });
      }
    });

    /**
     * Event: typing
     * Payload: { conversationId: string, to: string }
     * Validates: Requirements 5.1, 5.2
     */
    socket.on("typing", async (data: { conversationId: string; to: string }) => {
      try {
        const { conversationId, to } = data;

        // Validate required fields
        if (!conversationId || !to) {
          return; // Silently ignore invalid requests
        }

        // Verify user is participant (Requirement 5.2)
        const isParticipant = await chatService.isParticipant(conversationId, userId);
        if (!isParticipant) {
          return; // Silently ignore unauthorized requests
        }

        // Emit typing event to recipient (Requirement 5.1)
        getIO().to(SocketRooms.user(to)).emit("user_typing", {
          conversationId,
          userId,
        });
      } catch (error: any) {
        // Silently ignore errors (non-critical feature)
        console.error("typing error:", error);
      }
    });
  });
}
