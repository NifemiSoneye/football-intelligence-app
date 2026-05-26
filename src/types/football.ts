// ============================================================
// Shared types (used across football-data.org responses)
// ============================================================

export interface Area {
  id: number;
  name: string;
  code: string;
  flag: string;
}

export interface Competition {
  id: number;
  name: string;
  code: string;
  type: string;
  emblem: string;
}

export interface Season {
  id: number;
  startDate: string;
  endDate: string;
  currentMatchday: number;
  winner: string | null;
}

// ============================================================
// football-data.org — Standings
// ============================================================

export interface StandingsResponse {
  filters: StandingsFilters;
  area: Area;
  competition: Competition;
  season: Season;
  standings: Standing[];
}

export interface StandingsFilters {
  season: string;
}

export interface Standing {
  stage: string;
  type: string;
  group: string | null;
  table: StandingRow[];
}

export interface StandingRow {
  position: number;
  team: StandingTeam;
  playedGames: number;
  form: string | null;
  won: number;
  draw: number;
  lost: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
}

export interface StandingTeam {
  id: number;
  name: string;
  shortName: string;
  tla: string;
  crest: string;
}

// ============================================================
// football-data.org — Fixtures & Results (same shape)
// ============================================================

export interface MatchesResponse {
  filters: MatchesFilters;
  resultSet: ResultSet;
  competition: Competition;
  matches: Match[];
}

export interface MatchesFilters {
  season: string;
  status: string[];
}

export interface ResultSet {
  count: number;
  first: string;
  last: string;
  played: number;
}

export interface Match {
  area: Area;
  competition: Competition;
  season: Season;
  id: number;
  utcDate: string;
  status: string;
  matchday: number | null;
  stage: string;
  group: string | null;
  lastUpdated: string;
  homeTeam: MatchTeam;
  awayTeam: MatchTeam;
  score: MatchScore;
  odds: Odds;
  referees: Referee[];
}

export interface MatchTeam {
  id: number;
  name: string;
  shortName: string;
  tla: string;
  crest: string;
}

export interface MatchScore {
  winner: string | null;
  duration: string;
  fullTime: ScoreDetail;
  halfTime: ScoreDetail;
}

export interface ScoreDetail {
  home: number | null;
  away: number | null;
}

export interface Odds {
  msg: string;
}

export interface Referee {
  id: number;
  name: string;
  type: string;
  nationality: string;
}

// ============================================================
// football-data.org — Team Info
// ============================================================

export interface TeamInfoResponse {
  area: Area;
  id: number;
  name: string;
  shortName: string;
  tla: string;
  crest: string;
  address: string;
  website: string;
  founded: number;
  clubColors: string;
  venue: string;
  runningCompetitions: Competition[];
  coach: TeamCoach;
  squad: SquadMember[];
  staff: unknown[];
  lastUpdated: string;
}

export interface TeamCoach {
  id: number;
  firstName: string;
  lastName: string;
  name: string;
  dateOfBirth: string;
  nationality: string;
  contract: Contract;
}

export interface Contract {
  start: string;
  until: string;
}

export interface SquadMember {
  id: number;
  name: string;
  position: string;
  dateOfBirth: string;
  nationality: string;
}

// ============================================================
// API-Football — Match Stats, Lineups, Events
// ============================================================

export interface MatchResponse {
  get: string;
  parameters: { id: string };
  errors: unknown[];
  results: number;
  paging: Paging;
  response: MatchData[];
}

export interface Paging {
  current: number;
  total: number;
}

export interface MatchData {
  fixture: FixtureInfo;
  league: FixtureLeague;
  teams: FixtureTeams;
  goals: FixtureGoals;
  score: FixtureScore;
  events: MatchEvent[];
  lineups: TeamLineup[];
  statistics: TeamStatistics[];
  players: PlayerStats[];
}

export interface FixtureInfo {
  id: number;
  referee: string;
  timezone: string;
  date: string;
  timestamp: number;
  periods: { first: number; second: number };
  venue: Venue;
  status: FixtureStatus;
}

