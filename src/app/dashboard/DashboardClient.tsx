"use client";

import { Match } from "@/types/football";
import { useEffect, useState } from "react";
import { Competition } from "@/types/football";
import { LEAGUES } from "@/lib/constants";
import ResultsSection from "@/components/dashboard/ResultsSection";
import FixturesSection from "@/components/dashboard/FixturesSection";
import Image from "next/image";
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
  const [activeTab, setActiveTab] = useState<number | null>(
    leagueIds[0] ?? null,
  );
  const tabs = leagueIds.map((id) => {
    const league = LEAGUES.find((l) => l.id === id);
    return {
      id,
      label: league?.name ?? `League ${id}`,
      crest: league?.crest ?? `League ${id}`,
    };
  });
  const filteredFixtures = activeTab
    ? fixtures.filter(
        (match) =>
          match.competition.id === activeTab &&
          (favoriteTeamIds.includes(match.homeTeam.id) ||
            favoriteTeamIds.includes(match.awayTeam.id)),
      )
    : fixtures;

  const filteredResults = activeTab
    ? results.filter(
        (match) =>
          match.competition.id === activeTab &&
          (favoriteTeamIds.includes(match.homeTeam.id) ||
            favoriteTeamIds.includes(match.awayTeam.id)),
      )
    : results;
  return (
    <>
      <div className="flex border-b border-[#292c33] gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-5 py-3 text-[0.78rem] font-medium border-b-2 transition-colors
              ${
                activeTab === tab.id
                  ? "text-white border-[#C9A84C]"
                  : "text-[#8A93A8] border-transparent"
              }`}
          >
            <Image
              src={tab.crest}
              alt={tab.label}
              width={30}
              height={30}
              className="object-contain hidden md:block"
            />
            {tab.label}
          </button>
        ))}
      </div>
      <ResultsSection
        results={filteredResults}
        id={activeTab}
        leagueId={activeTab ?? 0}
      />
      <FixturesSection
        fixtures={filteredFixtures}
        id={activeTab}
        leagueId={activeTab ?? 0}
      />
    </>
  );
}
