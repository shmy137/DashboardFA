"use client";
import React, { useEffect, useState } from "react";
import { CompetitionApi } from "@/lib/api/CompetitionApi";
import { CompetitionTable } from "./_components/competition-table";

const Page = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCompetitions = async () => {
    try {
      const res = await CompetitionApi.getAllcompetitions();
      const responseData = res?.data;
      
      let finalData = [];
      if (Array.isArray(responseData)) finalData = responseData;
      else if (Array.isArray(responseData?.data)) finalData = responseData.data;
      else if (Array.isArray(responseData?.teams)) finalData = responseData.teams;
      else if (Array.isArray(responseData?.allteams)) finalData = responseData.allteams;
      else if (Array.isArray(responseData?.data?.teams)) finalData = responseData.data.teams;
      else if (Array.isArray(responseData?.data?.allteams)) finalData = responseData.data.allteams;
      else if (Array.isArray(responseData?.data?.data)) finalData = responseData.data.data;
      
      setData(Array.isArray(finalData) ? finalData : []);
    } catch (error) {
      console.error("Failed to fetch teams", error);
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
