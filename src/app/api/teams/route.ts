import { getLeagueTeams } from "@/lib/football-data";
import { NextRequest, NextResponse } from "next/server";

const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TIME = 60 * 1000; // 1 minute

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const leagueId = searchParams.get("leagueId");

  if (!leagueId) {
    return NextResponse.json(
      { error: "leagueId is required" },
      { status: 400 },
    );
  }
  const key = leagueId;
  const now = Date.now();

  const cached = cache.get(key);
  if (cached && now - cached.timestamp < CACHE_TIME) {
    return NextResponse.json(cached.data);
  }

  try {
    const data = await getLeagueTeams(Number(leagueId));
    cache.set(key, {
      data,
      timestamp: now,
    });
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch teams" },
      { status: 500 },
    );
  }
}
