"use client";
import React, { useEffect, useState } from "react";
import { GreenRoomTable } from "./_components/greenroom-table";
import { GreenRoomApi } from "@/lib/api/GreenRoomApi";

const Page = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGreenRooms = async () => {
    try {
      const res = await GreenRoomApi.getAllGreenRooms();
      const responseData = res?.data;
      
      let finalData = [];
      if (Array.isArray(responseData)) finalData = responseData;
      else if (Array.isArray(responseData?.data)) finalData = responseData.data;
      
      setData(Array.isArray(finalData) ? finalData : []);
    } catch (error) {
      console.error("Failed to fetch green rooms", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGreenRooms();
  }, []);

  return (
    <div>
      {loading ? (
        <div className="p-8 text-center text-muted-foreground">Loading green rooms...</div>
      ) : (
        <GreenRoomTable data={data} fetchGreenRooms={fetchGreenRooms} />
      )}
    </div>
  );
};

export default Page;
