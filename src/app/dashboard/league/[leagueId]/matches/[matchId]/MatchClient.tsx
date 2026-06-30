"use client";

import { useState } from "react";
import Image from "next/image";
import { Match } from "@/types/football";
import MatchOverview from "./MatchOverview";
import MatchStats from "./MatchStats";
import MatchLineups from "./MatchLineups";
import MatchAIAnalysis from "./MatchAIAnalysis";

type Tab = "overview" | "stats" | "lineups" | "ai";

type Props = {
  match: Match;
  sofascoreData: any;
  matchId: number;
  initialMessages: { role: "user" | "assistant"; content: string }[];
  initialSaved: boolean;
};

export default function MatchClient({
  match,
  sofascoreData,
  matchId,
  initialMessages,
  initialSaved,
}: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  const { homeTeam, awayTeam, score, competition, matchday, status } = match;

  const isFinished = status === "FINISHED";
  const isLive = status === "IN_PLAY" || status === "PAUSED";

  const statusLabel = isFinished
    ? score.duration === "EXTRA_TIME"
      ? "AET"
      : score.duration === "PENALTY_SHOOTOUT"
        ? "PEN"
        : "FT"
    : isLive
      ? "LIVE"
      : null;

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "stats", label: "Stats" },
    { id: "lineups", label: "Lineups" },
    ...(isFinished ? [{ id: "ai" as Tab, label: "⚡ AI Analysis" }] : []),
  ];

  console.log("lineups:", JSON.stringify(sofascoreData?.lineups, null, 2));
  console.log(
    "playerColor:",
    JSON.stringify(sofascoreData?.lineups?.home?.playerColor, null, 2),
  );
  console.log(
    "goalkeeperColor:",
    JSON.stringify(sofascoreData?.lineups?.home?.goalkeeperColor, null, 2),
  );

  return (
    <div className="min-h-screen text-white overflow-x-hidden font-body">
      {/* Header */}
      <div className="px-4 pt-6 pb-4 md:px-8">
        {/* Competition + Matchday */}
        <p className="text-xs text-zinc-400 uppercase tracking-widest mb-6">
          {competition.name}
          {matchday ? ` · Matchday ${matchday}` : ""}
        </p>

        {/* Score row */}
        <div className="flex items-center justify-between gap-4">
          {/* Home team */}
          <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
            <div className="w-16 h-16 md:w-20 md:h-20 relative  rounded-xl p-2">
              <Image
                src={homeTeam.crest}
                alt={homeTeam.name}
                fill
                className="object-contain p-1"
              />
            </div>
            <span
              className={`text-xs md:text-sm font-bold uppercase tracking-wider text-center w-full truncate ${
                score.winner === "HOME_TEAM"
                  ? "text-[#e8ff47]"
                  : "text-zinc-400"
              }`}
            >
              {homeTeam.shortName}
            </span>
          </div>

          {/* Score */}
          <div className="flex flex-col items-center gap-1">
            {statusLabel && (
              <span
                className={`text-[10px] font-bold tracking-widest px-2 py-0.5 rounded ${
                  isLive ? "bg-red-500 text-white" : "bg-zinc-700 text-zinc-300"
                }`}
              >
                {statusLabel}
              </span>
            )}
            <div className="text-4xl md:text-6xl font-black tracking-tight font-display">
              {score.fullTime.home ?? "-"}{" "}
              <span className="text-zinc-500">-</span>{" "}
              {score.fullTime.away ?? "-"}
            </div>
            {score.halfTime.home !== null && (
              <span className="text-xs text-zinc-500">
                ({score.halfTime.home} - {score.halfTime.away})
              </span>
            )}
          </div>

          {/* Away team */}
          <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
            <div className="w-16 h-16 md:w-20 md:h-20 relative  rounded-xl p-2">
              <Image
                src={awayTeam.crest}
                alt={awayTeam.name}
                fill
                className="object-contain p-1"
              />
            </div>
            <span
              className={`text-xs md:text-sm font-bold uppercase tracking-wider text-center w-full truncate ${
                score.winner === "AWAY_TEAM"
                  ? "text-[#e8ff47]"
                  : "text-zinc-400"
              }`}
            >
              {awayTeam.shortName}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-zinc-800 mt-2">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-wider transition-colors whitespace-nowrap text-center ${
                activeTab === tab.id
                  ? "text-[#e8ff47] border-b-2 border-[#e8ff47]"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div>
        <div
          className={`${activeTab === "overview" ? "block" : "hidden"} px-4 md:px-8 py-6`}
        >
          <MatchOverview match={match} sofascoreData={sofascoreData} />
        </div>

        <div
          className={`${activeTab === "stats" ? "block" : "hidden"} px-4 md:px-8 py-6`}
        >
          <MatchStats
            statistics={sofascoreData?.statistics?.statistics ?? []}
            homeTeamName={match.homeTeam.shortName}
            awayTeamName={match.awayTeam.shortName}
          />
        </div>

        <div
          className={`${activeTab === "lineups" ? "block" : "hidden"} px-4 md:px-8 py-6`}
        >
          {sofascoreData?.lineups && (
            <MatchLineups
              lineups={sofascoreData.lineups}
              homeTeamName={match.homeTeam.shortName}
              awayTeamName={match.awayTeam.shortName}
            />
          )}
        </div>

        <div
          className={`${activeTab === "ai" ? "block" : "hidden"} px-4 md:px-8 py-6`}
        >
          <MatchAIAnalysis
            matchId={matchId}
            initialMessages={initialMessages}
            isActive={activeTab === "ai"}
            initialSaved={initialSaved}
          />
        </div>
      </div>
    </div>
  );
}
