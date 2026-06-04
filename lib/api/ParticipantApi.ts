import { axiosConfig } from "./axiosConfig";

export const ParticipantApi = {
  getAllParticipants: async () => {
    return await axiosConfig.get("participants/get-all");
  },
  getOneParticipant: async (id: string) => {
    return await axiosConfig.get(`participants/get-one/${id}`);
  },
  getParticipantsByCompetition: async (competitionId: string) => {
    return await axiosConfig.get(`participants/get-by-competition/${competitionId}`);
  },
  allocateCodeLetter: async (id: string, codeLetter: string) => {
    return await axiosConfig.post(`participants/allocate/${id}`, { codeLetter });
  },
  createParticipant: async (data: any) => {
    return await axiosConfig.post("participants/create", data);
  },
  updateParticipant: async (id: string, data: any) => {
    return await axiosConfig.post(`participants/update/${id}`, data);
  },
  deleteParticipant: async (id: string) => {
    return await axiosConfig.delete(`participants/delete/${id}`);
  },
  getParticipantsByTeam: async (teamId: string) => {
    return await axiosConfig.get(`participants/get-by-team/${teamId}`);
  },
};
