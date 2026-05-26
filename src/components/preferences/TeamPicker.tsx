"use client";
import { useEffect, useState } from "react";
import { Team } from "@/types/football";

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
    <div>
      {teams.map((team) => (
        <div
          key={team.id}
          onClick={() => handleClick(team.id)}
          className={
            selected.includes(team.id) ? "border-blue-500" : "border-gray-200"
          }
        >
          <img src={team.crest} alt={team.name} />
          <p>{team.name}</p>
        </div>
      ))}
    </div>
  );
}
