const BASE_URL = "https://api.football-data.org/v4";
import { StandingsResponse } from "@/types/football";
import { MatchesResponse } from "@/types/football";
import { TeamInfoResponse } from "@/types/football";

const footballFetch = async (endpoint: string) => {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      "X-Auth-Token": process.env.FOOTBALL_DATA_API_KEY!,
    },
  });
  if (!response.ok) {
    throw new Error(`Football API error: ${response.status}`);
  }
  return response.json();
};

export const getStandings = async (
  leagueId: number,
): Promise<StandingsResponse> => {
  try {
    return await footballFetch(`/competitions/${leagueId}/standings`);
  } catch (err) {
    console.error(err);
    throw new Error(`Failed to fetch standings for league ${leagueId}`);
  }
};
export const getFixtures = async (
  leagueId: number,
): Promise<MatchesResponse> => {
  try {
    return await footballFetch(
      `/competitions/${leagueId}/matches?status=SCHEDULED`,
    );
  } catch (err) {
    console.error(err);
    throw new Error(`Failed to fetch fixtures for league ${leagueId}`);
  }
};
export const getResults = async (
  leagueId: number,
): Promise<MatchesResponse> => {
  try {
    return await footballFetch(
      `/competitions/${leagueId}/matches?status=FINISHED`,
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
    return await footballFetch(`/teams/${teamId}`);
  } catch (err) {
    console.error(err);
    throw new Error(`Failed to fetch info for team ${teamId}`);
  }
};
export const getTeamFixtures = async (
  teamId: number,
): Promise<MatchesResponse> => {
  try {
    return await footballFetch(`/teams/${teamId}/matches?status=SCHEDULED`);
  } catch (err) {
    console.error(err);
    throw new Error(`Failed to fetch fixtures for team ${teamId}`);
  }
};
export const getTeamResults = async (
  teamId: number,
): Promise<MatchesResponse> => {
  try {
    return await footballFetch(`/teams/${teamId}/matches?status=FINISHED`);
  } catch (err) {
    console.error(err);
    throw new Error(`Failed to fetch fixtures for team ${teamId}`);
  }
};
