export const SocketRooms = {
  user: (userId: string) => `user:${userId}`,
  // Khi có module mới thêm vào đây:
  // chat: (chatId: string) => `chat:${chatId}`,
} as const;
