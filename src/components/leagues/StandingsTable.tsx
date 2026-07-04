import { StandingRow } from "@/types/football";
import Image from "next/image";
import Link from "next/link";

type Props = {
  standings: StandingRow[];
};

export default function StandingsTable({ standings }: Props) {
  return (
    <div className="w-full">
      <table className="w-full border-collapse">
        <thead>
          <tr className="text-[#8A93A8] text-xs border-b border-[#292c33]">
            <th className="py-3 px-2 text-left font-medium w-8">#</th>
            <th className="py-3 px-2 text-left font-medium w-60">TEAM</th>
            <th className="py-3 px-2 text-center font-medium w-8">P</th>
            <th className="py-3 px-2 text-center font-medium w-8">W</th>
            <th className="py-3 px-2 text-center font-medium w-8">D</th>
            <th className="py-3 px-2 text-center font-medium w-8">L</th>
            <th className="py-3 px-2 text-center font-medium w-10 hidden md:table-cell">
              GF
            </th>
            <th className="py-3 px-2 text-center font-medium w-10 hidden md:table-cell">
              GA
            </th>
            <th className="py-3 px-2 text-center font-medium w-10">GD</th>
            <th className="py-3 px-2 text-center font-medium w-10 text-[#e8ff47]">
              PTS
            </th>
          </tr>
        </thead>
        <tbody>
          {standings.map((row) => (
            <tr
              key={row.team.id}
              className="border-b border-[#292c33] hover:bg-[#ffffff05] transition-colors"
            >
              <td className="py-3 px-2 text-white text-sm w-8">
                {row.position}
              </td>
              <td className="py-3 px-2 text-white text-sm w-60">
                <Link
                  href={`/dashboard/team/${row.team.id}`}
                  className="flex items-center gap-2 hover:text-[#e8ff47] transition-colors"
                >
                  <Image
                    src={row.team.crest}
                    alt={row.team.name}
                    width={24}
                    height={24}
                    className="shrink-0"
                  />
                  <span className="hidden md:inline">{row.team.name}</span>
                  <span className="md:hidden">{row.team.tla}</span>
                </Link>
              </td>
              <td className="py-3 px-2 text-white text-sm text-center w-8">
                {row.playedGames}
              </td>
              <td className="py-3 px-2 text-white text-sm text-center w-8">
                {row.won}
              </td>
              <td className="py-3 px-2 text-white text-sm text-center w-8">
                {row.draw}
              </td>
              <td className="py-3 px-2 text-white text-sm text-center w-8">
                {row.lost}
              </td>
              <td className="py-3 px-2 text-white text-sm text-center w-10 hidden md:table-cell">
                {row.goalsFor}
              </td>
              <td className="py-3 px-2 text-white text-sm text-center w-10 hidden md:table-cell">
                {row.goalsAgainst}
              </td>
              <td className="py-3 px-2 text-white text-sm text-center w-10">
                {row.goalDifference > 0
                  ? `+${row.goalDifference}`
                  : row.goalDifference}
              </td>
              <td className="py-3 px-2 text-[#e8ff47] text-sm text-center w-10">
                {row.points}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
