import "server-only";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export type MatchSnapshot = {
  match: {
    homeTeam: string;
    awayTeam: string;
    score: { home: number; away: number };
    halfTimeScore: { home: number; away: number };
    competition: string;
    matchday: number | null;
    date: string;
  };
  goals: {
    player: string;
    minute: string;
    team: string;
    type: string;
  }[];
  stats: {
    name: string;
    home: string;
    away: string;
  }[];
  lineups: {
    home: {
      team: string;
      formation: string;
      players: { name: string; position: string; jerseyNumber: string }[];
    };
    away: {
      team: string;
      formation: string;
      players: { name: string; position: string; jerseyNumber: string }[];
    };
  };
};

function buildSystemPrompt(snapshot: MatchSnapshot): string {
  const { match, goals, stats, lineups } = snapshot;

  const goalsText =
    goals.length === 0
      ? "No goals scored."
      : goals
          .map(
            (g) =>
              `${g.minute}' - ${g.player} (${g.team === "home" ? match.homeTeam : match.awayTeam})${g.type !== "Regular" ? ` [${g.type}]` : ""}`,
          )
          .join("\n");

  const statsText = stats
    .map(
      (s) =>
        `${s.name}: ${match.homeTeam} ${s.home} | ${match.awayTeam} ${s.away}`,
    )
    .join("\n");

  const homePlayers = lineups.home.players
    .map((p) => `#${p.jerseyNumber} ${p.name} (${p.position})`)
    .join(", ");

  const awayPlayers = lineups.away.players
    .map((p) => `#${p.jerseyNumber} ${p.name} (${p.position})`)
    .join(", ");

  return `You are an elite football analyst assistant for Football Intel, an AI-powered football analytics platform.

You have been provided with detailed data from the following match:

## MATCH
${match.competition}${match.matchday ? ` - Matchday ${match.matchday}` : ""}
${match.homeTeam} ${match.score.home} - ${match.score.away} ${match.awayTeam}
Half-time: ${match.halfTimeScore.home} - ${match.halfTimeScore.away}
Date: ${new Date(match.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}

## GOALS
${goalsText}

## MATCH STATISTICS
${statsText}

## LINEUPS
${match.homeTeam} (${lineups.home.formation}): ${homePlayers}
${match.awayTeam} (${lineups.away.formation}): ${awayPlayers}

## YOUR ROLE
- Answer questions about this specific match using the data above
- Provide tactical insights, performance analysis, and key observations
- Be concise but insightful — this is for football enthusiasts who want real analysis
- If asked about something not in the data, say so honestly
- Always refer to teams and players by name, never as "home" or "away"
- Keep responses focused and under 200 words unless a detailed breakdown is specifically requested`;
}

export const MAX_MESSAGES_PER_SESSION = 10;
const MAX_CONTEXT_MESSAGES = 6;

export async function sendChatMessage(
  snapshot: MatchSnapshot,
  history: ChatMessage[],
  userMessage: string,
): Promise<string> {
  const systemPrompt = buildSystemPrompt(snapshot);

  // take last 6 messages for context + new user message
  const contextMessages = history.slice(-MAX_CONTEXT_MESSAGES);

  const messages = [
    ...contextMessages,
    { role: "user" as const, content: userMessage },
  ];

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1000,
    system: systemPrompt,
    messages,
  });

  const content = response.content[0];
  if (content.type !== "text") throw new Error("Unexpected response type");

  return content.text;
}
