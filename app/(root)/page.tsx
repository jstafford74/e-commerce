"use client";
import { useEffect, useState } from "react";
import SnapshotChart from "./snapshot-chart";
import Link from "next/link";
import { BlogPost, TotalSnapshot } from "@/lib/validators";

const Homepage = () => {
  const [snapshotData, setSnapshotData] = useState<TotalSnapshot[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);

  const [searchValue, setSearchValue] = useState("");

  const filteredBlogPosts = posts.filter((post) => {
    const searchContent = post.title + post.summary + post.tags?.join(" ");
    return searchContent.toLowerCase().includes(searchValue.toLowerCase());
  });

  useEffect(() => {
    const fetchSnapshots = async () => {
      try {
        const response = await fetch("/api/workday/grouped");
        if (!response.ok) {
          throw new Error("Failed to fetch snapshot data");
        }
        const data = await response.json();
        setSnapshotData(data);
      } catch (err) {
        let errorMessage = "An unknown error occurred";

        if (err instanceof Error) {
          errorMessage = err.message;
        }

        console.error("Error fetching snapshots:", errorMessage);
        // setError(errorMessage); //  finally {
      }
    };

    fetchSnapshots();
  }, []);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const response = await fetch("/api/blogs");
        if (!response.ok) {
          throw new Error("Failed to fetch blog data");
        }
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        let errorMessage = "An unknown error occurred";

        if (err instanceof Error) {
          errorMessage = err.message;
        }

        console.error("Error fetching snapshots:", errorMessage);
        // setError(errorMessage); //  finally {
      }
    };

    fetchBlogPosts();
  }, []);

  return (
    <div>
      <h1> Snapshots</h1>
      <div>
        {snapshotData ? <SnapshotChart snapshotData={snapshotData} /> : null}
      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <div className="container mx-auto p-4">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/2 p-4">
              <div className="space-y-2 pt-6 pb-8 md:space-y-5">
                <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100">
                  Job Watch
                </h1>
                <div className="relative max-w-lg">
                  <label>
                    <span className="sr-only">Search articles</span>
                    <input
                      aria-label="Search articles"
                      type="text"
                      onChange={(e) => setSearchValue(e.target.value)}
                      placeholder="Search articles"
                      className="focus:border-primary-500 focus:ring-primary-500 block w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 dark:border-gray-900 dark:bg-gray-800 dark:text-gray-100"
                    />
                  </label>
                  <svg
                    className="absolute top-3 right-3 h-5 w-5 text-gray-400 dark:text-gray-300"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2 p-4">
              <h2 className="text-xl font-bold">About</h2>
              <p>
                This project was started in March 2025 to track the dynamism of
                the job market following the enactment of tariffs and creation
                of DOGE.
              </p>
              <br/>
              <p>
                The expectation is that free market capitalism will defeat
                socialist and communist economies in a radical and efficient
                manner. The transmission of this success will be reflected
                through the job market as more jobs are created and wages
                increase.
              </p>
            </div>
          </div>
        </div>

        <ul>
          {!filteredBlogPosts.length && "No posts found."}
          {filteredBlogPosts.map((post) => {
            const { slug, createdAt, title, summary } = post;
            return (
              <li key={slug} className="py-4">
                <article className="space-y-2 xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0">
                  <dl>
                    <dt className="sr-only">Published on</dt>
                    <dd className="text-base leading-6 font-medium text-gray-500 dark:text-gray-400">
                      <time dateTime={createdAt}>{createdAt}</time>
                    </dd>
                  </dl>
                  <div className="space-y-3 xl:col-span-3">
                    <div>
                      <h3 className="text-2xl leading-8 font-bold tracking-tight">
                        <Link
                          href={`/blog/${slug}`}
                          className="text-gray-900 dark:text-gray-100"
                        >
                          {title}
                        </Link>
                      </h3>
                      {/* <div className="flex flex-wrap">
                        {tags?.map((tag) => <Tag key={tag} text={tag} />)}
                      </div> */}
                    </div>
                    <div className="prose max-w-none text-gray-500 dark:text-gray-400">
                      {summary}
                    </div>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Homepage;
