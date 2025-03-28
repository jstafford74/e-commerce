import { getAllCompanies } from "@/db/companies";
import { getLinkedSnapshots } from "@/db/snapshots";
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

export default async function WorkdayPage() {
  const companyData = await getAllCompanies();
  const companySnapshots = await getLinkedSnapshots();

  return (
    <div className="space-y-2">
      <h1 className="h2-bold">Workday Dashboard</h1>
      <div className="mt-3">
        {companyData && companySnapshots ? (
          <CompanyForm data={companyData} snapshots={companySnapshots} />
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
