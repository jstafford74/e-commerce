import { getGroupedSnapshots } from "../getGroupedSnapshot";

import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const { pathname } = url;
  console.log("pathname:", pathname);
  try {
    const snapshots = await getGroupedSnapshots();
    console.log("snapshots:", snapshots);
    return NextResponse.json(snapshots);
  } catch (error) {
    console.error("Error handling request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
