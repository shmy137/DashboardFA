"use client";

import { getTopChannels } from "@/components/Tables/fetch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TeamApi } from "@/lib/api/TeamApi";
import { cn } from "@/lib/utils";
import { TrashIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
// import toast from "react-hot-toast";

export function TeamTable({ team = [], fetchTeams }: any) {

  const router = useRouter();

  const DeleteFunction = async (id: any) => {
    const res = await TeamApi.deleteTeam(id);

    console.log(res);

    if (res.data.success) {
      toast.success(res.data.message);
      if (fetchTeams) {
        fetchTeams();
      } else {
        window.location.reload();
      }
    } else {
      toast.error(res.data.message);
    }
  };

  return (
    <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="px-6 py-4 sm:px-7 sm:py-5 xl:px-8.5">
        <div className="flex w-full justify-between">
          <h2 className="text-2xl font-bold text-dark dark:text-white">
            Teams
          </h2>
          <Link
            href={"/dashboard/team/add"}
            className="flex w-fit justify-center rounded-lg bg-primary p-3.25 font-medium text-white hover:bg-opacity-90"
          >
            Add
          </Link>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-t text-base [&>th]:h-auto [&>th]:py-3 sm:[&>th]:py-4.5">
            <TableHead className="min-w-30 pl-5 text-left sm:pl-6 xl:pl-7.5">Team</TableHead>
            <TableHead className="pr-5 text-right sm:pr-6 xl:pr-7.5">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {Array.isArray(team) ? team.map((team: any) => (
            <TableRow
              className="text-base font-medium text-dark dark:text-white"
              key={team._id}
            >
              <TableCell className="pl-5 text-left sm:pl-6 xl:pl-7.5">
                <div>{team.name}</div>
              </TableCell>
              <TableCell className="pr-5 text-right sm:pr-6 xl:pr-7.5">
                <div className="flex items-center justify-end gap-x-3.5">
                  <button
                    className="hover:text-primary"
                    onClick={() => DeleteFunction(team._id)}
                  >
                    <span className="sr-only">Delete Invoice</span>
                    <TrashIcon />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          )) : (
            <TableRow>
              <TableCell colSpan={2} className="text-center py-4 text-muted-foreground">
                No teams found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
