import { axiosConfig } from "./axiosConfig";

export const CategoryApi = {
  createCategory: async function (data: any) {
    return await axiosConfig.post("category/create", data);
  },

  GetAllCategories: async function () {
    return await axiosConfig.get("category/get-all");
  },

    DeleteCategory : async function ( id : any ) {
        return await axiosConfig.delete(`category/delete/${id}`);
    },
};
