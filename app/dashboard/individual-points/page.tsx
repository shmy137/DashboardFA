"use client";
import React, { useEffect, useState } from "react";
import { ResultApi } from "@/lib/api/ResultApi";
import { IndividualPointsTable } from "./_components/individual-points-table";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const IndividualPointsPage = () => {
  const [starData, setStarData] = useState<any[]>([]);
  const [penData, setPenData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchIndividualPoints = async () => {
    try {
      const res = await ResultApi.getIndividualPoints();
      const responseData = res?.data?.data;

      if (responseData) {
        setStarData(responseData.starOfTheFest || []);
        setPenData(responseData.penOfTheFest || []);
      }
    } catch (error) {
      console.error("Failed to fetch individual points", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIndividualPoints();
  }, []);

  return (
    <div className="p-4 sm:p-6 w-full max-w-5xl mx-auto space-y-6">
      {loading ? (
        <div className="p-8 text-center text-muted-foreground">
          Loading Individual Points...
        </div>
      ) : (
        <Tabs defaultValue="star" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-6">
            <TabsTrigger value="star">Star of the Fest</TabsTrigger>
            <TabsTrigger value="pen">Pen of the Fest</TabsTrigger>
          </TabsList>
          <TabsContent value="star">
            <IndividualPointsTable 
              individualPoints={starData} 
              title="Star of the Fest" 
              description="Top scorer with at least one stage event" 
            />
          </TabsContent>
          <TabsContent value="pen">
            <IndividualPointsTable 
              individualPoints={penData} 
              title="Pen of the Fest" 
              description="Top scorer in off-stage events" 
            />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default IndividualPointsPage;
