import { MongoClient, ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { Company } from "@/lib/validators";

import * as dotenv from "dotenv";

dotenv.config();

interface UpdateFilter {
  _id: ObjectId; // Allow _id to be either a string or ObjectId
}

const client = new MongoClient(
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017"
);

type Params = Promise<{ id: string }>;

export async function GET(
  request: Request,
  { params }: { params: Params }
) {
  await request.json();
  const { id } = await params;
  try {
    await client.connect();
    const database = client.db("workday");
    const companies = database.collection("companies");

    // Convert ID to ObjectId for querying
    const objectId = new ObjectId(id);
    const company = await companies.findOne({ _id: objectId }); // Use findOne to retrieve the document

    if (!company) {
      return NextResponse.json(
        { message: "Company not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(company); // Return the found company
  } catch (error) {
    console.error("Error fetching company:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

// Function to handle updating companies
export async function PUT(request: Request) {
  const {
    filter,
    update,
    upsert,
  }: { filter: UpdateFilter; update: object; upsert?: boolean } =
    await request.json();

  try {
    await client.connect();
    const database = client.db("workday");
    const companies = database.collection("companies");

    // Convert ID to ObjectId if it's present
    if (filter._id) {
      filter._id = new ObjectId(filter._id);
    }

    const result = await companies.updateOne(filter, update, {
      upsert: upsert ?? false,
    }); // Default upsert to false if not provided

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: "No documents matched the query, upserted: " + upsert },
        { status: 204 }
      );
    }

    return NextResponse.json({
      message: "Document updated successfully.",
      result,
    });
  } catch (error) {
    console.error("Error updating company:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Params }
) {
  const { update }: { update: Partial<Company> } = await request.json(); // Expecting the updated company data
  const { id } = await params; // Get the dynamic id from the request

  try {
    await client.connect();
    const database = client.db("workday");
    const companies = database.collection("companies");
    // Convert id to ObjectId
    const objectId = new ObjectId(id); // Always convert to ObjectId

    // Prepare the filter
    const filter = { _id: objectId };
    const result = await companies.updateOne(
      filter,
      { $set: update },
      { upsert: false }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: "No documents matched the query" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Company updated successfully" });
  } catch (error) {
    console.error("Error updating company:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await client.close(); // Close the client connection
  }
}
