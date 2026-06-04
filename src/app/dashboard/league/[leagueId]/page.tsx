import { redirect } from "next/navigation";
import { db } from "@/db";
import { userPreferences, users } from "@/db/schema";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { eq } from "drizzle-orm";
import {
  getCachedLeagueFixtures,
  getCachedLeagueResults,
  getCachedStandings,
} from "@/lib/cached-football-data";
import LeagueClient from "./LeagueClient";

type Props = {
  params: Promise<{ leagueId: string }>;
};

export default async function LeaguePage({ params }: Props) {
  const { leagueId } = await params;
  const id = Number(leagueId);

  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user) redirect("/");

  const dbUser = await db.query.users.findFirst({
    where: eq(users.kindeId, user.id),
  });

  if (!dbUser) redirect("/");

  const standingsData = await getCachedStandings(id);
  const currentSeason = new Date(standingsData.season.startDate).getFullYear();

  const [fixturesData, resultsData] = await Promise.all([
    getCachedLeagueFixtures(id, currentSeason),
    getCachedLeagueResults(id, currentSeason),
  ]);

  return (
    <LeagueClient
      fixtures={fixturesData.matches}
      results={resultsData.matches}
      standings={standingsData}
    />
  );
}
