"use client";
import { Match } from "@/types/football";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import MatchCard from "./MatchCard";
import Link from "next/link";
type Props = {
  fixtures: Match[];
  id: number | null;
  leagueId: number;
};

export default function FixturesSection({ fixtures, id, leagueId }: Props) {
  const ITEMS_PER_PAGE = 3;

  const [page, setPage] = useState(0);

  const start = page * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;

  const paginatedFixtures = fixtures.slice(start, end);

  const nextPage = () => {
    if (end < fixtures.length) {
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
  }, [fixtures]);
  return (
    <div className="m-3">
      <div className="flex justify-between items-center my-2">
        <p className="uppercase text-[1.5rem] text-white font-display lg:text-[3rem] md:text-[2rem]">
          Upcoming Fixtures
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
            disabled={page >= Math.ceil(fixtures.length / ITEMS_PER_PAGE) - 1}
            className="text-white disabled:opacity-30 rounded-sm"
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
      {fixtures.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 ">
            {paginatedFixtures.map((match) => (
              <MatchCard key={match.id} Match={match} variant="fixture" />
            ))}
          </div>

          <Link
            href={`/dashboard/league/${id}?tab=fixtures`}
            className="text-[#e8ff47] text-center mt-3 block"
          >
            View All Fixtures
          </Link>
        </>
      ) : (
        <div className="text-[1.2rem] lg:text-[2rem] md:text-[1.5rem] text-center text-white font-display">
          No upcoming fixtures available
        </div>
      )}
    </div>
  );
}
