import { redirect } from "next/navigation";
import { db } from "@/db";
import { users } from "@/db/schema";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { eq } from "drizzle-orm";
import {
  getCachedLeagueFixtures,
  getCachedLeagueResults,
  getCachedStandings,
} from "@/lib/cached-football-data";
import LeagueClient from "./LeagueClient";
import { LEAGUES } from "@/lib/constants";

type Props = {
  params: Promise<{ leagueId: string }>;
  searchParams: Promise<{ season?: string; tab?: string }>;
};

export default async function LeaguePage({ params, searchParams }: Props) {
  const { leagueId } = await params;
  const { season } = await searchParams;
  const id = Number(leagueId);

  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user) redirect("/");

  const dbUser = await db.query.users.findFirst({
    where: eq(users.kindeId, user.id),
  });

  if (!dbUser) redirect("/");

  // always fetch current season standings first to get the current year
  const currentStandingsData = await getCachedStandings(id);
  const currentSeason = new Date(
    currentStandingsData.season.startDate,
  ).getFullYear();
  const league = LEAGUES.find((l) => l.id === id);
  const previousSeason = league?.previousSeasonYear ?? currentSeason - 1;
  // selected season from URL param, default to current
  const selectedSeason = season ? Number(season) : currentSeason;
  const isPreviousSeason = selectedSeason === previousSeason;

  // fetch standings for selected season
  const standingsData = isPreviousSeason
    ? await getCachedStandings(id, previousSeason)
    : currentStandingsData;

  const [fixturesData, resultsData] = await Promise.all([
    getCachedLeagueFixtures(id, selectedSeason),
    getCachedLeagueResults(id, selectedSeason),
  ]);
  const supportsPreviousSeason = league?.supportsPreviousSeason !== false;

  return (
    <LeagueClient
      fixtures={fixturesData.matches}
      results={resultsData.matches}
      standings={standingsData}
      leagueId={id}
      currentSeason={currentSeason}
      previousSeason={previousSeason}
      selectedSeason={selectedSeason}
      supportsPreviousSeason={supportsPreviousSeason}
    />
  );
}
