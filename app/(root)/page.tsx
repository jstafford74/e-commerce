import { getGroupedSnapshots } from "@/db/snapshots";


const Homepage = async () => {
  const snapshots = await getGroupedSnapshots();
  return (
    <div>
      <h1> Snapshots</h1>
      <div>{JSON.stringify(snapshots[0])}</div>
    </div>
  );
};

export default Homepage;
