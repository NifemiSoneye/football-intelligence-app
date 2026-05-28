"use client";

import { LEAGUES } from "@/lib/constants";
import Image from "next/image";

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
    <div className="grid grid-cols-2 gap-2.5">
      {LEAGUES.map((league) => (
        <div
          key={league.id}
          onClick={() => handleClick(league.id)}
          className="bg-[#111111] border border-[#ffffff12] p-5 cursor-pointer flex flex-col items-center rounded-md"
        >
          <Image
            src={league.crest}
            alt={league.name}
            width={80}
            height={80}
            className="object-contain"
          />
          <p className="font-semibold text-center  text-[13px] text-white leading-[1.3] mt-3">
            {league.name}
          </p>
          <p className="text-[11px] text-[#666]">{league.region}</p>
        </div>
      ))}
    </div>
  );
}
