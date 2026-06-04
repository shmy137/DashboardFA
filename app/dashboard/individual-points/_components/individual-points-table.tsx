"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export function IndividualPointsTable({ individualPoints = [], title, description }: any) {
  return (
    <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="px-6 py-4 sm:px-7 sm:py-5 xl:px-8.5">
        <div className="flex flex-col w-full justify-between">
          <h2 className="text-2xl font-bold text-dark dark:text-white">
            {title || "Individual Points"}
          </h2>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-t text-base [&>th]:h-auto [&>th]:py-3 sm:[&>th]:py-4.5">
            <TableHead className="w-24 pl-5 text-center sm:pl-6 xl:pl-7.5">
              Rank
            </TableHead>
            <TableHead className="text-left">Participant</TableHead>
            <TableHead className="text-left">Team</TableHead>
            <TableHead className="pr-5 text-right sm:pr-6 xl:pr-7.5">
              Total Grace Points
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {Array.isArray(individualPoints) && individualPoints.length > 0 ? (
            individualPoints.map((lb: any, idx: number) => (
              <TableRow
                className="text-base font-medium text-dark dark:text-white"
                key={lb.participantId || idx}
              >
                <TableCell className="pl-5 text-center sm:pl-6 xl:pl-7.5">
                  {lb.rank === 1 ? (
                    <Badge className="bg-yellow-500 hover:bg-yellow-600">1st</Badge>
                  ) : lb.rank === 2 ? (
                    <Badge className="bg-gray-400 hover:bg-gray-500">2nd</Badge>
                  ) : lb.rank === 3 ? (
                    <Badge className="bg-amber-700 hover:bg-amber-800">3rd</Badge>
                  ) : (
                    <span>{lb.rank}</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="font-semibold">{lb.participantName || "Unknown"}</div>
                </TableCell>
                <TableCell>
                  <div className="text-muted-foreground">{lb.teamName || "-"}</div>
                </TableCell>
                <TableCell className="pr-5 text-right sm:pr-6 xl:pr-7.5 font-bold text-primary">
                  {lb.totalPoints}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={4}
                className="text-center py-6 text-muted-foreground"
              >
                No individual points data available yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
