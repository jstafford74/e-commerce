import { MongoClient, WithId } from "mongodb";
import * as dotenv from "dotenv";
import { FullCompany } from "@/lib/validators";

dotenv.config();

const client = new MongoClient(
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017"
);

export async function getAllCompanies(): Promise<WithId<FullCompany>[]> {
  try {
    await client.connect();
    const database = client.db("workday"); // Replace with your actual database name
    const companies = database.collection<FullCompany>("companies");

    const allCompanies: WithId<FullCompany>[] = await companies
      .find({})
      .sort({ name: 1 })
      .toArray();

    return allCompanies; // Return the parsed companies
  } catch (error) {
    console.error("Error fetching all companies:", error);
    throw error; // Handle as needed
  } finally {
    await client.close();
  }
}
