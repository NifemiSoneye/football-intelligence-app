"use client";
import { useEffect, useState } from "react";
import { Team } from "@/types/football";
import Image from "next/image";

type Props = {
  selectedLeagues: number[];
  selected: number[];
  onChange: (ids: number[]) => void;
};

export default function TeamPicker({
  selectedLeagues,
  selected,
  onChange,
}: Props) {
  const [teams, setTeams] = useState<Team[]>([]);
  useEffect(() => {
    if (selectedLeagues.length === 0) return;

    // fetch teams for each selected league
    Promise.all(
      selectedLeagues.map((id) =>
        fetch(`/api/teams?leagueId=${id}`).then((res) => res.json()),
      ),
    ).then((results) => {
      const allTeams = results.flatMap((r) => r.teams);
      setTeams(allTeams);
    });
  }, [selectedLeagues]);
  const handleClick = (id: number) => {
    if (selected.includes(id)) {
      onChange(selected.filter((i) => i !== id));
    } else {
      onChange([...selected, id]);
    }
  };
  return (
    <div className="grid grid-cols-3 gap-2.5">
      {teams.map((team) => (
        <div
          key={team.id}
          onClick={() => handleClick(team.id)}
          style={
            selected.includes(team.id)
              ? {
                  boxShadow:
                    "0 0 0 1px #e8ff47, 0 8px 32px rgba(232,255,71,0.12)",
                }
              : undefined
          }
          className={` border p-5 cursor-pointer flex flex-col items-center rounded-md transition-all ${
            selected.includes(team.id)
              ? "border-[#e8ff47] bg-[#e8ff4712] "
              : "border-[#ffffff12] bg-[#111111]"
          }`}
        >
          <Image
            src={team.crest}
            alt={team.name}
            width={40}
            height={40}
            className="object-contain"
          />
          <p
            className={`font-semibold text-center  text-[13px] leading-[1.3] mt-3 transition-colors ${
              selected.includes(team.id) ? "text-[#e8ff47]" : "text-white "
            }`}
          >
            {team.name}
          </p>
        </div>
      ))}
    </div>
  );
}
