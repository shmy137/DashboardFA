"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { TrashIcon, EditIcon } from "lucide-react";
import { toast } from "sonner";
import { GreenRoomApi } from "@/lib/api/GreenRoomApi";

export function GreenRoomTable({ data = [], fetchGreenRooms }: any) {
  const DeleteFunction = async (id: any) => {
    try {
      const res = await GreenRoomApi.deleteGreenRoom(id);
      if (res.data.success) {
        toast.success(res.data.message);
        if (fetchGreenRooms) {
          fetchGreenRooms();
        } else {
          window.location.reload();
        }
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error("Failed to delete green room user");
    }
  };
  return (
    <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="px-6 py-4 sm:px-7 sm:py-5 xl:px-8.5">
        <div className="flex w-full justify-between">
          <h2 className="text-2xl font-bold text-dark dark:text-white">
            Green Room Users
          </h2>
          <Link
            href={"/dashboard/greenroom/add"}
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
            <TableHead className="min-w-30 pl-5 text-left sm:pl-6 xl:pl-7.5">Stage</TableHead>
            <TableHead className="w-[100px] text-right font-semibold text-gray-900 pr-5 sm:pr-6 xl:pr-7.5">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {Array.isArray(data) && data.length > 0 ? data.map((d: any) => (
            <TableRow
              className="text-base font-medium text-dark dark:text-white"
              key={d._id}
            >
              <TableCell className="pl-5 text-left sm:pl-6 xl:pl-7.5">
                <div>{d.name}</div>
              </TableCell>
              <TableCell className="pl-5 text-left sm:pl-6 xl:pl-7.5">
                <div>{d.email}</div>
              </TableCell>
              <TableCell className="pl-5 text-left sm:pl-6 xl:pl-7.5 capitalize">
                <div>{d.stageNo || "stage1"}</div>
              </TableCell>
              <TableCell className="text-right pr-5 sm:pr-6 xl:pr-7.5">
                <div className="flex items-center justify-end gap-2">
                  <Link
                    href={`/dashboard/greenroom/edit/${d._id}`}
                    className="p-2 text-gray-400 hover:text-primary transition-colors"
                  >
                    <span className="sr-only">Edit</span>
                    <EditIcon className="h-4 w-4" />
                  </Link>
                  <button
                    className="p-2 text-gray-400 hover:text-destructive transition-colors"
                    onClick={() => DeleteFunction(d._id)}
                  >
                    <span className="sr-only">Delete</span>
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          )) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                No green room users found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
