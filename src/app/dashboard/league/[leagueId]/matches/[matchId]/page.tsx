import {
  getCachedMatch,
  getCachedSofascoreMatchData,
} from "@/lib/cached-football-data";
import { LEAGUES } from "@/lib/constants";
import MatchClient from "./MatchClient";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { eq, and } from "drizzle-orm";
import { db } from "@/db";
import { matchChatSession, users } from "@/db/schema";
import { buildMatchSnapshot } from "@/lib/match-snapshot";

type Props = {
  params: Promise<{ leagueId: string; matchId: string }>;
};

export default async function MatchPage({ params }: Props) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user) redirect("/");

  const dbUser = await db.query.users.findFirst({
    where: eq(users.kindeId, user.id),
  });

  if (!dbUser) redirect("/");

  const { leagueId, matchId } = await params;

  const leagueIdNum = Number(leagueId);
  const matchIdNum = Number(matchId);

  const league = LEAGUES.find((l) => l.id === leagueIdNum);

  const match = await getCachedMatch(matchIdNum);

  const isFinished = match?.status === "FINISHED";

  let sofascoreData: any = null;

  if (isFinished && league?.sofascore) {
    sofascoreData = await getCachedSofascoreMatchData(
      league.sofascore.tournamentId,
      league.sofascore.seasonId,
      match.homeTeam.name,
      match.awayTeam.name,
      match.utcDate,
      matchIdNum,
    );
  }

  if (isFinished && sofascoreData) {
    const existingSession = await db.query.matchChatSession.findFirst({
      where: and(
        eq(matchChatSession.matchId, matchIdNum),
        eq(matchChatSession.userId, dbUser.id),
      ),
    });

    if (!existingSession) {
      const snapshot = buildMatchSnapshot(match, sofascoreData);
      await db
        .insert(matchChatSession)
        .values({
          id: crypto.randomUUID(),
          userId: dbUser.id,
          matchId: matchIdNum,
          matchSnapshot: snapshot,
        })
        .onConflictDoNothing();
    }
  }

  return <MatchClient match={match} sofascoreData={sofascoreData} />;
}
