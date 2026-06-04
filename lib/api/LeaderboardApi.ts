import { axiosConfig } from "./axiosConfig";

export const LeaderboardApi = {
  getAllLeaderboards: async function () {
    return await axiosConfig.get("leaderboard/get");
  },
};

export default LeaderboardApi;
