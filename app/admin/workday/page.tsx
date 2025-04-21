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

import { useLinkedSnapshots } from "@/hooks/use-linked-snapshots";
import { useUniqueSnapshotDates } from "@/hooks/use-unique-dates";
import { useCompanies } from "@/hooks/use-companies";
import { useMemo } from "react";
import { isSameDay, parseISO } from "date-fns";

export default function WorkdayPage() {
  const companyData = useCompanies();
  const uniqueSnapshotDates = useUniqueSnapshotDates();
  const snapshotData = useLinkedSnapshots();

  const filteredSnapshotData = useMemo(() => {
    if (!snapshotData || uniqueSnapshotDates.length === 0) return null;

    const targetDate = uniqueSnapshotDates[0].date;

    const targetDateObject = parseISO(
      `${targetDate.split("-")[2]}-${targetDate.split("-")[0]}-${targetDate.split("-")[1]}`
    ); // Converts to YYYY-MM-DD format
    console.log("targetDateObject:", targetDateObject);
    // Filter snapshotData based on the converted date
    const filteredData = snapshotData.filter((snapshot) => {
      const snapshotDateObject = new Date(snapshot.snapshot_date);

      // Check if snapshot_date is a valid Date object
      if (isNaN(snapshotDateObject.getTime())) {
        console.error(`Invalid snapshot_date for document: ${snapshot}`);
        return false; // Invalid date
      }

      // Compare the two Date objects
      return isSameDay(snapshotDateObject, targetDateObject);
    });
    return filteredData;
  }, [snapshotData, uniqueSnapshotDates]);

  console.log("Filtered Snapshot Data:", filteredSnapshotData);
  return (
    <div className="space-y-2">
      <h1 className="h2-bold">Workday Dashboard</h1>
      <div className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 p-4">
            {companyData && snapshotData ? (
              <CompanyForm data={companyData} snapshots={snapshotData} />
            ) : null}
          </div>
          <div className="w-full md:w-1/2 p-4">Right Column</div>
        </div>

        <div className="space-y-2">
          {uniqueSnapshotDates.length && filteredSnapshotData?.length ? (
            <div>
              Snapshot Date: {uniqueSnapshotDates[0].date} | Total Companies:{" "}
              {filteredSnapshotData?.length}
            </div>
          ) : null}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>NAME</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Active Applications</TableHead>
                <TableHead>Inactive Applications</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSnapshotData &&
                filteredSnapshotData.map((company) => (
                  <TableRow key={company.name.toString()}>
                    <TableCell>{company.name.toString()}</TableCell>
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
                    <TableCell>{company.total ? company.total : 0} </TableCell>
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
    </div>
  );
}
