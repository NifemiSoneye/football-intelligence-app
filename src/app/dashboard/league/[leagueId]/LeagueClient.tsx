import { Match } from "@/types/football";
import { StandingRow } from "@/types/football";
import StandingsTable from "@/components/leagues/StandingsTable";
type Props = {
  fixtures: Match[];
  results: Match[];
  standings: StandingRow[];
};

export default function LeagueClient({ fixtures, results, standings }: Props) {
  return <StandingsTable standings={standings} />;
}
