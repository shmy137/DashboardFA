"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ParticipantApi } from "@/lib/api/ParticipantApi";
import { toast } from "sonner";

export function ParticipantsTable({ data = [], fetchParticipants }: any) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [codeLetter, setCodeLetter] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleEdit = (participant: any) => {
    setEditingId(participant._id);
    setCodeLetter(participant.codeLetter || "");
  };

  const handleSave = async (id: string) => {
    try {
      setLoadingId(id);
      await ParticipantApi.allocateCodeLetter(id, codeLetter);
      toast.success("Code letter allocated successfully");
      setEditingId(null);
      if (fetchParticipants) fetchParticipants();
    } catch (error) {
      toast.error("Failed to allocate code letter");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="px-6 py-4 sm:px-7 sm:py-5 xl:px-8.5">
        <div className="flex w-full justify-between">
          <h2 className="text-2xl font-bold text-dark dark:text-white">
            Participants Allocation
          </h2>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-t text-base [&>th]:h-auto [&>th]:py-3 sm:[&>th]:py-4.5">
            <TableHead className="min-w-30 pl-5 text-left sm:pl-6 xl:pl-7.5">Name</TableHead>
            <TableHead className="min-w-30 pl-5 text-left sm:pl-6 xl:pl-7.5">Code Letter</TableHead>
            <TableHead className="pr-5 text-right sm:pr-6 xl:pr-7.5">Action</TableHead>
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
                {editingId === d._id ? (
                  <Input 
                    value={codeLetter} 
                    onChange={(e) => setCodeLetter(e.target.value)} 
                    placeholder="Enter code letter"
                    className="max-w-[200px]"
                  />
                ) : (
                  <div>{d.codeLetter || <span className="text-muted-foreground italic">Not allocated</span>}</div>
                )}
              </TableCell>
              <TableCell className="pr-5 text-right sm:pr-6 xl:pr-7.5">
                {editingId === d._id ? (
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setEditingId(null)}
                      disabled={loadingId === d._id}
                    >
                      Cancel
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => handleSave(d._id)}
                      disabled={loadingId === d._id}
                    >
                      {loadingId === d._id ? "Saving..." : "Save"}
                    </Button>
                  </div>
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleEdit(d)}
                  >
                    Allocate
                  </Button>
                )}
              </TableCell>
            </TableRow>
          )) : (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                No participants found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
