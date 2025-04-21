"use-client";

import { FullCompany } from "@/lib/validators";
import { useState, useEffect } from "react";

export function useCompanies() {
  const [companyData, setCompanyData] = useState<FullCompany[]>([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch("/api/companies"); // Call the new API endpoint
        if (!response.ok) {
          throw new Error("Failed to fetch company data");
        }
        const data = await response.json();
        setCompanyData(data); // Set state with the returned company data
      } catch (err) {
        let errorMessage = "An unknown error occurred";

        if (err instanceof Error) {
          errorMessage = err.message; // Safely access the message
        }

        console.error("Error fetching companies:", errorMessage);
        // setError(errorMessage); //  finally {
      }
    };

    fetchCompanies(); // Call the fetch function
  }, []);

  return companyData;
}
