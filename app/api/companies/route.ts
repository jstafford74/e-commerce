import { NextResponse } from "next/server";
import { getAllCompanies } from "./getAllCompanies";
import { getCompaniesWithActiveApplications } from "./getActiveCompanies";

// GET handler for companies
export async function GET(request: Request) {
  const url = new URL(request.url);
  const { pathname } = url;

  try {
    if (pathname.endsWith("/active")) {
      const companies = await getCompaniesWithActiveApplications();
      return NextResponse.json(companies);
    } else {
      const companies = await getAllCompanies();
      return NextResponse.json(companies);
    }
  } catch (error) {
    console.error("Error handling request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
