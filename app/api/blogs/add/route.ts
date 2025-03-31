import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";
import { addBlogSchema, NewBlog } from "@/lib/validators";

import * as dotenv from "dotenv";

dotenv.config();

const client = new MongoClient(
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017"
);

// Function to ensure tags exist in the database
async function ensureTagsExist(tags: string[], database: MongoClient) {
  const tagsCollection = database.db("workday").collection("tags");

  for (const tag of tags) {
    // Check if the tag already exists
    const existingTag = await tagsCollection.findOne({ name: tag });
    if (!existingTag) {
      // If the tag does not exist, insert it
      await tagsCollection.insertOne({ name: tag });
    }
  }
}

export async function POST(request: Request) {
  const newBlog: NewBlog = await request.json();

  // Validate the incoming data against the schema
  const validationResult = addBlogSchema.safeParse(newBlog);
  if (!validationResult.success) {
    return NextResponse.json(
      { error: validationResult.error.format() },
      { status: 400 }
    ); // Return validation errors
  }

  const validatedBlog = validationResult.data; // Get the validated data

  try {
    await client.connect();
    const database = client.db("workday");

    // Ensure tags exist before inserting the blog
    if (validatedBlog.tags && validatedBlog.tags.length > 0) {
      await ensureTagsExist(validatedBlog.tags, client);
    }

    const blogsCollection = database.collection("blogs");

    // Insert the new company into the database
    const result = await blogsCollection.insertOne(validatedBlog);

    return NextResponse.json(
      { message: "Company added successfully", id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding company:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await client.close(); // Ensure the client connection is closed
  }
}
