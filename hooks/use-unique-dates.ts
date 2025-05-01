"use-client";

import { useState, useEffect } from "react";

export function useUniqueSnapshotDates() {
  const [snapshotDates, setSnapshotDates] = useState<{ date: string }[]>([]);

  useEffect(() => {
    const fetchUniqueSnapshotDates = async () => {
      try {
        const response = await fetch("/api/snapshots/dates"); // Call the new API endpoint
        if (!response.ok) {
          throw new Error("Failed to fetch snapshot dates");
        }
        const data = await response.json();
        setSnapshotDates(data); // Set state with the returned company data
      } catch (err) {
        let errorMessage = "An unknown error occurred";

        if (err instanceof Error) {
          errorMessage = err.message; // Safely access the message
        }

        console.error("Error fetching snapshot dates:", errorMessage);
        // setError(errorMessage); //  finally {
      }
    };

    fetchUniqueSnapshotDates(); // Call the fetch function
  }, []);

  if (snapshotDates.length === 0) {
    return snapshotDates;
  }
}
