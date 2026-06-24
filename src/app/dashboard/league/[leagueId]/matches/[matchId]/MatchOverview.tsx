// src/app/dashboard/league/[leagueId]/matches/[matchId]/MatchOverview.tsx
import { Match } from "@/types/football";

type Props = {
  match: Match;
  sofascoreData: any;
};

export default function MatchOverview({ match, sofascoreData }: Props) {
  return <div />;
}
