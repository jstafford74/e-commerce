import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { NewBlog } from "@/lib/validators";
import * as dotenv from "dotenv";
import { format } from "date-fns";

dotenv.config();

const client = new MongoClient(
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017"
);

// Ensure tags exist in the tags collection
async function ensureTagsExist(tags: string[], database: MongoClient) {
  const tagsCollection = database.db("yourDatabaseName").collection("tags"); // Adjust your database name

  for (const tag of tags) {
    const existingTag = await tagsCollection.findOne({ name: tag });
    if (!existingTag) {
      await tagsCollection.insertOne({ name: tag }); // Insert tag if it does not exist
    }
  }
}

// PATCH function to update a blog post
export async function PATCH(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const { update }: { update: Partial<NewBlog> } = await request.json(); // Expecting the updated blog data

  const { slug } = params;
  try {
    await client.connect();
    const database = client.db("workday"); // Replace with your actual database name
    const blogs = database.collection<NewBlog>("blogs");

    // Convert the id to an ObjectId for MongoDB query
    // const objectId = new ObjectId(params.id);

    // Ensure that the tags exist if the tags array is provided
    if (update.tags && update.tags.length > 0) {
      await ensureTagsExist(update.tags, client);
    }

    // Update the blog post with the provided data
    const result = await blogs.updateOne(
      { slug },
      { $set: { ...update, updatedAt: format(new Date(), "MM-dd-yyyy") } },
      { upsert: false }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: "No documents matched the query" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Blog post updated successfully" });
  } catch (error) {
    console.error("Error updating blog post:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await client.close(); // Ensure the client connection is closed
  }
}

export async function GET(
  request: Request,
  { params }: { params: { slug: string[] } }
) {
  const { slug } = params;

  try {
    await client.connect();
    const database = client.db("workday"); // Replace with your actual database name
    const blogPosts = database.collection("blogs");

    const blogPost = await blogPosts.findOne({ slug }); // Assuming the blog document contains a slug field

    if (!blogPost) {
      return NextResponse.json(
        { message: "Blog post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(blogPost); // Return the found blog post
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await client.close(); // Ensure the client connection is closed
  }
}
