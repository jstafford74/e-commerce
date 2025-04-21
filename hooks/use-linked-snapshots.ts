"use-client";

import { LinkedSnapshot } from "@/lib/validators";
import { useState, useEffect } from "react";

export function useLinkedSnapshots(date?: string | null) {
  const [snapshotData, setSnapshotData] = useState<LinkedSnapshot[]>([]);

  useEffect(() => {
    const fetchSnapshots = async () => {
      try {
        let url = "/api/workday";

        if (date) {
          url = `${url}/${date}`;
        }
        const response = await fetch(url); // Call the new API endpoint
        if (!response.ok) {
          throw new Error("Failed to fetch snapshot data");
        }
        const data = await response.json();
        setSnapshotData(data); // Set state with the returned company data
      } catch (err) {
        let errorMessage = "An unknown error occurred";

        if (err instanceof Error) {
          errorMessage = err.message; // Safely access the message
        }

        console.error("Error fetching snapshots:", errorMessage);
        // setError(errorMessage); //  finally {
      }
    };

    fetchSnapshots(); // Call the fetch function
  }, [date]);

  return snapshotData;
}
