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
    const snapshots = database.collection("opening_snapshots");

    // Aggregate to get unique snapshot dates
    const uniqueDates = await snapshots
      .aggregate([
        {
          $group: {
            _id: "$snapshot_date", // Group by snapshot_date field
          },
        },
        {
          $project: {
            _id: 0, // Exclude the default _id field from output
            date: { $dateToString: { format: "%m-%d-%Y", date: "$_id" } }, // Format the date
          },
        },
        {
            $sort: { date: -1 } // Sort by date in descending order
        }
      ])
      .toArray();

    return  NextResponse.json(uniqueDates);;
  } catch (error) {
    console.error("Error fetching unique snapshot dates:", error);
  } finally {
    await client.close();
  }
}
