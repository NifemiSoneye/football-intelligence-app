"use client";

import { Match } from "@/types/football";
import { useEffect, useState } from "react";
import { Competition } from "@/types/football";
import { LEAGUES } from "@/lib/constants";
import ResultsSection from "@/components/dashboard/ResultsSection";

type Props = {
  fixtures: Match[];
  results: Match[];
  leagueIds: number[];
  favoriteTeamIds: number[];
};

export default function DashboardClient({
  fixtures,
  results,
  leagueIds,
  favoriteTeamIds,
}: Props) {
  const [activeTab, setActiveTab] = useState<number | null>(null);
  const tabs = leagueIds.map((id) => {
    const league = LEAGUES.find((l) => l.id === id);
    return {
      id,
      label: league?.name ?? `League ${id}`,
    };
  });
  const filteredFixtures = activeTab
    ? fixtures.filter((match) => match.competition.id === activeTab)
    : fixtures;

  const filteredResults = activeTab
    ? results.filter(
        (match) =>
          match.competition.id === activeTab &&
          (favoriteTeamIds.includes(match.homeTeam.id) ||
            favoriteTeamIds.includes(match.awayTeam.id)),
      )
    : results;
  useEffect(() => {
    if (leagueIds.length && activeTab === null) {
      setActiveTab(leagueIds[0]);
    }
  }, [leagueIds]);
  return (
    <>
      <div className="flex border-b border-[#292c33]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-[0.78rem] font-medium border-b-2 transition-colors
              ${
                activeTab === tab.id
                  ? "text-white border-[#C9A84C]"
                  : "text-[#8A93A8] border-transparent"
              }`}
          >
            <div
              className={`w-2 h-2  rounded-[50%] ${tab.id === activeTab ? "bg-[#f6b443]" : "bg-[#8A93A8]"}`}
            ></div>
            {tab.label}
          </button>
        ))}
      </div>
      <ResultsSection results={filteredResults} />
    </>
  );
}
