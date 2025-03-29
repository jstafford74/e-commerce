import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";
import { addCompanySchema, NewCompany } from "@/lib/validators";

import * as dotenv from "dotenv";

dotenv.config();

const client = new MongoClient(
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017"
);

export async function POST(request: Request) {
  const newCompanyData: NewCompany = await request.json(); // Expecting the new company data in the request body
  console.log(newCompanyData);
 
  // Validate the incoming data against the schema
  const validationResult = addCompanySchema.safeParse(newCompanyData);
  if (!validationResult.success) {
    return NextResponse.json(
      { error: validationResult.error.format() },
      { status: 400 }
    ); // Return validation errors
  }

  const validatedCompany = validationResult.data; // Get the validated data

  try {
    await client.connect();
    const database = client.db("workday");
    const companies = database.collection("companies");

    // Insert the new company into the database
    const result = await companies.insertOne(validatedCompany);

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
