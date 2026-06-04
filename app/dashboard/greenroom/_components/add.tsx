"use client";

import React, { useState } from "react";
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
import Link from "next/link";
import { GreenRoomApi } from "@/lib/api/GreenRoomApi";

const GreenRoomForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    stageNo: "stage1",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await GreenRoomApi.createGreenRoom(formData);
      router.push("/dashboard/greenroom");
      router.refresh();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-9">
      <Card className="w-full max-w-xl mx-auto mt-6">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Add Green Room User</CardTitle>
            <CardDescription>
              Create a new green room user account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name <span className="text-destructive">*</span></Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email <span className="text-destructive">*</span></Label>
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
              <Label htmlFor="password">Password <span className="text-destructive">*</span></Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Create a password"
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
                <option value="Girls">Girls</option>

              </select>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t p-4 mt-5">
            <Button variant="outline" type="button" asChild>
              <Link href="/dashboard/greenroom">Cancel</Link>
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save User"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default GreenRoomForm;
