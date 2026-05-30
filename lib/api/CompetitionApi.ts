import { axiosConfig } from "./axiosConfig";

export const CompetitionApi = {
 createCompetition: async function (data : any) {
    return await axiosConfig.post("competitions/create", data);
    
 },

 getAllcompetitions: async function () {
    return await axiosConfig.get("competitions/get-all");
 },

 deleteCompetition: async function (id : any) {
    return await axiosConfig.delete(`competitions/delete/${id}`);
 }
}