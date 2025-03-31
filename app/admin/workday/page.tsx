"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import CompanyForm from "./company-form";
import { useEffect, useState } from "react";
import { FullCompany, LinkedSnapshot } from "@/lib/validators";

export default function WorkdayPage() {
  const [companyData, setCompanyData] = useState<FullCompany[]>([]);
  const [snapshotData, setSnapshotData] = useState<LinkedSnapshot[]>([]);

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

  useEffect(() => {
    const fetchSnapshots = async () => {
      try {
        const response = await fetch("/api/workday"); // Call the new API endpoint
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
  }, []);

  return (
    <div className="space-y-2">
      <h1 className="h2-bold">Workday Dashboard</h1>
      <div className="mt-3">
        {companyData && snapshotData ? (
          <CompanyForm data={companyData} snapshots={snapshotData} />
        ) : null}
      </div>
      <div className="space-y-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>NAME</TableHead>
              <TableHead>Active Application</TableHead>
              <TableHead>Inactive Applications</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companyData.length &&
              companyData.map((company) => (
                <TableRow key={company._id.toString()}>
                  <TableCell>{company._id.toString()}</TableCell>
                  <TableCell>
                    <Button asChild variant="outline" size="sm">
                      <Link
                        target="_blank"
                        href={company.url}
                        rel="noopener noreferrer"
                      >
                        {company.name}
                      </Link>
                    </Button>
                  </TableCell>

                  <TableCell>
                    {company.active_applications
                      ? company.active_applications.length
                      : 0}{" "}
                  </TableCell>
                  <TableCell>
                    {company.inactive_applications
                      ? company.inactive_applications.length
                      : 0}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
