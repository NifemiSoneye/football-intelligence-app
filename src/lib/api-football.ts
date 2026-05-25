import { MatchResponse } from "@/types/football";

const BASE_URL = "https://v3.football.api-sports.io";

const footballFetch = async (endpoint: string) => {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      "x-apisports-key": process.env.API_FOOTBALL_API_KEY!,
    },
  });
  if (!response.ok) {
    throw new Error(`API Football error: ${response.status}`);
  }
  return response.json();
};

export const matchStats = async (matchId: number): Promise<MatchResponse> => {
  try {
    return await footballFetch(`/fixtures?id=${matchId}`);
  } catch (err) {
    console.error(err);
    throw new Error(`Failed to fetch statistics for match ${matchId}`);
  }
};
export const matchLineups = async (matchId: number): Promise<MatchResponse> => {
  try {
    return await footballFetch(`/fixtures/lineups?fixture=${matchId}`);
  } catch (err) {
    console.error(err);
    throw new Error(`Failed to fetch lineups for match ${matchId}`);
  }
};
export const matchEvents = async (matchId: number): Promise<MatchResponse> => {
  try {
    return await footballFetch(`/fixtures/events?fixture=${matchId}`);
  } catch (err) {
    console.error(err);
    throw new Error(`Failed to fetch events for match ${matchId}`);
  }
};
