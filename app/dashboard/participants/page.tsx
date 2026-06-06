"use client";
import React, { useEffect, useState } from "react";
import { ParticipantsTable } from "./_components/participants-table";
import { ParticipantApi } from "@/lib/api/ParticipantApi";
import { CompetitionApi } from "@/lib/api/CompetitionApi";
import { Badge } from "@/components/ui/badge";

const Page = () => {
  const [data, setData] = useState<any[]>([]);
  const [competitions, setCompetitions] = useState<any[]>([]);
  const [selectedStage, setSelectedStage] = useState<string>("stage1");
  const [selectedCompetition, setSelectedCompetition] = useState<any>(null);
  const [role, setRole] = useState("admin");
  const [loading, setLoading] = useState(true);
  const [loadingParticipants, setLoadingParticipants] = useState(false);
  const [updatingConfig, setUpdatingConfig] = useState(false);
  const [codeLettersMap, setCodeLettersMap] = useState<Record<string, string>>({});

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
      const parts = Array.isArray(finalData) ? finalData : [];
      setData(parts);

      const initialMap: Record<string, string> = {};
      parts.forEach((p: any) => {
         initialMap[p._id] = p.codeLetters?.find((c: any) => c.competitionId === competitionId)?.codeLetter || "";
      });
      setCodeLettersMap(initialMap);
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
      if (userRole === "greenroom" && storedStage) {
        setSelectedStage(storedStage);
      }
    }
  }, []);

  const saveAllConfig = async (comp: any, count: number, names: string[]) => {
    try {
      setUpdatingConfig(true);

      const updatedComp = { ...comp };
      updatedComp.judgeConfig = { count, names };

      setCompetitions((prev) =>
        prev.map((c) => (c._id === comp._id ? updatedComp : c)),
      );
      if (selectedCompetition?._id === comp._id) {
        setSelectedCompetition(updatedComp);
      }

      await CompetitionApi.updateCompetition(comp._id, {
        judgeConfig: { count, names },
      });

      const allocations = Object.keys(codeLettersMap).map((participantId) => ({
        participantId,
        codeLetter: codeLettersMap[participantId]
      }));

      if (allocations.length > 0) {
        await ParticipantApi.bulkAllocateCodeLetters(comp._id, allocations);
      }

      fetchParticipantsForCompetition(comp._id);
      fetchCompetitionsData();
    } catch (error) {
      console.error("Failed to update judge config", error);
    } finally {
      setUpdatingConfig(false);
    }
  };

  const filteredCompetitions = competitions.filter(
    (c: any) =>
      c.stageNo === selectedStage || (selectedStage === "stage1" && !c.stageNo),
  );

  return (
    <div className="space-y-6">
      <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-dark dark:text-white">
            Competitions By Stage
          </h2>
          <select
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
            disabled={role === "greenroom"}
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
                      <select
                        onClick={(e) => e.stopPropagation()}
                        value={comp.status || "pending"}
                        onChange={async (e) => {
                          const newStatus = e.target.value;
                          setCompetitions((prev) =>
                            prev.map((c) =>
                              c._id === comp._id ? { ...c, status: newStatus } : c
                            )
                          );
                          if (selectedCompetition?._id === comp._id) {
                            setSelectedCompetition({ ...comp, status: newStatus });
                          }
                          try {
                            await CompetitionApi.updateCompetition(comp._id, { status: newStatus });
                          } catch (err) {
                            console.error("Failed to update status", err);
                          }
                        }}
                        className={`text-xs ml-2 rounded-md border px-2 py-1 outline-none appearance-none cursor-pointer ${
                          comp.status === "completed"
                            ? "bg-green-100 text-green-800 border-green-200"
                            : comp.status === "ongoing"
                            ? "bg-blue-100 text-blue-800 border-blue-200"
                            : "bg-amber-100 text-amber-800 border-amber-200"
                        }`}
                      >
                        <option value="pending" className="bg-white text-dark">pending</option>
                        <option value="ongoing" className="bg-white text-dark">ongoing</option>
                        <option value="completed" className="bg-white text-dark">completed</option>
                      </select>
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
                      <>
                        <div className="mb-6 p-4 border rounded-md bg-gray-50/30">
                          <h4 className="font-medium mb-3 text-sm">
                            Judge Configuration
                          </h4>
                          <p className="text-xs text-muted-foreground mb-4">
                            Set the number of judges and their names. This will
                            be automatically reflected in the Judge Panel.
                          </p>
                          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                            <div className="space-y-1">
                              <label className="text-xs text-muted-foreground">
                                Number of Judges
                              </label>
                              <select
                                className="flex h-9 rounded-md border border-input bg-white px-3 py-1 text-sm"
                                value={comp.judgeConfig?.count || 1}
                                disabled={updatingConfig}
                                onChange={(e) => {
                                  const count = parseInt(e.target.value);
                                  const oldNames =
                                    comp.judgeConfig?.names || [];
                                  const newNames = Array(count)
                                    .fill("")
                                    .map(
                                      (_, i) => oldNames[i] || `Judge ${i + 1}`,
                                    );
                                  const newComp = { ...comp };
                                  newComp.judgeConfig = {
                                    count,
                                    names: newNames,
                                  };
                                  setCompetitions((prev) =>
                                    prev.map((c) =>
                                      c._id === comp._id ? newComp : c,
                                    ),
                                  );
                                  if (selectedCompetition?._id === comp._id)
                                    setSelectedCompetition(newComp);
                                }}
                              >
                                {[1, 2, 3, 4, 5].map((n) => (
                                  <option key={n} value={n}>
                                    {n}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {Array(comp.judgeConfig?.count || 1).fill("").map(
                              (_, i: number) => {
                                const name = comp.judgeConfig?.names?.[i] ?? `Judge ${i + 1}`;
                                return (
                                <div key={i} className="space-y-1">
                                  <label className="text-xs text-muted-foreground">
                                    Judge {i + 1} Name
                                  </label>
                                  <input
                                    type="text"
                                    className="flex h-9 rounded-md border border-input bg-white px-3 py-1 text-sm w-32"
                                    value={name}
                                    disabled={updatingConfig}
                                    onChange={(e) => {
                                      const newNames = [
                                        ...(comp.judgeConfig?.names || [
                                          "Judge 1",
                                        ]),
                                      ];
                                      newNames[i] = e.target.value;
                                      const newComp = { ...comp };
                                      newComp.judgeConfig = {
                                        count: comp.judgeConfig?.count || 1,
                                        names: newNames,
                                      };
                                      setCompetitions((prev) =>
                                        prev.map((c) =>
                                          c._id === comp._id ? newComp : c,
                                        ),
                                      );
                                      if (selectedCompetition?._id === comp._id)
                                        setSelectedCompetition(newComp);
                                    }}
                                  />
                                </div>
                              );
                            })}

                            <div className="flex items-end pb-1">
                              <button
                                onClick={() =>
                                  saveAllConfig(
                                    comp,
                                    comp.judgeConfig?.count || 1,
                                    comp.judgeConfig?.names || ["Judge 1"],
                                  )
                                }
                                disabled={updatingConfig}
                                className="flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
                              >
                                {updatingConfig ? "Saving..." : "Save Configuration"}
                              </button>
                            </div>
                          </div>
                        </div>

                        <ParticipantsTable
                          data={data}
                          competition={comp}
                          codeLettersMap={codeLettersMap}
                          setCodeLettersMap={setCodeLettersMap}
                          fetchParticipants={() =>
                            fetchParticipantsForCompetition(comp._id)
                          }
                        />
                      </>
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

export default Page;
