import { redirect } from "next/navigation";
import { db } from "@/db";
import { users } from "@/db/schema";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { eq } from "drizzle-orm";
import {
  getCachedTeamInfo,
  getCachedTeamResults,
  getCachedTeamFixtures,
} from "@/lib/cached-football-data";
import TeamClient from "./TeamClient";

type Props = {
  params: Promise<{ teamId: string }>;
};

export default async function TeamPage({ params }: Props) {
  const { teamId } = await params;
  const id = Number(teamId);

  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user) redirect("/");

  const dbUser = await db.query.users.findFirst({
    where: eq(users.kindeId, user.id),
  });

  if (!dbUser) redirect("/");

  try {
    const [teamInfo, resultsData, fixturesData] = await Promise.all([
      getCachedTeamInfo(id),
      getCachedTeamResults(id),
      getCachedTeamFixtures(id),
    ]);

    return (
      <TeamClient
        teamInfo={teamInfo}
        results={resultsData.matches}
        fixtures={fixturesData.matches}
      />
    );
  } catch (err) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 px-8 text-center">
        <p className="text-white text-xl font-bold font-display mb-2">
          TEAM DATA UNAVAILABLE
        </p>
        <p className="text-zinc-500 text-sm">
          Detailed team data is only available for teams in the top 5 European
          leagues.
        </p>
      </div>
    );
  }
}
