import MatchCard from "./MatchCard";
import { Match } from "@/types/football";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { useEffect } from "react";
type Props = {
  results: Match[];
};

export default function ResultsSection({ results }: Props) {
  const ITEMS_PER_PAGE = 2;

  const [page, setPage] = useState(0);

  const start = page * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;

  const paginatedResults = results.slice(start, end);

  const nextPage = () => {
    if (end < results.length) {
      setPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (page > 0) {
      setPage((prev) => prev - 1);
    }
  };
  useEffect(() => {
    setPage(0);
  }, [results]);
  return (
    <div className="m-3">
      <div className="flex justify-between items-center my-2">
        <p className="uppercase text-[1.5rem] text-white font-display ">
          Recent Results
        </p>

        <div className="flex items-center justify-between gap-2">
          <Button
            onClick={prevPage}
            disabled={page === 0}
            className="text-white disabled:opacity-30 rounded-sm"
          >
            <ChevronLeft />
          </Button>

          <Button
            onClick={nextPage}
            disabled={page >= Math.ceil(results.length / ITEMS_PER_PAGE) - 1}
            className="text-white disabled:opacity-30 rounded-sm"
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-2">
        {paginatedResults.map((Match) => (
          <MatchCard key={Match.id} Match={Match} variant="result" />
        ))}
      </div>
    </div>
  );
}
