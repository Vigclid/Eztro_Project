import { Types } from "mongoose";
import ConversationModel, { IConversation, IParticipant } from "./conversation.model";
import MessageModel, { IMessage } from "./message.model";
import userModel from "../users/user.model";

export class ChatService {
  /**
   * Find or create a direct conversation between two users
   * Validates: Requirements 1.2, 2.6, 8.3
   */
  async findOrCreateConversation(
    userId1: string,
    userId2: string,
    createIfNotExists: boolean = false
  ): Promise<IConversation | null> {
    try {
      // Sort participantIds to ensure consistent ordering
      const participantIds = [new Types.ObjectId(userId1), new Types.ObjectId(userId2)].sort(
        (a, b) => a.toString().localeCompare(b.toString())
      );

      // Query for existing conversation using $all and $size operators
      let conversation = await ConversationModel.findOne({
        participantIds: { $all: participantIds, $size: 2 },
      });

      // Fetch user details and create conversation only if createIfNotExists is true
      if (!conversation && createIfNotExists) {
        const users = await userModel
          .find({
            _id: { $in: participantIds },
          })
          .select("firstName lastName profilePicture");

        if (users.length !== 2) {
          console.error("findOrCreateConversation - could not find both users");
          console.error("findOrCreateConversation - expected 2 users, found:", users.length);
          console.error(
            "findOrCreateConversation - looking for userIds:",
            participantIds.map((id) => id.toString())
          );
          throw new Error(`Could not find both users. Found ${users.length} out of 2 users.`);
        }

        const participants: IParticipant[] = users.map((user) => ({
          userId: user._id,
          firstName: user.firstName || "Unknown",
          lastName: user.lastName || "",
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
    } catch (error: any) {
      console.error("findOrCreateConversation - error:", error);
      console.error("findOrCreateConversation - error stack:", error.stack);
      throw error;
    }
  }

  /**
   * Create a new message and update conversation
   * Validates: Requirements 1.1, 10.1, 10.3
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

    // Update conversation's lastMessage and updatedAt atomically
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
   * Get unread message count for a user in a conversation
   */
  async getUnreadCount(conversationId: string, userId: string): Promise<number> {
    const conversation = await ConversationModel.findById(conversationId);
    if (!conversation) return 0;

    // Find user's participant info
    const participant = conversation.participants?.find(
      (p) => p.userId.toString() === userId
    );

    const lastSeen = participant?.lastSeen;
    
    if (!lastSeen) {
      // Never seen, count all messages not from this user
      return await MessageModel.countDocuments({
        conversationId: new Types.ObjectId(conversationId),
        senderId: { $ne: new Types.ObjectId(userId) }
      });
    }

    // Count messages after lastSeen and not from this user
    return await MessageModel.countDocuments({
      conversationId: new Types.ObjectId(conversationId),
      senderId: { $ne: new Types.ObjectId(userId) },
      createdAt: { $gt: lastSeen }
    });
  }

  /**
   * Get conversations for a user with cursor-based pagination
   * Validates: Requirements 2.1, 2.4, 2.5, 13.1
   */
  async getConversations(
    userId: string,
    cursor?: string,
    limit: number = 25
  ): Promise<{ conversations: any[]; nextCursor: string | null }> {
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

    // Add unreadCount to each conversation
    const conversationsWithUnread = await Promise.all(
      results.map(async (conv) => {
        const unreadCount = await this.getUnreadCount(conv._id.toString(), userId);
        return {
          ...conv.toObject(),
          unreadCount
        };
      })
    );

    return { conversations: conversationsWithUnread, nextCursor };
  }

  /**
   * Get messages for a conversation with cursor-based pagination
   * Validates: Requirements 3.1, 3.2, 3.3, 13.2
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
   * Validates: Requirements 4.1, 10.4
   */
  async updateLastSeen(conversationId: string, userId: string): Promise<void> {
    await ConversationModel.updateOne(
      {
        _id: new Types.ObjectId(conversationId),
        "participants.userId": new Types.ObjectId(userId),
      },
      {
        $set: { "participants.$.lastSeen": new Date() },
      }
    );
  }

  /**
   * Check if user is participant in conversation
   * Validates: Requirements 6.3
   */
  async isParticipant(conversationId: string, userId: string): Promise<boolean> {
    const conversation = await ConversationModel.findOne({
      _id: new Types.ObjectId(conversationId),
      participantIds: new Types.ObjectId(userId),
    });
    return !!conversation;
  }

  /**
   * Get single conversation by ID
   * Validates: Requirements 6.3
   */
  async getConversationById(conversationId: string): Promise<IConversation | null> {
    return ConversationModel.findById(conversationId);
  }
}
