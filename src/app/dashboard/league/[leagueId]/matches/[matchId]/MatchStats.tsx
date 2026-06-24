// src/app/dashboard/league/[leagueId]/matches/[matchId]/MatchStats.tsx
"use client";

import { useState } from "react";

type StatItem = {
  name: string;
  home: string;
  away: string;
  homeValue: number;
  awayValue: number;
  statisticsType: "positive" | "negative";
  renderType: number;
};

type Group = {
  groupName: string;
  statisticsItems: StatItem[];
};

type Period = {
  period: "ALL" | "1ST" | "2ND";
  groups: Group[];
};

type Props = {
  statistics: Period[];
  homeTeamName: string;
  awayTeamName: string;
};

const CURATED: Record<string, string[]> = {
  "Match Overview": [
    "ballPossession",
    "expectedGoals",
    "bigChanceCreated",
    "totalShotsOnGoal",
    "shotsOnGoal",
    "goalkeeperSaves",
    "cornerKicks",
    "fouls",
    "yellowCards",
  ],
  Passing: [
    "passes",
    "accuratePasses",
    "accurateLongBalls",
    "accurateCross",
    "accurateThroughBall",
    "finalThirdEntries",
  ],
  Attack: ["touchesInOppBox", "bigChanceScored", "offsides"],
  Duels: [
    "duelWonPercent",
    "groundDuelsPercentage",
    "aerialDuelsPercentage",
    "dribblesPercentage",
  ],
  Defending: [
    "wonTacklePercent",
    "interceptionWon",
    "totalClearance",
    "ballRecovery",
    "errorsLeadToGoal",
  ],
  Goalkeeping: ["goalkeeperSaves", "diveSaves", "goalsPrevented"],
};

// flatten all stats from all groups into a key->stat map
function buildStatMap(groups: Group[]): Record<string, StatItem> {
  const map: Record<string, StatItem> = {};
  for (const group of groups) {
    for (const item of group.statisticsItems) {
      const key = (item as any).key;
      if (key) map[key] = item;
    }
  }
  return map;
}

function StatBar({ stat }: { stat: StatItem }) {
  const isNegative = stat.statisticsType === "negative";
  const homeWins = isNegative
    ? stat.homeValue < stat.awayValue
    : stat.homeValue > stat.awayValue;
  const awayWins = isNegative
    ? stat.awayValue < stat.homeValue
    : stat.awayValue > stat.homeValue;
  const equal = stat.homeValue === stat.awayValue;

  const homeColor = equal
    ? "text-zinc-400"
    : homeWins
      ? "text-[#e8ff47]"
      : "text-zinc-400";
  const awayColor = equal
    ? "text-zinc-400"
    : awayWins
      ? "text-[#e8ff47]"
      : "text-zinc-400";

  // bar widths
  const total = stat.homeValue + stat.awayValue;
  const homeBarPct = total === 0 ? 50 : (stat.homeValue / total) * 100;
  const awayBarPct = 100 - homeBarPct;

  const homeBarColor = equal
    ? "bg-zinc-600"
    : homeWins
      ? "bg-[#e8ff47]"
      : "bg-zinc-600";
  const awayBarColor = equal
    ? "bg-zinc-600"
    : awayWins
      ? "bg-[#e8ff47]"
      : "bg-zinc-600";

  return (
    <div className="mb-5">
      {/* Values + label row */}
      <div className="flex items-center justify-between mb-1.5">
        <span className={`text-base font-bold ${homeColor}`}>{stat.home}</span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 text-center px-2">
          {stat.name}
        </span>
        <span className={`text-base font-bold ${awayColor}`}>{stat.away}</span>
      </div>

      {/* Bar */}
      <div className="flex gap-0.5 h-1 rounded-full overflow-hidden">
        <div
          className={`${homeBarColor} rounded-l-full transition-all duration-500`}
          style={{ width: `${homeBarPct}%` }}
        />
        <div
          className={`${awayBarColor} rounded-r-full transition-all duration-500`}
          style={{ width: `${awayBarPct}%` }}
        />
      </div>
    </div>
  );
}

export default function MatchStats({
  statistics,
  homeTeamName,
  awayTeamName,
}: Props) {
  const [period, setPeriod] = useState<"ALL" | "1ST" | "2ND">("ALL");

  const periodData = statistics.find((p) => p.period === period);
  const statMap = periodData ? buildStatMap(periodData.groups) : {};

  const periods: { id: "ALL" | "1ST" | "2ND"; label: string }[] = [
    { id: "ALL", label: "All" },
    { id: "1ST", label: "1st Half" },
    { id: "2ND", label: "2nd Half" },
  ];

  return (
    <div>
      {/* Period toggle */}
      <div className="flex items-center bg-zinc-900 rounded-full p-1 mb-8 w-fit mx-auto">
        {periods.map((p) => (
          <button
            key={p.id}
            onClick={() => setPeriod(p.id)}
            className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
              period === p.id
                ? "bg-[#e8ff47] text-black"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Team name headers */}
      <div className="flex justify-between mb-6 px-1">
        <span className="text-xs font-bold uppercase tracking-widest text-zinc-400 ">
          {homeTeamName}
        </span>
        <span className="text-xs font-bold uppercase tracking-widest text-zinc-400 ">
          {awayTeamName}
        </span>
      </div>

      {/* Stat groups */}
      {Object.entries(CURATED).map(([groupName, keys]) => {
        const stats = keys
          .map((key) => statMap[key])
          .filter(Boolean) as StatItem[];

        if (stats.length === 0) return null;

        return (
          <div key={groupName} className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                {groupName}
              </span>
              <div className="flex-1 h-px bg-zinc-800" />
            </div>
            {stats.map((stat) => (
              <StatBar key={stat.name} stat={stat} />
            ))}
          </div>
        );
      })}
    </div>
  );
}
