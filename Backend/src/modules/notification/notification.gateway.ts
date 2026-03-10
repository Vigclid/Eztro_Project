import { emitToUser, emitToHouse, emitToAll } from "../../core/socket/socket.gateway";

export const NOTIFICATION_EVENT = "notification";

export function sendNotificationToUser(userId: string, data: unknown) {
  emitToUser(userId, NOTIFICATION_EVENT, data);
}

export function sendNotificationToHouse(houseId: string, data: unknown) {
  emitToHouse(houseId, NOTIFICATION_EVENT, data);
}

export function sendNotificationToAll(data: unknown) {
  emitToAll(NOTIFICATION_EVENT, data);
}
