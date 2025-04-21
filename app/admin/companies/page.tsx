"use client";

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
import { LinkedSnapshot } from "@/lib/validators";
import { useLinkedSnapshots } from "@/hooks/use-linked-snapshots";

const AdminCompanyPage = () => {
  const snapshotData = useLinkedSnapshots();
  
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
              <TableHead>NAME</TableHead>
              <TableHead>URL</TableHead>
              <TableHead className="text-center">Total</TableHead>
              <TableHead className="text-center">Active Apps</TableHead>
              <TableHead className="text-center">Inactive Apps</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {snapshotData.length &&
              snapshotData.map((company: LinkedSnapshot) => (
                <TableRow
                  key={`${company.company_id.toString()}_${company.snapshot_date}`}
                >
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
                    {company.total ? company.total : 0}{" "}
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
                      <Link href={`/admin/companies/${company.company_id}`}>
                        Edit
                      </Link>
                    </Button>
                    <DeleteDialog id={company.company_id} action={deleteUser} />
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
