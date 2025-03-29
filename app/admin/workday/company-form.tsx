"use client";

import { useMemo, useState, Dispatch, SetStateAction } from "react";
import {
  companySchema,
  Company,
  LinkedSnapshot,
} from "@/lib/validators";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import Charts from "./charts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  /*FormMessage,*/
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ControllerRenderProps, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
const defaultFormValue = {
  _id: "123",
  name: "default",
  url: "www.example.com",
  active_applications: [],
  inactive_applications: [],
};

const CustomSelect = ({
  field,
  data,
  company,

  setCompany,
}: {
  field: ControllerRenderProps<Company, "name">;
  data: Company[];
  company: string;

  setCompany: Dispatch<SetStateAction<string>>;
}) => {
  const handleValueChange = (value: string) => {
    setCompany(value);
    field.onChange(value);
  };

  return (
    <div>
      <FormLabel className="mb-2">Company</FormLabel>
      <Select onValueChange={handleValueChange} value={company.toString()}>
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Select a company" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {data.map((company) => (
            <SelectItem key={company.name} value={company._id}>
              {company.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default function CompanyForm({
  data,
  snapshots,
}: {
  data: Company[];
  snapshots: LinkedSnapshot[];
}) {
  const form = useForm<Company>({
    resolver: zodResolver(companySchema),
    defaultValues: defaultFormValue,
  });

  const [company, setCompany] = useState<string>("");
  //   const [currentSnapshot, setCurrentSnapshot] = useState<string>("");

  const renderField = ({
    field,
  }: {
    field: ControllerRenderProps<Company, "name">;
  }) => (
    <FormItem className="w-full mb-3">
      <CustomSelect
        field={field}
        data={data}
        company={company}
        setCompany={setCompany}
      />
    </FormItem>
  );

  const currentCompany = useMemo(() => {
    if (company) {
      return data.filter((corp) => corp._id === company)[0].name;
    } else {
      return "No Company Selected";
    }
  }, [company, data]);

  const linkedSnapshots = useMemo(() => {
    let result: Omit<LinkedSnapshot, "name" | "company_id">[] | null = null;

    if (snapshots) {
      result = snapshots
        .filter((shot) => shot.company_id === company)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .map(({ name, company_id, ...rest }) => rest);
    }
    return result;
  }, [company, snapshots]);

  const headerSnapshot = linkedSnapshots ? linkedSnapshots.slice(-3) : [];

  return (
    <div>
      <Form {...form}>
        <form method="POST" onSubmit={(values) => console.log(values)}>
          <FormField control={form.control} name="name" render={renderField} />
        </form>
      </Form>
      <Card className="col-span-4 mt-3">
        <CardHeader>
          <CardTitle>{currentCompany}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                {headerSnapshot.map((shot) => {
                  return (
                    <TableHead key={shot.snapshot_date}>
                      {shot.snapshot_date}
                    </TableHead>
                  );
                })}
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Total</TableCell>
                {headerSnapshot.map((shot) => {
                  return (
                    <TableCell key={`${shot.snapshot_date}_total`}>
                      {shot.total}
                    </TableCell>
                  );
                })}
              </TableRow>
              <TableRow>
                <TableCell>New York</TableCell>
                {headerSnapshot.map((shot) => {
                  return (
                    <TableCell key={`${shot.snapshot_date}_new_york`}>
                      {shot.new_york}
                    </TableCell>
                  );
                })}
              </TableRow>
              <TableRow>
                <TableCell>New Jersey</TableCell>
                {headerSnapshot.map((shot) => {
                  return (
                    <TableCell key={`${shot.snapshot_date}_new_jersey`}>
                      {shot.new_jersey}
                    </TableCell>
                  );
                })}
              </TableRow>
              <TableRow>
                <TableCell>Connecticut</TableCell>
                {headerSnapshot.map((shot) => {
                  return (
                    <TableCell key={`${shot.snapshot_date}_ct`}>
                      {shot.connecticut}
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
