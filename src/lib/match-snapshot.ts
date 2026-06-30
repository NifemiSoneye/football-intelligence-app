import { Match } from "@/types/football";

const CURATED_KEYS = [
  "ballPossession",
  "expectedGoals",
  "bigChanceCreated",
  "totalShotsOnGoal",
  "shotsOnGoal",
  "goalkeeperSaves",
  "cornerKicks",
  "fouls",
  "yellowCards",
  "passes",
  "accuratePasses",
  "accurateLongBalls",
  "accurateCross",
  "accurateThroughBall",
  "finalThirdEntries",
  "touchesInOppBox",
  "bigChanceScored",
  "offsides",
  "duelWonPercent",
  "groundDuelsPercentage",
  "aerialDuelsPercentage",
  "dribblesPercentage",
  "wonTacklePercent",
  "interceptionWon",
  "totalClearance",
  "ballRecovery",
  "errorsLeadToGoal",
  "goalkeeperSaves",
  "diveSaves",
  "goalsPrevented",
];

function buildStats(statistics: any[]) {
  const allPeriod = statistics.find((p: any) => p.period === "ALL");
  if (!allPeriod) return [];

  const stats: { name: string; home: string; away: string }[] = [];

  for (const group of allPeriod.groups) {
    for (const item of group.statisticsItems) {
      if (CURATED_KEYS.includes(item.key)) {
        stats.push({
          name: item.name,
          home: item.home,
          away: item.away,
        });
      }
    }
  }

  return stats;
}

function buildGoals(incidents: any[]) {
  return incidents
    .filter((i: any) => i.incidentType === "goal")
    .map((i: any) => ({
      player: i.player?.name ?? "Unknown",
      minute: i.addedTime ? `${i.time}+${i.addedTime}` : `${i.time}`,
      team: i.isHome ? "home" : "away",
      type:
        i.incidentClass === "penalty"
          ? "Penalty"
          : i.incidentClass === "ownGoal"
            ? "Own Goal"
            : i.footballPassingNetworkAction?.[0]?.bodyPart === "head"
              ? "Header"
              : "Regular",
    }));
}

function buildLineups(
  lineups: any,
  homeTeamName: string,
  awayTeamName: string,
) {
  const mapPlayers = (players: any[]) =>
    players
      .filter((p: any) => !p.substitute)
      .map((p: any) => ({
        name: p.player.name,
        position: p.position,
        jerseyNumber: p.jerseyNumber,
      }));

  return {
    home: {
      team: homeTeamName,
      formation: lineups.home.formation,
      players: mapPlayers(lineups.home.players),
    },
    away: {
      team: awayTeamName,
      formation: lineups.away.formation,
      players: mapPlayers(lineups.away.players),
    },
  };
}

export function buildMatchSnapshot(
  match: Match,
  sofascoreData: any,
  leagueId: number,
) {
  return {
    match: {
      leagueId: leagueId,
      homeTeam: match.homeTeam.name,
      awayTeam: match.awayTeam.name,
      score: {
        home: match.score.fullTime.home,
        away: match.score.fullTime.away,
      },
      halfTimeScore: {
        home: match.score.halfTime.home,
        away: match.score.halfTime.away,
      },
      competition: match.competition.name,
      matchday: match.matchday,
      date: match.utcDate,
    },
    goals: buildGoals(sofascoreData.incidents.incidents ?? []),
    stats: buildStats(sofascoreData.statistics.statistics ?? []),
    lineups: buildLineups(
      sofascoreData.lineups,
      match.homeTeam.name,
      match.awayTeam.name,
    ),
  };
}
