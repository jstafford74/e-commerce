import { run } from "./mongo";
import { Company } from "@/lib/validators";

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
export async function getAllCompanies(): Promise<Company[]> {
  // const query = { active_applications: { $exists: false } };
  const companies = run("companies");
  const allCompanies = (await companies
    .aggregate(findCompaniesPipeline)
    .toArray()) as Company[];
  // .find()
  // .sort({ active_applications: 1, name: 1 })
  // .project({ email: 0, password: 0, updated_at: 0 })
  // .toArray()) as Company[];
  const companiesString = JSON.stringify(allCompanies, null, 2);
  const parsedCompanies = JSON.parse(companiesString);
  return parsedCompanies;
}
