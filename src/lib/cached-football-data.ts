import { unstable_cache } from "next/cache";
import {
  getFixtures,
  getResults,
  getStandings,
  getLeagueTeams,
  getTeamInfo,
  getTeamFixtures,
  getTeamResults,
  getMatch,
} from "./football-data";
import {
  getSofascoreMatchId,
  getSofascoreStatistics,
  getSofascoreLineups,
  getSofascoreIncidents,
} from "./sofascore";

export const getCachedFixtures = unstable_cache(
  async (leagueId: number) => getFixtures(leagueId),
  ["fixtures"],
  { revalidate: 3600 },
);

export const getCachedResults = unstable_cache(
  async (leagueId: number) => getResults(leagueId),
  ["results"],
  { revalidate: 1800 },
);

export const getCachedStandings = (leagueId: number, season?: number) =>
  unstable_cache(
    async () => getStandings(leagueId, season),
    ["standings", String(leagueId), String(season ?? "current")],
    { revalidate: 3600 },
  )();

export const getCachedLeagueTeams = unstable_cache(
  async (leagueId: number) => getLeagueTeams(leagueId),
  ["league-teams"],
  { revalidate: 86400 },
);

export const getCachedTeamInfo = unstable_cache(
  async (teamId: number) => getTeamInfo(teamId),
  ["team-info"],
  { revalidate: 86400 },
);

export const getCachedTeamFixtures = unstable_cache(
  async (teamId: number) => getTeamFixtures(teamId),
  ["team-fixtures"],
  { revalidate: 3600 },
);

export const getCachedTeamResults = unstable_cache(
  async (teamId: number) => getTeamResults(teamId),
  ["team-results"],
  { revalidate: 1800 },
);

export const getCachedLeagueResults = (id: number, season?: number) =>
  unstable_cache(
    async () => getResults(id, season),
    ["league-results", String(id), String(season ?? "current")],
    { revalidate: 1800 },
  )();

export const getCachedLeagueFixtures = (id: number, season?: number) =>
  unstable_cache(
    async () => getFixtures(id, season),
    ["league-fixtures", String(id), String(season ?? "current")],
    { revalidate: 3600 },
  )();

export const getCachedSofascoreMatchData = unstable_cache(
  async (
    tournamentId: number,
    seasonId: number,
    homeTeamName: string,
    awayTeamName: string,
    utcDate: string,
    matchId: number,
  ) => {
    const sofascoreId = await getSofascoreMatchId(
      tournamentId,
      seasonId,
      homeTeamName,
      awayTeamName,
      utcDate,
    );

    if (!sofascoreId) return null;

    const [statistics, lineups, incidents] = await Promise.all([
      getSofascoreStatistics(sofascoreId),
      getSofascoreLineups(sofascoreId),
      getSofascoreIncidents(sofascoreId),
    ]);

    return { sofascoreId, statistics, lineups, incidents };
  },
  ["sofascore-match-data"],
  { revalidate: 86400, tags: ["sofascore-match-data"] },
);

export const getCachedMatch = unstable_cache(
  async (matchId: number) => getMatch(matchId),
  ["match"],
  { revalidate: 86400 },
);
