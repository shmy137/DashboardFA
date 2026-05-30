"use client";
import React, { useEffect, useState } from "react";
import { ResultApi } from "@/lib/api/ResultApi";
import { ResultTable } from "./_components/result-table";

const Page = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchResults = async () => {
    try {
      const res = await ResultApi.getAllResults();
      const responseData = res?.data;

      let finalData: any[] = [];
      if (Array.isArray(responseData)) finalData = responseData;
      else if (Array.isArray(responseData?.data)) finalData = responseData.data;

      setData(Array.isArray(finalData) ? finalData : []);
    } catch (error) {
      console.error("Failed to fetch results", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  return (
    <div>
      {loading ? (
        <div className="p-8 text-center text-muted-foreground">
          Loading Results...
        </div>
      ) : (
        <ResultTable results={data} fetchResults={fetchResults} />
      )}
    </div>
  );
};

export default Page;
