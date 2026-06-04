"use client";
import React, { useEffect, useState } from "react";
import { ParticipantTable } from "./_components/participants-table";
import { ParticipantApi } from "@/lib/api/ParticipantApi";

const TeamParticipantsPage = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchParticipants = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const teamId = token ? token.split("-")[2] : null;

      if (!teamId) {
        console.error("No team ID found");
        setLoading(false);
        return;
      }

      const res = await ParticipantApi.getParticipantsByTeam(teamId);
      const responseData = res?.data;
      
      let finalData = [];
      if (Array.isArray(responseData)) finalData = responseData;
      else if (Array.isArray(responseData?.data)) finalData = responseData.data;
      
      setData(Array.isArray(finalData) ? finalData : []);
    } catch (error) {
      console.error("Failed to fetch participants", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParticipants();
  }, []);

  return (
    <div>
      {loading ? (
        <div className="p-8 text-center text-muted-foreground">Loading participants...</div>
      ) : (
        <ParticipantTable participants={data} fetchParticipants={fetchParticipants} />
      )}
    </div>
  );
};

export default TeamParticipantsPage;
