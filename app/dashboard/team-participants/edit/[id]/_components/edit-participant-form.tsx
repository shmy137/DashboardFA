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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { toast } from "sonner";
import { CategoryApi } from "@/lib/api/CategoryApi";
import { CompetitionApi } from "@/lib/api/CompetitionApi";
import { ParticipantApi } from "@/lib/api/ParticipantApi";

const EditParticipantForm = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);
  const [competitions, setCompetitions] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    className: "",
    categoryId: "",
    competitionIds: [] as string[],
  });

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const catRes = await CategoryApi.GetAllCategories();
        const catData = catRes?.data;
        let finalCats = [];
        if (Array.isArray(catData)) finalCats = catData;
        else if (Array.isArray(catData?.data)) finalCats = catData.data;
        setCategories(Array.isArray(finalCats) ? finalCats : []);

        const compRes = await CompetitionApi.getAllcompetitions();
        const compData = compRes?.data;
        let finalComps = [];
        if (Array.isArray(compData)) finalComps = compData;
        else if (Array.isArray(compData?.data)) finalComps = compData.data;
        setCompetitions(Array.isArray(finalComps) ? finalComps : []);

        const partRes = await ParticipantApi.getOneParticipant(id);
        const participant = partRes?.data?.data || partRes?.data;
        if (participant) {
          setFormData({
            name: participant.name || "",
            className: participant.className || "",
            categoryId: participant.categoryId?._id || participant.categoryId || "",
            competitionIds: participant.competitionIds?.map((c: any) => c._id || c) || [],
          });
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
        toast.error("Failed to load participant data");
      } finally {
        setInitialLoading(false);
      }
    };
    fetchAllData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (val: string) => {
    setFormData((prev) => ({ ...prev, categoryId: val, competitionIds: [] }));
  };

  const handleCompetitionChange = (compId: string, checked: boolean) => {
    setFormData((prev) => {
      let updatedCompetitions = [...prev.competitionIds];
      if (checked) {
        if (updatedCompetitions.length >= 4) {
          toast.warning("You can only select up to 4 competitions.");
          return prev;
        }
        updatedCompetitions.push(compId);
      } else {
        updatedCompetitions = updatedCompetitions.filter((id) => id !== compId);
      }
      return { ...prev, competitionIds: updatedCompetitions };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.categoryId) {
      toast.error("Please select a category.");
      return;
    }
    
    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        className: formData.className,
        categoryId: formData.categoryId,
        competitionIds: formData.competitionIds,
      };

      const res = await ParticipantApi.updateParticipant(id, payload);
      if (res?.data?.success) {
        toast.success(res.data.message || "Participant updated successfully");
        router.push("/dashboard/team-participants");
        router.refresh();
      } else {
        toast.error(res?.data?.message || "Failed to update participant");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to update participant");
    } finally {
      setLoading(false);
    }
  };

  const filteredCompetitions = formData.categoryId
    ? competitions.filter(
        (c) =>
          c.categoryId === formData.categoryId ||
          c.category === formData.categoryId ||
          c.categoryId?._id === formData.categoryId
      )
    : [];

  if (initialLoading) {
    return <div className="p-8 text-center">Loading form...</div>;
  }

  return (
    <div className="flex flex-col gap-9">
      <Card className="w-full max-w-2xl mx-auto mt-6 shadow-sm border">
        <form onSubmit={handleSubmit}>
          <CardHeader className="bg-muted/30 pb-6 border-b">
            <CardTitle className="text-2xl font-bold">Edit Participant</CardTitle>
            <CardDescription>
              Update student information and competition assignments.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Student Name <span className="text-destructive">*</span></Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="e.g. John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="className">Class / Grade <span className="text-destructive">*</span></Label>
                <Input
                  id="className"
                  name="className"
                  placeholder="e.g. 10th Grade"
                  value={formData.className}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Category <span className="text-destructive">*</span></Label>
              <select
                id="categoryId"
                name="categoryId"
                value={formData.categoryId}
                onChange={(e) => handleCategoryChange(e.target.value)}
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="" disabled>Select a category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name || cat.title || cat._id}
                  </option>
                ))}
              </select>
            </div>

            {formData.categoryId && (
              <div className="space-y-3 rounded-md border p-4 bg-muted/10">
                <div className="space-y-1">
                  <Label>Select Competitions (Max 4)</Label>
                  <p className="text-sm text-muted-foreground">
                    Choose up to 4 competitions from the selected category.
                  </p>
                </div>
                
                {filteredCompetitions.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {filteredCompetitions.map((comp) => {
                      const isChecked = formData.competitionIds.includes(comp._id);
                      const isMaxReached = formData.competitionIds.length >= 4 && !isChecked;
                      
                      return (
                        <div
                          key={comp._id}
                          className={`flex flex-row items-start space-x-3 space-y-0 p-3 rounded border transition-colors ${
                            isChecked ? "bg-primary/5 border-primary/20" : "bg-background"
                          } ${isMaxReached ? "opacity-60" : "hover:border-primary/50"}`}
                        >
                          <Checkbox
                            id={`comp-${comp._id}`}
                            checked={isChecked}
                            disabled={isMaxReached}
                            onCheckedChange={(checked) =>
                              handleCompetitionChange(comp._id, checked as boolean)
                            }
                          />
                          <div className="space-y-1 leading-none">
                            <Label
                              htmlFor={`comp-${comp._id}`}
                              className={`font-medium cursor-pointer ${
                                isMaxReached ? "cursor-not-allowed" : ""
                              }`}
                            >
                              {comp.name || comp.title}
                            </Label>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground p-3 bg-background rounded border">
                    No competitions found for this category.
                  </p>
                )}
                
                <div className="text-sm text-right font-medium text-muted-foreground">
                  {formData.competitionIds.length} / 4 Selected
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between border-t p-6 bg-muted/10">
            <Button variant="outline" type="button" asChild>
              <Link href="/dashboard/team-participants">Cancel</Link>
            </Button>
            <Button type="submit" disabled={loading || !formData.categoryId || formData.competitionIds.length === 0}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default EditParticipantForm;
