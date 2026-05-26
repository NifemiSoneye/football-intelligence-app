"use client";

import { LEAGUES } from "@/lib/constants";

type Props = {
  selected: number[];
  onChange: (ids: number[]) => void;
};

export default function LeaguePicker({ selected, onChange }: Props) {
  const handleClick = (id: number) => {
    if (selected.includes(id)) {
      onChange(selected.filter((i) => i !== id)); // deselect
    } else {
      onChange([...selected, id]); // select
    }
  };

  return (
    <div>
      {LEAGUES.map((league) => (
        <div
          key={league.id}
          onClick={() => handleClick(league.id)}
          className={
            selected.includes(league.id) ? "border-blue-500" : "border-gray-200"
          }
        >
          <img src={league.crest} alt={league.name} />
          <p>{league.name}</p>
        </div>
      ))}
    </div>
  );
}
