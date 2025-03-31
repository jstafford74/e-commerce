import { getGroupedSnapshots } from "../getGroupedSnapshot";

import { NextResponse } from "next/server";

export async function GET() {
  // const url = new URL(request.url);
  // const { pathname } = url;

  try {
    const snapshots = await getGroupedSnapshots();
 
    return NextResponse.json(snapshots);
  } catch (error) {
    console.error("Error handling request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
