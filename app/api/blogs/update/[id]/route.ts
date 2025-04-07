import { MongoClient, ObjectId } from "mongodb";
import * as dotenv from "dotenv";
import { NextResponse } from "next/server";
import { BlogPost } from "@/lib/validators";
import { format } from "date-fns";
dotenv.config();

const client = new MongoClient(
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017"
);

type Params = Promise<{ id: string }>;
// Ensure tags exist in the tags collection
async function ensureTagsExist(tags: string[], database: MongoClient) {
  const tagsCollection = database.db("workday").collection("tags"); // Adjust your database name

  for (const tag of tags) {
    const existingTag = await tagsCollection.findOne({ name: tag });
    if (!existingTag) {
      await tagsCollection.insertOne({ name: tag }); // Insert tag if it does not exist
    }
  }
}

export async function PATCH(request: Request, { params }: { params: Params }) {
  const { update }: { update: Partial<BlogPost> } = await request.json(); // Expecting the updated blog data

  const { id } = await params;
  try {
    await client.connect();
    const database = client.db("workday"); // Replace with your actual database name
    const blogs = database.collection("blogs");

    // Convert the id to an ObjectId for MongoDB query
    const objectId = new ObjectId(id);

    // Ensure that the tags exist if the tags array is provided
    if (update.tags && update.tags.length > 0) {
      await ensureTagsExist(
        update.tags.map((tag: { _id: string; name: string }) => tag.name),
        client
      );
    }

    // Update the blog post with the provided data
    const result = await blogs.updateOne(
      { _id: objectId },
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

export async function GET(request: Request, { params }: { params: Params }) {
  const { id } = await params;

  const objectId = new ObjectId(id);
  try {
    await client.connect();
    const database = client.db("workday");
    const blogs = database.collection("blogs");
    const selectedBlog = await blogs.findOne({ _id: objectId });

    return NextResponse.json(selectedBlog);
  } catch (error) {
    console.error("Error handling request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
