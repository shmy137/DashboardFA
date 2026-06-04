import { axiosConfig } from "./axiosConfig";

export const GreenRoomApi = {
  loginGreenRoom: async (data: any) => {
    return await axiosConfig.post("greenroom/login", data);
  },
  createGreenRoom: async (data: any) => {
    return await axiosConfig.post("greenroom/create", data);
  },
  getAllGreenRooms: async () => {
    return await axiosConfig.get("greenroom/get-all");
  },
  getOneGreenRoom: async (id: string) => {
    return await axiosConfig.get(`greenroom/get-one/${id}`);
  },
  updateGreenRoom: async (id: string, data: any) => {
    return await axiosConfig.post(`greenroom/update/${id}`, data);
  },
  deleteGreenRoom: async (id: string) => {
    return await axiosConfig.delete(`greenroom/delete/${id}`);
  },
};
