"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { JudgesApi } from "@/lib/api/JudgesApi";
import { CompetitionApi } from "@/lib/api/CompetitionApi";
import { CategoryApi } from "@/lib/api/CategoryApi";

const JudgeForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [competitions, setCompetitions] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  
  const [formData, setFormData] = useState({
    competitionIds: [] as string[],
    name: "",
    email: "",
    password: "",
    stageNo: "stage1",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [compRes, catRes] = await Promise.all([
          CompetitionApi.getAllcompetitions(),
          CategoryApi.GetAllCategories()
        ]);
        
        const compData = compRes?.data;
        let finalComps = [];
        if (Array.isArray(compData)) finalComps = compData;
        else if (Array.isArray(compData?.data)) finalComps = compData.data;
        else if (Array.isArray(compData?.competitions)) finalComps = compData.competitions;
        else if (Array.isArray(compData?.allcompetitions)) finalComps = compData.allcompetitions;
        else if (Array.isArray(compData?.data?.competitions)) finalComps = compData.data.competitions;
        else if (Array.isArray(compData?.data?.allcompetitions)) finalComps = compData.data.allcompetitions;
        else if (Array.isArray(compData?.data?.data)) finalComps = compData.data.data;
        setCompetitions(Array.isArray(finalComps) ? finalComps : []);

        const catData = catRes?.data;
        let finalCats = [];
        if (Array.isArray(catData)) finalCats = catData;
        else if (Array.isArray(catData?.data)) finalCats = catData.data;
        else if (Array.isArray(catData?.categories)) finalCats = catData.categories;
        else if (Array.isArray(catData?.allcategories)) finalCats = catData.allcategories;
        else if (Array.isArray(catData?.data?.categories)) finalCats = catData.data.categories;
        else if (Array.isArray(catData?.data?.allcategories)) finalCats = catData.data.allcategories;
        else if (Array.isArray(catData?.data?.data)) finalCats = catData.data.data;
        setCategories(Array.isArray(finalCats) ? finalCats : []);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (compId: string, checked: boolean) => {
    setFormData((prev) => {
      if (checked) {
        return { ...prev, competitionIds: [...prev.competitionIds, compId] };
      } else {
        return { ...prev, competitionIds: prev.competitionIds.filter(id => id !== compId) };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await JudgesApi.createJudge(formData);
      console.log("Judge created:", res);
      
      router.push("/dashboard/judges");
      router.refresh();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-9">
      <Card className="w-full max-w-3xl mx-auto mt-6">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Add New Judge</CardTitle>
            <CardDescription>
              Create a new judge account by filling out the information below.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2 pt-1">
              <Label htmlFor="name">Judge Name <span className="text-destructive">*</span></Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter judge name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-4 rounded-md border p-4 bg-muted/20">
              <p className="text-sm text-muted-foreground">The judge is automatically assigned to the competitions in their selected stage.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email <span className="text-destructive">*</span></Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter judge email address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password <span className="text-destructive">*</span></Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stageNo">Assigned Stage <span className="text-destructive">*</span></Label>
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
                </select>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t p-4 mt-5">
            <Button variant="outline" type="button" asChild>
              <Link href="/dashboard/judges">Cancel</Link>
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Judge"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default JudgeForm;
