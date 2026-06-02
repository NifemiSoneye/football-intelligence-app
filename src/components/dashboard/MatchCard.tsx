import { Match } from "@/types/football";
import Image from "next/image";

type Prop = {
  Match: Match;
  variant: "result" | "fixture";
};

export default function MatchCard({ Match, variant }: Prop) {
  const formatDate = (utc: string) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(new Date(utc));
  };
  return (
    <div className="bg-[#131313] flex items-center justify-evenly p-4 rounded-md border border-[#292c33] ">
      <div className="flex flex-col items-center">
        <Image
          src={Match.homeTeam.crest}
          alt={Match.homeTeam.name}
          width={40}
          height={40}
          className="object-contain"
        />
        <p
          className={`font-semibold text-center  text-[13px] leading-[1.3] mt-3 transition-colors border-b-2 text-white ${Match.score.winner === "HOME_TEAM" ? "text-[#e8ff47] border-[#e8ff47]" : Match.score.winner === "DRAW" ? "text-white border-white/30" : Match.score.winner === "AWAY_TEAM" ? "border-red-600" : "border-transparent"}`}
        >
          {Match.homeTeam.tla}
        </p>
      </div>

      <div>
        {variant === "result" ? (
          <div className="flex flex-col items-center ">
            <div className="text-white font-display">
              {Match.score.fullTime.home ?? 0} -{" "}
              {Match.score.fullTime.away ?? 0}
            </div>
            <div className="text-[#e8ff47]">FT</div>
            <div className="text-white">{formatDate(Match.utcDate)}</div>
          </div>
        ) : (
          <div className="flex flex-col items-center font-display">
            <div className="text-[#e8ff47]">VS</div>
            <div className="text-white">{formatDate(Match.utcDate)}</div>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center">
        <Image
          src={Match.awayTeam.crest}
          alt={Match.awayTeam.name}
          width={40}
          height={40}
          className="object-contain"
        />
        <p
          className={`font-semibold text-center  text-[13px] leading-[1.3] mt-3 transition-colors border-b-2 text-white ${Match.score.winner === "AWAY_TEAM" ? "text-[#e8ff47] border-[#e8ff47]" : Match.score.winner === "HOME_TEAM" ? "border-red-600" : Match.score.winner === "DRAW" ? "text-white border-white/30" : "border-transparent"}`}
        >
          {Match.awayTeam.tla}
        </p>
      </div>
    </div>
  );
}
