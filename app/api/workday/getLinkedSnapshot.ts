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

/*
[
  {
    '$sort': {
      'snapshot_date': 1
    }
  }, {
    '$lookup': {
      'from': 'companies', 
      'localField': 'company_id', 
      'foreignField': '_id', 
      'as': 'company_details'
    }
  }, {
    '$unwind': {
      'path': '$company_details'
    }
  }, {
    '$group': {
      '_id': {
        'company_id': '$company_id', 
        'snapshot_date': '$snapshot_date'
      }, 
      'company_name': {
        '$first': '$company_details.name'
      }, 
      'total': {
        '$first': '$total'
      }, 
      'new_york': {
        '$first': '$new_york'
      }, 
      'connecticut': {
        '$first': '$connecticut'
      }, 
      'texas': {
        '$first': '$texas'
      }, 
      'massachusetts': {
        '$first': '$massachusetts'
      }, 
      'new_jersey': {
        '$first': '$new_jersey'
      }, 
      'maryland': {
        '$first': '$maryland'
      }, 
      'north_carolina': {
        '$first': '$north_carolina'
      }, 
      'florida': {
        '$first': '$florida'
      }, 
      'california': {
        '$first': '$california'
      }, 
      'remote': {
        '$first': '$remote'
      }, 
      'intern': {
        '$first': '$intern'
      }, 
      'director': {
        '$first': '$director'
      }, 
      'analyst': {
        '$first': '$analyst'
      }, 
      'manager': {
        '$first': '$manager'
      }, 
      'software': {
        '$first': '$software'
      }, 
      'engineer': {
        '$first': '$engineer'
      }, 
      'project': {
        '$first': '$project'
      }
    }
  }, {
    '$lookup': {
      'from': 'opening_snapshots', 
      'let': {
        'company_id': '$_id.company_id', 
        'current_date': '$_id.snapshot_date'
      }, 
      'pipeline': [
        {
          '$match': {
            '$expr': {
              '$and': [
                {
                  '$eq': [
                    '$company_id', '$$company_id'
                  ]
                }, {
                  '$lt': [
                    '$snapshot_date', '$$current_date'
                  ]
                }
              ]
            }
          }
        }, {
          '$sort': {
            'snapshot_date': -1
          }
        }, {
          '$limit': 1
        }
      ], 
      'as': 'previous_snapshot'
    }
  }, {
    '$project': {
      'company_id': '$_id.company_id', 
      'snapshot_date': '$_id.snapshot_date', 
      'previous_snapshot_date': {
        '$arrayElemAt': [
          '$previous_snapshot.snapshot_date', 0
        ]
      }, 
      'company_name': 1, 
      'total': 1, 
      'new_york': 1, 
      'connecticut': 1, 
      'texas': 1, 
      'massachusetts': 1, 
      'new_jersey': 1, 
      'maryland': 1, 
      'north_carolina': 1, 
      'florida': 1, 
      'california': 1, 
      'remote': 1, 
      'intern': 1, 
      'director': 1, 
      'analyst': 1, 
      'manager': 1, 
      'software': 1, 
      'engineer': 1, 
      'project': 1, 
      'previous_total': {
        '$arrayElemAt': [
          '$previous_snapshots.total', -1
        ]
      }, 
      'previous_new_york': {
        '$arrayElemAt': [
          '$previous_snapshots.new_york', -1
        ]
      }, 
      'previous_connecticut': {
        '$arrayElemAt': [
          '$previous_snapshots.connecticut', -1
        ]
      }, 
      'previous_texas': {
        '$arrayElemAt': [
          '$previous_snapshots.texas', -1
        ]
      }, 
      'previous_massachusetts': {
        '$arrayElemAt': [
          '$previous_snapshots.massachusetts', -1
        ]
      }, 
      'previous_new_jersey': {
        '$arrayElemAt': [
          '$previous_snapshots.new_jersey', -1
        ]
      }, 
      'previous_maryland': {
        '$arrayElemAt': [
          '$previous_snapshots.maryland', -1
        ]
      }, 
      'previous_north_carolina': {
        '$arrayElemAt': [
          '$previous_snapshots.north_carolina', -1
        ]
      }, 
      'previous_florida': {
        '$arrayElemAt': [
          '$previous_snapshots.florida', -1
        ]
      }, 
      'previous_california': {
        '$arrayElemAt': [
          '$previous_snapshots.california', -1
        ]
      }, 
      'previous_remote': {
        '$arrayElemAt': [
          '$previous_snapshots.remote', -1
        ]
      }, 
      'previous_intern': {
        '$arrayElemAt': [
          '$previous_snapshots.intern', -1
        ]
      }, 
      'previous_director': {
        '$arrayElemAt': [
          '$previous_snapshots.director', -1
        ]
      }, 
      'previous_analyst': {
        '$arrayElemAt': [
          '$previous_snapshots.analyst', -1
        ]
      }, 
      'previous_manager': {
        '$arrayElemAt': [
          '$previous_snapshots.manager', -1
        ]
      }, 
      'previous_software': {
        '$arrayElemAt': [
          '$previous_snapshots.software', -1
        ]
      }, 
      'previous_engineer': {
        '$arrayElemAt': [
          '$previous_snapshots.engineer', -1
        ]
      }, 
      'previous_project': {
        '$arrayElemAt': [
          '$previous_snapshots.project', -1
        ]
      }
    }
  }, {
    '$project': {
      'company_id': 1, 
      'company_name': 1, 
      'snapshot_date': 1, 
      'previous_snapshot_date': 1, 
      'total_change': {
        '$subtract': [
          '$total', '$previous_total'
        ]
      }, 
      'new_york_change': {
        '$subtract': [
          '$new_york', '$previous_new_york'
        ]
      }, 
      'connecticut_change': {
        '$subtract': [
          '$connecticut', '$previous_connecticut'
        ]
      }, 
      'texas_change': {
        '$subtract': [
          '$texas', '$previous_texas'
        ]
      }, 
      'massachusetts_change': {
        '$subtract': [
          '$massachusetts', '$previous_massachusetts'
        ]
      }, 
      'new_jersey_change': {
        '$subtract': [
          '$new_jersey', '$previous_new_jersey'
        ]
      }, 
      'maryland_change': {
        '$subtract': [
          '$maryland', '$previous_maryland'
        ]
      }, 
      'north_carolina_change': {
        '$subtract': [
          '$north_carolina', '$previous_north_carolina'
        ]
      }, 
      'florida_change': {
        '$subtract': [
          '$florida', '$previous_florida'
        ]
      }, 
      'california_change': {
        '$subtract': [
          '$california', '$previous_california'
        ]
      }, 
      'remote_change': {
        '$subtract': [
          '$remote', '$previous_remote'
        ]
      }, 
      'intern_change': {
        '$subtract': [
          '$intern', '$previous_intern'
        ]
      }, 
      'director_change': {
        '$subtract': [
          '$director', '$previous_director'
        ]
      }, 
      'analyst_change': {
        '$subtract': [
          '$analyst', '$previous_analyst'
        ]
      }, 
      'manager_change': {
        '$subtract': [
          '$manager', '$previous_manager'
        ]
      }, 
      'software_change': {
        '$subtract': [
          '$software', '$previous_software'
        ]
      }, 
      'engineer_change': {
        '$subtract': [
          '$engineer', '$previous_engineer'
        ]
      }, 
      'project_change': {
        '$subtract': [
          '$project', '$previous_project'
        ]
      }
    }
  }
]
*/
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
