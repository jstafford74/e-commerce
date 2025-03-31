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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

import { addBlogSchema, NewBlog } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { JSX } from "react";
import slugify from "slugify";
import { ControllerRenderProps, useForm, UseFormReturn } from "react-hook-form";
import { adminBlogFormDefaultValues } from "@/lib/constants";
import { format } from "date-fns";

type AdminBlogComponentProps = {
  field: ControllerRenderProps<NewBlog>;
  form?: UseFormReturn<NewBlog, unknown, undefined>;
};

const SlugField = ({ field, form }: AdminBlogComponentProps) => (
  <div className="relative">
    <Input
      placeholder="Enter slug"
      {...field}
      value={typeof field.value === "string" ? field.value : ""}
    />
    <Button
      type="button"
      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-1 mt-2"
      onClick={() => {
        form?.setValue(
          "slug",
          slugify(form?.getValues("title"), { lower: true })
        );
      }}
    >
      Generate
    </Button>
  </div>
);

const blogFields: {
  name: string;
  display: string;
  component: ({ field, form }: AdminBlogComponentProps) => JSX.Element;
}[] = [
  {
    name: "title",
    display: "Title",
    component: ({ field }: AdminBlogComponentProps) => (
      <Input
        placeholder="Enter title"
        {...field}
        value={typeof field.value === "string" ? field.value : ""}
      />
    ),
  },
  {
    name: "slug",
    display: "Slug",
    component: ({ field, form }: AdminBlogComponentProps) => (
      <SlugField field={field} form={form} />
    ),
  },
  {
    name: "datePublished",
    display: "Date Published",
    component: ({ field }: AdminBlogComponentProps) => (
      <Input
        placeholder="Enter date published"
        {...field}
        value={typeof field.value === "string" ? field.value : ""}
      />
    ),
  },
  {
    name: "dateModified",
    display: "Date Modified",
    component: ({ field }: AdminBlogComponentProps) => (
      <Input
        placeholder="Enter date modified"
        {...field}
        value={typeof field.value === "string" ? field.value : ""}
      />
    ),
  },
  {
    name: "tags",
    display: "Tags",
    component: ({ field }: AdminBlogComponentProps) => (
      <Input
        placeholder="Enter tags"
        {...field}
        value={typeof field.value === "string" ? field.value : ""}
      />
    ),
  },
  {
    name: "summary",
    display: "Summary",
    component: ({ field }: AdminBlogComponentProps) => (
      <Input
        placeholder="Enter summary"
        {...field}
        value={typeof field.value === "string" ? field.value : ""}
      />
    ),
  },
  {
    name: "author",
    display: "Author",
    component: ({ field }: AdminBlogComponentProps) => (
      <Input
        placeholder="Enter author"
        {...field}
        value={typeof field.value === "string" ? field.value : ""}
      />
    ),
  },
  {
    name: "body",
    display: "Body",
    component: ({ field }: AdminBlogComponentProps) => (
      <Textarea
        {...field}
        placeholder="Enter blog post"
        value={typeof field.value === "string" ? field.value : ""}
      />
    ),
  },
];

const AdminBlogForm = () => {
  const { toast } = useToast();

  const form = useForm<NewBlog>({
    resolver: zodResolver(addBlogSchema),
    defaultValues: adminBlogFormDefaultValues,
  });

  const onSubmit = async (values: NewBlog) => {
    try {
      const res = await fetch(`/api/blogs/add`, {
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {blogFields.map((item) => {
          return (
            <div key={item.name}>
              <FormField
                control={form.control}
                name={
                  item.name as
                    | "title"
                    | "slug"
                    | "createdAt"
                    | "updatedAt"
                    | "tags"
                    | "summary"
                    | "author"
                    | "body"
                    | `tags.${number}`
                }
                render={({
                  field,
                }: {
                  field: ControllerRenderProps<NewBlog>;
                }) => (
                  <FormItem className="w-full">
                    <FormLabel>{item.display}</FormLabel>
                    <FormControl>{item.component({ field, form })}</FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          );
        })}
        <div className="flex-between mt-6">
          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
            onClick={() => {
                form?.setValue(
                  "createdAt",
                  format(new Date(), 'MM-dd-yyyy')
                );
              }}
          >
            {form.formState.isSubmitting ? "Submitting..." : "Add Blog Post"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AdminBlogForm;
