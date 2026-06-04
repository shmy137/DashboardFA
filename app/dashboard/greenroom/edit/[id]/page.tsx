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
import { GreenRoomApi } from "@/lib/api/GreenRoomApi";
import { toast } from "sonner";

const EditGreenRoomForm = () => {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    stageNo: "stage1",
  });

  useEffect(() => {
    const fetchGreenRoom = async () => {
      try {
        if (id) {
          const res = await GreenRoomApi.getOneGreenRoom(id as string);
          const data = res?.data?.data?.[0] || res?.data?.data || res?.data;

          if (data) {
            setFormData({
              name: data.name || "",
              email: data.email || "",
              password: "", // Keep password empty by default
              stageNo: data.stageNo || "stage1",
            });
          }
        }
      } catch (error) {
        console.error("Failed to fetch green room", error);
        toast.error("Failed to load green room user");
      } finally {
        setInitialLoading(false);
      }
    };
    fetchGreenRoom();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await GreenRoomApi.updateGreenRoom(id as string, formData);
      if (res?.data?.success) {
        toast.success("Green Room user updated successfully");
        router.push("/dashboard/greenroom");
        router.refresh();
      } else {
        toast.error(res?.data?.message || "Failed to update user");
      }
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast.error(
        error?.response?.data?.message || "Error updating green room user",
      );
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Loading data...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-9">
      <Card className="w-full max-w-2xl mx-auto mt-6">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Edit Green Room User
            </CardTitle>
            <CardDescription>
              Update the user's information below. Leave the password blank if
              you do not wish to change it.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">
                Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter user name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">New Password (Optional)</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter new password if changing"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stageNo">
                Assigned Stage <span className="text-destructive">*</span>
              </Label>
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
          </CardContent>
          <CardFooter className="flex justify-between border-t p-6">
            <Button variant="outline" type="button" asChild>
              <Link href="/dashboard/greenroom">Cancel</Link>
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update User"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default EditGreenRoomForm;
