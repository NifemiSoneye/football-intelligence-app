"use client";
import { Match, TeamInfoResponse } from "@/types/football";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import TeamInfo from "./TeamInfo";
import TeamFixtures from "./TeamFixtures";
import TeamResults from "./TeamResults";

type Props = {
  teamInfo: TeamInfoResponse;
  results: Match[];
  fixtures: Match[];
};

type Tab = "overview" | "results" | "fixtures";

export default function TeamClient({ teamInfo, results, fixtures }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = (searchParams.get("tab") as Tab) ?? "overview";
  const setTab = (tab: Tab) => {
    router.replace(`?tab=${tab}`, { scroll: false });
  };

  return (
    <>
      <div className="flex flex-col-reverse">
        <div className="flex border-b border-[#292c33] gap-2">
          {(["overview", "results", "fixtures"] as Tab[]).map((tab) => (
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

        <div className="flex items-center gap-3 m-3 flex-col md:flex-row">
          <Image
            src={teamInfo.crest}
            alt={teamInfo.name}
            width={100}
            height={100}
            className="hidden md:block"
          />
          <Image
            src={teamInfo.crest}
            alt={teamInfo.name}
            width={70}
            height={70}
            className="md:hidden"
          />
          <div className="text-center md:text-left">
            <h1 className="uppercase text-white text-[2.8rem] font-display">
              {teamInfo.name}
            </h1>
            <div className="flex items-center gap-3 text-[#8A93A8] text-sm">
              <Image
                src={teamInfo.area.flag}
                alt={teamInfo.area.name}
                width={20}
                height={20}
              />
              <span>{teamInfo.area.name}</span>
              <span>•</span>
              <span>Est. {teamInfo.founded}</span>
              <span>•</span>
              <span>{teamInfo.venue}</span>
            </div>
          </div>
        </div>
      </div>
      {activeTab === "overview" && <TeamInfo teamInfo={teamInfo} />};
      {activeTab === "fixtures" && <TeamFixtures fixtures={fixtures} />};
      {activeTab === "results" && <TeamResults results={results} />};
    </>
  );
}
