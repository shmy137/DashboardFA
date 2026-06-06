"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ResultApi } from "@/lib/api/ResultApi";
import { TeamApi } from "@/lib/api/TeamApi";
import { CompetitionApi } from "@/lib/api/CompetitionApi";
import { TrashIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import React, { useEffect, useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Eye, Download } from "lucide-react";
import * as XLSX from "xlsx";

export function ResultTable({ results = [], fetchResults }: any) {
  const router = useRouter();
  const [teamsMap, setTeamsMap] = useState<Record<string, any>>({});
  const [competitionsMap, setCompetitionsMap] = useState<Record<string, any>>(
    {},
  );

  useEffect(() => {
    const fetchLookups = async () => {
      try {
        const teamRes = await TeamApi.getAllTeams();
        const teamData = teamRes?.data;
        let finalTeam: any[] = [];
        if (Array.isArray(teamData)) finalTeam = teamData;
        else if (Array.isArray(teamData?.data)) finalTeam = teamData.data;

        const teamMap: Record<string, any> = {};
        finalTeam.forEach((t: any) => (teamMap[t._id] = t));
        setTeamsMap(teamMap);

        const compRes = await CompetitionApi.getAllcompetitions();
        const compData = compRes?.data;
        let finalComp: any[] = [];
        if (Array.isArray(compData)) finalComp = compData;
        else if (Array.isArray(compData?.data)) finalComp = compData.data;

        const compMap: Record<string, any> = {};
        finalComp.forEach((c: any) => (compMap[c._id] = c));
        setCompetitionsMap(compMap);
      } catch (error) {
        console.error("Failed to fetch lookups", error);
      }
    };

    fetchLookups();
  }, []);

  const DeleteFunction = async (id: any) => {
    try {
      const res = await ResultApi.deleteResult(id);
      if (res.data.success) {
        toast.success(res.data.message);
        if (fetchResults) fetchResults();
        else window.location.reload();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete result");
    }
  };

  const [selectedCompId, setSelectedCompId] = useState<string | null>(null);
  const [compDetails, setCompDetails] = useState<any[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    try {
      setExporting(true);
      const res = await ResultApi.getTopResultsExport();
      if (res?.data?.success) {
        const exportData = res.data.data.map((item: any) => ({
          Category: item.categoryName || "-",
          Competition: item.competitionName || "-",
          Position: item.position || "-",
          Code: item.participantCode || "-",
          Participant: item.participantName || "-",
          Team: item.teamName || "-",
          Grade: item.grade || "-",
          "Total Score": item.score || 0,
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Top Results");
        XLSX.writeFile(workbook, "Festival_Top_Results.xlsx");
        toast.success("Results exported successfully!");
      } else {
        toast.error("Failed to fetch export data");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred during export");
    } finally {
      setExporting(false);
    }
  };

  const groupedCompetitions = useMemo(() => {
    const compIds = new Set<string>();
    if (Array.isArray(results)) {
      results.forEach((r: any) => {
        if (r.competitionId) compIds.add(r.competitionId);
      });
    }
    return Array.from(compIds);
  }, [results]);

  const handleView = async (compId: string) => {
    setSelectedCompId(compId);
    setLoadingDetails(true);
    try {
      const res = await ResultApi.getResultsByCompetition(compId);
      if (res?.data?.success) {
        const sortedData = res.data.data.sort(
          (a: any, b: any) => (b.score || 0) - (a.score || 0),
        );
        setCompDetails(sortedData);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load details");
    } finally {
      setLoadingDetails(false);
    }
  };

  const selectedCompData = selectedCompId
    ? competitionsMap[selectedCompId]
    : null;

  return (
    <>
      <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
        <div className="px-6 py-4 sm:px-7 sm:py-5 xl:px-8.5">
          <div className="flex w-full items-center justify-between">
            <h2 className="text-2xl font-bold text-dark dark:text-white">
              Results
            </h2>
            <button
              onClick={handleExport}
              disabled={exporting}
              className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-70"
            >
              <Download className="h-4 w-4" />
              {exporting ? "Exporting..." : "Download Result"}
            </button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="border-t text-base [&>th]:h-auto [&>th]:py-3 sm:[&>th]:py-4.5">
              <TableHead className="w-16 pl-5 text-left sm:pl-6 xl:pl-7.5">
                SN
              </TableHead>
              <TableHead className="text-left">Competition</TableHead>
              <TableHead className="text-left">Category</TableHead>
              <TableHead className="text-left">Publish Status</TableHead>
              <TableHead className="pr-5 text-right sm:pr-6 xl:pr-7.5">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {groupedCompetitions.length > 0 ? (
              groupedCompetitions.map((compId, idx) => {
                const comp = competitionsMap[compId];

                return (
                  <TableRow
                    className="text-base font-medium text-dark dark:text-white"
                    key={compId}
                  >
                    <TableCell className="pl-5 text-left sm:pl-6 xl:pl-7.5">
                      {idx + 1}
                    </TableCell>
                    <TableCell>
                      <div>{comp?.name || compId}</div>
                    </TableCell>
                    <TableCell>
                      {comp?.category && (
                        <Badge variant="outline">{comp.category}</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <select
                        value={
                          comp?.isPublished ? "published" : "not_published"
                        }
                        onChange={async (e) => {
                          const isPublished = e.target.value === "published";
                          try {
                            const res = await CompetitionApi.updateCompetition(
                              compId,
                              { isPublished },
                            );
                            if (res.data?.success) {
                              toast.success(
                                `Competition is ${isPublished ? "published" : "unpublished"}`,
                              );
                              setCompetitionsMap((prev) => ({
                                ...prev,
                                [compId]: { ...prev[compId], isPublished },
                              }));
                            } else {
                              toast.error("Failed to update status");
                            }
                          } catch (error) {
                            toast.error("An error occurred");
                          }
                        }}
                        className={`flex h-9 w-[140px] rounded-md border px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${
                          comp?.isPublished
                            ? "bg-green-50 border-green-200 text-green-700"
                            : "bg-gray-50 border-gray-200 text-gray-700"
                        }`}
                      >
                        <option value="not_published">Not Published</option>
                        <option value="published">Published</option>
                      </select>
                    </TableCell>
                    <TableCell className="pr-5 text-right sm:pr-6 xl:pr-7.5">
                      <button
                        className="flex items-center justify-end gap-2 text-primary hover:text-primary/80 ml-auto"
                        onClick={() => handleView(compId)}
                      >
                        <Eye className="h-4 w-4" />
                        <span>View</span>
                      </button>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-6 text-muted-foreground"
                >
                  No competitions have completed results yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={!!selectedCompId}
        onOpenChange={(open) => !open && setSelectedCompId(null)}
      >
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {selectedCompData?.name} Results
            </DialogTitle>
          </DialogHeader>

          <div className="overflow-y-auto flex-1 mt-4">
            {loadingDetails ? (
              <div className="py-8 text-center text-muted-foreground">
                Loading details...
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                    <TableHead className="font-semibold text-gray-900 w-16">
                      Pos
                    </TableHead>
                    <TableHead className="font-semibold text-gray-900">
                      Code
                    </TableHead>
                    <TableHead className="font-semibold text-gray-900">
                      Participant / Team
                    </TableHead>
                    {selectedCompData?.judgeConfig?.names?.map(
                      (name: string, i: number) => (
                        <TableHead
                          key={i}
                          className="font-semibold text-gray-900"
                        >
                          {name || `Judge ${i + 1}`}
                        </TableHead>
                      ),
                    )}
                    <TableHead className="font-semibold text-gray-900">
                      Base
                    </TableHead>
                    <TableHead className="font-semibold text-gray-900">
                      Grace
                    </TableHead>
                    <TableHead className="font-semibold text-gray-900 text-center">
                      Total
                    </TableHead>
                    <TableHead className="font-semibold text-gray-900">
                      Grade
                    </TableHead>
                    <TableHead className="font-semibold text-gray-900 text-right pr-4">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {compDetails.length > 0 ? (
                    compDetails.map((det: any, index: number) => {
                      const pos = index + 1;
                      const position =
                        pos === 1
                          ? "1st"
                          : pos === 2
                            ? "2nd"
                            : pos === 3
                              ? "3rd"
                              : `${pos}th`;
                      return (
                        <TableRow key={det._id}>
                          <TableCell className="font-bold">
                            <span
                              className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                                pos === 1
                                  ? "bg-yellow-100 text-yellow-700"
                                  : pos === 2
                                    ? "bg-gray-200 text-gray-700"
                                    : pos === 3
                                      ? "bg-orange-100 text-orange-700"
                                      : "text-muted-foreground"
                              }`}
                            >
                              {position}
                            </span>
                          </TableCell>
                          <TableCell>
                            {det.participantId?.codeLetter ? (
                              <Badge
                                variant="outline"
                                className="bg-primary/5 text-primary border-primary/20"
                              >
                                {det.participantId.codeLetter}
                              </Badge>
                            ) : (
                              "-"
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">
                              {det.participantId?.name || "-"}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {det.teamId?.name}
                            </div>
                          </TableCell>
                          {selectedCompData?.judgeConfig?.names?.map(
                            (_: any, i: number) => (
                              <TableCell key={i}>
                                {det.judgeMarks?.[i] || "-"}
                              </TableCell>
                            ),
                          )}
                          <TableCell>{det.basePoints || 0}</TableCell>
                          <TableCell>{det.gracePoints || 0}</TableCell>
                          <TableCell className="text-center font-bold text-primary">
                            {det.score}
                          </TableCell>
                          <TableCell>
                            {det.grade && (
                              <Badge variant="secondary">{det.grade}</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right pr-4">
                            <button
                              className="text-gray-400 hover:text-destructive transition-colors p-2"
                              onClick={() => {
                                DeleteFunction(det._id);
                                setCompDetails((prev) =>
                                  prev.filter((r) => r._id !== det._id),
                                );
                              }}
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={
                          6 + (selectedCompData?.judgeConfig?.count || 0)
                        }
                        className="text-center py-4 text-muted-foreground"
                      >
                        No result data found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ResultTable;
