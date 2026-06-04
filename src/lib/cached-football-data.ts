import { unstable_cache } from "next/cache";
import {
  getFixtures,
  getResults,
  getStandings,
  getLeagueTeams,
  getTeamInfo,
  getTeamFixtures,
  getTeamResults,
} from "./football-data";

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

export const getCachedStandings = unstable_cache(
  async (leagueId: number) => getStandings(leagueId),
  ["standings"],
  { revalidate: 3600 },
);

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

export const getCachedLeagueResults = unstable_cache(
  async (id: number, season?: number) => getResults(id, season),
  ["league-results"],
  { revalidate: 1800 },
);

export const getCachedLeagueFixtures = unstable_cache(
  async (id: number, season?: number) => getFixtures(id, season),
  ["league-fixtures"],
  { revalidate: 3600 },
);
