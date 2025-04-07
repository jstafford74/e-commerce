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

import {
  BlogPost,
  UpdateBlogPost,
  updateBlogPostSchema,
} from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { JSX } from "react";
import slugify from "slugify";
import { ControllerRenderProps, useForm, UseFormReturn } from "react-hook-form";

import { format } from "date-fns";

type UpdateBlogComponentProps = {
  field: ControllerRenderProps<UpdateBlogPost>;
  form?: UseFormReturn<UpdateBlogPost, unknown, undefined>;
};

const SlugField = ({ field, form }: UpdateBlogComponentProps) => (
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
  component: ({ field, form }: UpdateBlogComponentProps) => JSX.Element;
}[] = [
  {
    name: "title",
    display: "Title",
    component: ({ field }: UpdateBlogComponentProps) => (
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
    component: ({ field, form }: UpdateBlogComponentProps) => (
      <SlugField field={field} form={form} />
    ),
  },
  {
    name: "updatedAt",
    display: "Date Updated",
    component: ({ field }: UpdateBlogComponentProps) => (
      <Input
        placeholder="Enter date published"
        {...field}
        value={typeof field.value === "string" ? field.value : ""}
      />
    ),
  },
  {
    name: "tags",
    display: "Tags",
    component: ({ field }: UpdateBlogComponentProps) => (
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
    component: ({ field }: UpdateBlogComponentProps) => (
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
    component: ({ field }: UpdateBlogComponentProps) => (
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
    component: ({ field }: UpdateBlogComponentProps) => (
      <Textarea
        {...field}
        placeholder="Enter blog post"
        value={typeof field.value === "string" ? field.value : ""}
      />
    ),
  },
];

const UpdateBlogForm = ({ selectedPost }: { selectedPost: BlogPost }) => {
  const { toast } = useToast();

  const form = useForm<UpdateBlogPost>({
    resolver: zodResolver(updateBlogPostSchema),
    defaultValues: {
      ...selectedPost,
      tags: Array.isArray(selectedPost.tags)
        ? selectedPost.tags.map((tag: { _id: string; name: string }) => ({
            _id: tag._id || "",
            name: tag.name || "",
          }))
        : [],
    },
  });

  const onSubmit = async (values: UpdateBlogPost) => {
    console.log(values);
    try {
      const res = await fetch(`/api/blogs/update/${selectedPost._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ update: values }), // Send the update data
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
                    | "tags"
                    | "summary"
                    | "author"
                    | "body"
                }
                render={({
                  field,
                }: {
                  field: ControllerRenderProps<UpdateBlogPost>;
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
              form?.setValue("updatedAt", format(new Date(), "MM-dd-yyyy"));
            }}
          >
            {form.formState.isSubmitting ? "Submitting..." : "Update Blog Post"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default UpdateBlogForm;
