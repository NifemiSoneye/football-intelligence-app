"use client";
import { Match } from "@/types/football";
import { StandingsResponse } from "@/types/football";
import StandingsTable from "@/components/leagues/StandingsTable";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import LeagueResults from "./LeagueResults";
import LeagueFixtures from "./LeagueFixtures";
import Link from "next/link";

type Props = {
  fixtures: Match[];
  results: Match[];
  standings: StandingsResponse;
  leagueId: number;
  currentSeason: number;
  previousSeason: number;
  selectedSeason: number;
  supportsPreviousSeason: boolean;
};

type Tab = "standings" | "results" | "fixtures";

export default function LeagueClient({
  fixtures,
  results,
  standings,
  leagueId,
  currentSeason,
  previousSeason,
  selectedSeason,
  supportsPreviousSeason,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = (searchParams.get("tab") as Tab) ?? "standings";

  const setTab = (tab: Tab) => {
    const season = searchParams.get("season");
    const query = season ? `?tab=${tab}&season=${season}` : `?tab=${tab}`;
    router.replace(query, { scroll: false });
  };

  const startYear = new Date(standings.season.startDate).getFullYear();
  const endYear = new Date(standings.season.endDate).getFullYear();
  const season = `${startYear}/${String(endYear).slice(2)}`;

  const isPrevious = selectedSeason === previousSeason;

  return (
    <>
      {/* Tabs */}
      <div className="flex border-b border-[#292c33] gap-2">
        {(["standings", "results", "fixtures"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setTab(tab)}
            className={`flex-1 flex items-center justify-center gap-5 py-3 text-[0.78rem] font-medium border-b-2 transition-colors ${
              activeTab === tab
                ? "text-white border-[#C9A84C]"
                : "text-[#8A93A8] border-transparent"
            }`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* League header + season toggle */}
      <div className="flex items-center justify-between m-3">
        <div className="flex items-center gap-3">
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
          <div>
            <h1 className="uppercase text-[1rem] text-white font-display lg:text-[1.5rem] md:text-[1rem]">
              {standings.competition.name}
            </h1>
            <div className="flex items-center gap-3">
              <p className="uppercase text-[0.75rem] text-[#8A93A8] font-display lg:text-[1rem] md:text-[0.875rem] hidden md:block">
                Matchday {standings.season.currentMatchday}
              </p>
              <p className="uppercase text-[0.75rem] text-[#8A93A8] font-display lg:text-[1rem] md:text-[0.875rem]">
                {season} Season
              </p>
            </div>
          </div>
        </div>

        {/* Season toggle */}
        {supportsPreviousSeason && (
          <div className="flex items-center bg-zinc-900 rounded-full p-1 shrink-0">
            <Link
              href={`/dashboard/league/${leagueId}?tab=${activeTab}`}
              className={`px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all ${
                !isPrevious
                  ? "bg-[#e8ff47] text-black"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {currentSeason}/{String(currentSeason + 1).slice(2)}
            </Link>
            <Link
              href={`/dashboard/league/${leagueId}?tab=${activeTab}&season=${previousSeason}`}
              className={`px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all ${
                isPrevious
                  ? "bg-[#e8ff47] text-black"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {previousSeason}/{String(currentSeason).slice(2)}
            </Link>
          </div>
        )}
      </div>

      {/* Tab content */}
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
      {activeTab === "fixtures" && (
        <LeagueFixtures fixtures={fixtures} leagueId={leagueId} />
      )}
    </>
  );
}
