"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ParticipantApi } from "@/lib/api/ParticipantApi";
import { TrashIcon, EditIcon } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import React from "react";
import { Badge } from "@/components/ui/badge";

export function ParticipantTable({ participants = [], fetchParticipants }: any) {
  const DeleteFunction = async (id: string) => {
    try {
      const res = await ParticipantApi.deleteParticipant(id);
      if (res.data?.success) {
        toast.success(res.data.message);
        if (fetchParticipants) {
          fetchParticipants();
        } else {
          window.location.reload();
        }
      } else {
        toast.error(res.data?.message || "Failed to delete participant");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete participant");
    }
  };

  return (
    <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card p-6">
      <div className="flex flex-col sm:flex-row w-full justify-between pb-4 gap-4 sm:items-center">
        <h2 className="text-2xl font-bold text-dark dark:text-white">
          Team Participants
        </h2>
        <Link
          href={"/dashboard/team-participants/add"}
          className="flex w-fit justify-center rounded-lg bg-primary px-4 py-2 font-medium text-white hover:bg-opacity-90"
        >
          Add Participant
        </Link>
      </div>

      <div className="overflow-x-auto">
        <Table className="min-w-[600px]">
          <TableHeader>
            <TableRow className="border-t text-base [&>th]:h-auto [&>th]:py-3 sm:[&>th]:py-4.5">
              <TableHead className="min-w-30 pl-5 text-left sm:pl-6 xl:pl-7.5">Name</TableHead>
              <TableHead className="text-left">Class</TableHead>
              <TableHead className="text-left">Category</TableHead>
              <TableHead className="text-left">Competitions</TableHead>
              <TableHead className="pr-5 text-right sm:pr-6 xl:pr-7.5">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {Array.isArray(participants) && participants.length > 0 ? (
              participants.map((item: any) => (
                <TableRow
                  className="text-base font-medium text-dark dark:text-white"
                  key={item._id}
                >
                  <TableCell className="pl-5 text-left sm:pl-6 xl:pl-7.5">
                    <div>{item.name}</div>
                  </TableCell>
                  <TableCell className="text-left">
                    <span className="text-muted-foreground">{item.className}</span>
                  </TableCell>
                  <TableCell className="text-left">
                    <span className="text-muted-foreground">{item.categoryId?.name || "Unknown"}</span>
                  </TableCell>
                  <TableCell className="text-left">
                    <div className="flex flex-wrap gap-1">
                      {item.competitionIds?.map((comp: any) => (
                        <Badge key={comp._id} variant="secondary" className="font-normal text-xs whitespace-nowrap">
                          {comp.name}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="pr-5 text-right sm:pr-6 xl:pr-7.5">
                    <div className="flex items-center justify-end gap-x-3.5">
                      <Link
                        href={`/dashboard/team-participants/edit/${item._id}`}
                        className="hover:text-primary transition-colors p-1"
                      >
                        <span className="sr-only">Edit Participant</span>
                        <EditIcon className="h-4 w-4" />
                      </Link>
                      <button
                        className="hover:text-destructive transition-colors p-1"
                        onClick={() => DeleteFunction(item._id)}
                      >
                        <span className="sr-only">Delete</span>
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  No participants found. Add some to get started!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
