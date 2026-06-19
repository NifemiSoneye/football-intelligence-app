import {
  getCachedMatch,
  getCachedSofascoreMatchData,
} from "@/lib/cached-football-data";
import { LEAGUES } from "@/lib/constants";
import MatchClient from "./MatchClient";
type Props = {
  params: Promise<{ leagueId: string; matchId: string }>;
};

export default async function MatchPage({ params }: Props) {
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

  return <MatchClient match={match} sofascoreData={sofascoreData} />;
}
