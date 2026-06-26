"use client";
import { Match } from "@/types/football";
import { StandingRow } from "@/types/football";
import StandingsTable from "@/components/leagues/StandingsTable";
import { StandingsResponse } from "@/types/football";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import LeagueResults from "./LeagueResults";
import LeagueFixtures from "./LeagueFixtures";
type Props = {
  fixtures: Match[];
  results: Match[];
  standings: StandingsResponse;
  leagueId: number;
};
type Tab = "standings" | "results" | "fixtures";

export default function LeagueClient({
  fixtures,
  results,
  standings,
  leagueId,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = (searchParams.get("tab") as Tab) ?? "standings";
  const setTab = (tab: Tab) => {
    router.replace(`?tab=${tab}`, { scroll: false });
  };
  const startYear = new Date(standings.season.startDate).getFullYear();
  const endYear = new Date(standings.season.endDate).getFullYear();
  const season = `${startYear}/${String(endYear).slice(2)}`;
  return (
    <>
      <div className="flex border-b border-[#292c33] gap-2">
        {(["standings", "results", "fixtures"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setTab(tab)}
            className={`flex-1 flex items-center justify-center gap-5 py-3 text-[0.78rem] font-medium border-b-2 transition-colors
                  ${
                    activeTab === tab
                      ? "text-white border-[#C9A84C]"
                      : "text-[#8A93A8] border-transparent"
                  }`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-3 m-3">
        <Image
          src={standings.competition.emblem}
          alt={standings.competition.name}
          width={100}
          height={100}
          className="hidden md:block"
        />
        <Image
          src={standings.competition.emblem}
          alt={standings.competition.name}
          width={80}
          height={80}
          className="md:hidden"
        />
        <div className="">
          <h1 className="uppercase text-[1rem] text-white font-display lg:text-[1.5rem] md:text-[1rem]">
            {standings.competition.name}
          </h1>
          <div className="flex items-center gap-3">
            <p className="uppercase text-[0.75rem] text-[#8A93A8] font-display lg:text-[1rem] md:text-[0.875rem] hidden md:block">
              Matchday {standings.season.currentMatchday}
            </p>
            <p className="uppercase text-[0.75rem] text-[#8A93A8] font-display lg:text-[1rem] md:text-[0.875rem]">
              {season} season
            </p>
          </div>
        </div>
      </div>
      {activeTab === "standings" && (
        <>
          {standings.standings.map((group) => (
            <div key={group.group ?? group.type}>
              {standings.standings.length > 1 && (
                <p className="text-white font-display uppercase m-2 text-[1.2rem]">
                  {group.group ?? group.type}
                </p>
              )}
              <StandingsTable standings={group.table} />
            </div>
          ))}
        </>
      )}
      {activeTab === "results" && (
        <LeagueResults results={results} leagueId={leagueId} />
      )}
      ;
      {activeTab === "fixtures" && (
        <LeagueFixtures fixtures={fixtures} leagueId={leagueId} />
      )}
      ;
    </>
  );
}
