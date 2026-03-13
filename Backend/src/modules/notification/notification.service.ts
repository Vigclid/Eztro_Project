import NotificationModel, { INotification } from "./notification.model";
import { NOTIFICATION_TYPES } from "./notificationTypes";
import { GenericService } from "../../core/services/base.service";
import { Types } from "mongoose";
import {
  sendNotificationToAll,
  sendNotificationToHouse,
  sendNotificationToUser,
} from "./notification.gateway";
import { LandlordNotificationMetadata, targetMetadata } from "./notificationMetadata";

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
    }
  | {
      type: typeof NOTIFICATION_TYPES.LANDLORD_RULE_UPDATE;
      target: targetMetadata;
      triggeredBy?: string;
      metadata: LandlordNotificationMetadata;
    }
  | {
      type: typeof NOTIFICATION_TYPES.LANDLORD_BROADCAST;
      target: targetMetadata;
      triggeredBy?: string;
      metadata: LandlordNotificationMetadata;
    };
// Thêm type mới → chỉ cần thêm vào đây

// ─────────────────────────────────────────────────────────────────────

export class notificationService extends GenericService<INotification> {
  constructor() {
    super(NotificationModel);
  }
  send = async (payload: NotificationPayload): Promise<void> => {
    // Cast string IDs to ObjectId before persisting
    const target = (() => {
      const t = payload.target;
      if (t.kind === "user") return { kind: "user", userId: new Types.ObjectId(t.userId) };
      if (t.kind === "house") return { kind: "house", houseId: new Types.ObjectId(t.houseId) };
      if (t.kind === "room") return { kind: "room", roomId: new Types.ObjectId(t.roomId) };
      return t;
    })();

    const triggeredBy =
      "triggeredBy" in payload && payload.triggeredBy
        ? new Types.ObjectId(payload.triggeredBy)
        : undefined;

    const doc = await NotificationModel.create({
      type: payload.type,
      target,
      triggeredBy,
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

    switch (payload.target.kind) {
      case "user":
        sendNotificationToUser(payload.target.userId!, eventData);
        break;
      case "house":
        sendNotificationToHouse(payload.target.houseId!, eventData);
        break;
      case "all":
        sendNotificationToAll(eventData);
        break;
    }
  };

  getByUserId = async (userId: string, cursor?: string) => {
    const limit = 20;
    const filter: Record<string, any> = {
      $or: [
        { "target.kind": "user", "target.userId": new Types.ObjectId(userId) },
        { "target.kind": "all" },
      ],
    };
    if (cursor) {
      filter._id = { $lt: new Types.ObjectId(cursor) };
    }
    const docs = await NotificationModel.find(filter)
      .sort({ _id: -1 })
      .limit(limit + 1);

    const hasMore = docs.length > limit;
    const data = hasMore ? docs.slice(0, limit) : docs;
    const nextCursor = hasMore ? data[data.length - 1]._id.toString() : null;

    return { data, nextCursor, hasMore };
  };

  markAsRead = async (notificationId: string) => {
    return NotificationModel.findByIdAndUpdate(notificationId, { status: "read" }, { new: true });
  };

  markAsReadAll = async (userId: string) => {
    return NotificationModel.updateMany(
      {
        $or: [
          { "target.kind": "user", "target.userId": new Types.ObjectId(userId) },
          { "target.kind": "house" },
          { "target.kind": "all" },
        ],
        status: "unread",
      },
      { status: "read" }
    );
  };
}
