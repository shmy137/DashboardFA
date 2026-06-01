"use client";
import React, { useEffect, useState } from "react";
import { JudgesTable } from "./_components/judges-table";
import { JudgesApi } from "@/lib/api/JudgesApi";

const Page = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchJudges = async () => {
    try {
      const res = await JudgesApi.getAllJudges();
      const responseData = res?.data;
      
      let finalData = [];
      if (Array.isArray(responseData)) finalData = responseData;
      else if (Array.isArray(responseData?.data)) finalData = responseData.data;
      else if (Array.isArray(responseData?.judges)) finalData = responseData.judges;
      else if (Array.isArray(responseData?.alljudges)) finalData = responseData.alljudges;
      else if (Array.isArray(responseData?.data?.judges)) finalData = responseData.data.judges;
      else if (Array.isArray(responseData?.data?.alljudges)) finalData = responseData.data.alljudges;
      else if (Array.isArray(responseData?.data?.data)) finalData = responseData.data.data;
      
      setData(Array.isArray(finalData) ? finalData : []);
    } catch (error) {
      console.error("Failed to fetch judges", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJudges();
  }, []);

  return (
    <div>
      {loading ? (
        <div className="p-8 text-center text-muted-foreground">Loading judges...</div>
      ) : (
        <JudgesTable judge={data} fetchJudges={fetchJudges} />
      )}
    </div>
  );
};

export default Page;
