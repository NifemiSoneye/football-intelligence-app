const SOFASCORE_BASE_URL = "https://sofascore.p.rapidapi.com";

const sofascoreFetch = async (endpoint: string) => {
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

const TEAM_NAME_MAP: Record<string, string> = {
  "club atletico de madrid": "atletico madrid",
  "atletico de madrid": "atletico madrid",
  "real betis balompie": "real betis",
  "deportivo alaves": "alaves",
  "rayo vallecano de madrid": "rayo vallecano",
  "wolverhampton wanderers": "wolverhampton",
  "paris saint germain": "paris saintgermain",
  "olympique de marseille": "marseille",
  "olympique lyonnais": "lyon",
  "celta de vigo": "celta vigo",
  "real sociedad de futbol": "real sociedad",
  "psv eindhoven": "psv",
  "bayer 04 leverkusen": "bayer leverkusen",
  "sk slavia praha": "slavia praha",
  "afc ajax": "ajax",
  "ssc napoli": "napoli",
  paphos: "pafos",
  "fc bayern munchen": "bayern munchen",
  "bayern munchen": "bayern munchen",
};

const normalizeTeamName = (name: string) => {
  const normalized = name
    .toLowerCase()
    .replace(/ü/g, "u")
    .replace(/ö/g, "o")
    .replace(/ä/g, "a")
    .replace(/é/g, "e")
    .replace(/è/g, "e")
    .replace(/ñ/g, "n")
    .replace(/ø/g, "o")
    .replace(/å/g, "a")
    .replace(/\bafc\b/gi, "")
    .replace(/\bfc\b/gi, "")
    .replace(/\bcf\b/gi, "")
    .replace(/\bsc\b/gi, "")
    .replace(/\bac\b/gi, "")
    .replace(/\bud\b/gi, "")
    .replace(/\brcd\b/gi, "")
    .replace(/\brc\b/gi, "")
    .replace(/\bca\b/gi, "")
    .replace(/&/g, "")
    .replace(/\band\b/g, "")
    .replace(/-/g, " ")
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return TEAM_NAME_MAP[normalized] ?? normalized;
};

export const getSofascoreMatchId = async (
  tournamentId: number,
  seasonId: number,
  homeTeamName: string,
  awayTeamName: string,
  utcDate: string,
): Promise<number | null> => {
  try {
    const normalizedHome = normalizeTeamName(homeTeamName);
    const normalizedAway = normalizeTeamName(awayTeamName);
    const matchDate = new Date(utcDate).toISOString().split("T")[0];

    let pageIndex = 0;
    const MAX_PAGES = 20;

    while (pageIndex < MAX_PAGES) {
      const data = await sofascoreFetch(
        `/tournaments/get-last-matches?tournamentId=${tournamentId}&seasonId=${seasonId}&pageIndex=${pageIndex}`,
      );

      const events = data.events ?? [];
      if (events.length === 0) break;

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

      if (match) return match.id;

      // if earliest event on this page is already before our target date, stop
      const earliest = events[events.length - 1];
      const earliestDate = new Date(earliest.startTimestamp * 1000)
        .toISOString()
        .split("T")[0];
      if (earliestDate < matchDate) break;

      pageIndex++;
    }

    return null;
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
