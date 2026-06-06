import { axiosConfig } from "./axiosConfig";

export const ResultApi = {
  createResult: async function (data: any) {
    return await axiosConfig.post("results/create", data);
  },
  
  bulkEvaluate: async function (competitionId: string, evaluations: any) {
    return await axiosConfig.post("results/bulk-evaluate", { competitionId, evaluations });
  },

  getAllResults: async function () {
    return await axiosConfig.get("results/get-all");
  },

  getResultsByCompetition: async function (competitionId: string) {
    return await axiosConfig.get(`results/competition/${competitionId}`);
  },

  getIndividualPoints: async function () {
    return await axiosConfig.get("results/individual-points");
  },

  getTopResultsExport: async function () {
    return await axiosConfig.get("results/export-top");
  },

  deleteResult: async function (id: any) {
    return await axiosConfig.delete(`results/delete/${id}`);
  },
};

export default ResultApi;
