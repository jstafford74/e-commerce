import { run } from "./mongo";
// import { ObjectId } from "mongodb";
import { LinkedSnapshot } from "@/lib/validators";

const snapshotPipeline = [
  //   {
  //     $match: {
  //       company_id: new ObjectId(id),
  //     },
  //   },
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
    },
  },
];

export async function getLinkedSnapshots(): Promise<LinkedSnapshot[]> {
  // const query = { active_applications: { $exists: false } };
  const snapshots = run("opening_snapshots");
  const linkedSnapshots = await snapshots.aggregate(snapshotPipeline).toArray();
  const snapshotString = JSON.stringify(linkedSnapshots, null, 2);
  const parsedSnapshots = JSON.parse(snapshotString);
  return parsedSnapshots;
}
