export interface StandingsResponse {
  filters: Filters;
  area: Area;
  competition: Competition;
  season: Season;
  standings: Standing[];
}

export interface Filters {
  season: string;
}

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

export interface Standing {
  stage: string;
  type: string;
  group: string | null;
  table: StandingRow[];
}

export interface StandingRow {
  position: number;
  team: Team;
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

export interface Team {
  id: number;
  name: string;
  shortName: string;
  tla: string;
  crest: string;
}

export interface MatchesResponse {
  filters: Filters;
  resultSet: ResultSet;
  competition: Competition;
  matches: Match[];
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
  matchday: number;
  stage: string;
  group: any;
  lastUpdated: string;
  homeTeam: MatchTeam;
  awayTeam: MatchTeam;
  score: Score;
  odds: Odds;
  referees: Referee[];
}
export interface Season {
  id: number;
  startDate: string;
  endDate: string;
  currentMatchday: number;
  winner: string | null;
}

export interface MatchTeam {
  id: number;
  name: string;
  shortName: string;
  tla: string;
  crest: string;
}

export interface Score {
  winner: string | null;
  duration: string;
  fullTime: FullTime;
  halfTime: HalfTime;
}

export interface FullTime {
  home: number | null;
  away: number | null;
}

export interface HalfTime {
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
  coach: Coach;
  squad: Squad[];
  staff: unknown[];
  lastUpdated: string;
}

export interface Coach {
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

export interface Squad {
  id: number;
  name: string;
  position: string;
  dateOfBirth: string;
  nationality: string;
}

export interface StatResponse {
  get: string;
  parameters: Parameters;
  errors: any[];
  results: number;
  paging: Paging;
  response: Response[];
}

export interface Parameters {
  id: string;
}

export interface Paging {
  current: number;
  total: number;
}

export interface Response {
  fixture: Fixture;
  league: League;
  teams: Teams;
  goals: Goals;
  score: Score;
  events: Event[];
  lineups: Lineup[];
  statistics: Statistic[];
  players: Player5[];
}

export interface Fixture {
  id: number;
  referee: string;
  timezone: string;
  date: string;
  timestamp: number;
  periods: Periods;
  venue: Venue;
  status: Status;
}

export interface Periods {
  first: number;
  second: number;
}

export interface Venue {
  id: number;
  name: string;
  city: string;
}

export interface Status {
  long: string;
  short: string;
  elapsed: number;
  extra: any;
}

export interface League {
  id: number;
  name: string;
  country: string;
  logo: string;
  flag: string;
  season: number;
  round: string;
  standings: boolean;
}

export interface Teams {
  home: Home;
  away: Away;
}

export interface Home {
  id: number;
  name: string;
  logo: string;
  winner: boolean;
}

export interface Away {
  id: number;
  name: string;
  logo: string;
  winner: boolean;
}

export interface Goals {
  home: number;
  away: number;
}

export interface Score {
  halftime: Halftime;
  fulltime: Fulltime;
  extratime: Extratime;
  penalty: Penalty;
}

export interface Halftime {
  home: number;
  away: number;
}

export interface Fulltime {
  home: number;
  away: number;
}

export interface Extratime {
  home: any;
  away: any;
}

export interface Penalty {
  home: any;
  away: any;
}

export interface Event {
  time: Time;
  team: Team;
  player: Player;
  assist: Assist;
  type: string;
  detail: string;
  comments?: string;
}

export interface Time {
  elapsed: number;
  extra?: number;
}

export interface Team {
  id: number;
  name: string;
  logo: string;
}

export interface Player {
  id: number;
  name: string;
}

export interface Assist {
  id?: number;
  name?: string;
}

export interface Lineup {
  team: Team2;
  coach: Coach;
  formation: string;
  startXI: StartXi[];
  substitutes: Substitute[];
}

export interface Team2 {
  id: number;
  name: string;
  logo: string;
  colors: Colors;
}

export interface Colors {
  player: Player2;
  goalkeeper: Goalkeeper;
}

export interface Player2 {
  primary: string;
  number: string;
  border: string;
}

export interface Goalkeeper {
  primary: string;
  number: string;
  border: string;
}

export interface Coach {
  id: number;
  name: string;
  photo: string;
}

export interface StartXi {
  player: Player3;
}

export interface Player3 {
  id: number;
  name: string;
  number: number;
  pos: string;
  grid: string;
}

export interface Substitute {
  player: Player4;
}

export interface Player4 {
  id: number;
  name: string;
  number: number;
  pos: string;
  grid: any;
}

export interface Statistic {
  team: Team3;
  statistics: Statistic2[];
}

export interface Team3 {
  id: number;
  name: string;
  logo: string;
}

export interface Statistic2 {
  type: string;
  value: any;
}

export interface Player5 {
  team: Team4;
  players: Player6[];
}

export interface Team4 {
  id: number;
  name: string;
  logo: string;
  update: string;
}

export interface Player6 {
  player: Player7;
  statistics: Statistic3[];
}

export interface Player7 {
  id: number;
  name: string;
  photo: string;
}

export interface Statistic3 {
  games: Games;
  offsides?: number;
  shots: Shots;
  goals: Goals2;
  passes: Passes;
  tackles: Tackles;
  duels: Duels;
  dribbles: Dribbles;
  fouls: Fouls;
  cards: Cards;
  penalty: Penalty2;
}

export interface Games {
  minutes?: number;
  number: number;
  position: string;
  rating?: string;
  captain: boolean;
  substitute: boolean;
}

export interface Shots {
  total?: number;
  on?: number;
}

export interface Goals2 {
  total?: number;
  conceded: number;
  assists?: number;
  saves?: number;
}

export interface Passes {
  total?: number;
  key?: number;
  accuracy?: string;
}

export interface Tackles {
  total?: number;
  blocks?: number;
  interceptions?: number;
}

export interface Duels {
  total?: number;
  won?: number;
}

export interface Dribbles {
  attempts?: number;
  success?: number;
  past?: number;
}

export interface Fouls {
  drawn?: number;
  committed?: number;
}

export interface Cards {
  yellow: number;
  red: number;
}

export interface Penalty2 {
  won: any;
  commited: any;
  scored: number;
  missed: number;
  saved?: number;
}
