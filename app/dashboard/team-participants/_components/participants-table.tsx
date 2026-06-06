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
import React, { useState, useMemo, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { CategoryApi } from "@/lib/api/CategoryApi";
import { Button } from "@/components/ui/button";
import { DownloadIcon } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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

  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("teamParticipantsCategoryFilter");
      if (saved) {
        setSelectedCategory(saved);
      }
    }
  }, []);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedCategory(val);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("teamParticipantsCategoryFilter", val);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await CategoryApi.GetAllCategories();
        if (res.data?.success) {
          let catData = res.data.data;
          if (Array.isArray(catData)) {
             setCategories(catData.map((c: any) => c.name).sort());
          } else if (res.data?.categories && Array.isArray(res.data.categories)) {
             setCategories(res.data.categories.map((c: any) => c.name).sort());
          }
        }
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchCategories();
  }, []);

  const filteredParticipants = useMemo(() => {
    if (!Array.isArray(participants)) return [];
    if (selectedCategory === "All") return participants;
    return participants.filter((p: any) => p.categoryId?.name === selectedCategory);
  }, [participants, selectedCategory]);

  const downloadPDF = () => {
    if (!Array.isArray(participants) || participants.length === 0) {
      toast.error("No participants to download");
      return;
    }

    const doc = new jsPDF();
    
    // Group participants by category
    const grouped: any = {};
    participants.forEach((p: any) => {
      const catName = p.categoryId?.name || "Unknown Category";
      if (!grouped[catName]) {
        grouped[catName] = [];
      }
      grouped[catName].push(p);
    });

    let currentY = 14;
    doc.setFontSize(18);
    doc.text("Team Participants Roster", 14, currentY);
    currentY += 10;

    Object.keys(grouped).sort().forEach((catName) => {
      doc.setFontSize(14);
      doc.setTextColor(40, 40, 40);
      doc.text(`Category: ${catName}`, 14, currentY);
      currentY += 6;

      const tableData = grouped[catName].map((p: any) => {
        const compNames = p.competitionIds?.map((c: any) => c.name).join(", ") || "-";
        return [p.name, p.className, compNames];
      });

      autoTable(doc, {
        startY: currentY,
        head: [["Name", "Class", "Competitions"]],
        body: tableData,
        theme: "grid",
        styles: { fontSize: 10 },
        headStyles: { fillColor: [65, 84, 241] }, // Primary color
        margin: { left: 14 },
      });

      currentY = (doc as any).lastAutoTable.finalY + 15;
      
      if (currentY > 270) {
        doc.addPage();
        currentY = 14;
      }
    });

    doc.save("team_participants.pdf");
  };

  return (
    <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card p-6">
      <div className="flex flex-col sm:flex-row w-full justify-between pb-4 gap-4 sm:items-center">
        <h2 className="text-2xl font-bold text-dark dark:text-white">
          Team Participants
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="flex h-10 w-full sm:w-fit rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="All">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          <Button
            onClick={downloadPDF}
            variant="outline"
            className="flex h-10 w-full sm:w-fit items-center gap-2 border-primary text-primary hover:bg-primary/5"
          >
            <DownloadIcon className="h-4 w-4" />
            Download PDF
          </Button>
          <Link
            href={"/dashboard/team-participants/add"}
            className="flex w-fit justify-center rounded-lg bg-primary px-4 py-2 font-medium text-white hover:bg-opacity-90 whitespace-nowrap"
          >
            Add Participant
          </Link>
        </div>
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
            {filteredParticipants.length > 0 ? (
              filteredParticipants.map((item: any) => (
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
