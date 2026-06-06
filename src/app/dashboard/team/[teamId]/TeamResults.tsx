import { Match } from "@/types/football";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MatchCard from "@/components/dashboard/MatchCard";
type Props = {
  results: Match[];
};
export default function TeamResults({ results }: Props) {
  const groupByMonth = (matches: Match[]): Record<string, Match[]> => {
    return matches.reduce(
      (acc, match) => {
        const key = new Date(match.utcDate).toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        }); // → "June 2026"
        if (!acc[key]) acc[key] = [];
        acc[key].push(match);
        return acc;
      },
      {} as Record<string, Match[]>,
    );
  };
  const groupedResults = groupByMonth(results);
  const [currentIndex, setCurrentIndex] = useState(0);
  const months = Object.keys(groupedResults).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime(),
  );

  const currentMatchday = months[currentIndex];
  const currentResults = groupedResults[currentMatchday];
  if (!results.length) {
    return (
      <div className="text-[1.2rem] lg:text-[2rem] md:text-[1.5rem] text-center text-white font-display m-3">
        No recent results available
      </div>
    );
  }
  return (
    <div className="m-3">
      <div className="flex justify-between items-center my-2">
        <p className="uppercase text-[1.5rem] text-white font-display lg:text-[3rem] md:text-[2rem]  ">
          {currentMatchday}
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
            disabled={currentIndex === months.length - 1}
            className="text-white disabled:opacity-30 rounded-sm"
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
        {currentResults.map((match) => (
          <MatchCard key={match.id} Match={match} variant="result" />
        ))}
      </div>
    </div>
  );
}
