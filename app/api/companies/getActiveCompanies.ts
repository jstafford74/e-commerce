import { MongoClient, WithId } from "mongodb";
import * as dotenv from "dotenv";
import { FullCompany } from "@/lib/validators";

dotenv.config();

const findCompaniesPipeline = [
  {
    $match: {
      active_applications: {
        $exists: true,
      },
    },
  },
  {
    $addFields: {
      activeLength: {
        $size: "$active_applications",
      },
    },
  },
  {
    $sort: {
      activeLength: -1,
      name: 1,
    },
  },
  {
    $project: {
      email: 0,
      password: 0,
      updated_at: 0,
    },
  },
];

const client = new MongoClient(
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017"
);

export async function getCompaniesWithActiveApplications(): Promise<
  WithId<FullCompany>[]
> {
  try {
    await client.connect();
    const database = client.db("workday"); // Replace with your actual database name
    const companies = database.collection<FullCompany>("companies");

    const allActiveCompanies = (await companies
      .aggregate(findCompaniesPipeline)
      .toArray()) as WithId<FullCompany>[];

    return allActiveCompanies; // Return the parsed companies
  } catch (error) {
    console.error("Error fetching companies with active applications:", error);
    throw error; // Handle as needed
  } finally {
    await client.close();
  }
}
