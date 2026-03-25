export const SocketRooms = {
  user: (userId: string) => `user:${userId}`,
  conversation: (conversationId: string) => `conversation:${conversationId}`,
  // Khi có module mới thêm vào đây:
  // chat: (chatId: string) => `chat:${chatId}`,
} as const;
