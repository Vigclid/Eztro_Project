export const SocketRooms = {
  user: (userId: string) => `user:${userId}`,
  house: (houseId: string) => `house:${houseId}`,
  room: (roomId: string) => `room:${roomId}`,
  // Khi có module mới thêm vào đây:
  // chat: (chatId: string) => `chat:${chatId}`,
} as const;
