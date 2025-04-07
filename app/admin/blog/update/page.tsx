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
import UpdateBlogForm from "./update-blog-form";
import { BlogPost } from "@/lib/validators";
import { Button } from "@/components/ui/button";

export default function UpdateBlogPostPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);

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

  useEffect(() => {
    const fetchBlogPostById = async () => {
      try {
        if (selectedPostId) {
          const response = await fetch(`/api/blogs/update/${selectedPostId}`);
          if (!response.ok) {
            throw new Error("Failed to fetch blog posts");
          }
          const post = await response.json();
          const tags = Array.isArray(post.tags)
            ? post.tags.map((tag: { _id: string; name: string }) => tag.name)
            : [];
          const currentPost = { ...post, tags } as BlogPost;
          setBlogPost(currentPost);
        }
      } catch (err) {
        let errorMessage = "An unknown error occurred";

        if (err instanceof Error) {
          errorMessage = err.message;
        }

        console.error("Error fetching blog posts:", errorMessage);
      }
    };

    fetchBlogPostById();
  }, [selectedPostId]);

  // If there is an error, we display this message
  if (error) {
    return (
      <div className="error">
        <h2>Error loading blog posts:</h2>
        <p>{error}</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col md:flex-row">
      <div className="md:w-1/3 w-full p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Title</TableHead>
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
                    <Button onClick={() => setSelectedPostId(post._id)}>
                      {post.title}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      <div className="md:w-2/3 w-full p-4">
        {blogPost ? (
          <div>
            <h1 className="h2-bold">Update Blog Post</h1>
            <UpdateBlogForm selectedPost={blogPost} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
