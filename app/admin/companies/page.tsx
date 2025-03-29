"use client";

import { useEffect, useState } from "react";
import { deleteUser } from "@/lib/actions/user.actions";
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

import DeleteDialog from "@/components/shared/delete-dialog";
import { FullCompany } from "@/lib/validators";

const AdminCompanyPage = () => {
  const [companyData, setCompanyData] = useState<FullCompany[]>([]);

  const [error, setError] = useState<string | null>(null);

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
        setError(errorMessage); //  finally {
      }
    };

    fetchCompanies(); // Call the fetch function
  }, []);

  // If there is an error, we display this message
  if (error) {
    return (
      <div className="error">
        <h2>Error loading companies:</h2>
        <p>{error}</p>
      </div>
    );
  }

  // If there’s no data yet (during loading), display loading component
  if (companyData.length === 0) {
    return (
      <div className="loading">
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <h1 className="h2-bold">Companies</h1>
        <Button asChild variant="outline" size="sm">
          <Link href={`/admin/companies/add`}>Add New Company</Link>
        </Button>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>NAME</TableHead>
              <TableHead>URL</TableHead>
              <TableHead className="text-center">Active Apps</TableHead>
              <TableHead className="text-center">Inactive Apps</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companyData.length &&
              companyData.map((company: FullCompany) => (
                <TableRow key={company._id.toString()}>
                  <TableCell className="max-w-[100px] overflow-hidden whitespace-nowrap text-ellipsis">
                    {company._id.toString()}
                  </TableCell>
                  <TableCell>
                    <Button asChild variant="outline" size="sm">
                      <Link
                        target="_blank"
                        href={company.url}
                        rel="noopener noreferrer"
                        className="max-w-[200px] overflow-hidden whitespace-nowrap text-ellipsis"
                      >
                        {company.name}
                      </Link>
                    </Button>
                  </TableCell>
                  <TableCell className="max-w-[200px] overflow-hidden whitespace-nowrap text-ellipsis">
                    {company.url}
                  </TableCell>
                  <TableCell className="max-w-[50px] overflow-hidden whitespace-nowrap text-ellipsis text-center">
                    {company.active_applications
                      ? company.active_applications.length
                      : 0}{" "}
                  </TableCell>
                  <TableCell className="max-w-[50px] overflow-hidden whitespace-nowrap text-ellipsis text-center">
                    {company.inactive_applications
                      ? company.inactive_applications.length
                      : 0}
                  </TableCell>

                  <TableCell>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/companies/${company._id}`}>Edit</Link>
                    </Button>
                    <DeleteDialog id={company._id} action={deleteUser} />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default AdminCompanyPage;
