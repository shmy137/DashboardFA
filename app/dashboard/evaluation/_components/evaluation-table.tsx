"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ResultApi } from "@/lib/api/ResultApi";

export function EvaluationTable({ data = [], competitionId, competition, onSuccess }: { data: any[], competitionId?: string, competition?: any, onSuccess?: () => void }) {
  const [judgeConfig, setJudgeConfig] = useState<{ count: number, names: string[] }>({ count: 1, names: ["Judge 1"] });
  const [evaluations, setEvaluations] = useState<{
    [key: string]: {
      judgeMarks: Record<number, string>;
      basePoints: string;
      gracePoints: string;
      grade: string;
    };
  }>({});
  const [isUploading, setIsUploading] = useState(false);

  const fetchResults = () => {
    if (competitionId) {
      ResultApi.getResultsByCompetition(competitionId).then((res) => {
        if (res.data?.success && Array.isArray(res.data.data)) {
           const fetchedEvaluations: any = {};
           res.data.data.forEach((result: any) => {
             if (result.participantId) {
               const pId = typeof result.participantId === 'object' ? result.participantId._id : result.participantId;
               fetchedEvaluations[pId] = {
                 judgeMarks: result.judgeMarks || {},
                 basePoints: result.basePoints?.toString() || "0",
                 gracePoints: result.gracePoints?.toString() || "0",
                 grade: result.grade || "",
                 isUploaded: true,
               };
             }
           });
           setEvaluations(fetchedEvaluations);
        }
      }).catch(err => console.error("Failed to fetch results", err));
    }
  };

  useEffect(() => {
    if (competition?.judgeConfig && Array.isArray(competition.judgeConfig.names) && competition.judgeConfig.names.length > 0) {
      setJudgeConfig(competition.judgeConfig);
    } else {
      setJudgeConfig({ count: 1, names: ["Judge 1"] });
    }
    fetchResults();
  }, [competition, competitionId]);

  const handleEvaluationChange = (participantId: string, field: string, value: string) => {
    setEvaluations((prev) => {
      const prevData = prev[participantId] || { judgeMarks: {}, basePoints: "0", gracePoints: "0", grade: "" };
      return {
        ...prev,
        [participantId]: {
          ...prevData,
          [field]: value,
        },
      };
    });
  };

  const handleJudgeMarkChange = (participantId: string, judgeIndex: number, value: string) => {
    setEvaluations((prev) => {
      const prevData = prev[participantId] || { judgeMarks: {}, basePoints: "0", gracePoints: "0", grade: "" };
      return {
        ...prev,
        [participantId]: {
          ...prevData,
          judgeMarks: {
            ...prevData.judgeMarks,
            [judgeIndex]: value,
          },
        },
      };
    });
  };

  const handleUploadMarks = async () => {
    setIsUploading(true);
    try {
      if (!competitionId) {
         toast.error("Competition ID is missing.");
         return;
      }
      
      const payload: any = {};
      Object.keys(evaluations).forEach((participantId) => {
        const pData = evaluations[participantId];
        const participant = data.find((p) => p._id === participantId);
        if (!participant) return;
        
        let judgesTotal = 0;
        judgeConfig.names.forEach((_, i) => {
           judgesTotal += parseFloat(pData.judgeMarks[i]) || 0;
        });
        const basePointsNum = parseFloat(pData.basePoints) || 0;
        const gracePointsNum = parseFloat(pData.gracePoints) || 0;
        const totalMarks = basePointsNum + gracePointsNum;
        
        if (totalMarks > 0 || pData.grade || Object.keys(pData.judgeMarks).length > 0) {
          payload[participantId] = {
             ...pData,
             totalMarks,
             teamId: participant.teamId?._id || participant.teamId
          };
        }
      });
      
      const res = await ResultApi.bulkEvaluate(competitionId, payload);
      if (res.data?.success) {
        toast.success("mark is uploaded");
        fetchResults();
        if (onSuccess) onSuccess();
      } else {
        toast.error(res.data?.message || "Failed to upload marks.");
      }
    } catch (error) {
      console.error("Failed to upload marks", error);
      toast.error("Failed to upload marks.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="px-6 py-4 sm:px-7 sm:py-5 xl:px-8.5">
        <div className="flex w-full justify-between items-center">
          <h2 className="text-2xl font-bold text-dark dark:text-white">
            Evaluation Form
          </h2>
          <Button onClick={handleUploadMarks} disabled={isUploading}>
            {isUploading ? "Uploading..." : "Upload Marks"}
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-t text-base [&>th]:h-auto [&>th]:py-3 sm:[&>th]:py-4.5 whitespace-nowrap">
              <TableHead className="min-w-30 pl-5 text-left sm:pl-6 xl:pl-7.5">Code Letter</TableHead>
              {judgeConfig.names.map((name, idx) => (
                <TableHead key={idx}>{name || `Judge ${idx + 1}`} Mark</TableHead>
              ))}
              {judgeConfig.names.length > 1 && (
                <TableHead className="text-center font-semibold text-primary">Judges Avg</TableHead>
              )}
              <TableHead>Base Points</TableHead>
              <TableHead>Grace Points</TableHead>
              <TableHead className="text-center">Total Marks</TableHead>
              <TableHead>Grade</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {Array.isArray(data) && data.length > 0 ? (
              [...data].sort((a: any, b: any) => {
                const codeA = a.codeLetters?.find((c: any) => c.competitionId === competitionId)?.codeLetter || "";
                const codeB = b.codeLetters?.find((c: any) => c.competitionId === competitionId)?.codeLetter || "";
                return codeA.localeCompare(codeB, undefined, { numeric: true });
              }).map((d: any) => {
                const evalData = evaluations[d._id] || {
                  judgeMarks: {},
                  basePoints: "0",
                  gracePoints: "0",
                  grade: "",
                };
                
                let judgesTotal = 0;
                judgeConfig.names.forEach((_, i) => {
                   judgesTotal += parseFloat(evalData.judgeMarks[i]) || 0;
                });
                const judgesAvg = judgeConfig.names.length > 1 
                  ? (judgesTotal / judgeConfig.names.length).toFixed(1)
                  : 0;

                const basePointsNum = parseFloat(evalData.basePoints) || 0;
                const gracePointsNum = parseFloat(evalData.gracePoints) || 0;
                const totalMarks = basePointsNum + gracePointsNum;
                const compCodeLetter = d.codeLetters?.find((c: any) => c.competitionId === competitionId)?.codeLetter || "";

                return (
                  <TableRow
                    className="text-base font-medium text-dark dark:text-white"
                    key={d._id}
                  >
                    <TableCell className="pl-5 text-left sm:pl-6 xl:pl-7.5">
                      {compCodeLetter ? (
                        <Badge variant="outline" className="text-sm font-bold bg-primary/10 text-primary border-primary/20">
                          {compCodeLetter}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground italic text-sm">Not allocated</span>
                      )}
                    </TableCell>
                    
                    {judgeConfig.names.map((_, idx) => (
                      <TableCell key={idx}>
                        <Input 
                          type="number" 
                          placeholder="Mark" 
                          value={evalData.judgeMarks[idx] || ""}
                          onChange={(e) => handleJudgeMarkChange(d._id, idx, e.target.value)}
                          className="w-24"
                          disabled={!compCodeLetter}
                        />
                      </TableCell>
                    ))}

                    {judgeConfig.names.length > 1 && (
                      <TableCell className="text-center font-bold text-primary bg-primary/5 rounded-md">
                        {parseFloat(judgesAvg as string) > 0 ? judgesAvg : "-"}
                      </TableCell>
                    )}

                    <TableCell>
                      <select
                        value={evalData.basePoints}
                        onChange={(e) => handleEvaluationChange(d._id, "basePoints", e.target.value)}
                        className="flex h-10 w-24 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={!compCodeLetter}
                      >
                        <option value="0">0</option>
                        <option value="1">1</option>
                        <option value="3">3</option>
                        <option value="5">5</option>
                      </select>
                    </TableCell>
                    
                    <TableCell>
                      <Input 
                        type="number" 
                        min="0"
                        placeholder="Grace" 
                        value={evalData.gracePoints}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (parseFloat(val) >= 0 || val === "") {
                             handleEvaluationChange(d._id, "gracePoints", val);
                          } else {
                             toast.error("Negative grace points are not allowed.");
                          }
                        }}
                        className="w-24"
                        disabled={!compCodeLetter}
                      />
                    </TableCell>

                    <TableCell className="font-bold text-center text-lg">
                      {totalMarks > 0 ? totalMarks : "-"}
                    </TableCell>

                    <TableCell>
                      <select
                        value={evalData.grade}
                        onChange={(e) => handleEvaluationChange(d._id, "grade", e.target.value)}
                        className="flex h-10 w-24 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={!compCodeLetter}
                      >
                        <option value="">Select</option>
                        <option value="A+">A+</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                      </select>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5 + judgeConfig.names.length + (judgeConfig.names.length > 1 ? 1 : 0)} className="text-center py-6 text-muted-foreground">
                  No participants found for this competition.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
