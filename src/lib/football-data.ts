const BASE_URL = "https://api.football-data.org/v4";
import { StandingsResponse } from "@/types/football";
import { MatchesResponse } from "@/types/football";
import { TeamInfoResponse, TeamsResponse } from "@/types/football";

const footballFetch = async (endpoint: string, revalidate: number = 3600) => {
  console.log(`Fetching: ${BASE_URL}${endpoint}`);
  console.log(`Fetching: ${endpoint}`);
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      "X-Auth-Token": process.env.FOOTBALL_DATA_API_KEY!,
    },
    next: { revalidate },
  });
  if (!response.ok) {
    throw new Error(`Football API error: ${response.status}`);
  }
  return response.json();
};

export const getStandings = async (
  leagueId: number,
  season?: number,
): Promise<StandingsResponse> => {
  try {
    const params = new URLSearchParams();
    if (season) params.set("season", String(season));
    const query = season ? `?${params.toString()}` : "";
    return await footballFetch(
      `/competitions/${leagueId}/standings${query}`,
      3600,
    );
  } catch (err) {
    console.error(err);
    throw new Error(`Failed to fetch standings for league ${leagueId}`);
  }
};
export const getFixtures = async (
  leagueId: number,
  season?: number,
  days: number = 90,
): Promise<MatchesResponse> => {
  try {
    const params = new URLSearchParams({ status: "SCHEDULED" });

    if (season) {
      params.set("season", String(season));
    } else {
      const dateFrom = new Date();
      const dateTo = new Date();
      dateTo.setDate(dateFrom.getDate() + days);
      params.set("dateFrom", dateFrom.toISOString().split("T")[0]);
      params.set("dateTo", dateTo.toISOString().split("T")[0]);
    }

    return await footballFetch(
      `/competitions/${leagueId}/matches?${params.toString()}`,
      3600,
    );
  } catch (err) {
    console.error(err);
    throw new Error(`Failed to fetch fixtures for league ${leagueId}`);
  }
};
export const getResults = async (
  leagueId: number,
  season?: number,
  days: number = 90,
): Promise<MatchesResponse> => {
  try {
    const params = new URLSearchParams({ status: "FINISHED" });

    if (season) {
      params.set("season", String(season));
    } else {
      const dateTo = new Date();
      const dateFrom = new Date();
      dateFrom.setDate(dateTo.getDate() - days);
      params.set("dateFrom", dateFrom.toISOString().split("T")[0]);
      params.set("dateTo", dateTo.toISOString().split("T")[0]);
    }

    return await footballFetch(
      `/competitions/${leagueId}/matches?${params.toString()}`,
      1800,
    );
  } catch (err) {
    console.error(err);
    throw new Error(`Failed to fetch results for league ${leagueId}`);
  }
};
export const getTeamInfo = async (
  teamId: number,
): Promise<TeamInfoResponse> => {
  try {
    return await footballFetch(`/teams/${teamId}`, 86400);
  } catch (err) {
    console.error(err);
    throw new Error(`Failed to fetch info for team ${teamId}`);
  }
};
export const getTeamFixtures = async (
  teamId: number,
): Promise<MatchesResponse> => {
  try {
    return await footballFetch(
      `/teams/${teamId}/matches?status=SCHEDULED`,
      3600,
    );
  } catch (err) {
    console.error(err);
    throw new Error(`Failed to fetch fixtures for team ${teamId}`);
  }
};
export const getTeamResults = async (
  teamId: number,
  season?: number,
): Promise<MatchesResponse> => {
  try {
    const params = new URLSearchParams({ status: "FINISHED" });
    if (season) params.set("season", String(season));
    return await footballFetch(
      `/teams/${teamId}/matches?${params.toString()}`,
      1800,
    );
  } catch (err) {
    console.error(err);
    throw new Error(`Failed to fetch fixtures for team ${teamId}`);
  }
};

export const getLeagueTeams = async (
  leagueId: number,
): Promise<TeamsResponse> => {
  try {
    return await footballFetch(`/competitions/${leagueId}/teams`, 86400);
  } catch (err) {
    console.error(err);
    throw new Error(`Failed to fetch teams for league ${leagueId}`);
  }
};
