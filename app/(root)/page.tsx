import { getGroupedSnapshots } from "@/db/snapshots";
import SnapshotChart, { TotalSnapshot } from "./snapshot-chart";

const Homepage = async () => {
  const snapshots: TotalSnapshot[] = await getGroupedSnapshots();
  return (
    <div>
      <h1> Snapshots</h1>
      <div>
        <SnapshotChart snapshotData={snapshots} />
      </div>
    </div>
  );
};

export default Homepage;
