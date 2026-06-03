import { getLeagueTeams } from "@/lib/football-data";
import { NextRequest, NextResponse } from "next/server";
import { unstable_cache } from "next/cache";

const getCachedTeams = unstable_cache(
  async (leagueId: number) => getLeagueTeams(leagueId),
  ["teams"],
  { revalidate: 86400 },
);

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const leagueId = searchParams.get("leagueId");

  if (!leagueId) {
    return NextResponse.json(
      { error: "leagueId is required" },
      { status: 400 },
    );
  }

  try {
    const data = await getCachedTeams(Number(leagueId));
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch teams" },
      { status: 500 },
    );
  }
}
