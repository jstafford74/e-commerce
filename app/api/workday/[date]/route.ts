import { NextResponse } from "next/server";
import { getLinkedSnapshots } from "../getLinkedSnapshot";

type Params = Promise<{ date: string }>;

export async function GET(request: Request, { params }: { params: Params }) {
  const { date } = await params; // Extract the date parameter from the request
console.log("Date param:", date); 
  try {
    const snapshots = await getLinkedSnapshots(date);
    return NextResponse.json(snapshots);
  } catch (error) {
    console.error("Error handling request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
