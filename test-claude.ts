import { sendChatMessage } from "./src/lib/claude";

const fakeSnapshot = {
  match: {
    homeTeam: "Manchester United",
    awayTeam: "Arsenal",
    score: { home: 0, away: 1 },
    halfTimeScore: { home: 0, away: 1 },
    competition: "Premier League",
    matchday: 1,
    date: "2025-08-17T15:30:00Z",
  },
  goals: [
    {
      player: "Riccardo Calafiori",
      minute: "13",
      team: "away",
      type: "Header",
    },
  ],
  stats: [
    { name: "Ball possession", home: "39%", away: "61%" },
    { name: "Total shots", home: "9", away: "22" },
  ],
  lineups: {
    home: { team: "Manchester United", formation: "3-4-2-1", players: [] },
    away: { team: "Arsenal", formation: "4-3-3", players: [] },
  },
};

async function test() {
  const response = await sendChatMessage(
    fakeSnapshot,
    [],
    "Who scored in this match and how did Arsenal win?",
  );
}

test();
