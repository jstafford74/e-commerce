import { getLinkedSnapshots } from "@/db/snapshots";

export default async function SnapshotPage() {
  const snapshots = await getLinkedSnapshots();
  if (snapshots?.length) {
    return (
      <div>
        <h1> Snapshots</h1>
        <div>{JSON.stringify(snapshots[0])}</div>
      </div>
    );
  }
  
}
