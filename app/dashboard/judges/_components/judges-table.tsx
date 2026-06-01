"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { JudgesApi } from "@/lib/api/JudgesApi";
import { TrashIcon, EditIcon } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export function JudgesTable({ judge = [], fetchJudges }: any) {

  const DeleteFunction = async (id: any) => {
    const res = await JudgesApi.deleteJudge(id);

    if (res.data.success) {
      toast.success(res.data.message);
      if (fetchJudges) {
        fetchJudges();
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
            Judges
          </h2>
          <Link
            href={"/dashboard/judges/add"}
            className="flex w-fit justify-center rounded-lg bg-primary p-3.25 font-medium text-white hover:bg-opacity-90"
          >
            Add
          </Link>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-t text-base [&>th]:h-auto [&>th]:py-3 sm:[&>th]:py-4.5">
            <TableHead className="min-w-30 pl-5 text-left sm:pl-6 xl:pl-7.5">Name</TableHead>
            <TableHead className="min-w-30 pl-5 text-left sm:pl-6 xl:pl-7.5">Email</TableHead>
            <TableHead className="pr-5 text-right sm:pr-6 xl:pr-7.5">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {Array.isArray(judge) && judge.length > 0 ? judge.map((j: any) => (
            <TableRow
              className="text-base font-medium text-dark dark:text-white"
              key={j._id}
            >
              <TableCell className="pl-5 text-left sm:pl-6 xl:pl-7.5">
                <div>{j.name}</div>
              </TableCell>
              <TableCell className="pl-5 text-left sm:pl-6 xl:pl-7.5">
                <div>{j.email}</div>
              </TableCell>
              <TableCell className="pr-5 text-right sm:pr-6 xl:pr-7.5">
                <div className="flex items-center justify-end gap-x-3.5">
                  <Link
                    href={`/dashboard/judges/edit/${j._id}`}
                    className="p-2 text-gray-400 hover:text-primary transition-colors"
                  >
                    <span className="sr-only">Edit Judge</span>
                    <EditIcon className="h-4 w-4" />
                  </Link>
                  <button
                    className="p-2 text-gray-400 hover:text-destructive transition-colors"
                    onClick={() => DeleteFunction(j._id)}
                  >
                    <span className="sr-only">Delete Judge</span>
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          )) : (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                No judges found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
