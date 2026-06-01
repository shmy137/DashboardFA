import { axiosConfig } from "./axiosConfig";

export const JudgesApi = {
  createJudge: async function (data: any) {
    return await axiosConfig.post("judges/create", data);
  },

  getAllJudges: async function () {
    return await axiosConfig.get("judges/getall");
  },

  deleteJudge: async function (id: any) {
    return await axiosConfig.delete(`judges/delete/${id}`);
  },

  updateJudge: async function (id: any, data: any) {
    return await axiosConfig.post(`judges/update/${id}`, data);
  },

  getOneJudge: async function (id: any) {
    return await axiosConfig.get(`judges/getone/${id}`);
  },

  loginJudge: async function (data: any) {
    return await axiosConfig.post("judges/login", data);
  }
};
