import { GenericService } from "../../core/services/base.service";
import roomModel, { IRoom } from "./room.model";
import housePackageModel from "../../modules/housePackage/housePackage.model";
import { IPackage } from "../package/package.model";
import roomInvitationModel from "./roomInvitation.model";
import roomMemberModel from "./roomMember.model";
import roomPolicyModel from "./roomPolicy.model";
import { Types } from "mongoose";
import userModel from "../users/user.model";
import houseModel from "../houses/house.model";

export class roomService extends GenericService<IRoom> {
    constructor() {
        super(roomModel);
    }

  private toObjectId = (value: string) => new Types.ObjectId(value);

  private getExpireDate = () => new Date(Date.now() + 48 * 60 * 60 * 1000);

  private generateInviteCode = () => Math.floor(100000 + Math.random() * 900000).toString();

  private normalizeRoomPolicyPayload = (policy: any = {}) => {
    const notificationTypeRaw = String(policy?.notificationType || "in-app");
    const allowedTypes = ["in-app", "mail", "zalo"];
    const notificationType = allowedTypes.includes(notificationTypeRaw)
      ? notificationTypeRaw
      : "in-app";

    return {
      description: String(policy?.description || ""),
      defaultTimeReminder: policy?.defaultTimeReminder
        ? new Date(policy.defaultTimeReminder)
        : null,
      defaultTimeReminderContent: String(policy?.defaultTimeReminderContent || ""),
      notificationType: notificationType as "in-app" | "mail" | "zalo",
      timeReminderStatus: String(policy?.timeReminderStatus || "active"),
    };
  };

    createNewRoom = async (data: Partial<IRoom>) => {
        // Đảm bảo không tạo 2 phòng trùng tên trong cùng 1 cụm trọ
        if (!data.houseId || !data.roomName) {
            throw new Error("HOUSE_ID_AND_ROOM_NAME_REQUIRED");
        }

        const existed = await roomModel.findOne({
            houseId: data.houseId,
            roomName: data.roomName,
        });

        if (existed) {
            const error: any = new Error("ROOM_NAME_ALREADY_EXISTS_IN_HOUSE");
            error.code = "ROOM_NAME_ALREADY_EXISTS_IN_HOUSE";
            throw error;
        }

        const housePackage = await housePackageModel
            .findOne({
                houseId: data.houseId,
            })
            .sort({ expirationDate: -1, createDate: -1 })
            .populate("packageId");

        const packageData = housePackage?.packageId as IPackage;

        if (!housePackage) {
            const error: any = new Error("HOUSE_PACKAGE_NOT_FOUND");
            error.code = "HOUSE_PACKAGE_NOT_FOUND";
            throw error;
        }

        if (new Date(housePackage.expirationDate) < new Date()) {
            const error: any = new Error("HOUSE_PACKAGE_EXPIRED");
            error.code = "HOUSE_PACKAGE_EXPIRED";
            throw error;
        }

        if (!packageData || typeof packageData.maxRoom !== "number") {
            const error: any = new Error("HOUSE_PACKAGE_NOT_FOUND");
            error.code = "HOUSE_PACKAGE_NOT_FOUND";
            throw error;
        }

        const countRoom = await roomModel.countDocuments({ houseId: data.houseId });
        if (countRoom >= packageData.maxRoom) {
            const error: any = new Error("ROOM_LIMIT_EXCEEDED");
            error.code = "ROOM_LIMIT_EXCEEDED";
            error.maxRoom = packageData.maxRoom;
            throw error;
        }

    const inputData: any = { ...(data as any) };
    const policyPayload = inputData.policy;
    delete inputData.policy;

    const newRoom = new roomModel({
      ...inputData,
    });
    const createdRoom = await roomModel.create(newRoom);

    if (policyPayload) {
      const normalizedPolicy = this.normalizeRoomPolicyPayload(policyPayload);
      await roomPolicyModel.findOneAndUpdate(
        { roomId: createdRoom._id },
        {
          roomId: createdRoom._id,
          houseId: inputData.houseId,
          ...normalizedPolicy,
        },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );
    }

    return createdRoom;
    };

  getAllRoomsByHouseId = async (houseId: string) => {
    return await roomModel.find({ houseId: houseId });
  };

  private ensureUserNotActiveInAnotherRoom = async (userId: string) => {
    const activeMember = await roomMemberModel.findOne({
      userId: this.toObjectId(userId),
      status: "Đang Thuê",
    });
    if (activeMember) {
      const error: any = new Error("USER_ALREADY_IN_ACTIVE_ROOM");
      error.code = "USER_ALREADY_IN_ACTIVE_ROOM";
      throw error;
    }
  };

