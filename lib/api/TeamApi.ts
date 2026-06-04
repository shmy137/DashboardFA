import { axiosConfig } from "./axiosConfig";

export const TeamApi = {
  createTeam: async function (data: any) {
    return await axiosConfig.post("teams/create", data);
  },

  getAllTeams: async function () {
    return await axiosConfig.get("teams/get-all");
  },

    deleteTeam : async function ( id : any ) {
        return await axiosConfig.delete(`teams/delete/${id}`);
    },

    updateTeam: async function (id: any, data: any) {
        return await axiosConfig.post(`teams/update/${id}`, data);
    },

    loginTeam: async function (data: any) {
        return await axiosConfig.post(`teams/login`, data);
    }
};
