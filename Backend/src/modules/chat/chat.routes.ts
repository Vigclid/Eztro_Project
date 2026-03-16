import { Router } from "express";
import { authenticate } from "../../middlewares/authMiddleware";
import { ChatController } from "./chat.controller";

const router = Router();
const chatController = new ChatController();

// GET /chat/conversations - Get all conversations for authenticated user
router.get("/conversations", authenticate, chatController.getConversations.bind(chatController));

// GET /chat/messages/:conversationId - Get messages for a conversation
router.get("/messages/:conversationId", authenticate, chatController.getMessages.bind(chatController));

// POST /chat/send - Send a message
router.post("/send", authenticate, chatController.sendMessage.bind(chatController));

// GET /chat/conversation/:userId - Get conversation with specific user
router.get("/conversation/:userId", authenticate, chatController.getConversationWithUser.bind(chatController));

export default router;