  private createRoomMember = async (roomId: string, userId: string, invitedBy: string) => {
    const activeInRoomCount = await roomMemberModel.countDocuments({
      roomId: this.toObjectId(roomId),
      status: "Đang Thuê",
    });

    const memberRole = activeInRoomCount === 0 ? "TENANT" : "CO-TENANT";
    const member = await roomMemberModel.create({
      roomId: this.toObjectId(roomId),
      userId: this.toObjectId(userId),
      invitedBy: this.toObjectId(invitedBy),
      role: memberRole,
      status: "Đang Thuê",
      moveInDate: new Date(),
    });

    await roomModel.findByIdAndUpdate(roomId, { status: "Đang Thuê" });
    return member;
  };

  markExpiredInvitations = async () => {
    return roomInvitationModel.updateMany(
      {
        status: "Đang Chờ",
        expiresAt: { $lt: new Date() },
      },
      { status: "Hết Hạn" }
    );
  };

  createInviteCodeForRoom = async (roomId: string, createdBy: string) => {
    const room = await roomModel.findById(roomId);
    if (!room) {
      const error: any = new Error("ROOM_NOT_FOUND");
      error.code = "ROOM_NOT_FOUND";
      throw error;
    }

    await this.markExpiredInvitations();
    await roomInvitationModel.updateMany(
      {
        roomId: this.toObjectId(roomId),
        inviteCode: { $type: "string" },
        status: "Đang Chờ",
      },
      { status: "Hết Hạn" }
    );

    let inviteCode = this.generateInviteCode();
    let existedCode = await roomInvitationModel.findOne({ inviteCode });
    while (existedCode) {
      inviteCode = this.generateInviteCode();
      existedCode = await roomInvitationModel.findOne({ inviteCode });
    }

    return roomInvitationModel.create({
      roomId: this.toObjectId(roomId),
      inviteCode,
      invitedUserId: null,
      createdBy: this.toObjectId(createdBy),
      status: "Đang Chờ",
      expiresAt: this.getExpireDate(),
    });
  };

  inviteTenantToRoom = async (roomId: string, invitedUserId: string, createdBy: string) => {
    const room = await roomModel.findById(roomId);
    if (!room) {
      const error: any = new Error("ROOM_NOT_FOUND");
      error.code = "ROOM_NOT_FOUND";
      throw error;
    }

    const invitedUser = await userModel.findById(invitedUserId).populate("roleId");
    const invitedRole = (invitedUser?.roleId as any)?.name;
    if (!invitedUser || invitedRole !== "Tenant") {
      const error: any = new Error("INVITED_USER_NOT_TENANT");
      error.code = "INVITED_USER_NOT_TENANT";
      throw error;
    }

    await this.ensureUserNotActiveInAnotherRoom(invitedUserId);
    await this.markExpiredInvitations();

    const pending = await roomInvitationModel.findOne({
      roomId: this.toObjectId(roomId),
      invitedUserId: this.toObjectId(invitedUserId),
      status: "Đang Chờ",
    });
    if (pending) {
      const error: any = new Error("INVITATION_ALREADY_PENDING");
      error.code = "INVITATION_ALREADY_PENDING";
      throw error;
    }

    return roomInvitationModel.create({
      roomId: this.toObjectId(roomId),
      invitedUserId: this.toObjectId(invitedUserId),
      createdBy: this.toObjectId(createdBy),
      status: "Đang Chờ",
      expiresAt: this.getExpireDate(),
    });
  };

  joinRoomByCode = async (inviteCode: string, userId: string) => {
    await this.markExpiredInvitations();
    await this.ensureUserNotActiveInAnotherRoom(userId);

    const invitation = await roomInvitationModel.findOne({
      inviteCode,
      status: "Đang Chờ",
      expiresAt: { $gt: new Date() },
    });
    if (!invitation) {
      const error: any = new Error("INVALID_OR_EXPIRED_CODE");
      error.code = "INVALID_OR_EXPIRED_CODE";
      throw error;
    }

    await this.createRoomMember(String(invitation.roomId), userId, String(invitation.createdBy));

    invitation.status = "Đã Chấp Nhận";
    await invitation.save();

    return this.getActiveRoomOfUser(userId);
  };

