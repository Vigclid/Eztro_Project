import NotificationModel, { INotification } from "./notification.model";
import { NOTIFICATION_TYPES } from "./notificationTypes";
import { GenericService } from "../../core/services/base.service";
import { Types } from "mongoose";
import { sendNotificationToAll, sendNotificationToUser } from "./notification.gateway";
import { LandlordNotificationMetadata, targetMetadata } from "./notificationMetadata";
import RoomMemberModel from "../rooms/roomMember.model";
import RoomModel from "../rooms/room.model";
import UserModel from "../users/user.model";
import HouseModel from "../houses/house.model";

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
    }
  | {
      type: typeof NOTIFICATION_TYPES.LANDLORD_ALL_BROADCAST;
      target: { kind: "landlord-all" };
      triggeredBy: string; // required — landlordId
      metadata: { message: string };
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
      case "house": {
        const rooms = await RoomModel.find(
          { houseId: new Types.ObjectId(payload.target.houseId) },
          { _id: 1 }
        );
        const roomIds = rooms.map((r) => r._id);
        const members = await RoomMemberModel.find(
          { roomId: { $in: roomIds }, status: "Đang Thuê" },
          { userId: 1 }
        );
        members.forEach((m) => sendNotificationToUser(m.userId.toString(), eventData));
        break;
      }
      case "room": {
        const members = await RoomMemberModel.find(
          { roomId: new Types.ObjectId(payload.target.roomId), status: "Đang Thuê" },
          { userId: 1 }
        );
        members.forEach((m) => sendNotificationToUser(m.userId.toString(), eventData));
        break;
      }
      case "landlord-all": {
        const houses = await HouseModel.find({ landlordId: triggeredBy }, { _id: 1 });
        const houseIds = houses.map((h) => h._id);
        const rooms = await RoomModel.find({ houseId: { $in: houseIds } }, { _id: 1 });
        const roomIds = rooms.map((r) => r._id);
        const members = await RoomMemberModel.find(
          { roomId: { $in: roomIds }, status: "Đang Thuê" },
          { userId: 1 }
        );
        members.forEach((m) => sendNotificationToUser(m.userId.toString(), eventData));
        break;
      }
      case "all":
        sendNotificationToAll(eventData);
        break;
    }
  };

  private buildVisibilityFilter = async (userId: string) => {
    const userObjectId = new Types.ObjectId(userId);

    const user = await UserModel.findById(userObjectId, { createdAt: 1 });
    const userCreatedAt = user?.createdAt ?? new Date(0);

    const memberships = await RoomMemberModel.find(
      { userId: userObjectId },
      { roomId: 1, moveInDate: 1 }
    );

    const roomIds = memberships.map((m) => m.roomId as Types.ObjectId);
    const rooms = await RoomModel.find({ _id: { $in: roomIds } }, { _id: 1, houseId: 1 });
    const roomToHouse = new Map(rooms.map((r) => [r._id.toString(), r.houseId as Types.ObjectId]));

    const roomConditions = memberships.map((m) => ({
      "target.kind": "room",
      "target.roomId": m.roomId as Types.ObjectId,
      sendAt: { $gte: m.moveInDate },
    }));

    const houseMap = new Map<string, Date>();
    for (const m of memberships) {
      const houseId = roomToHouse.get((m.roomId as Types.ObjectId).toString())?.toString();
      if (!houseId) continue;
      const existing = houseMap.get(houseId);
      if (!existing || m.moveInDate < existing) houseMap.set(houseId, m.moveInDate);
    }
    const houseConditions = Array.from(houseMap.entries()).map(([houseId, moveInDate]) => ({
      "target.kind": "house",
      "target.houseId": new Types.ObjectId(houseId),
      sendAt: { $gte: moveInDate },
    }));

    // landlord-all: visible if user is/was in any house of that landlord,
    // gated by the earliest moveInDate across all that landlord's houses
    const houseIds = Array.from(houseMap.keys()).map((id) => new Types.ObjectId(id));
    const landlordHouses = await HouseModel.find(
      { _id: { $in: houseIds } },
      { _id: 1, landlordId: 1 }
    );
    const landlordMap = new Map<string, Date>();
    for (const h of landlordHouses) {
      const landlordId = (h.landlordId as Types.ObjectId).toString();
      const moveInDate = houseMap.get(h._id.toString())!;
      const existing = landlordMap.get(landlordId);
      if (!existing || moveInDate < existing) landlordMap.set(landlordId, moveInDate);
    }
    const landlordAllConditions = Array.from(landlordMap.entries()).map(
      ([landlordId, moveInDate]) => ({
        "target.kind": "landlord-all",
        triggeredBy: new Types.ObjectId(landlordId),
        sendAt: { $gte: moveInDate },
      })
    );

    return [
      { "target.kind": "user", "target.userId": userObjectId },
      { "target.kind": "all", sendAt: { $gte: userCreatedAt } },
      ...roomConditions,
      ...houseConditions,
      ...landlordAllConditions,
    ];
  };

  getByUserId = async (userId: string, cursor?: string) => {
    const limit = 20;
    const orConditions = await this.buildVisibilityFilter(userId);
    const filter: Record<string, any> = { $or: orConditions };
    if (cursor) filter._id = { $lt: new Types.ObjectId(cursor) };

    const docs = await NotificationModel.find(filter)
      .sort({ _id: -1 })
      .limit(limit + 1);

    const hasMore = docs.length > limit;
    const data = hasMore ? docs.slice(0, limit) : docs;
    const nextCursor = hasMore ? data[data.length - 1]._id.toString() : null;

    return { data, nextCursor, hasMore };
  };

  markAsReadAll = async (userId: string) => {
    const orConditions = await this.buildVisibilityFilter(userId);
    return NotificationModel.updateMany(
      { $or: orConditions, status: "unread" },
      { status: "read" }
    );
  };
  markAsRead = async (notificationId: string) => {
    return NotificationModel.findByIdAndUpdate(notificationId, { status: "read" }, { new: true });
  };
}
