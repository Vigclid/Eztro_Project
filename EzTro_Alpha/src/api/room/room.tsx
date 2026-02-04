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
};