  getPendingInvitationsOfTenant = async (userId: string) => {
    await this.markExpiredInvitations();
    return roomInvitationModel
      .find({
        invitedUserId: this.toObjectId(userId),
        status: "Đang Chờ",
        expiresAt: { $gt: new Date() },
      })
      .sort({ createdAt: -1 })
      .populate({
        path: "roomId",
        populate: { path: "houseId" },
      })
      .populate("createdBy", "firstName lastName phoneNumber");
  };

  acceptInvitation = async (invitationId: string, userId: string) => {
    await this.markExpiredInvitations();
    await this.ensureUserNotActiveInAnotherRoom(userId);

    const invitation = await roomInvitationModel.findById(invitationId);
    if (!invitation) {
      const error: any = new Error("INVITATION_NOT_FOUND");
      error.code = "INVITATION_NOT_FOUND";
      throw error;
    }
    if (String(invitation.invitedUserId) !== userId) {
      const error: any = new Error("INVITATION_FORBIDDEN");
      error.code = "INVITATION_FORBIDDEN";
      throw error;
    }
    if (invitation.status !== "Đang Chờ" || invitation.expiresAt <= new Date()) {
      invitation.status = "Hết Hạn";
      await invitation.save();
      const error: any = new Error("INVITATION_EXPIRED");
      error.code = "INVITATION_EXPIRED";
      throw error;
    }

    await this.createRoomMember(String(invitation.roomId), userId, String(invitation.createdBy));
    invitation.status = "Đã Chấp Nhận";
    await invitation.save();

    return this.getActiveRoomOfUser(userId);
  };

  getActiveRoomOfUser = async (userId: string) => {
    const roomMember = await roomMemberModel
      .findOne({
        userId: this.toObjectId(userId),
        status: "Đang Thuê",
      })
      .sort({ createdAt: -1 })
      .populate({
        path: "roomId",
        populate: { path: "houseId" },
      })
      .populate("invitedBy", "firstName lastName phoneNumber");

    if (!roomMember) return null;

    const room: any = roomMember.roomId;
    const house: any = room?.houseId;
    const landlord: any = roomMember.invitedBy;
    const roomPolicy: any = room?._id
      ? await roomPolicyModel.findOne({
          roomId: this.toObjectId(String(room._id)),
        })
      : null;

    return {
      roomMemberId: roomMember._id,
      role: roomMember.role,
      moveInDate: roomMember.moveInDate,
      status: roomMember.status,
      room: {
        _id: room?._id,
        roomName: room?.roomName,
        rentalFee: room?.rentalFee,
        rentalDate: room?.rentalDate,
        status: room?.status,
      },
      house: {
        _id: house?._id,
        houseName: house?.houseName,
        address: house?.address,
      },
      landlord: {
        _id: landlord?._id,
        fullName: `${landlord?.lastName || ""} ${landlord?.firstName || ""}`.trim(),
        phoneNumber: landlord?.phoneNumber,
      },
      policy: roomPolicy
        ? {
            description: roomPolicy.description || "",
            defaultTimeReminder: roomPolicy.defaultTimeReminder || null,
            defaultTimeReminderContent: roomPolicy.defaultTimeReminderContent || "",
            notificationType: roomPolicy.notificationType || "in-app",
            timeReminderStatus: roomPolicy.timeReminderStatus || "active",
          }
        : null,
    };
  };

  removeMemberByLandlord = async (roomMemberId: string, landlordId: string) => {
    const roomMember = await roomMemberModel.findById(roomMemberId);
    if (!roomMember) {
      const error: any = new Error("ROOM_MEMBER_NOT_FOUND");
      error.code = "ROOM_MEMBER_NOT_FOUND";
      throw error;
    }

    if (roomMember.status !== "Đang Thuê") {
      const error: any = new Error("ROOM_MEMBER_ALREADY_LEFT");
      error.code = "ROOM_MEMBER_ALREADY_LEFT";
      throw error;
    }

    const room = await roomModel.findById(roomMember.roomId);
    if (!room) {
      const error: any = new Error("ROOM_NOT_FOUND");
      error.code = "ROOM_NOT_FOUND";
      throw error;
    }

    const house = await houseModel.findById(room.houseId);
    if (!house) {
      const error: any = new Error("HOUSE_NOT_FOUND");
      error.code = "HOUSE_NOT_FOUND";
      throw error;
    }

    if (String(house.landlordId) !== landlordId) {
      const error: any = new Error("LANDLORD_FORBIDDEN");
      error.code = "LANDLORD_FORBIDDEN";
      throw error;
    }

    roomMember.status = "Đã Rời Phòng";
    roomMember.moveOutDate = new Date();
    await roomMember.save();

    // Nếu tenant chính rời phòng thì promote CO-TENANT sớm nhất lên TENANT
    if (roomMember.role === "TENANT") {
      const nextTenant = await roomMemberModel
        .findOne({
          roomId: roomMember.roomId,
          status: "Đang Thuê",
          role: "CO-TENANT",
        })
        .sort({ moveInDate: 1, createdAt: 1 });

      if (nextTenant) {
        nextTenant.role = "TENANT";
        await nextTenant.save();
      }
    }

    const activeCount = await roomMemberModel.countDocuments({
      roomId: roomMember.roomId,
      status: "Đang Thuê",
    });
    if (activeCount === 0) {
      await roomModel.findByIdAndUpdate(roomMember.roomId, { status: "Còn Trống" });
    }

    return roomMember;
  };

