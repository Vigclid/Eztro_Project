export type NotificationTarget =
  | { kind: "user"; userId: string }
  | { kind: "house"; houseId: string }
  | { kind: "all" };

export interface INotification {
  _id: string;
  type: string;
  target: NotificationTarget;
  triggeredBy?: string;
  metadata: Record<string, any>;
  status: "unread" | "read";
  sendAt: string;
}
