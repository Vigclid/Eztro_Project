import { apiService } from "../../service/apiService";

const roomApi = "v1/rooms/";

export const getRoomApi = {
  async getAllRoomsByHouseId(houseId: string | undefined) {
    try {
      const res = await apiService.get(`${roomApi}house/${houseId}`);
      return res.data;
    } catch (err: any) {
      throw err;
    }
  },

  async getMyInvitations() {
    try {
      const res = await apiService.get(`${roomApi}invitations/my`);
      return res.data;
    } catch (err: any) {
      throw err;
    }
  },

  async getMyActiveRoom() {
    try {
      const res = await apiService.get(`${roomApi}my-room`);
      return res.data;
    } catch (err: any) {
      throw err;
    }
  },

  async getRoomMembers(roomId: string) {
    try {
      const res = await apiService.get(`${roomApi}${roomId}/members`);
      return res.data;
    } catch (err: any) {
      throw err;
    }
  },

  async getRoomPolicy(roomId: string) {
    try {
      const res = await apiService.get(`${roomApi}${roomId}/policy`);
      return res.data;
    } catch (err: any) {
      throw err;
    }
  },
};

export const postRoomApi = {
  async createRoom(roomData: any) {
    try {
      const res = await apiService.post(roomApi, roomData);
      return res.data;
    } catch (err: any) {
      throw err;
    }
  },

  async updateRoom(roomId: string, roomData: any) {
    try {
      const res = await apiService.patch(`${roomApi}${roomId}`, roomData);
      return res.data;
    } catch (err: any) {
      throw err;
    }
  },

  async createInviteCode(roomId: string) {
    try {
      const res = await apiService.post(`${roomApi}invite-code/${roomId}`);
      return (
        res.data || {
          status: "error",
          message: res?.error?.message || "Không thể tạo mã mời lúc này.",
        }
      );
    } catch (err: any) {
      throw err;
    }
  },

  async inviteTenant(roomId: string, invitedUserId: string) {
    try {
      const res = await apiService.post(`${roomApi}invite`, {
        roomId,
        invitedUserId,
      });
      return (
        res.data || {
          status: "error",
          message: res?.error?.message || "Không thể gửi lời mời lúc này.",
        }
      );
    } catch (err: any) {
      throw err;
    }
  },

  async joinByCode(inviteCode: string) {
    try {
      const res = await apiService.post(`${roomApi}join-by-code`, {
        inviteCode,
      });
      return (
        res.data || {
          status: "error",
          message: res?.error?.message || "Không thể tham gia phòng lúc này.",
        }
      );
    } catch (err: any) {
      throw err;
    }
  },

  async acceptInvitation(invitationId: string) {
    try {
      const res = await apiService.post(`${roomApi}invitations/${invitationId}/accept`);
      return (
        res.data || {
          status: "error",
          message: res?.error?.message || "Không thể chấp nhận lời mời lúc này.",
        }
      );
    } catch (err: any) {
      throw err;
    }
  },

  async removeRoomMember(roomMemberId: string) {
    try {
      const res = await apiService.delete(`${roomApi}members/${roomMemberId}`);
      return (
        res.data || {
          status: "error",
          message: res?.error?.message || "Không thể xóa thành viên lúc này.",
        }
      );
    } catch (err: any) {
      throw err;
    }
  },

  async updateRoomPolicy(roomId: string, policyData: any) {
    try {
      const res = await apiService.patch(`${roomApi}${roomId}/policy`, policyData);
      return res.data;
    } catch (err: any) {
      throw err;
    }
  },
};

