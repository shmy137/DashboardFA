"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { JudgesApi } from "@/lib/api/JudgesApi";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ username: "", password: "" });
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setErrorMsg(""); // Clear error on typing
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      // Check if trying to login as admin
      if (form.username === "admin") {
        if (form.password === "admin") {
          if (typeof window !== "undefined") {
            localStorage.setItem("accessToken", "admin-token");
            localStorage.setItem("userRole", "admin");
          }
          toast.success("Admin logged in successfully");
          router.push("/dashboard");
        } else {
          const errorText = "Invalid admin password.";
          setErrorMsg(errorText);
          toast.error(errorText);
        }
        return; // Don't proceed to judge login
      }

      // If not admin, try authenticating as Judge via backend API
      const res = await JudgesApi.loginJudge({
        email: form.username,
        password: form.password,
      });

      if (res?.data?.success) {
        if (typeof window !== "undefined") {
          localStorage.setItem("accessToken", `judge-token-${res.data.judgeId}`);
          localStorage.setItem("userRole", "judge");
          localStorage.setItem("judgeId", res.data.judgeId);
        }
        toast.success("Logged in successfully");
        router.push("/dashboard"); 
      } else {
        const errorText = res?.data?.message || "Invalid credentials. Please try again.";
        setErrorMsg(errorText);
        toast.error(errorText);
      }
    } catch (error: any) {
      const errorText = error.response?.data?.message || "An error occurred while logging in.";
      setErrorMsg(errorText);
      toast.error(errorText);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <Card className="w-full max-w-md mx-4">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2">
              <img src="../download.png" alt="Logo" className="h-23 w-50" />
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 p-6 pt-0">
            {errorMsg && (
              <div className="p-3 mb-2 rounded-md bg-destructive/15 text-destructive text-sm font-medium border border-destructive/20 text-center">
                {errorMsg}
              </div>
            )}
            
            <div>
              <Label htmlFor="username" className="pl-3 pb-2">
                Email / Username
              </Label>
              <Input
                id="username"
                name="username"
                placeholder="Enter your email or username"
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
