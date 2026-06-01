"use client";
import React, { useEffect, useState } from "react";
import { CompetitionApi } from "@/lib/api/CompetitionApi";
import { CompetitionTable } from "./_components/competition-table";

const Page = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCompetitions = async () => {
    try {
      const userRole = localStorage.getItem("userRole") || "admin";
      
      const res = await CompetitionApi.getAllcompetitions();
      const responseData = res?.data;
      
      let finalData = [];
      if (Array.isArray(responseData)) finalData = responseData;
      else if (Array.isArray(responseData?.data)) finalData = responseData.data;
      else if (Array.isArray(responseData?.competitions)) finalData = responseData.competitions;
      else if (Array.isArray(responseData?.allcompetitions)) finalData = responseData.allcompetitions;
      else if (Array.isArray(responseData?.data?.competitions)) finalData = responseData.data.competitions;
      else if (Array.isArray(responseData?.data?.allcompetitions)) finalData = responseData.data.allcompetitions;
      else if (Array.isArray(responseData?.data?.data)) finalData = responseData.data.data;
      
      finalData = Array.isArray(finalData) ? finalData : [];

      if (userRole === "judge") {
        const judgeId = localStorage.getItem("judgeId");
        if (judgeId) {
          const { JudgesApi } = await import("@/lib/api/JudgesApi");
          const jRes = await JudgesApi.getOneJudge(judgeId);
          const jData = jRes?.data?.data;
          const judgeObj = Array.isArray(jData) ? jData[0] : jData;
          if (judgeObj && judgeObj.competitionIds) {
            finalData = finalData.filter((comp: any) => judgeObj.competitionIds.includes(comp._id));
          }
        }
      }

      setData(finalData);
    } catch (error) {
      console.error("Failed to fetch competitions", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompetitions();
  }, []);

  return (
    <div>
      {loading ? (
        <div className="p-8 text-center text-muted-foreground">Loading teams...</div>
      ) : (
        <CompetitionTable competition={data} fetchTeams={fetchCompetitions} />
      )}
    </div>
  );
};

export default Page;
