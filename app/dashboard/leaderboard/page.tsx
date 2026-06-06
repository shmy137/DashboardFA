"use client";
import React, { useEffect, useState } from "react";
import { LeaderboardApi } from "@/lib/api/LeaderboardApi";
import { CompetitionApi } from "@/lib/api/CompetitionApi";
import { ResultApi } from "@/lib/api/ResultApi";
import { LeaderboardTable } from "./_components/leaderboard-table";

const LeaderboardPage = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ published: 0, total: 0 });

  const fetchLeaderboardsAndStats = async () => {
    try {
      const [resLb, resComp, resResults] = await Promise.all([
        LeaderboardApi.getAllLeaderboards(),
        CompetitionApi.getAllcompetitions(),
        ResultApi.getAllResults()
      ]);

      const responseData = resLb?.data;
      let finalData: any[] = [];
      if (Array.isArray(responseData)) finalData = responseData;
      else if (Array.isArray(responseData?.data)) finalData = responseData.data;
      setData(Array.isArray(finalData) ? finalData : []);

      let compData: any[] = [];
      if (Array.isArray(resComp?.data)) compData = resComp.data;
      else if (Array.isArray(resComp?.data?.data)) compData = resComp.data.data;
      
      let resultsData: any[] = [];
      if (Array.isArray(resResults?.data)) resultsData = resResults.data;
      else if (Array.isArray(resResults?.data?.data)) resultsData = resResults.data.data;

      const compIdsWithResults = new Set();
      resultsData.forEach((r: any) => {
        if (r.competitionId) compIdsWithResults.add(r.competitionId);
      });

      const publishedCount = compData.filter((c) => c.isPublished && compIdsWithResults.has(c._id)).length;
      
      setStats({
        published: publishedCount,
        total: compIdsWithResults.size,
      });

    } catch (error) {
      console.error("Failed to fetch leaderboards or stats", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboardsAndStats();
  }, []);

  return (
    <div className="p-4 sm:p-6 w-full max-w-5xl mx-auto space-y-6">
      {loading ? (
        <div className="p-8 text-center text-muted-foreground">
          Loading Leaderboard...
        </div>
      ) : (
        <LeaderboardTable leaderboards={data} stats={stats} />
      )}
    </div>
  );
};

export default LeaderboardPage;
