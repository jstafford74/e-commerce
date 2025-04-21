import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";
import { LinkedSnapshot } from "@/lib/validators";


dotenv.config();

const client = new MongoClient(
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017"
);

// Define the type for aggregation stages
type SnapshotAggregationStage =
  | {
      $lookup: {
        from: string;
        localField: string;
        foreignField: string;
        as: string;
      };
    }
  | { $unwind: string }
  | { $project: { [key in keyof LinkedSnapshot]: 1 | 0 | string } }
  | { $match: { snapshot_date: { $gte: Date; $lte: Date } } };

const snapshotPipeline: SnapshotAggregationStage[] = [
  {
    $lookup: {
      from: "companies",
      localField: "company_id",
      foreignField: "_id",
      as: "company_details",
    },
  },
  {
    $unwind: "$company_details",
  },
  {
    $project: {
      _id: 0,
      company_id: 1,
      name: "$company_details.name",
      url: "$company_details.url",
      active_applications: "$company_details.active_applications",
      inactive_applications: "$company_details.inactive_applications",
      snapshot_date: 1,
      total: 1,
      new_york: 1,
      connecticut: 1,
      texas: 1,
      massachusetts: 1,
      new_jersey: 1,
      maryland: 1,
      north_carolina: 1,
      florida: 1,
      california: 1,
      remote: 1,
      intern: 1,
      director: 1,
      analyst: 1,
      manager: 1,
      software: 1,
      engineer: 1,
      project: 1,
    },
  },
];

export async function getLinkedSnapshots(
  dateParam?: string
): Promise<LinkedSnapshot[] | void> {
  
  try {
    await client.connect();
    const database = client.db("workday");
    const snapshots = database.collection("opening_snapshots");

    if (dateParam) {
      // Add a match stage to filter by the snapshot_date if a date is provided
      const parsedDate = new Date(dateParam); // Parse the provided date
      const startOfDay = new Date(parsedDate.setHours(0, 0, 0, 0)); // Start of the day
      const endOfDay = new Date(parsedDate.setHours(23, 59, 59, 999)); // End of the day

      snapshotPipeline.unshift({
        $match: {
          snapshot_date: {
            $gte: startOfDay,
            $lte: endOfDay,
          },
        },
      });
    }

    const linkedSnapshots = (await snapshots
      .aggregate(snapshotPipeline)
      .toArray()) as LinkedSnapshot[];

    return linkedSnapshots
   
  } catch (err) {
    console.log(JSON.stringify(err));
  }
}
