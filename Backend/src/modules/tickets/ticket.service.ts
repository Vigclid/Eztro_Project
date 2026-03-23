import { GenericService } from "../../core/services/base.service";
import TicketModel, { ITicket } from "./ticket.model";
import RoomModel from "../rooms/room.model";
import HouseModel from "../houses/house.model";
import RoomMemberModel from "../rooms/roomMember.model";
import { Types } from "mongoose";

export class TicketService extends GenericService<ITicket> {
  constructor() {
    super(TicketModel);
  }

  // Lấy tất cả tickets với populate
  async getAllPopulated() {
    return TicketModel.find()
      .populate("senderId", "firstName lastName email profilePicture")
      .populate("receiverId", "firstName lastName email profilePicture")
      .populate("houseId", "houseName address")
      .populate("roomId", "roomName")
      .populate("replies.userId", "firstName lastName email profilePicture")
      .sort({ createdAt: -1 });
  }

  // Lấy ticket theo ID với populate
  async getByIdPopulated(id: string) {
    return TicketModel.findById(id)
      .populate("senderId", "firstName lastName email profilePicture")
      .populate("receiverId", "firstName lastName email profilePicture")
      .populate("houseId", "houseName address")
      .populate("roomId", "roomName")
      .populate("replies.userId", "firstName lastName email profilePicture");
  }

  // Tenant tạo ticket - tự động tìm house và room từ userId
  async createTicketByTenant(
    userId: string,
    data: { title: string; description: string; categories: string[] }
  ) {
    // Convert userId to ObjectId
    const userObjectId = new Types.ObjectId(userId);

    // Tìm room member record của tenant (status = "Đang Thuê")
    const roomMember = await RoomMemberModel.findOne({
      userId: userObjectId,
      status: "Đang Thuê",
    }).populate("roomId");

    if (!roomMember) {
      throw new Error("Bạn chưa tham gia phòng nào");
    }

    const room = roomMember.roomId as any;
    if (!room) {
      throw new Error("Không tìm thấy phòng của bạn");
    }

    const house = await HouseModel.findById(room.houseId);
    if (!house) {
      throw new Error("Không tìm thấy cụm trọ");
    }

    const ticket = await TicketModel.create({
      title: data.title,
      description: data.description,
      categories: data.categories,
      senderId: userObjectId,
      receiverId: house.landlordId,
      houseId: house._id,
      roomId: room._id,
      status: "pending",
    });

    return this.getByIdPopulated(ticket._id.toString());
  }

  // Landlord tạo ticket
  async createTicketByLandlord(
    landlordId: string,
    data: {
      title: string;
      description: string;
      categories: string[];
      houseId: string;
      roomId: string;
    }
  ) {
    // Convert landlordId string to ObjectId for comparison
    const landlordObjectId = new Types.ObjectId(landlordId);

    // Kiểm tra house có thuộc landlord không
    const house = await HouseModel.findOne({
      _id: data.houseId,
      landlordId: landlordObjectId,
    });

    if (!house) {
      throw new Error("Cụm trọ không tồn tại hoặc không thuộc quyền quản lý của bạn");
    }

    // Kiểm tra room có thuộc house không
    const room = await RoomModel.findOne({
      _id: data.roomId,
      houseId: data.houseId,
    });

    if (!room) {
      throw new Error("Phòng không tồn tại trong cụm trọ này");
    }

    // Tìm tenant trong room (lấy user đầu tiên nếu có nhiều)
    // Nếu không có tenant thực, có thể gửi cho chính landlord
    const ticket = await TicketModel.create({
      title: data.title,
      description: data.description,
      categories: data.categories,
      senderId: landlordObjectId,
      receiverId: landlordObjectId, // Có thể điều chỉnh logic này
      houseId: data.houseId,
      roomId: data.roomId,
      status: "pending",
    });

    const populatedTicket = await this.getByIdPopulated(ticket._id.toString());

    return populatedTicket;
  }

