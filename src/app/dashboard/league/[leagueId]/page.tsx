import { redirect } from "next/navigation";
import { db } from "@/db";
import { userPreferences, users } from "@/db/schema";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { eq } from "drizzle-orm";
import {
  getCachedFixtures,
  getCachedResults,
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

  const [fixturesData, resultsData, standingsData] = await Promise.all([
    getCachedFixtures(id),
    getCachedResults(id),
    getCachedStandings(id),
  ]);

  return (
    <LeagueClient
      fixtures={fixturesData.matches}
      results={resultsData.matches}
      standings={standingsData.standings[0].table}
    />
  );
}
