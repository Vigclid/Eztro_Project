import { Router } from "express";
import { authenticate } from "../../middlewares/authMiddleware";
import { ChatController } from "./chat.controller";

const router = Router();
const chatController = new ChatController();

// GET /v1/chat/conversations - Get all conversations for authenticated user
router.get("/chat/conversations", authenticate, chatController.getConversations.bind(chatController));

// GET /v1/chat/conversations/:conversationId/messages - Get messages for a conversation
router.get("/chat/conversations/:conversationId/messages", authenticate, chatController.getMessages.bind(chatController));

// POST /v1/chat/messages - Send a message
router.post("/chat/messages", authenticate, chatController.sendMessage.bind(chatController));

// GET /v1/chat/conversations/user/:userId - Get conversation with specific user (check if exists)
router.get("/chat/conversations/user/:userId", authenticate, chatController.getConversationWithUser.bind(chatController));

// POST /v1/chat/conversations/user/:userId - Create conversation with specific user
router.post("/chat/conversations/user/:userId", authenticate, chatController.createConversationWithUser.bind(chatController));

export default router;