  // Lấy tickets của landlord (tất cả tickets trong các house của họ)
  async getTicketsByLandlord(landlordId: string) {
    const landlordObjectId = new Types.ObjectId(landlordId);
    const houses = await HouseModel.find({ landlordId: landlordObjectId });
    const houseIds = houses.map((h) => h._id);

    return TicketModel.find({ houseId: { $in: houseIds } })
      .populate("senderId", "firstName lastName email profilePicture")
      .populate("receiverId", "firstName lastName email profilePicture")
      .populate("houseId", "houseName address")
      .populate("roomId", "roomName")
      .populate("replies.userId", "firstName lastName email profilePicture")
      .sort({ createdAt: -1 });
  }

  // Lấy tickets của tenant (tickets mà họ đã tạo)
  async getTicketsByTenant(tenantId: string) {
    return TicketModel.find({ senderId: tenantId })
      .populate("senderId", "firstName lastName email profilePicture")
      .populate("receiverId", "firstName lastName email profilePicture")
      .populate("houseId", "houseName address")
      .populate("roomId", "roomName")
      .populate("replies.userId", "firstName lastName email profilePicture")
      .sort({ createdAt: -1 });
  }

  // Thêm reply vào ticket
  async addReply(ticketId: string, userId: string, content: string) {
    const ticket = await TicketModel.findByIdAndUpdate(
      ticketId,
      {
        $push: {
          replies: {
            userId: new Types.ObjectId(userId),
            content: content,
            createdAt: new Date(),
          },
        },
      },
      { new: true }
    );

    if (!ticket) {
      throw new Error("Ticket không tồn tại");
    }

    return this.getByIdPopulated(ticketId);
  }

  // Cập nhật status của ticket
  async updateStatus(ticketId: string, status: "pending" | "processing" | "completed") {
    const ticket = await TicketModel.findByIdAndUpdate(ticketId, { status: status }, { new: true });

    if (!ticket) {
      throw new Error("Ticket không tồn tại");
    }

    return this.getByIdPopulated(ticketId);
  }

  // Lấy tickets theo house
  async getTicketsByHouse(houseId: string) {
    return TicketModel.find({ houseId: houseId })
      .populate("senderId", "firstName lastName email profilePicture")
      .populate("receiverId", "firstName lastName email profilePicture")
      .populate("houseId", "houseName address")
      .populate("roomId", "roomName")
      .populate("replies.userId", "firstName lastName email profilePicture")
      .sort({ createdAt: -1 });
  }

  // Lấy tickets theo room
  async getTicketsByRoom(roomId: string) {
    return TicketModel.find({ roomId: roomId })
      .populate("senderId", "firstName lastName email profilePicture")
      .populate("receiverId", "firstName lastName email profilePicture")
      .populate("houseId", "houseName address")
      .populate("roomId", "roomName")
      .populate("replies.userId", "firstName lastName email profilePicture")
      .sort({ createdAt: -1 });
  }

  // Mark replies as read
  async markRepliesAsRead(ticketId: string, userId: string) {
    const ticket = await TicketModel.findById(ticketId);
    if (!ticket) {
      throw new Error("Ticket không tồn tại");
    }

    // Mark all replies from other users as read
    ticket.replies.forEach((reply) => {
      if (reply.userId.toString() !== userId) {
        reply.isRead = true;
      }
    });

    await ticket.save();
    return this.getByIdPopulated(ticketId);
  }

  // Get unread count for a ticket (for a specific user)
  async getUnreadCount(ticketId: string, userId: string) {
    const ticket = await TicketModel.findById(ticketId);
    if (!ticket) {
      return 0;
    }

    // Count replies from other users that are not read
    const unreadCount = ticket.replies.filter((reply) => {
      return reply.userId.toString() !== userId && !reply.isRead;
    }).length;

    return unreadCount;
  }
}
