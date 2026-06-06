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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ParticipantApi } from "@/lib/api/ParticipantApi";
import { TeamApi } from "@/lib/api/TeamApi";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export function ParticipantsTable({ data = [], fetchParticipants, competition, codeLettersMap, setCodeLettersMap }: any) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [teams, setTeams] = useState<any[]>([]);
  const [addForm, setAddForm] = useState({ name: "", teamId: "", className: "" });
  const [adding, setAdding] = useState(false);

  // Fetch teams on mount
  useEffect(() => {
    TeamApi.getAllTeams().then((res) => {
      let teamData = [];
      if (Array.isArray(res?.data)) teamData = res.data;
      else if (Array.isArray(res?.data?.data)) teamData = res.data.data;
      setTeams(teamData);
    }).catch(console.error);
  }, []);

  // Code letters are managed by the parent via codeLettersMap

  const handleAddParticipant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.name || !addForm.teamId) {
      toast.error("Please fill in required fields.");
      return;
    }
    setAdding(true);
    try {
      const payload = {
        name: addForm.name,
        teamId: addForm.teamId,
        className: addForm.className || "N/A",
        competitionId: competition?._id,
        categoryId: competition?.categoryId || competition?.category,
      };
      const res = await ParticipantApi.addParticipantFromGreenRoom(payload);
      if (res?.data?.success) {
        toast.success("participants are added");
        setIsAddOpen(false);
        setAddForm({ name: "", teamId: "", className: "" });
        if (fetchParticipants) fetchParticipants();
      } else {
        toast.error(res?.data?.message || "Failed to add participant");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "An error occurred");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="px-6 py-4 sm:px-7 sm:py-5 xl:px-8.5">
        <div className="flex w-full justify-between items-center">
          <h2 className="text-2xl font-bold text-dark dark:text-white">
            Participants Allocation
          </h2>
          <Button onClick={() => setIsAddOpen(true)}>Add Participant</Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-t text-base [&>th]:h-auto [&>th]:py-3 sm:[&>th]:py-4.5">
            <TableHead className="min-w-30 pl-5 text-left sm:pl-6 xl:pl-7.5">Name</TableHead>
            <TableHead className="min-w-30 pl-5 text-left sm:pl-6 xl:pl-7.5">Team</TableHead>
            <TableHead className="min-w-30 pl-5 text-left sm:pl-6 xl:pl-7.5">Code Letter</TableHead>
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
                <div className="text-muted-foreground text-sm">{d.teamId?.name || "-"}</div>
              </TableCell>
              <TableCell className="pl-5 text-left sm:pl-6 xl:pl-7.5">
                <Input 
                  value={codeLettersMap ? (codeLettersMap[d._id] || "") : ""}
                  onChange={(e) => setCodeLettersMap && setCodeLettersMap({ ...codeLettersMap, [d._id]: e.target.value })} 
                  placeholder="Enter code letter"
                  className="max-w-[200px]"
                />
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

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleAddParticipant}>
            <DialogHeader>
              <DialogTitle>Add Participant</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Participant Name *</Label>
                <Input
                  id="name"
                  value={addForm.name}
                  onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                  placeholder="Enter name"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="team">Team *</Label>
                <select
                  id="team"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={addForm.teamId}
                  onChange={(e) => setAddForm({ ...addForm, teamId: e.target.value })}
                  required
                >
                  <option value="" disabled>Select Team</option>
                  {teams.map((t) => (
                    <option key={t._id} value={t._id}>{t.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="className">Class (Optional)</Label>
                <Input
                  id="className"
                  value={addForm.className}
                  onChange={(e) => setAddForm({ ...addForm, className: e.target.value })}
                  placeholder="Enter class/grade"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={adding}>
                {adding ? "Adding..." : "Add Participant"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
