import { getLinkedSnapshots } from "@/db/snapshots";

export default async function SnapshotPage() {
  const snapshots = await getLinkedSnapshots();
  return (
    <div>
      <h1> Snapshots</h1>
      <div>{JSON.stringify(snapshots[0])}</div>
    </div>
  );
}
