import { getCachedStandings } from "@/lib/cached-football-data";
import { StandingRow } from "@/types/football";
import Image from "next/image";

type Props = {
  standings: StandingRow[];
};
export default function StandingsTable({ standings }: Props) {
  return (
    <table className="w-full">
      <thead>
        <tr className="text-[#8A93A8] text-xs border-b border-[#292c33] ">
          <th className="py-3 px-2 text-left font-medium">#</th>
          <th className="py-3 px-2 text-left font-medium">TEAM</th>
          <th className="py-3 px-2 text-left font-medium">P</th>
          <th className="py-3 px-2 text-left font-medium">W</th>
          <th className="py-3 px-2 text-left font-medium">D</th>
          <th className="py-3 px-2 text-left font-medium">L</th>
          <th className="py-3 px-2 text-left font-medium hidden md:table-cell">
            GF
          </th>
          <th className="py-3 px-2 text-left font-medium hidden md:table-cell">
            GA
          </th>
          <th className="py-3 px-2 text-left font-medium">GD</th>
          <th className="text-[#e8ff47] py-3 px-2 text-left font-medium">
            PTS
          </th>
        </tr>
      </thead>
      <tbody>
        {standings.map((row) => (
          <tr
            key={row.team.id}
            className={`border-b border-[#292c33] hover:bg-[#ffffff05] transition-colors
    ${row.position <= 4 ? "border-l-2 border-l-green-500" : ""}
    ${row.position >= 18 ? "border-l-2 border-l-red-500" : ""}
  `}
          >
            <td className="py-3 px-2 text-white text-sm">{row.position}</td>
            <td className="py-3 px-2 text-white text-sm">
              <div className="flex items-center gap-2">
                <Image
                  src={row.team.crest}
                  alt={row.team.name}
                  width={24}
                  height={24}
                />
                <span className="hidden md:inline">{row.team.name}</span>
                <span className="md:hidden">{row.team.tla}</span>
              </div>
            </td>
            <td className="py-3 px-2 text-white text-sm">{row.playedGames}</td>
            <td className="py-3 px-1 md:px-2 text-white text-sm">{row.won}</td>
            <td className="py-3 px-1 md:px-2 text-white text-sm">{row.draw}</td>
            <td className="py-3 px-1 md:px-2 text-white text-sm">{row.lost}</td>
            <td className="py-3 px-1 md:px-2 text-white text-sm hidden md:table-cell">
              {row.goalsFor}
            </td>
            <td className="py-3 px-1 md:px-2 text-white text-sm hidden md:table-cell">
              {row.goalsAgainst}
            </td>
            <td className="py-3 px-1 md:px-2 text-white text-sm">
              {row.goalDifference > 0
                ? `+${row.goalDifference}`
                : row.goalDifference}
            </td>
            <td className="text-[#e8ff47] text-sm py-3 px-1 md:px-2  ">
              {row.points}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
