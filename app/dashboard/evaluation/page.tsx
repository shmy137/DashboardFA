"use client";
import React, { useEffect, useState } from "react";
import { EvaluationTable } from "./_components/evaluation-table";
import { ParticipantApi } from "@/lib/api/ParticipantApi";
import { CompetitionApi } from "@/lib/api/CompetitionApi";
import { Badge } from "@/components/ui/badge";

const EvaluationPage = () => {
  const [data, setData] = useState<any[]>([]);
  const [competitions, setCompetitions] = useState<any[]>([]);
  const [selectedStage, setSelectedStage] = useState<string>("stage1");
  const [selectedCompetition, setSelectedCompetition] = useState<any>(null);
  const [role, setRole] = useState("admin");
  const [loading, setLoading] = useState(true);
  const [loadingParticipants, setLoadingParticipants] = useState(false);

  const fetchCompetitionsData = async () => {
    try {
      setLoading(true);
      const compRes = await CompetitionApi.getAllcompetitions();

      const compData = compRes?.data;
      let finalComps = [];
      if (Array.isArray(compData)) finalComps = compData;
      else if (Array.isArray(compData?.data)) finalComps = compData.data;
      else if (Array.isArray(compData?.competitions))
        finalComps = compData.competitions;
      else if (Array.isArray(compData?.allcompetitions))
        finalComps = compData.allcompetitions;
      else if (Array.isArray(compData?.data?.competitions))
        finalComps = compData.data.competitions;
      else if (Array.isArray(compData?.data?.allcompetitions))
        finalComps = compData.data.allcompetitions;
      else if (Array.isArray(compData?.data?.data))
        finalComps = compData.data.data;
      setCompetitions(Array.isArray(finalComps) ? finalComps : []);
    } catch (error) {
      console.error("Failed to fetch competitions", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchParticipantsForCompetition = async (competitionId: string) => {
    try {
      setLoadingParticipants(true);
      const partRes =
        await ParticipantApi.getParticipantsByCompetition(competitionId);
      const responseData = partRes?.data;
      let finalData = [];
      if (Array.isArray(responseData)) finalData = responseData;
      else if (Array.isArray(responseData?.data)) finalData = responseData.data;
      setData(Array.isArray(finalData) ? finalData : []);
    } catch (error) {
      console.error("Failed to fetch participants", error);
    } finally {
      setLoadingParticipants(false);
    }
  };

  useEffect(() => {
    fetchCompetitionsData();
    if (typeof window !== "undefined") {
      const userRole = localStorage.getItem("userRole") || "admin";
      setRole(userRole);
      const storedStage = localStorage.getItem("stageNo");
      if ((userRole === "judge" || userRole === "greenroom") && storedStage) {
        setSelectedStage(storedStage);
      }
    }
  }, []);

  const filteredCompetitions = competitions.filter(
    (c: any) =>
      c.stageNo === selectedStage || (selectedStage === "stage1" && !c.stageNo),
  );

  return (
    <div className="space-y-6">
      <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-dark dark:text-white">
            Competitions for Evaluation
          </h2>
          <select
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
            disabled={role === "judge" || role === "greenroom"}
            className="mt-2 sm:mt-0 flex h-10 w-full sm:w-fit rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="stage1">Stage 1</option>
            <option value="stage2">Stage 2</option>
            <option value="stage3">Stage 3</option>
            <option value="stage4">Stage 4</option>
            <option value="stage5">Stage 5</option>
            <option value="Girls">Girls</option>
          </select>
        </div>

        {loading ? (
          <div className="py-4 text-center text-muted-foreground">
            Loading competitions...
          </div>
        ) : filteredCompetitions.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredCompetitions.map((comp) => (
              <div
                key={comp._id}
                onClick={() => {
                  if (selectedCompetition?._id === comp._id) {
                    setSelectedCompetition(null);
                  } else {
                    setSelectedCompetition(comp);
                    fetchParticipantsForCompetition(comp._id);
                  }
                }}
                className={`p-4 border rounded-lg transition-colors cursor-pointer ${
                  selectedCompetition?._id === comp._id
                    ? "bg-primary/5 border-primary col-span-1 sm:col-span-2 md:col-span-3"
                    : "bg-gray-50/50 hover:bg-gray-50"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      {comp.name}
                      <Badge
                        variant="secondary"
                        className={`text-xs ml-2 ${comp.status === "completed" ? "bg-green-100 text-green-800 hover:bg-green-100" : comp.status === "ongoing" ? "bg-blue-100 text-blue-800 hover:bg-blue-100" : "bg-amber-100 text-amber-800 hover:bg-amber-100"}`}
                      >
                        {comp.status || "pending"}
                      </Badge>
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {comp.category}
                      </Badge>
                      <Badge variant="secondary" className="text-xs bg-white">
                        {comp.gender || "Boys"}
                      </Badge>
                    </div>
                  </div>
                </div>

                {selectedCompetition?._id === comp._id && (
                  <div
                    className="mt-6 pt-4 border-t border-primary/20 cursor-default"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {loadingParticipants ? (
                      <div className="p-8 text-center text-muted-foreground bg-white rounded-[10px] shadow-sm">
                        Loading participants...
                      </div>
                    ) : (
                      <EvaluationTable
                        data={data}
                        competitionId={comp._id}
                        competition={comp}
                        onSuccess={() => {
                          fetchCompetitionsData();
                        }}
                      />
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground border border-dashed rounded-lg">
            No competitions assigned to {selectedStage}.
          </div>
        )}
      </div>
    </div>
  );
};

export default EvaluationPage;
