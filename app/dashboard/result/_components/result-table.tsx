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
import React, { useEffect, useState } from "react";

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

  return (
    <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="px-6 py-4 sm:px-7 sm:py-5 xl:px-8.5">
        <div className="flex w-full justify-between">
          <h2 className="text-2xl font-bold text-dark dark:text-white">
            Results
          </h2>
          <Link
            href={"/dashboard/result/add"}
            className="flex w-fit justify-center rounded-lg bg-primary p-3.25 font-medium text-white hover:bg-opacity-90"
          >
            Add
          </Link>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-t text-base [&>th]:h-auto [&>th]:py-3 sm:[&>th]:py-4.5">
            <TableHead className="min-w-30 pl-5 text-left sm:pl-6 xl:pl-7.5">
              Competition
            </TableHead>
            <TableHead className="text-left">Team</TableHead>
            <TableHead className="text-right">Score</TableHead>
            <TableHead className="pr-5 text-right sm:pr-6 xl:pr-7.5">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {Array.isArray(results) && results.length ? (
            results.map((r: any) => (
              <TableRow
                className="text-base font-medium text-dark dark:text-white"
                key={r._id || `${r.teamId}_${r.competitionId}_${r.score}`}
              >
                <TableCell className="pl-5 text-left sm:pl-6 xl:pl-7.5">
                  <div>
                    {competitionsMap[r.competitionId]?.name || r.competitionId}
                  </div>
                </TableCell>
                <TableCell>
                  <div>{teamsMap[r.teamId]?.name || r.teamId}</div>
                </TableCell>
                <TableCell className="pr-5 text-right sm:pr-6 xl:pr-7.5">
                  {r.score}
                </TableCell>
                <TableCell className="pr-5 text-right sm:pr-6 xl:pr-7.5">
                  <div className="flex items-center justify-end gap-x-3.5">
                    <button
                      className="hover:text-primary"
                      onClick={() => DeleteFunction(r._id)}
                    >
                      <span className="sr-only">Delete Result</span>
                      <TrashIcon />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={4}
                className="text-center py-4 text-muted-foreground"
              >
                No results found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default ResultTable;
