"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CompetitionApi } from "@/lib/api/CompetitionApi";
import { CategoryApi } from "@/lib/api/CategoryApi";
import { cn } from "@/lib/utils";
import { TrashIcon, EditIcon, Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function CompetitionTable({ competition = [], fetchCompetitions }: any) {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [selectedStage, setSelectedStage] = useState<string>("All");
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await CategoryApi.GetAllCategories();
        const responseData = res?.data;
        let finalData = [];
        if (Array.isArray(responseData)) finalData = responseData;
        else if (Array.isArray(responseData?.data)) finalData = responseData.data;
        setCategories(Array.isArray(finalData) ? finalData : []);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userRole = localStorage.getItem("userRole") || "admin";
      setRole(userRole);
      
      const storedStage = localStorage.getItem("stageNo");
      if ((userRole === "greenroom" || userRole === "judge") && storedStage) {
        setSelectedStage(storedStage);
      }
    }
  }, []);

  const filteredCompetitions = useMemo(() => {
    if (!Array.isArray(competition)) return [];
    
    return competition.filter((c: any) => {
      const matchesCategory = selectedCategory === "All" || c.category === selectedCategory;
      const matchesSearch = c.name?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
      const matchesStatus = selectedStatus === "All" || (c.status || "pending").toLowerCase() === selectedStatus.toLowerCase();
      const matchesStage = selectedStage === "All" || c.stageNo === selectedStage || (selectedStage === "stage1" && !c.stageNo);
      
      return matchesCategory && matchesSearch && matchesStatus && matchesStage;
    });
  }, [competition, selectedCategory, searchQuery, selectedStatus, selectedStage]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredCompetitions.length / itemsPerPage) || 1;
  const paginatedCompetitions = filteredCompetitions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedStatus, selectedStage]);

  const DeleteFunction = async (id: any) => {
    const res = await CompetitionApi.deleteCompetition(id);
    if (res.data.success) {
      toast.success(res.data.message);
      if (fetchCompetitions) {
        fetchCompetitions();
      } else {
        window.location.reload();
      }
    } else {
      toast.error(res.data.message);
    }
  };

  return (
    <div className="w-full space-y-4 p-4 sm:p-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-dark dark:text-white">
          Competitions
        </h2>
        <p className="text-sm text-muted-foreground">
          View and manage all competitions
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search competitions..."
            className="w-full bg-white pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="flex h-10 w-fit rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="All">All Categories</option>
            {categories.map((cat: any) => (
              <option key={cat._id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>


            {/* status selection */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="flex h-10 w-fit rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Completed">Completed</option>
          </select>

          {/* stage selection */}
          {(role === "judge" || role === "greenroom" || role === "admin") && (
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              disabled={role === "greenroom" || role === "judge"} // lock it if they are bound to a stage
              className="flex h-10 w-fit rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="All">All Stages</option>
              <option value="stage1">Stage 1</option>
              <option value="stage2">Stage 2</option>
              <option value="stage3">Stage 3</option>
              <option value="stage4">Stage 4</option>
                <option value="Girls">Girls</option>

            </select>
          )}

          {role !== "judge" && role !== "team" && (
            <Link
              href={"/dashboard/competitions/add"}
              className="flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 mr-12"
            >
              Add
            </Link>
          )}
        </div>
      </div>

      <div className="flex flex-col overflow-hidden rounded-md border bg-white shadow-sm dark:bg-gray-dark">
        <div className="max-h-[calc(100vh-16rem)] overflow-auto">
          <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
              <TableHead className="font-semibold text-gray-900">Competition</TableHead>
              <TableHead className="font-semibold text-gray-900">Category</TableHead>
              <TableHead className="font-semibold text-gray-900">Category Type</TableHead>
              <TableHead className="font-semibold text-gray-900">Stage</TableHead>
              <TableHead className="font-semibold text-gray-900">Status</TableHead>
              {role !== "judge" && role !== "team" && <TableHead className="w-[100px] text-right font-semibold text-gray-900">Action</TableHead>}
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedCompetitions.length > 0 ? (
              paginatedCompetitions.map((item: any) => (
                <TableRow key={item._id} className="hover:bg-gray-50/50">
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="text-muted-foreground">{item.category}</TableCell>
                  <TableCell className="text-muted-foreground">{item.gender || "Boys"}</TableCell>
                  <TableCell className="text-muted-foreground capitalize">
                    {item.stageNo || "stage1"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={cn(
                      "font-normal",
                      (item.status === "Completed" || item.status === "completed") ? "bg-green-100 text-green-800" :
                      (item.status === "Ongoing" || item.status === "ongoing") ? "bg-blue-100 text-blue-800" :
                      "bg-gray-100 text-gray-700"
                    )}>
                      {item.status || "Pending"}
                    </Badge>
                  </TableCell>
                  {role !== "judge" && role !== "team" && (
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/dashboard/competitions/edit/${item._id}`}
                          className="p-2 text-gray-400 hover:text-primary transition-colors"
                        >
                          <span className="sr-only">Edit</span>
                          <EditIcon className="h-4 w-4" />
                        </Link>
                        <button
                          className="p-2 text-gray-400 hover:text-destructive transition-colors"
                          onClick={() => DeleteFunction(item._id)}
                        >
                          <span className="sr-only">Delete</span>
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={role !== "judge" && role !== "team" && role !== "greenroom" ? 6 : 5} className="h-24 text-center text-muted-foreground">
                  No competitions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        </div>

        {/* Pagination Footer */}
        <div className="flex items-center justify-between border-t bg-gray-50/50 px-6 py-2">
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="text-sm text-muted-foreground pr-8">
            Total: {filteredCompetitions.length}
          </div>
        </div>
      </div>
    </div>
  );
}
