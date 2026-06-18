const SOFASCORE_BASE_URL = "https://sofascore.p.rapidapi.com";

const sofascoreFetch = async (endpoint: string) => {
  console.log(`Sofascore fetching: ${SOFASCORE_BASE_URL}${endpoint}`);
  const response = await fetch(`${SOFASCORE_BASE_URL}${endpoint}`, {
    headers: {
      "x-rapidapi-key": process.env.RAPIDAPI_KEY!,
      "x-rapidapi-host": "sofascore.p.rapidapi.com",
    },
    next: { revalidate: 86400 },
  });
  if (!response.ok) {
    throw new Error(`Sofascore API error: ${response.status}`);
  }
  return response.json();
};

const normalizeTeamName = (name: string) =>
  name
    .toLowerCase()
    .replace(/\s*fc\s*/gi, "")
    .trim();

export const getSofascoreMatchId = async (
  tournamentId: number,
  seasonId: number,
  homeTeamName: string,
  awayTeamName: string,
  utcDate: string,
): Promise<number | null> => {
  try {
    const data = await sofascoreFetch(
      `/tournaments/get-last-matches?tournamentId=${tournamentId}&seasonId=${seasonId}&pageIndex=0`,
    );
    const events = data.events ?? [];
    const normalizedHome = normalizeTeamName(homeTeamName);
    const normalizedAway = normalizeTeamName(awayTeamName);
    const matchDate = new Date(utcDate).toISOString().split("T")[0];

    const match = events.find((event: any) => {
      const home = normalizeTeamName(event.homeTeam?.name ?? "");
      const away = normalizeTeamName(event.awayTeam?.name ?? "");
      const eventDate = new Date(event.startTimestamp * 1000)
        .toISOString()
        .split("T")[0];
      return (
        home === normalizedHome &&
        away === normalizedAway &&
        eventDate === matchDate
      );
    });

    return match?.id ?? null;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const getSofascoreStatistics = async (matchId: number) => {
  try {
    return await sofascoreFetch(`/matches/get-statistics?matchId=${matchId}`);
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const getSofascoreLineups = async (matchId: number) => {
  try {
    return await sofascoreFetch(`/matches/get-lineups?matchId=${matchId}`);
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const getSofascoreIncidents = async (matchId: number) => {
  try {
    return await sofascoreFetch(`/matches/get-incidents?matchId=${matchId}`);
  } catch (err) {
    console.error(err);
    return null;
  }
};
