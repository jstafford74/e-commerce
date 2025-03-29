"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useToast } from "@/hooks/use-toast";

import { addCompanySchema, NewCompany } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";

import { ControllerRenderProps, useForm } from "react-hook-form";

const AddCompanyForm = () => {

  const { toast } = useToast();

  const form = useForm<NewCompany>({
    resolver: zodResolver(addCompanySchema),
    defaultValues: {
      name: "",
      url: "",
      email: "",
      password: "",
      equity_ticker: "",
      industry: "",
      sector: "",
    },
  });

  const onSubmit = async (values: NewCompany) => {
    try {
      const res = await fetch(`/api/companies/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values), // Send the update data
      });

      if (!res.ok) {
        const errorData = await res.json();
        return toast({
          variant: "destructive",
          description: errorData.message || "Update failed",
        });
      }

      const responseData = await res.json();
      toast({
        description: responseData.message,
      });
      form.reset();
      
    } catch (error) {
      toast({
        variant: "destructive",
        description: (error as Error).message,
      });
    }
  };

  const renderNameField = ({
    field,
  }: {
    field: ControllerRenderProps<NewCompany, "name">;
  }) => (
    <FormItem className="w-full">
      <FormLabel>Name</FormLabel>
      <FormControl>
        <Input placeholder="Enter company name" {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  );

  const renderUrlField = ({
    field,
  }: {
    field: ControllerRenderProps<NewCompany, "url">;
  }) => (
    <FormItem className="w-full">
      <FormLabel>URL</FormLabel>
      <FormControl>
        <Input placeholder="Enter URL" {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  );

  const renderEmailField = ({
    field,
  }: {
    field: ControllerRenderProps<NewCompany, "email">;
  }) => (
    <FormItem className="w-full">
      <FormLabel>Email</FormLabel>
      <FormControl>
        <Input placeholder="Enter email" {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  );

  const renderPasswordField = ({
    field,
  }: {
    field: ControllerRenderProps<NewCompany, "password">;
  }) => (
    <FormItem className="w-full">
      <FormLabel>Password</FormLabel>
      <FormControl>
        <Input placeholder="Enter password" {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  );

  const renderEquityTickerField = ({
    field,
  }: {
    field: ControllerRenderProps<NewCompany, "equity_ticker">;
  }) => (
    <FormItem className="w-full">
      <FormLabel>Equity Ticker</FormLabel>
      <FormControl>
        <Input placeholder="Enter equity ticker" {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  );

  const renderIndustryField = ({
    field,
  }: {
    field: ControllerRenderProps<NewCompany, "industry">;
  }) => (
    <FormItem className="w-full">
      <FormLabel>Industry</FormLabel>
      <FormControl>
        <Input placeholder="Enter industry" {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  );

  const renderSectorField = ({
    field,
  }: {
    field: ControllerRenderProps<NewCompany, "sector">;
  }) => (
    <FormItem className="w-full">
      <FormLabel>Sector</FormLabel>
      <FormControl>
        <Input placeholder="Enter sector" {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div>
          <FormField
            control={form.control}
            name="name"
            render={renderNameField}
          />
        </div>
        <div>
          <FormField
            control={form.control}
            name="url"
            render={renderUrlField}
          />
        </div>
        <div>
          <FormField
            control={form.control}
            name="email"
            render={renderEmailField}
          />
        </div>
        <div>
          <FormField
            control={form.control}
            name="password"
            render={renderPasswordField}
          />
        </div>
        <div>
          <FormField
            control={form.control}
            name="equity_ticker"
            render={renderEquityTickerField}
          />
        </div>
        <div>
          <FormField
            control={form.control}
            name="industry"
            render={renderIndustryField}
          />
        </div>
        <div>
          <FormField
            control={form.control}
            name="sector"
            render={renderSectorField}
          />
        </div>
        <div className="flex-between mt-6">
          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Submitting..." : "Update company"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddCompanyForm;
