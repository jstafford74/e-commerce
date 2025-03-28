import { run } from "./mongo";
// import { ObjectId } from "mongodb";
import { LinkedSnapshot } from "@/lib/validators";

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
    },
  },
];

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
    },
  },
  {
    $sort: {
      _id: 1, // Sort by snapshot_date in ascending order
    },
  },
];

export async function getLinkedSnapshots(): Promise<LinkedSnapshot[] | void> {
  // const query = { active_applications: { $exists: false } };
  try {
    const snapshots = run("opening_snapshots");
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

export async function getGroupedSnapshots() {
  try {
    const snapshots = run("opening_snapshots");
    const groupedSnapshots = await snapshots
      .aggregate(groupedSnapshotsPipeline)
      .toArray();
    const snapshotString = JSON.stringify(groupedSnapshots, null, 2);
    const parsedSnapshots = JSON.parse(snapshotString);
    return parsedSnapshots;
  } catch (err) {
    console.log(JSON.stringify(err));
  }
}
