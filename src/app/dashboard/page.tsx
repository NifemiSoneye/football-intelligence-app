import { redirect } from "next/navigation";
import { db } from "@/db";
import { userPreferences, users } from "@/db/schema";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { eq } from "drizzle-orm";
import { getFixtures, getResults } from "@/lib/football-data";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user) redirect("/");

  const dbUser = await db.query.users.findFirst({
    where: eq(users.kindeId, user.id),
  });

  if (!dbUser) redirect("/");

  const prefs = await db.query.userPreferences.findFirst({
    where: eq(userPreferences.userId, dbUser.id),
  });

  const leagueIds = prefs?.favoriteLeaguesIds ?? [];
  const favoriteTeamIds = prefs?.favoriteTeamsIds ?? [];

  const [fixturesData, resultsData] = await Promise.all([
    Promise.all(leagueIds.map((id) => getFixtures(id))),
    Promise.all(leagueIds.map((id) => getResults(id))),
  ]);

  const fixtures = fixturesData.flatMap((r) => r.matches);
  const results = resultsData.flatMap((r) => r.matches);

  return (
    <DashboardClient
      fixtures={fixtures}
      results={results}
      leagueIds={leagueIds}
      favoriteTeamIds={favoriteTeamIds}
    />
  );
}
