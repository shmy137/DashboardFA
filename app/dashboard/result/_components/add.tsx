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
import Link from "next/link";
import { ResultApi } from "@/lib/api/ResultApi";
import { CompetitionApi } from "@/lib/api/CompetitionApi";
import { TeamApi } from "@/lib/api/TeamApi";

const ResultForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [competitions, setCompetitions] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    competitionId: "",
    teamId: "",
    score: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const compRes = await CompetitionApi.getAllcompetitions();
        const compData = compRes?.data;
        let finalComp: any[] = [];
        if (Array.isArray(compData)) finalComp = compData;
        else if (Array.isArray(compData?.data)) finalComp = compData.data;

        setCompetitions(Array.isArray(finalComp) ? finalComp : []);

        const teamRes = await TeamApi.getAllTeams();
        const teamData = teamRes?.data;
        let finalTeam: any[] = [];
        if (Array.isArray(teamData)) finalTeam = teamData;
        else if (Array.isArray(teamData?.data)) finalTeam = teamData.data;

        setTeams(Array.isArray(finalTeam) ? finalTeam : []);
      } catch (error) {
        console.error("Failed to fetch competitions or teams", error);
      }
    };

    fetchData();
  }, []);

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
      const payload = {
        competitionId: formData.competitionId,
        teamId: formData.teamId,
        score: Number(formData.score),
      };

      const res = await ResultApi.createResult(payload);
      console.log("Result created:", res);

      router.push("/dashboard/result");
      router.refresh();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-9">
      <Card className="w-full max-w-2xl mx-auto mt-6">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Add Result</CardTitle>
            <CardDescription>
              Record a result by selecting the competition, team and score.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="competitionId">
                Competition <span className="text-destructive">*</span>
              </Label>
              <select
                id="competitionId"
                name="competitionId"
                value={formData.competitionId}
                onChange={handleChange}
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="" disabled>
                  Select a competition
                </option>
                {competitions.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="teamId">
                Team <span className="text-destructive">*</span>
              </Label>
              <select
                id="teamId"
                name="teamId"
                value={formData.teamId}
                onChange={handleChange}
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="" disabled>
                  Select a team
                </option>
                {teams.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="score">
                Score <span className="text-destructive">*</span>
              </Label>
              <Input
                id="score"
                name="score"
                type="number"
                placeholder="Enter score"
                value={formData.score}
                onChange={handleChange}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t p-6">
            <Button variant="outline" type="button" asChild>
              <Link href="/dashboard/result">Cancel</Link>
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Result"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default ResultForm;
