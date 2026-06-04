import { Match } from "@/types/football";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MatchCard from "@/components/dashboard/MatchCard";
type Props = {
  fixtures: Match[];
};
export default function LeagueResults({ fixtures }: Props) {
  const KNOCKOUT_STAGE_ORDER = [
    "PLAYOFFS",
    "LAST_32",
    "LAST_16",
    "QUARTER_FINALS",
    "SEMI_FINALS",
    "THIRD_PLACE",
    "FINAL",
  ];
  const groupByMatchday = (
    matches: Match[],
  ): Record<string | number, Match[]> => {
    return matches.reduce(
      (acc, match) => {
        const key = KNOCKOUT_STAGE_ORDER.includes(match.stage)
          ? match.stage
          : (match.matchday ?? match.stage);
        if (!acc[key]) acc[key] = [];
        acc[key].push(match);
        return acc;
      },
      {} as Record<string | number, Match[]>,
    );
  };
  const groupedFixtures = groupByMatchday(fixtures);
  const [currentIndex, setCurrentIndex] = useState(0);
  const matchdays = Object.keys(groupedFixtures).sort((a, b) => {
    const aNum = Number(a);
    const bNum = Number(b);

    // both are matchday numbers
    if (!isNaN(aNum) && !isNaN(bNum)) return aNum - bNum;

    // both are knockout stages
    if (isNaN(aNum) && isNaN(bNum)) {
      return KNOCKOUT_STAGE_ORDER.indexOf(a) - KNOCKOUT_STAGE_ORDER.indexOf(b);
    }

    // numbers come before knockout stages
    return isNaN(aNum) ? 1 : -1;
  });

  const currentMatchday = matchdays[currentIndex];
  const currentFixtures = groupedFixtures[currentMatchday];
  if (!fixtures.length) {
    return (
      <div className="text-[1.2rem] lg:text-[2rem] md:text-[1.5rem] text-center text-white font-display m-3">
        No Upcoming fixtures scheduled
      </div>
    );
  }
  return (
    <div className="m-3">
      <div className="flex justify-between items-center my-2">
        <p className="uppercase text-[1.5rem] text-white font-display lg:text-[3rem] md:text-[2rem]  ">
          {isNaN(Number(currentMatchday))
            ? currentMatchday.replace(/_/g, " ")
            : `Matchday ${currentMatchday}`}
        </p>

        <div className="flex items-center justify-between gap-2">
          <Button
            onClick={() => setCurrentIndex((prev) => prev - 1)}
            disabled={currentIndex === 0}
            className="text-white disabled:opacity-30 rounded-sm"
          >
            <ChevronLeft />
          </Button>

          <Button
            onClick={() => setCurrentIndex((prev) => prev + 1)}
            disabled={currentIndex === matchdays.length - 1}
            className="text-white disabled:opacity-30 rounded-sm"
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
        {currentFixtures.map((match) => (
          <MatchCard key={match.id} Match={match} variant="fixture" />
        ))}
      </div>
    </div>
  );
}
