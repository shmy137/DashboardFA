import { axiosConfig } from "./axiosConfig";

export const ResultApi = {
  createResult: async function (data: any) {
    return await axiosConfig.post("results/create", data);
  },

  getAllResults: async function () {
    return await axiosConfig.get("results/get-all");
  },

  deleteResult: async function (id: any) {
    return await axiosConfig.delete(`results/delete/${id}`);
  },
};

export default ResultApi;