export interface Venue {
  id: number;
  name: string;
  city: string;
}

export interface FixtureStatus {
  long: string;
  short: string;
  elapsed: number;
  extra: number | null;
}

export interface FixtureLeague {
  id: number;
  name: string;
  country: string;
  logo: string;
  flag: string;
  season: number;
  round: string;
  standings: boolean;
}

export interface FixtureTeams {
  home: FixtureTeam;
  away: FixtureTeam;
}

export interface FixtureTeam {
  id: number;
  name: string;
  logo: string;
  winner: boolean | null;
}

export interface FixtureGoals {
  home: number | null;
  away: number | null;
}

export interface FixtureScore {
  halftime: ScoreLine;
  fulltime: ScoreLine;
  extratime: ScoreLine;
  penalty: ScoreLine;
}

export interface ScoreLine {
  home: number | null;
  away: number | null;
}

// Events (goals, cards, subs)
export interface MatchEvent {
  time: { elapsed: number; extra?: number | null };
  team: EventTeam;
  player: EventPlayer;
  assist: EventAssist;
  type: string;
  detail: string;
  comments?: string | null;
}

export interface EventTeam {
  id: number;
  name: string;
  logo: string;
}

export interface EventPlayer {
  id: number;
  name: string;
}

export interface EventAssist {
  id?: number | null;
  name?: string | null;
}

// Lineups
export interface TeamLineup {
  team: LineupTeam;
  coach: LineupCoach;
  formation: string;
  startXI: { player: LineupPlayer }[];
  substitutes: { player: LineupPlayer }[];
}

export interface LineupTeam {
  id: number;
  name: string;
  logo: string;
  colors: {
    player: KitColors;
    goalkeeper: KitColors;
  };
}

export interface KitColors {
  primary: string;
  number: string;
  border: string;
}

export interface LineupCoach {
  id: number;
  name: string;
  photo: string;
}

export interface LineupPlayer {
  id: number;
  name: string;
  number: number;
  pos: string;
  grid: string | null;
}

// Team statistics
export interface TeamStatistics {
  team: StatTeam;
  statistics: { type: string; value: string | number | null }[];
}

export interface StatTeam {
  id: number;
  name: string;
  logo: string;
}

// Player stats
export interface PlayerStats {
  team: PlayerTeam;
  players: PlayerStatEntry[];
}

export interface PlayerTeam {
  id: number;
  name: string;
  logo: string;
  update: string;
}

export interface PlayerStatEntry {
  player: { id: number; name: string; photo: string };
  statistics: PlayerStatDetail[];
}

export interface PlayerStatDetail {
  games: {
    minutes?: number | null;
    number: number;
    position: string;
    rating?: string | null;
    captain: boolean;
    substitute: boolean;
  };
  offsides?: number | null;
  shots: { total?: number | null; on?: number | null };
  goals: {
    total?: number | null;
    conceded: number;
    assists?: number | null;
    saves?: number | null;
  };
  passes: {
    total?: number | null;
    key?: number | null;
    accuracy?: string | null;
  };
  tackles: {
    total?: number | null;
    blocks?: number | null;
    interceptions?: number | null;
  };
  duels: { total?: number | null; won?: number | null };
  dribbles: {
    attempts?: number | null;
    success?: number | null;
    past?: number | null;
  };
  fouls: { drawn?: number | null; committed?: number | null };
  cards: { yellow: number; red: number };
  penalty: {
    won: number | null;
    commited: number | null;
    scored: number;
    missed: number;
    saved?: number | null;
  };
}

export interface TeamsResponse {
  count: number;
  filters: {
    season: string;
  };
  competition: Competition;
  season: Season;
  teams: Team[];
}

export interface Team {
  id: number;
  name: string;
  shortName: string;
  tla: string;
  crest: string;
  address: string;
  website: string;
  founded: number;
  clubColors: string;
  venue: string;
  lastUpdated: string;
}
