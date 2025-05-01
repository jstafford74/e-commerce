import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";
import { getLinkedSnapshots } from "../getLinkedSnapshot";
dotenv.config();

const client = new MongoClient(
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017"
);

export async function GET() {
  await client.connect();
  const database = client.db("workday");
  const snapshots = database.collection("opening_snapshots");

  try {
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
          $sort: { date: -1 }, // Sort by date in descending order
        },
      ])
      .toArray();

    if (uniqueDates && uniqueDates.length) {
      const latestSnapshots = await getLinkedSnapshots(uniqueDates[0].date);
      return NextResponse.json(latestSnapshots);
    }
  } catch (error) {
    console.error("Error handling request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
