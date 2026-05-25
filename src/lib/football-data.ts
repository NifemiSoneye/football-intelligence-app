const BASE_URL = "https://api.football-data.org/v4";

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

export const getStandings = async (leagueId: number) => {
  try {
    return await footballFetch(`/competitions/${leagueId}/standings`);
  } catch (err) {
    console.error(err);
    throw new Error(`Failed to fetch standings for league ${leagueId}`);
  }
};
export const getFixtures = async (leagueId: number) => {
  try {
    return await footballFetch(
      `/competitions/${leagueId}/matches?status=SCHEDULED`,
    );
  } catch (err) {
    console.error(err);
    throw new Error(`Failed to fetch fixtures for league ${leagueId}`);
  }
};
export const getResults = async (leagueId: number) => {
  try {
    return await footballFetch(
      `/competitions/${leagueId}/matches?status=FINISHED`,
    );
  } catch (err) {
    console.error(err);
    throw new Error(`Failed to fetch results for league ${leagueId}`);
  }
};
export const getTeamInfo = async (teamId: number) => {
  try {
    return await footballFetch(`/teams/${teamId}`);
  } catch (err) {
    console.error(err);
    throw new Error(`Failed to fetch info for team ${teamId}`);
  }
};
export const getTeamFixtures = async (teamId: number) => {
  try {
    return await footballFetch(`/teams/${teamId}/matches?status=SCHEDULED`);
  } catch (err) {
    console.error(err);
    throw new Error(`Failed to fetch fixtures for team ${teamId}`);
  }
};
export const getTeamResults = async (teamId: number) => {
  try {
    return await footballFetch(`/teams/${teamId}/matches?status=FINISHED`);
  } catch (err) {
    console.error(err);
    throw new Error(`Failed to fetch fixtures for team ${teamId}`);
  }
};
