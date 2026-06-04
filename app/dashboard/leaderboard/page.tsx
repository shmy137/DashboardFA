"use client";
import React, { useEffect, useState } from "react";
import { LeaderboardApi } from "@/lib/api/LeaderboardApi";
import { LeaderboardTable } from "./_components/leaderboard-table";

const LeaderboardPage = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboards = async () => {
    try {
      const res = await LeaderboardApi.getAllLeaderboards();
      const responseData = res?.data;

      let finalData: any[] = [];
      if (Array.isArray(responseData)) finalData = responseData;
      else if (Array.isArray(responseData?.data)) finalData = responseData.data;

      setData(Array.isArray(finalData) ? finalData : []);
    } catch (error) {
      console.error("Failed to fetch leaderboards", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboards();
  }, []);

  return (
    <div className="p-4 sm:p-6 w-full max-w-5xl mx-auto space-y-6">
      {loading ? (
        <div className="p-8 text-center text-muted-foreground">
          Loading Leaderboard...
        </div>
      ) : (
        <LeaderboardTable leaderboards={data} />
      )}
    </div>
  );
};

export default LeaderboardPage;