  getRoomMembersByLandlord = async (roomId: string, landlordId: string) => {
    const room = await roomModel.findById(roomId);
    if (!room) {
      const error: any = new Error("ROOM_NOT_FOUND");
      error.code = "ROOM_NOT_FOUND";
      throw error;
    }

    const house = await houseModel.findById(room.houseId);
    if (!house) {
      const error: any = new Error("HOUSE_NOT_FOUND");
      error.code = "HOUSE_NOT_FOUND";
      throw error;
    }

    if (String(house.landlordId) !== landlordId) {
      const error: any = new Error("LANDLORD_FORBIDDEN");
      error.code = "LANDLORD_FORBIDDEN";
      throw error;
    }

    return roomMemberModel
      .find({
        roomId: this.toObjectId(roomId),
        status: "Đang Thuê",
      })
      .sort({ moveInDate: 1, createdAt: 1 })
      .populate("userId", "firstName lastName phoneNumber email");
  };

  getRoomPolicyByLandlord = async (roomId: string, landlordId: string) => {
    const room = await roomModel.findById(roomId);
    if (!room) {
      const error: any = new Error("ROOM_NOT_FOUND");
      error.code = "ROOM_NOT_FOUND";
      throw error;
    }

    const house = await houseModel.findById(room.houseId);
    if (!house) {
      const error: any = new Error("HOUSE_NOT_FOUND");
      error.code = "HOUSE_NOT_FOUND";
      throw error;
    }

    if (String(house.landlordId) !== landlordId) {
      const error: any = new Error("LANDLORD_FORBIDDEN");
      error.code = "LANDLORD_FORBIDDEN";
      throw error;
    }

    return roomPolicyModel.findOne({ roomId: this.toObjectId(roomId) });
  };

  updateRoomPolicyByLandlord = async (roomId: string, landlordId: string, payload: any) => {
    const room = await roomModel.findById(roomId);
    if (!room) {
      const error: any = new Error("ROOM_NOT_FOUND");
      error.code = "ROOM_NOT_FOUND";
      throw error;
    }

    const house = await houseModel.findById(room.houseId);
    if (!house) {
      const error: any = new Error("HOUSE_NOT_FOUND");
      error.code = "HOUSE_NOT_FOUND";
      throw error;
    }

    if (String(house.landlordId) !== landlordId) {
      const error: any = new Error("LANDLORD_FORBIDDEN");
      error.code = "LANDLORD_FORBIDDEN";
      throw error;
    }

    const normalizedPolicy = this.normalizeRoomPolicyPayload(payload || {});

    return roomPolicyModel.findOneAndUpdate(
      { roomId: this.toObjectId(roomId) },
      {
        roomId: this.toObjectId(roomId),
        houseId: room.houseId,
        ...normalizedPolicy,
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
  };

    updateRoom = async (roomId: string, data: Partial<IRoom>) => {
        const existing = await roomModel.findById(roomId);
        if (!existing) {
            const error: any = new Error("ROOM_NOT_FOUND");
            error.code = "ROOM_NOT_FOUND";
            throw error;
        }
        const targetHouseId = (data.houseId as any) || existing.houseId;
        const targetRoomName = (data.roomName as any) || existing.roomName;

        if (!targetHouseId || !targetRoomName) {
            return await roomModel.findByIdAndUpdate(roomId, data, { new: true });
        }

        const duplicate = await roomModel.findOne({
            houseId: targetHouseId,
            roomName: targetRoomName,
            _id: { $ne: roomId },
        });

        if (duplicate) {
            const error: any = new Error("ROOM_NAME_ALREADY_EXISTS_IN_HOUSE");
            error.code = "ROOM_NAME_ALREADY_EXISTS_IN_HOUSE";
            throw error;
        }

        return await roomModel.findByIdAndUpdate(roomId, data, { new: true });
    };
}
