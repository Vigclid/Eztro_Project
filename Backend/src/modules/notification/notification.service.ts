import NotificationModel, { INotification } from "./notification.model";
import { NOTIFICATION_TYPES } from "./notificationTypes";
import { GenericService } from "../../core/services/base.service";
import { Types } from "mongoose";
import {
  sendNotificationToAll,
  sendNotificationToHouse,
  sendNotificationToUser,
} from "./notification.gateway";

// ─── Typed payload cho từng loại notification ───────────────────────
export type NotificationPayload =
  | {
      type: typeof NOTIFICATION_TYPES.LANDLORD_INVOICE;
      target: { kind: "user"; userId: string };
      triggeredBy?: string;
      metadata: { invoiceId: string; amount: number; roomId: string };
    }
  | {
      type: typeof NOTIFICATION_TYPES.LANDLORD_BROADCAST;
      target: { kind: "house"; houseId: string };
      triggeredBy?: string;
      metadata: { message: string; houseId: string };
    }
  | {
      type: typeof NOTIFICATION_TYPES.SYSTEM_ANNOUNCEMENT;
      target: { kind: "all" };
      metadata: { message: string };
    }
  | {
      type: typeof NOTIFICATION_TYPES.PAYMENT_DUE;
      target: { kind: "user"; userId: string };
      metadata: { invoiceId: string; dueDate: string; amount: number };
    }
  | {
      type: typeof NOTIFICATION_TYPES.INTERACTION_COMMENT;
      target: { kind: "user"; userId: string };
      triggeredBy?: string;
      metadata: { postId: string; commentId: string; preview: string };
    };
// Thêm type mới → chỉ cần thêm vào đây

// ─────────────────────────────────────────────────────────────────────

export class notificationService extends GenericService<INotification> {
  constructor() {
    super(NotificationModel);
  }

  /**
   * @example
   * // Trong invoice.service.ts sau khi tạo invoice:
   * await notificationService.send({
   *   type: NOTIFICATION_TYPES.LANDLORD_INVOICE,
   *   target: { kind: 'user', userId: tenant._id.toString() },
   *   triggeredBy: landlordId,
   *   metadata: { invoiceId: invoice._id, amount: 500000, roomId: room._id }
   * });
   */
  send = async (payload: NotificationPayload): Promise<void> => {
    // 1. Lưu vào MongoDB
    const doc = await NotificationModel.create({
      type: payload.type,
      target: payload.target,
      triggeredBy: "triggeredBy" in payload ? payload.triggeredBy : undefined,
      metadata: payload.metadata,
    });

    const eventData = {
      _id: doc._id,
      type: doc.type,
      metadata: doc.metadata,
      triggeredBy: doc.triggeredBy,
      sendAt: doc.sendAt,
      status: doc.status,
    };

    // 2. Emit socket theo target
    switch (payload.target.kind) {
      case "user":
        sendNotificationToUser(payload.target.userId, eventData);
        break;
      case "house":
        sendNotificationToHouse(payload.target.houseId, eventData);
        break;
      case "all":
        sendNotificationToAll(eventData);
        break;
    }
  };

  getByUserId = async (userId: string) => {
    return NotificationModel.find({
      $or: [
        { "target.kind": "user", "target.userId": new Types.ObjectId(userId) },
        { "target.kind": "house", "target.houseId": /* user's houseId */ null },
        { "target.kind": "all" },
      ],
    })
      .sort({ sendAt: -1 })
      .limit(50);
  };

  markAsRead = async (notificationId: string) => {
    return NotificationModel.findByIdAndUpdate(notificationId, { status: "read" }, { new: true });
  };

  markAsReadAll = async (userId: string) => {
    return NotificationModel.updateMany(
      {
        $or: [
          { "target.kind": "user",  "target.userId": new Types.ObjectId(userId) },
          { "target.kind": "house" },
          { "target.kind": "all" },
        ],
        status: "unread",
      },
      { status: "read" }
    );
  };
}
