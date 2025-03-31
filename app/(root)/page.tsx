"use client";
import { useEffect, useState } from "react";
import SnapshotChart, { TotalSnapshot } from "./snapshot-chart";

const Homepage = () => {
  const [snapshotData, setSnapshotData] = useState<TotalSnapshot[]>([]);

  useEffect(() => {
    const fetchSnapshots = async () => {
      try {
        const response = await fetch("/api/workday/grouped"); 
        if (!response.ok) {
          throw new Error("Failed to fetch snapshot data");
        }
        const data = await response.json();
        setSnapshotData(data); 
      } catch (err) {
        let errorMessage = "An unknown error occurred";

        if (err instanceof Error) {
          errorMessage = err.message; 
        }

        console.error("Error fetching snapshots:", errorMessage);
        // setError(errorMessage); //  finally {
      }
    };

    fetchSnapshots(); 
  }, []);

  return (
    <div>
      <h1> Snapshots</h1>
      <div>
        {snapshotData ? <SnapshotChart snapshotData={snapshotData} /> : null}
      </div>
    </div>
  );
};

export default Homepage;
