"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import DeleteDialog from "@/components/shared/delete-dialog";
import { BlogPost } from "@/lib/validators";

const DeleteBlogPage = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [error, setError] = useState<string | null>(null);
  //   const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  //   const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const response = await fetch("/api/blogs");
        if (!response.ok) {
          throw new Error("Failed to fetch blog posts");
        }
        const posts = await response.json();
        setBlogPosts(posts);
      } catch (err) {
        let errorMessage = "An unknown error occurred";

        if (err instanceof Error) {
          errorMessage = err.message;
        }

        console.error("Error fetching blog posts:", errorMessage);
        setError(errorMessage);
      }
    };

    fetchBlogPosts();
  }, []);

  //   const openDeleteDialog = (postId: string) => {
  //     setSelectedPostId(postId);
  //     setDialogOpen(true); // Open the delete confirmation dialog
  //   };

  const deleteBlogPost = async (
    id: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch(`/api/blogs/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete blog post");
      }

      // If the deletion is successful
      return { success: true, message: "Blog post deleted successfully" };
    } catch (error) {
      console.error("Error deleting blog post:", error);
      // Here you could return failure message instead of throwing error
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "An unknown error occurred",
      };
    }
  };

  if (error) {
    return (
      <div className="error">
        <h2>Error loading companies:</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (blogPosts.length === 0) {
    return (
      <div className="loading">
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <h1 className="h2-bold">Blogs</h1>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Summary</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {blogPosts.length &&
              blogPosts.map((post: BlogPost) => (
                <TableRow key={post._id.toString()}>
                  <TableCell className="max-w-[100px] overflow-hidden whitespace-nowrap text-ellipsis">
                    {post._id.toString()}
                  </TableCell>
                  <TableCell className="max-w-[200px] overflow-hidden whitespace-nowrap text-ellipsis">
                    {post.title}
                  </TableCell>
                  <TableCell className="max-w-[200px] overflow-hidden whitespace-nowrap text-ellipsis">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="max-w-[50px] overflow-hidden whitespace-nowrap text-ellipsis text-center">
                    {post.summary}
                  </TableCell>
                  <TableCell>
                    <DeleteDialog id={post._id} action={deleteBlogPost} />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DeleteBlogPage;
