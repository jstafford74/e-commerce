import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";
import { NextResponse } from "next/server";
dotenv.config();

const client = new MongoClient(
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017"
);

export async function GET() {
  try {
    await client.connect();
    const database = client.db("workday");
    const blogs = database.collection("blogs");
    const allBlogs = await blogs.find({}).sort({ name: 1 }).toArray();

    return NextResponse.json(allBlogs);
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
