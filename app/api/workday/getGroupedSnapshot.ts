import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";
import { convertDatesToMMDDYYYY } from "@/lib/utils";
// import { LinkedSnapshot } from "@/lib/validators";

dotenv.config();

const groupedSnapshotsPipeline = [
  {
    $group: {
      _id: "$snapshot_date", // Group by snapshot_date
      total: {
        $sum: "$total",
      },
      new_york: {
        $sum: "$new_york",
      },
      connecticut: {
        $sum: "$connecticut",
      },
      texas: {
        $sum: "$texas",
      },
      massachusetts: {
        $sum: "$massachusetts",
      },
      new_jersey: {
        $sum: "$new_jersey",
      },
      maryland: {
        $sum: "$maryland",
      },
      north_carolina: {
        $sum: "$north_carolina",
      },
      florida: {
        $sum: "$florida",
      },
      california: {
        $sum: "$california",
      },
      remote: {
        $sum: "$remote",
      },
      intern: {
        $sum: "$intern",
      },
      director: {
        $sum: "$director",
      },
      analyst: {
        $sum: "$analyst",
      },
      manager: {
        $sum: "$manager",
      },
      software: {
        $sum: "$software",
      },
      engineer: {
        $sum: "$engineer",
      },
      project: {
        $sum: "$project",
      },
    },
  },
  {
    $sort: {
      _id: 1, // Sort by snapshot_date in ascending order
    },
  },
];

const client = new MongoClient(
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017"
);

export async function getGroupedSnapshots() {
  try {
    await client.connect();
    const database = client.db("workday");
    const snapshots = database.collection("opening_snapshots");

    const groupedSnapshots = await snapshots
      .aggregate(groupedSnapshotsPipeline)
      .toArray();
    
    return groupedSnapshots.map((snapshot) => ({
      ...snapshot,
      _id: convertDatesToMMDDYYYY(snapshot._id),
    }));
    
  } catch (error) {
    console.error("Error fetching grouped snapshots:", error);
    throw error; // Handle as needed
  } finally {
    await client.close();
  }
}
