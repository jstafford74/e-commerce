import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";
import { LinkedSnapshot } from "@/lib/validators";

dotenv.config();

const client = new MongoClient(
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017"
);

const snapshotPipeline = [
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

export async function getLinkedSnapshots(): Promise<LinkedSnapshot[] | void> {
  // const query = { active_applications: { $exists: false } };
  try {
    await client.connect();
    const database = client.db("workday");
    const snapshots = database.collection("opening_snapshots");

    const linkedSnapshots = await snapshots
      .aggregate(snapshotPipeline)
      .toArray();
    const snapshotString = JSON.stringify(linkedSnapshots, null, 2);
    const parsedSnapshots = JSON.parse(snapshotString);

    return parsedSnapshots;
  } catch (err) {
    console.log(JSON.stringify(err));
  }
}
