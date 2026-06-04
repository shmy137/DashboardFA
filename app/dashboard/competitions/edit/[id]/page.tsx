"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { CompetitionApi } from "@/lib/api/CompetitionApi";
import { CategoryApi } from "@/lib/api/CategoryApi";
import { toast } from "sonner";

const EditCompetitionForm = () => {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    gender: "Boys",
    stageNo: "stage1",
    competitionType: "stage",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await CategoryApi.GetAllCategories();
        const responseData = catRes?.data;
        let finalData = [];
        if (Array.isArray(responseData)) finalData = responseData;
        else if (Array.isArray(responseData?.data)) finalData = responseData.data;
        setCategories(Array.isArray(finalData) ? finalData : []);

        if (id) {
          const compRes = await CompetitionApi.getOneCompetition(id);
          const compData = compRes?.data?.data?.[0] || compRes?.data?.data || compRes?.data;
          
          if (compData) {
            setFormData({
              name: compData.name || "",
              categoryId: compData.categoryId || "",
              gender: compData.gender || "Boys",
              stageNo: compData.stageNo || "stage1",
              competitionType: compData.competitionType || "stage",
            });
          }
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
        toast.error("Failed to load competition data");
      } finally {
        setInitialLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await CompetitionApi.updateCompetition(id, formData);
      if (res?.data?.success) {
        toast.success("Competition updated successfully");
        router.push("/dashboard/competitions");
        router.refresh();
      } else {
        toast.error(res?.data?.message || "Failed to update competition");
      }
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast.error(error?.response?.data?.message || "Error updating competition");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <div className="p-8 text-center text-muted-foreground">Loading competition data...</div>;
  }

  return (
    <div className="flex flex-col gap-9">
      <Card className="w-full max-w-2xl mx-auto mt-6">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Edit Competition</CardTitle>
            <CardDescription>
              Update the competition information below.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Competition Name <span className="text-destructive">*</span></Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter Competition name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="categoryId">Category <span className="text-destructive">*</span></Label>
              <select
                id="categoryId"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="" disabled>Select a category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="gender">Gender Section <span className="text-destructive">*</span></Label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="Boys">Boys</option>
                <option value="Girls">Girls</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="stageNo">Stage Number <span className="text-destructive">*</span></Label>
              <select
                id="stageNo"
                name="stageNo"
                value={formData.stageNo}
                onChange={handleChange}
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="stage1">Stage 1</option>
                <option value="stage2">Stage 2</option>
                <option value="stage3">Stage 3</option>
                <option value="stage4">Stage 4</option>
                <option value="Girls">Girls</option>

              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="competitionType">Competition Type <span className="text-destructive">*</span></Label>
              <select
                id="competitionType"
                name="competitionType"
                value={formData.competitionType}
                onChange={handleChange}
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="stage">Stage</option>
                <option value="off stage">Off Stage</option>
              </select>
            </div>
            
          </CardContent>
          <CardFooter className="flex justify-between border-t p-6">
            <Button variant="outline" type="button" asChild>
              <Link href="/dashboard/competitions">Cancel</Link>
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Competition"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default EditCompetitionForm;
