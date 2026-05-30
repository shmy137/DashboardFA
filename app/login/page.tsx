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
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ username: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simple local auth: admin / admin
    setTimeout(() => {
      setLoading(false);
      if (form.username === "admin" && form.password === "admin") {
        if (typeof window !== "undefined") {
          localStorage.setItem("accessToken", "admin-token");
        }
        toast.success("Logged in successfully");
        router.push("/dashboard");
      } else {
        toast.error("Invalid credentials");
      }
    }, 600);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <Card className="w-full max-w-md mx-4">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2">
              <img src="../download.png" alt="Logo" className="h-23 w-50" />
            </CardTitle>
            {/* <CardDescription>Sign in with admin / admin</CardDescription> */}
          </CardHeader>

          <CardContent className="space-y-4 p-6 pt-0">
            <div>
              <Label htmlFor="username" className="pl-3 pb-2">
                Email
              </Label>
              <Input
                id="username"
                name="username"
                placeholder="Enter your email"
                value={form.username}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className="pl-3 pb-2">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
